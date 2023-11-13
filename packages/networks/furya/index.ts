import { NetworkInfo } from "../types";
import { Network } from "./../../utils/network";
import { furyaCurrencies } from "./currencies";

export const furyaNetwork: NetworkInfo = {
  id: "furya",
  network: Network.Furya,
  chainId: "furya-1",
  displayName: "Furya",
  icon: "icons/networks/furya-circle.svg",
  currencies: furyaCurrencies,
  addressPrefix: "furya",
  restEndpoint: "https://rest.mainnet.furya.xyz",
  rpcEndpoint: "https://rpc.mainnet.furya.xyz",
  stakeCurrency: "ufury",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  features: [
    "stargate",
    "ibc-transfer",
    "cosmwasm",
    "no-legacy-stdTx",
    "ibc-go",
  ],
};
