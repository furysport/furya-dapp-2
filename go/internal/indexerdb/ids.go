package indexerdb

import (
	"fmt"

	"github.com/furysport/furya-dapp-2/go/pkg/marketplacepb"
)

func FuryaCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", marketplacepb.Network_NETWORK_FURYA.Prefix(), mintContractAddress)
}

func FuryaNFTID(mintContractAddress string, tokenId string) string {
	return fmt.Sprintf("%s-%s-%s", marketplacepb.Network_NETWORK_FURYA.Prefix(), mintContractAddress, tokenId)
}

func FuryaUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", marketplacepb.Network_NETWORK_FURYA.Prefix(), address))
}

func FuryaActiviyID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", marketplacepb.Network_NETWORK_FURYA.Prefix(), txHash, messageIndex)
}
