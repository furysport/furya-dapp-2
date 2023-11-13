import { isDeliverTxFailure } from "@cosmjs/stargate";
import { Decimal } from "cosmwasm";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";

import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useTNS } from "../../../context/TNSProvider";
import { FuryaNameServiceQueryClient } from "../../../contracts-clients/furya-name-service/FuryaNameService.client";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { prettyPrice } from "../../../utils/coins";
import {
  getKeplrOfflineSigner,
  getNonSigningCosmWasmClient,
} from "../../../utils/keplr";
import {
  getFuryaSigningStargateClient,
  furyCurrency,
} from "../../../utils/furya";
import { SendFundFormType } from "../../../utils/types/tns";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import ModalBase from "../ModalBase";

export const SendFundModal: React.FC<{
  onClose: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  const { name } = useTNS();
  const [isVisible, setIsVisible] = useState(false);
  const { control, handleSubmit: formHandleSubmit } =
    useForm<SendFundFormType>();
  const selectedWallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const balances = useBalances(
    process.env.FURYA_NETWORK_ID,
    selectedWallet?.address
  );
  const furyBalance = balances.find(
    (bal) => bal.denom === furyCurrency.coinMinimalDenom
  );

  useEffect(() => {
    setIsVisible(visible || false);
  }, [visible]);

  const handleSubmit: SubmitHandler<SendFundFormType> = async (fieldValues) => {
    try {
      // get contract address
      const contractAddress =
        process.env.FURYA_NAME_SERVICE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        setToastError({
          title: "Internal error",
          message: "No TNS contract address",
        });
        onClose();
        return;
      }

      // get sender address
      const sender = selectedWallet?.address;
      if (!sender) {
        setToastError({
          title: "Internal error",
          message: "No sender address",
        });
        onClose();
        return;
      }

      // get token id
      const tokenId = name + process.env.TLD || "";

      // get tns client
      const cosmwasmClient = await getNonSigningCosmWasmClient();
      const tnsClient = new FuryaNameServiceQueryClient(
        cosmwasmClient,
        contractAddress
      );

      // get recipient address
      const { owner: recipientAddress } = await tnsClient.ownerOf({ tokenId });

      // get stargate client
      const signer = await getKeplrOfflineSigner();
      const client = await getFuryaSigningStargateClient(signer);

      // send tokens
      const response = await client.sendTokens(
        sender,
        recipientAddress,
        [
          {
            denom: furyCurrency.coinMinimalDenom,
            amount: Decimal.fromUserInput(
              fieldValues.amount,
              furyCurrency.coinDecimals
            ).atomics,
          },
        ],
        "auto",
        fieldValues.comment
      );
      if (isDeliverTxFailure(response)) {
        setToastError({ title: "Send failed", message: response.rawLog || "" });
        onClose();
        return;
      }

      // signal success
      setToastSuccess({ title: "Send success", message: "" });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({ title: "Send failed", message: err.message });
      }
    }
    onClose();
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={400}
      label={`Your wallet has ${prettyPrice(
        process.env.FURYA_NETWORK_ID || "",
        furyBalance?.amount || "0",
        furyBalance?.denom || ""
      )}`}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <TextInputCustom<SendFundFormType>
          name="comment"
          label="COMMENT ?"
          control={control}
          defaultValue="Sent from Furya"
          placeHolder="Type your comment here"
          style={{ marginBottom: 12 }}
        />

        <TextInputCustom<SendFundFormType>
          name="amount"
          label={`${furyCurrency.coinDenom} AMOUNT ?`}
          control={control}
          placeHolder="Type your amount here"
          rules={{
            max: Decimal.fromAtomics(
              furyBalance?.amount || "0",
              furyCurrency.coinDecimals
            ).toString(),
            required: true,
          }}
          currency={furyCurrency}
        />
        <PrimaryButton
          size="M"
          text="Send"
          style={{
            marginVertical: 20,
          }}
          loader
          onPress={formHandleSubmit(handleSubmit)}
        />
      </View>
    </ModalBase>
  );
};
