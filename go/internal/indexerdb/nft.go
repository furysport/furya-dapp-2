package indexerdb

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type Attribute struct {
	TraitType string
	Value     string
}

type ArrayJSONB []interface{}

func (p ArrayJSONB) Value() (driver.Value, error) {
	j, err := json.Marshal(p)
	return j, err
}

func (p *ArrayJSONB) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}

	var i interface{}
	err := json.Unmarshal(source, &i)
	if err != nil {
		return err
	}

	*p, ok = i.([]interface{})
	if !ok {
		return errors.New("type assertion .([]Attribute) failed")
	}

	return nil
}

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
	LockedOn    string

	// "belongs to" relations
	CollectionID string `gorm:"index"`
	Collection   *Collection

	// "has one" relations
	FuryaNFT *FuryaNFT

	// "has many" relations
	Activities []Activity
	Attributes ArrayJSONB `gorm:"type:jsonb;default:'[]'"`
	Burnt      bool
}

type FuryaNFT struct {
	NFTID   string `gorm:"primaryKey"`
	TokenID string
}
