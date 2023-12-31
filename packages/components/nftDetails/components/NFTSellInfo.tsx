import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";

import { FuryaNftVaultQueryClient } from "../../../contracts-clients/furya-nft-vault/FuryaNftVault.client";
import { getNativeCurrency } from "../../../networks";
import { NFTInfo } from "../../../screens/Marketplace/NFTDetailScreen";
import { prettyPrice } from "../../../utils/coins";
import { getNonSigningCosmWasmClient } from "../../../utils/keplr";
import { trimFixed } from "../../../utils/numbers";
import { fontMedium14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";

export const NFTSellInfo: React.FC<{
  nftInfo?: NFTInfo;
  price: string;
  networkId?: string;
}> = ({ nftInfo, price, networkId }) => {
  const vaultConfig = useVaultConfig();
  const currency = getNativeCurrency(networkId, nftInfo?.mintDenom);

  if (!currency || !vaultConfig || !nftInfo || !networkId) {
    return null;
  }

  const nftRoyalty = nftInfo.royalty || 0;

  const platformFeePercent = parseInt(vaultConfig.fee_bp || "0", 10) / 100;
  const platformFee = platformFeePercent / 100;

  const feeGain = nftRoyalty + platformFee;

  let willReceive = "?";

  try {
    const decPrice = Decimal.fromUserInput(price, currency.decimals);
    const foo = (decPrice.toFloatApproximation() * (1 - feeGain)).toFixed(
      currency.decimals
    );
    const willReceiveDec = Decimal.fromUserInput(foo, currency?.decimals);
    willReceive = prettyPrice(
      networkId,
      willReceiveDec.atomics,
      nftInfo?.mintDenom
    );
  } catch {}

  return (
    <>
      <BrandText style={[fontMedium14, { marginBottom: 8 }]}>
        Artist Royalty: {trimFixed((nftRoyalty * 100).toFixed(2))}%
      </BrandText>
      <BrandText style={[fontMedium14, { marginBottom: 8 }]}>
        Platform Fee: {trimFixed((platformFee * 100).toFixed(2))}%
      </BrandText>
      <BrandText style={fontMedium14}>
        You will receive: {willReceive}
      </BrandText>
    </>
  );
};

const useVaultConfig = () => {
  const { data } = useQuery(
    ["vaultConfig"],
    async () => {
      const cosmwasmClient = await getNonSigningCosmWasmClient();
      const vaultClient = new FuryaNftVaultQueryClient(
        cosmwasmClient,
        process.env.FURYA_VAULT_CONTRACT_ADDRESS || ""
      );
      return await vaultClient.config();
    },
    {
      staleTime: Infinity,
    }
  );
  return data;
};
