package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/furysport/furya-dapp-2/go/internal/indexerdb"
	"github.com/furysport/furya-dapp-2/go/internal/indexerhandler"
	"github.com/furysport/furya-dapp-2/go/pkg/coingeckoprices"
	"github.com/furysport/furya-dapp-2/go/pkg/quests"
	"github.com/furysport/furya-dapp-2/go/pkg/tmws"
	"github.com/allegro/bigcache/v3"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ReplayInfo struct {
	StartHeight       int64
	FinalHeight       int64
	WebsocketEndpoint string
}

func main() {
	// handle args
	fs := flag.NewFlagSet("furya-indexer", flag.ContinueOnError)
	var (
		blocksBatchSize             = fs.Int64("blocks-batch-size", 100000, "maximum number of blocks to query from tendermint at once")
		txsBatchSize                = fs.Int("txs-batch-size", 1000, "number of txs per query page")
		pollDelay                   = fs.Duration("poll-delay", 2*time.Second, "delay between queries")
		tnsContractAddress          = fs.String("furya-name-service-contract-address", "", "address of the furya name service contract")
		vaultContractAddress        = fs.String("furya-vault-contract-address", "", "address of the furya vault contract")
		minterCodeIDs               = fs.String("furya-minter-code-ids", "", "code id of the furya minter contract")
		tnsDefaultImageURL          = fs.String("furya-name-service-default-image-url", "", "url of a fallback image for TNS")
		dbHost                      = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort                      = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass                      = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName                      = fs.String("database-name", "", "database name for postgreSQL")
		dbUser                      = fs.String("postgres-user", "", "username for postgreSQL")
		furyaNetworkID           = fs.String("furya-network-id", "furya", "furya network id")
		tendermintWebsocketEndpoint = fs.String("tendermint-websocket-endpoint", "", "tendermint websocket endpoint")
	)
	if err := ff.Parse(fs, os.Args[1:],
		ff.WithEnvVars(),
		ff.WithIgnoreUndefined(true),
		ff.WithConfigFile(".env"),
		ff.WithConfigFileParser(ff.EnvParser),
		ff.WithAllowMissingConfigFile(true),
	); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	if *tnsContractAddress == "" {
		panic(errors.New("missing furya-name-service-contract-address flag"))
	}
	if *tendermintWebsocketEndpoint == "" {
		panic(errors.New("missing tendermint-websocket-endpoint flag"))
	}

	// parse minter code ids
	mcisParts := strings.Split(*minterCodeIDs, ",")
	mcis := make([]uint64, len(mcisParts))
	var err error
	for i, mciStr := range mcisParts {
		mcis[i], err = strconv.ParseUint(strings.TrimFunc(mciStr, unicode.IsSpace), 10, 64)
		if err != nil {
			panic(errors.Wrap(err, "failed to parse minter code ID"))
		}
	}

	// create replay infos
	replayInfos := []ReplayInfo{
		/*{
			StartHeight:       0,
			FinalHeight:       1154235,
			WebsocketEndpoint: "wss://furyad.65.108.73.219.nip.io/rpc/websocket",
		},*/
		{
			//StartHeight:       1154236,
			StartHeight:       0,
			FinalHeight:       -1,
			WebsocketEndpoint: *tendermintWebsocketEndpoint,
		},
	}

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}
	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}

	// create block time cache
	blockTimeCacheConfig := bigcache.DefaultConfig(time.Duration(0))
	blockTimeCacheConfig.HardMaxCacheSize = 10
	blockTimeCache, err := bigcache.NewBigCache(blockTimeCacheConfig)
	if err != nil {
		panic(errors.Wrap(err, "failed to init block time cache"))
	}

	// get price service
	cgp, err := coingeckoprices.NewCoinGeckoPrices()
	if err != nil {
		panic(errors.Wrap(err, "failed to initialize price service"))
	}

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	err = indexerdb.MigrateDB(db)
	if err != nil {
		panic(errors.Wrap(err, "failed migrate database models"))
	}

	// init/get height
	var dbApp indexerdb.App
	if err := db.FirstOrCreate(&dbApp).Error; err != nil {
		panic(errors.Wrap(err, "failed to get db app"))
	}
	height := dbApp.Height

	// inject quests
	qs, err := quests.Quests()
	if err != nil {
		panic(errors.Wrap(err, "failed to get embedded quests"))
	}
	for _, q := range qs {
		db.Save(&indexerdb.Quest{
			ID:    q.ID,
			Title: q.Title,
		})
	}

	// find replay info to use
	var runReplayInfos []ReplayInfo
	for i, replayInfo := range replayInfos {
		if replayInfo.StartHeight <= height && (replayInfo.FinalHeight == -1 || replayInfo.FinalHeight >= height) {
			runReplayInfos = replayInfos[i:]
			break
		}
	}
	if len(runReplayInfos) == 0 {
		panic(fmt.Errorf("failed to find suitable replay info for height %d", height))
	}

	// replay
	for _, replayInfo := range runReplayInfos {
		logger.Info("using replay info", zap.String("ws", replayInfo.WebsocketEndpoint), zap.Int64("start", replayInfo.StartHeight), zap.Int64("end", replayInfo.FinalHeight))

		client, err := tmws.NewClient(replayInfo.WebsocketEndpoint)
		if err != nil {
			panic(errors.Wrap(err, "failed to create tendermint websocket client"))
		}

		for {
			var end int64
			if replayInfo.FinalHeight == -1 {
				res, err := client.Status()
				if err != nil {
					panic(errors.Wrap(err, "failed to query status"))
				}

				// we lag one block behind to increase the chance that tendermint tx indexer has finished it's work
				lbh := res.SyncInfo.LatestBlockHeight - 1

				if lbh < height {
					time.Sleep(*pollDelay)
					continue
				}
				end = int64Min(height+*blocksBatchSize, lbh+1)
			} else {
				if height > replayInfo.FinalHeight {
					break
				}
				end = int64Min(height+*blocksBatchSize, replayInfo.FinalHeight+1)
			}
			if height == end-1 {
				logger.Info(fmt.Sprintf("indexing %d", height))
			} else {
				logger.Info(fmt.Sprintf("indexing [%d, %d]", height, end-1))
			}

			if err := db.Transaction(func(dbtx *gorm.DB) error {
				handler, err := indexerhandler.NewHandler(dbtx, indexerhandler.Config{
					MinterCodeIDs:        mcis,
					VaultContractAddress: *vaultContractAddress,
					TNSContractAddress:   *tnsContractAddress,
					TNSDefaultImageURL:   *tnsDefaultImageURL,
					TendermintClient:     client,
					NetworkID:            *furyaNetworkID,
					CoinGeckoPrices:      cgp,
					BlockTimeCache:       blockTimeCache,
				}, logger)
				if err != nil {
					return errors.Wrap(err, "failed to create handler")
				}

				chunkElems := int64(0)
				page := 1
				for {
					res, err := client.TxSearch(
						fmt.Sprintf("message.module = 'wasm' AND tx.height >= %d AND tx.height < %d", height, end),
						true,
						&page,
						txsBatchSize,
						"asc",
					)
					if err != nil {
						return errors.Wrap(err, "failed to search txs")
					}

					for _, tx := range res.Txs {
						if err := handler.HandleTendermintResultTx(tx); err != nil {
							return errors.Wrap(err, fmt.Sprintf(`failed to handle tx "%s"`, tx.Hash))
						}
					}

					chunkElems += int64(len(res.Txs))
					if chunkElems >= int64(res.TotalCount) {
						break
					}

					page++
				}

				if err := dbtx.Model(&indexerdb.App{}).Where("id = ?", dbApp.ID).Update("height", end).Error; err != nil {
					return errors.Wrap(err, "failed to update app height")
				}

				return nil
			}); err != nil {
				panic(errors.Wrap(err, "failed to commit chunk"))
			}
			height = end
		}
	}
}

func int64Min(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}
