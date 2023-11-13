import { NetworkInfo } from "../types";
import { furyaCurrencies } from "./currencies";

export const furyaNetwork: NetworkInfo = {
  id: "furya",
  chainId: "furya-1",
  displayName: "Furya",
  icon: "icons/networks/furya-circle.svg",
  currencies: furyaCurrencies,
  addressPrefix: "furya",
  restEndpoint: "https://api.furya.xyz",
  rpcEndpoint: "https://rpc.furya.xyz",
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
