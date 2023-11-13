import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import ModalBase from "../../components/modals/ModalBase";
import { NameDataForm } from "../../components/furyaNameService/NameDataForm";
import { NameNFT } from "../../components/furyaNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { FuryaNameServiceQueryClient } from "../../contracts-clients/furya-name-service/FuryaNameService.client";
import { Metadata } from "../../contracts-clients/furya-name-service/FuryaNameService.types";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { defaultMintFee } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { neutral17 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { defaultMetaData } from "../../utils/types/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

interface TNSUpdateNameScreenProps extends TNSModalCommonProps {}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const TNSUpdateNameScreen: React.FC<TNSUpdateNameScreenProps> = ({
  onClose,
}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const [initialized, setInitialized] = useState(false);
  const { name, setName } = useTNS();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const { tokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const contractAddress =
    process.env.FURYA_NAME_SERVICE_CONTRACT_ADDRESS || "";

  const initData = async () => {
    try {
      const cosmwasmClient = await getNonSigningCosmWasmClient();

      const client = new FuryaNameServiceQueryClient(
        cosmwasmClient,
        contractAddress
      );

      // If this query fails it means that the token does not exist.
      const { extension } = await client.nftInfo({
        tokenId: name + process.env.TLD,
      });
      console.log("in data", extension);
      setInitialized(true);
      setInitialData(extension);
    } catch {
      setInitialized(true);
      // ---- If here, "cannot contract", so the token is considered as available
      // return undefined;
    }
  };

  // ==== Init
  useFocusEffect(() => {
    if (!initialized) initData();
  });

  const submitData = async (data: Metadata) => {
    console.log("data", data);
    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    if (
      tokens.length &&
      (!userHasCoWallet || !isTokenOwnedByUser(tokens, name))
    ) {
      setToastError({
        title: "Something went wrong!",
        message: "",
      });
      return;
    }

    const normalizedTokenId = (name + process.env.TLD).toLowerCase();

    const msg = {
      update_metadata: {
        token_id: normalizedTokenId,
        metadata: data,
      },
    };

    try {
      const walletAddress = (await getFirstKeplrAccount()).address;

      const signingClient = await getSigningCosmWasmClient();

      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
        setToastSuccess({
          title: normalizedTokenId + " successfully updated",
          message: "",
        });
        setName(name);
        onClose("TNSConsultName");
      }
    } catch (err) {
      console.warn(err);
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = `${err}`;
      }
      setToastError({
        title: "Something went wrong!",
        message,
      });
    }
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      scrollable
      width={457}
      contentStyle={{
        backgroundColor: neutral17,
      }}
    >
      <NameNFT name={name} />
      <View
        style={{
          marginVertical: 20,
        }}
      >
        <NameDataForm
          btnLabel="Update profile"
          onPressBtn={submitData}
          initialData={initialData}
        />
      </View>
    </ModalBase>
  );
};
