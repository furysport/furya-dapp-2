import cosmosHubSVG from "../../assets/icons/networks/cosmos-hub-circle.svg";
import ethereumSVG from "../../assets/icons/networks/ethereum-circle.svg";
import solanaSVG from "../../assets/icons/networks/solana-circle.svg";
import furyaSVG from "../../assets/icons/networks/furya-circle.svg";

export enum WalletTitle {
  Solana = "Solana",
  CosmosHub = "Cosmos Hub",
  Furya = "Furya",
  Ethereum = "Ethereum",
}

export const getWalletIconFromTitle = (title: string) => {
  switch (title) {
    case "Solana":
      return solanaSVG;
    case "Cosmos Hub":
      return cosmosHubSVG;
    case "Furya":
      return furyaSVG;
    case "Ethereum":
      return ethereumSVG;
    default:
      return solanaSVG;
  }
};
