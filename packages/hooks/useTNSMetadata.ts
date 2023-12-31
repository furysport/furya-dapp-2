import { useQuery } from "@tanstack/react-query";

import { FuryaNameServiceQueryClient } from "../contracts-clients/furya-name-service/FuryaNameService.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

// FIXME: use react-query to prevent recalling the api all the time

export const useTNSMetadata = (address?: string) => {
  const { data, isLoading, isError } = useQuery(
    ["tns-metadata", address],
    async () => {
      if (!address) {
        return null;
      }

      const contractAddress =
        process.env.FURYA_NAME_SERVICE_CONTRACT_ADDRESS || "";
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient();

      const tnsClient = new FuryaNameServiceQueryClient(
        cosmWasmClient,
        contractAddress
      );

      const aliasResponse = await tnsClient.primaryAlias({
        address,
      });

      // ======== Getting NFT info
      const nftInfo = await tnsClient.nftInfo({
        tokenId: aliasResponse.username,
      });

      return { tokenId: aliasResponse.username, ...nftInfo.extension };
    },
    { staleTime: Infinity }
  );

  return { loading: isLoading, metadata: data, notFound: isError };
};
