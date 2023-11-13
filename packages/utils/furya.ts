import { Decimal } from "@cosmjs/math";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { Currency } from "@keplr-wallet/types";

import { Metadata } from "../contracts-clients/furya-name-service/FuryaNameService.types";
import { Network } from "./network";

export const UFURY_PER_FURY = process.env.PUBLIC_BASE_MINT_FEE;
export const furyaRestProvider = process.env.PUBLIC_CHAIN_REST_ENDPOINT;
export const furyaRPCProvider = process.env.PUBLIC_CHAIN_RPC_ENDPOINT;
export const furyaChainId = process.env.PUBLIC_CHAIN_ID;
export const furyDisplayDenom = process.env.PUBLIC_STAKING_DENOM_DISPLAY_NAME;
export const vaultContractAddress =
  process.env.FURYA_VAULT_CONTRACT_ADDRESS || "";
const furyDenom = process.env.PUBLIC_STAKING_DENOM;

export interface CosmosRewardsResponse {
  total: {
    denom: string;
    amount: string;
  }[];
  rewards: {
    validator_address: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[];
}

export interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}

export const getCosmosBalances = async (address: string) => {
  const response = await fetch(
    `${furyaRestProvider}/cosmos/bank/v1beta1/balances/${address}`
  );
  const responseJSON: CosmosBalancesResponse = await response.json();
  return responseJSON;
};

export const furyaNFTVaultCodeID = 10;

export const getUfuryBalance = async (address: string) => {
  const cosmosBalances = await getCosmosBalances(address);
  return cosmosBalances.balances
    .filter((balance) => balance.denom === furyDenom)
    .reduce(
      (total, balance) =>
        total.plus(
          Decimal.fromAtomics(balance.amount, furyCurrency.coinDecimals)
        ),
      Decimal.fromAtomics("0", furyCurrency.coinDecimals)
    );
};

export const furyCurrency: Currency = {
  // Coin denomination to be displayed to the user.
  coinDenom: furyDisplayDenom || "",
  // Actual denom (i.e. uatom, uscrt) used by the blockchain.
  coinMinimalDenom: furyDenom || "",
  // # of decimal points to convert minimal denomination to user-facing denomination.
  coinDecimals: 6,
  // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
  // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
  // coinGeckoId: ""
};

export const furyaGasPrice = new GasPrice(
  Decimal.fromUserInput("0.025", furyCurrency.coinDecimals),
  furyCurrency.coinMinimalDenom
);

export const getFuryaSigningStargateClient = (signer: OfflineSigner) =>
  SigningStargateClient.connectWithSigner(furyaRPCProvider || "", signer, {
    gasPrice: furyaGasPrice,
  });

interface PrettyTokenData {
  displayLabel: string;
  value: string | null;
}

export const imageDisplayLabel = "Image URL";
export const publicNameDisplayLabel = "Public Name";

// From a token data, returns an array with these data ordered and containing a pretty label
// FIXME: type this properly
export const prettyTokenData = (tokenData: Metadata): PrettyTokenData[] => {
  const finalDatas: PrettyTokenData[] = [];
  Object.entries(tokenData).map(([key, value], i) => {
    switch (key) {
      case "email":
        finalDatas[0] = { displayLabel: "Email", value: value as string };
        break;
      case "public_name":
        finalDatas[1] = {
          displayLabel: publicNameDisplayLabel,
          value: value as string,
        };
        break;
      case "public_bio":
        finalDatas[2] = { displayLabel: "Bio", value: value as string };
        break;
      case "image":
        finalDatas[3] = {
          displayLabel: imageDisplayLabel,
          value: value as string,
        };
        break;
      case "external_url":
        finalDatas[4] = {
          displayLabel: "External URL",
          value: value as string,
        };
        break;
      case "discord_id":
        finalDatas[5] = {
          displayLabel: "Discord",
          value: value as string,
        };
        break;
      case "twitter_id":
        finalDatas[6] = { displayLabel: "Twitter", value: value as string };
        break;
      case "telegram_id":
        finalDatas[7] = {
          displayLabel: "Telegram username",
          value: value as string,
        };
        break;
      case "keybase_id":
        finalDatas[8] = { displayLabel: "Keybase", value: value as string };
        break;
      case "validator_operator_address":
        finalDatas[9] = { displayLabel: "Validator", value: value as string };
        break;
    }
  });
  return finalDatas;
};

// You can add, remove or modify the domains and their status (See DomainsAvailability in TNSHomeScreen.tsx)
export const domainsList = [
  {
    // Displayed name
    name: ".furya",
    // Is the domains can be minted ? Or just displayed as a "future available domain" (Doesn't exist yet)
    comingSoon: false,
    // Is the domain minted ? (To be true, comingSoon=false necessary) (I don't talk about "availability" to avoid confusion)
    minted: false,
  },
  {
    name: ".fury",
    comingSoon: false,
    minted: false,
  },
  {
    name: ".osmo",
    comingSoon: true,
    minted: false,
  },
  {
    name: ".atom",
    comingSoon: true,
    minted: false,
  },
  {
    name: ".juno",
    comingSoon: true,
    minted: false,
  },
];

export const txExplorerLink = (
  network: Network | undefined,
  txHash: string
) => {
  let explorerUrl = "/";
  switch (network) {
    case Network.Furya:
      explorerUrl = process.env.FURYA_TRANSACTION_EXPLORER_URL || "";
      break;
    case Network.Ethereum:
      explorerUrl = process.env.ETHEREUM_TRANSACTION_EXPLORER_URL || "";
      break;
  }

  return explorerUrl.replace("$hash", txHash);
};

export const accountExplorerLink = (
  network: Network | undefined,
  address: string
) => {
  let explorerUrl = "/";
  switch (network) {
    case Network.Furya:
      explorerUrl = process.env.FURYA_ACCOUNT_EXPLORER_URL || "";
      break;
    case Network.Ethereum:
      explorerUrl = process.env.ETHEREUM_ACCOUNT_EXPLORER_URL || "";
      break;
  }

  return explorerUrl.replace("$address", address);
};
