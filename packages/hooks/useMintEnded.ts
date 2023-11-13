import { useQuery } from "@tanstack/react-query";

import { FuryaBunkerMinterQueryClient } from "../contracts-clients/furya-bunker-minter/FuryaBunkerMinter.client";
import { FuryaMinter__factory } from "../evm-contracts-clients/furya-bunker-minter/FuryaMinter__factory";
import { getEthereumProvider } from "../utils/ethereum";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useMintEnded = (id: string) => {
  const { data } = useQuery(["mintEnded", id], async () => {
    if (!id) {
      return false;
    }

    const [addressPrefix, mintAddress] = id.split("-");

    if (addressPrefix === "furya") {
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
    } else if (addressPrefix === "eth") {
      const provider = await getEthereumProvider();
      if (!provider) {
        console.error("no eth provider found");
        return false;
      }

      const minterClient = FuryaMinter__factory.connect(
        mintAddress,
        provider
      );
      const minterConfig = await minterClient.callStatic.config();
      const mintedAmount = (await minterClient.currentSupply()).toNumber();
      return mintedAmount === minterConfig.maxSupply.toNumber();
    }

    console.error(`unknown collectionId ${id}`);
    return false;
  });
  return data;
};
