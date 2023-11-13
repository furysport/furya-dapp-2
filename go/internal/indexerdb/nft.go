package indexerdb

import (
	"database/sql"
)

type NFT struct {
	// ID is network-dependent
	// Furya: furya-<bech32_mint_contract_address>-<token_id>
	ID          string
	Name        string
	ImageURI    string
	OwnerID     UserID
	IsListed    bool
	PriceAmount sql.NullString `gorm:"type:numeric"`
	PriceDenom  string

	// "belongs to" relations
	CollectionID string
	Collection   *Collection

	// "has one" relations
	FuryaNFT *FuryaNFT

	// "has many" relations
	Activities []Activity
	Burnt      bool
}

type FuryaNFT struct {
	NFTID   string `gorm:"primaryKey"`
	TokenID string
}
