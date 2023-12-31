// Code generated by schema-generate. DO NOT EDIT.

package name_service_types

import (
	"bytes"
	"encoding/json"
	"errors"
)

// ContractInfoResponse
type ContractInfoResponse struct {
	BaseMintFee    interface{} `json:"base_mint_fee,omitempty"`
	BurnPercentage interface{} `json:"burn_percentage,omitempty"`
	Name           string      `json:"name"`
	NativeDecimals int         `json:"native_decimals"`
	NativeDenom    string      `json:"native_denom"`
	Symbol         string      `json:"symbol"`
	TokenCap       interface{} `json:"token_cap,omitempty"`
}

func (strct *ContractInfoResponse) MarshalJSON() ([]byte, error) {
	buf := bytes.NewBuffer(make([]byte, 0))
	buf.WriteString("{")
	comma := false
	// Marshal the "base_mint_fee" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"base_mint_fee\": ")
	if tmp, err := json.Marshal(strct.BaseMintFee); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// Marshal the "burn_percentage" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"burn_percentage\": ")
	if tmp, err := json.Marshal(strct.BurnPercentage); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// "Name" field is required
	// only required object types supported for marshal checking (for now)
	// Marshal the "name" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"name\": ")
	if tmp, err := json.Marshal(strct.Name); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// "NativeDecimals" field is required
	// only required object types supported for marshal checking (for now)
	// Marshal the "native_decimals" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"native_decimals\": ")
	if tmp, err := json.Marshal(strct.NativeDecimals); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// "NativeDenom" field is required
	// only required object types supported for marshal checking (for now)
	// Marshal the "native_denom" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"native_denom\": ")
	if tmp, err := json.Marshal(strct.NativeDenom); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// "Symbol" field is required
	// only required object types supported for marshal checking (for now)
	// Marshal the "symbol" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"symbol\": ")
	if tmp, err := json.Marshal(strct.Symbol); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true
	// Marshal the "token_cap" field
	if comma {
		buf.WriteString(",")
	}
	buf.WriteString("\"token_cap\": ")
	if tmp, err := json.Marshal(strct.TokenCap); err != nil {
		return nil, err
	} else {
		buf.Write(tmp)
	}
	comma = true

	buf.WriteString("}")
	rv := buf.Bytes()
	return rv, nil
}

func (strct *ContractInfoResponse) UnmarshalJSON(b []byte) error {
	nameReceived := false
	native_decimalsReceived := false
	native_denomReceived := false
	symbolReceived := false
	var jsonMap map[string]json.RawMessage
	if err := json.Unmarshal(b, &jsonMap); err != nil {
		return err
	}
	// parse all the defined properties
	for k, v := range jsonMap {
		switch k {
		case "base_mint_fee":
			if err := json.Unmarshal([]byte(v), &strct.BaseMintFee); err != nil {
				return err
			}
		case "burn_percentage":
			if err := json.Unmarshal([]byte(v), &strct.BurnPercentage); err != nil {
				return err
			}
		case "name":
			if err := json.Unmarshal([]byte(v), &strct.Name); err != nil {
				return err
			}
			nameReceived = true
		case "native_decimals":
			if err := json.Unmarshal([]byte(v), &strct.NativeDecimals); err != nil {
				return err
			}
			native_decimalsReceived = true
		case "native_denom":
			if err := json.Unmarshal([]byte(v), &strct.NativeDenom); err != nil {
				return err
			}
			native_denomReceived = true
		case "symbol":
			if err := json.Unmarshal([]byte(v), &strct.Symbol); err != nil {
				return err
			}
			symbolReceived = true
		case "token_cap":
			if err := json.Unmarshal([]byte(v), &strct.TokenCap); err != nil {
				return err
			}
		}
	}
	// check if name (a required property) was received
	if !nameReceived {
		return errors.New("\"name\" is required but was not present")
	}
	// check if native_decimals (a required property) was received
	if !native_decimalsReceived {
		return errors.New("\"native_decimals\" is required but was not present")
	}
	// check if native_denom (a required property) was received
	if !native_denomReceived {
		return errors.New("\"native_denom\" is required but was not present")
	}
	// check if symbol (a required property) was received
	if !symbolReceived {
		return errors.New("\"symbol\" is required but was not present")
	}
	return nil
}
