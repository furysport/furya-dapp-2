package indexerdb

type Collection struct {
	// ID is network-dependent
	// Furya: furya-<bech32_mint_contract_address>
	ID string `gorm:"primaryKey"`

	NetworkId           string
	Name                string
	ImageURI            string
	MaxSupply           int
	SecondaryDuringMint bool
	Paused              bool

	// "has one" relations
	FuryaCollection *FuryaCollection

	// "has many" relations
	NFTs []*NFT
}

type FuryaCollection struct {
	CollectionID        string `gorm:"index"`
	MintContractAddress string `gorm:"primaryKey"`
	NFTContractAddress  string
	CreatorAddress      string
}
