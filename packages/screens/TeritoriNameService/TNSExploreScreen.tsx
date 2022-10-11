import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { SendFundModal } from "../../components/modals/teritoriNameService/TNSSendFundsModal";
import { BackTo } from "../../components/navigation/BackTo";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useCheckNameAvailability } from "../../hooks/useCheckNameAvailability";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { isTokenOwnedByUser } from "../../utils/tns";

export const TNSExploreScreen: ScreenFC<"TNSExplore"> = () => {
  const [sendFundsModalVisible, setSendFundsModalVisible] = useState(false);
  const { name, setName } = useTNS();
  const navigation = useAppNavigation();
  const isKeplrConnected = useIsKeplrConnected();
  const { setLoadingFullScreen } = useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const { nameAvailable, nameError, loading } = useCheckNameAvailability(
    name,
    tokens
  );

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  return (
    <ScreenContainer
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
      footerChildren={
        <BackTo
          label="Back to home"
          onPress={() => navigation.navigate("TNSHome")}
        />
      }
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
      >
        {/*-----  If name entered, no error and if the name is minted, we display some buttons for Explore flow */}
        {name &&
        !nameError &&
        !nameAvailable &&
        !isTokenOwnedByUser(tokens, name) ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 56,
              maxHeight: 56,
              minHeight: 56,
              maxWidth: 332,
              width: "100%",
            }}
          >
            <PrimaryButton
              size="XL"
              width={154}
              text="View"
              onPress={() => navigation.navigate("TNSConsultName", { name })}
            />
            <PrimaryButtonOutline
              size="XL"
              width={154}
              disabled={!isKeplrConnected}
              text="Send funds"
              onPress={() => setSendFundsModalVisible(true)}
            />
          </View>
        ) : null}
      </FindAName>

      <SendFundModal
        onClose={() => setSendFundsModalVisible(false)}
        visible={sendFundsModalVisible}
      />
    </ScreenContainer>
  );
};