package indexerdb

import "github.com/furysport/furya-dapp-2/go/pkg/marketplacepb"

type Collection struct {
	// ID is network-dependent
	// Furya: furya-<bech32_mint_contract_address>
	ID string `gorm:"primaryKey"`

	Network  marketplacepb.Network
	Name     string
	ImageURI string

	// "has one" relations
	FuryaCollection *FuryaCollection

	// "has many" relations
	NFTs []*NFT
}

type FuryaCollection struct {
	CollectionID        string
	MintContractAddress string `gorm:"primaryKey"`
	NFTContractAddress  string
	CreatorAddress      string
}
