import { Network } from "../../utils/network";
import { NetworkInfo } from "../types";
import { ethereumCurrencies } from "./currencies";

export const ethereumNetwork: NetworkInfo = {
  id: "highbury",
  network: Network.Ethereum,
  chainId: "710",
  displayName: "Highbury",
  icon: "icons/networks/ethereum-circle.svg",
  currencies: ethereumCurrencies,
  addressPrefix: "fury",
  restEndpoint: "https://api.furya.io",
  rpcEndpoint: "https://highbury.furya.io",
  stakeCurrency: "afury",
  gasPriceStep: {
    low: 0.0,
    average: 0.025,
    high: 0.04,
  },
  features: [],
};
