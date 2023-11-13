import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { furyaTestnetCurrencies } from "./currencies";

export const furyaTestnetNetwork: NetworkInfo = {
  id: "furya-testnet",
  network: Network.Furya,
  chainId: "furya-testnet",
  displayName: "Furya Testnet",
  icon: "icons/networks/furya-circle.svg",
  currencies: furyaTestnetCurrencies,
  addressPrefix: "furya",
  restEndpoint: "https://testnet-api.furya.xyz",
  rpcEndpoint: "https://testnet-rpc.furya.xyz",
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
