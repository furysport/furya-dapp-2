import { PublicKey } from "@solana/web3.js";
import { bech32 } from "bech32";

import { Network as ProtobufNetwork } from "../api/marketplace/v1/marketplace";

export enum Network {
  Unknown = "Unknown",
  Solana = "Solana",
  Furya = "Furya",
  Ethereum = "Ethereum",
  Atom = "Atom",
  Juno = "Juno",
  Osmosis = "Osmosis",
}

export const addressToNetwork = (address: string) => {
  try {
    const bech32Result = bech32.decode(address);
    switch (bech32Result.prefix) {
      case "furya":
        return Network.Furya;
    }
  } catch {}
  try {
    // eslint-disable-next-line no-new
    new PublicKey(address); // this will throw if the address is invalid
    return Network.Solana;
  } catch {}
  return Network.Unknown;
};

export const protobufNetworkToNetwork = (network: ProtobufNetwork) => {
  switch (network) {
    case ProtobufNetwork.NETWORK_SOLANA:
      return Network.Solana;
    case ProtobufNetwork.NETWORK_FURYA:
      return Network.Furya;
    default:
      return Network.Unknown;
  }
};
