import { useQuery } from "@tanstack/react-query";

import { FuryaBunkerMinterQueryClient } from "../contracts-clients/furya-bunker-minter/FuryaBunkerMinter.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useMintEnded = (id: string) => {
  const { data } = useQuery(["mintEnded", id], async () => {
    if (!id) {
      return false;
    }

    const mintAddress = id.replace("furya-", "");

    if (mintAddress === process.env.FURYA_NAME_SERVICE_CONTRACT_ADDRESS) {
      return false;
    }

    const cosmwasm = await getNonSigningCosmWasmClient();

    const minterClient = new FuryaBunkerMinterQueryClient(
      cosmwasm,
      mintAddress
    );
    const conf = await minterClient.config();

    const mintedAmount = await minterClient.currentSupply();

    return mintedAmount === conf.nft_max_supply;
  });
  return data;
};
