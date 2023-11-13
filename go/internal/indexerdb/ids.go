package indexerdb

import (
	"fmt"
)

func FuryaCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", "fury", mintContractAddress)
}

func EthereumCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", "eth", mintContractAddress)
}

func FuryaNFTID(mintContractAddress string, tokenId string) string {
	return fmt.Sprintf("%s-%s-%s", "fury", mintContractAddress, tokenId)
}

func FuryaUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", "fury", address))
}

func EthereumUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", "eth", address))
}

func FuryaActivityID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", "fury", txHash, messageIndex)
}

func EthereumActivityID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", "eth", txHash, messageIndex)
}
