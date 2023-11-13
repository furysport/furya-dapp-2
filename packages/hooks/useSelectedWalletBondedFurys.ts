import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";

import { furyCurrency, furyaRestProvider } from "../utils/furya";
import useSelectedWallet from "./useSelectedWallet";

export const useSelectedWalletBondedFurys = (validatorAddress?: string) => {
  const wallet = useSelectedWallet();
  const { data, refetch } = useQuery(
    [`bondedFurys/${wallet?.address}/${validatorAddress}`],
    async () => {
      if (!wallet?.address || !validatorAddress) {
        return Decimal.fromAtomics("0", furyCurrency.coinDecimals);
      }
      try {
        const delegations: any[] = [];
        let nextKey = "";
        while (true) {
          const httpResponse = await fetch(
            `${furyaRestProvider}/cosmos/staking/v1beta1/delegations/${
              wallet.address
            }?pagination.key=${encodeURIComponent(nextKey)}`
          );
          const response = await httpResponse.json();
          delegations.push(...response.delegation_responses);
          if (!response.pagination.next_key) {
            break;
          }
          nextKey = response.pagination.next_key;
        }
        const validatorDeleg = delegations.find(
          (deleg) => deleg.delegation.validator_address === validatorAddress
        );
        if (validatorDeleg) {
          return Decimal.fromAtomics(
            validatorDeleg.balance.amount,
            furyCurrency.coinDecimals
          );
        }
      } catch (err) {
        console.error(err);
      }
      return Decimal.fromAtomics("0", furyCurrency.coinDecimals);
    },
    { initialData: Decimal.fromAtomics("0", furyCurrency.coinDecimals) }
  );
  return { bondedTokens: data, refreshBondedTokens: refetch };
};
