import { useCallback } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { FuryaNftVaultClient } from "../contracts-clients/furya-nft-vault/FuryaNftVault.client";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { vaultContractAddress } from "../utils/furya";
import useSelectedWallet from "./useSelectedWallet";

export const useCancelNFTListing = (
  nftContractAddress: string,
  tokenId: string
) => {
  const wallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  return useCallback(async () => {
    if (!wallet?.address || !wallet.connected) {
      setToastError({
        title: "Failed to cancel NFT listing",
        message: "Bad wallet",
      });
      return;
    }
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      const vaultClient = new FuryaNftVaultClient(
        cosmwasmClient,
        wallet.address,
        vaultContractAddress
      );
      const reply = await vaultClient.withdraw({
        nftContractAddr: nftContractAddress,
        nftTokenId: tokenId,
      });
      return reply;
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to cancel NFT listing",
          message: err.message,
        });
      }
    }
  }, [nftContractAddress, tokenId, wallet]);
};
