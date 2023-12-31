package indexerdb

import (
	"fmt"

	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// UserID is network-dependent
// Furya: furya-<bech32_address>
type UserID string

type App struct {
	ID     uint
	Height int64
}

type User struct {
	ID UserID
}

var allModels = []interface{}{
	// app
	&App{},

	// users
	&User{},

	// collections
	&Collection{},
	&FuryaCollection{},

	// nfts
	&NFT{},
	&FuryaNFT{},

	// activity
	&Activity{},
	&Listing{},
	&CancelListing{},
	&Trade{},
	&UpdateNFTPrice{},
	&Mint{},
	&Burn{},
	&SendNFT{},
	&TransferNFT{},

	// quests
	&Quest{},
	&QuestCompletion{},
}

func NewSQLiteDB(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path))
	if err != nil {
		return nil, errors.Wrap(err, "open db")
	}
	return db, nil
}

func NewPostgresDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("NewMySQLDB error: %s", err.Error())
		return nil, errors.Wrap(err, "open db")
	}
	return db, nil
}

func MigrateDB(db *gorm.DB) error {
	return db.AutoMigrate(allModels...)
}
