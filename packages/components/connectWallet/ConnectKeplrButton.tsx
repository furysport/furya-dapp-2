import { Window as KeplrWindow } from "@keplr-wallet/types";
import React from "react";
import { Linking } from "react-native";

import keplrSVG from "../../../assets/icons/keplr.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { getNetwork, keplrChainInfoFromNetworkInfo } from "../../networks";
import {
  setIsKeplrConnected,
  setSelectedNetworkId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ConnectWalletButton } from "./components/ConnectWalletButton";

export const ConnectKeplrButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const handlePress = async () => {
    try {
      const keplr = (window as KeplrWindow)?.keplr;
      if (!keplr) {
        Linking.openURL(
          "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap"
        );
        return;
      }
      const furyaNetworkId = process.env.FURYA_NETWORK_ID;
      if (!furyaNetworkId) {
        console.error("no furya network id");
        return;
      }
      const network = getNetwork(furyaNetworkId);
      if (!network) {
        console.error(`no ${furyaNetworkId} network`);
        return;
      }
      await keplr.experimentalSuggestChain(
        keplrChainInfoFromNetworkInfo(network)
      );
      await keplr.enable(network.chainId);

      dispatch(setSelectedNetworkId(furyaNetworkId));
      dispatch(setIsKeplrConnected(true));
      if (typeof onDone === "function") {
        onDone();
      }
    } catch (err) {
      if (typeof onDone === "function") {
        onDone(err);
      }
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Keplr",
          message: err.message,
        });
      }
    }
  };
  return (
    <ConnectWalletButton
      text="Keplr Wallet"
      icon={keplrSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
