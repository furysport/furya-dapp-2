import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import CountDown from "react-native-countdown-component";

import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBadge } from "../../components/badges/TertiaryBadge";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ProgressionCard } from "../../components/cards/ProgressionCard";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { GradientText } from "../../components/gradientText";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { FuryaBunkerMinterClient } from "../../contracts-clients/furya-bunker-minter/FuryaBunkerMinter.client";
import { useBalances } from "../../hooks/useBalances";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCurrency } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral33,
  neutral67,
  neutral77,
  neutralA3,
  pinkDefault,
  primaryColor,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { DepositWithdrawModal } from "../WalletManager/components/DepositWithdrawModal";

const maxImageSize = 532;
const cardsHalfGap = 6;

const countDownTxtStyleStarts: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 20,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
  color: pinkDefault,
};

const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const MintCollectionScreen: ScreenFC<"MintCollection"> = ({
  route: {
    params: { id },
  },
}) => {
  const mintAddress = id.startsWith("furya-") ? id.substring(5) : id;
  const wallet = useSelectedWallet();
  const [minted, setMinted] = useState(false);
  const [isDepositVisible, setDepositVisible] = useState(false);
  const { info, notFound, refetchCollectionInfo } = useCollectionInfo(id);
  const { setToastError } = useFeedbacks();
  const [viewWidth, setViewWidth] = useState(0);
  const networkId = process.env.FURYA_NETWORK_ID;
  const balances = useBalances(networkId, wallet?.address);
  const balance = balances.find((bal) => bal.denom === info?.priceDenom);

  const imageSize = viewWidth < maxImageSize ? viewWidth : maxImageSize;
  const mintButtonDisabled = minted || !wallet?.connected;

  const prettyError = (err: any) => {
    const msg = err?.message;
    if (typeof msg !== "string") {
      return `${err}`;
    }
    if (msg.includes("Already minted maximum for whitelist period")) {
      return "You already minted the maximum allowed per address during presale";
    }
    if (msg.includes("Already minted maximum")) {
      return "You already minted the maximum allowed per address";
    }
    if (msg.includes("Not whitelisted!")) {
      return "You are not in the presale whitelist";
    }
    return msg;
  };

  const mint = useCallback(async () => {
    try {
      const mintAddress = id.startsWith("furya-") ? id.substring(5) : id;

      setToastError(initialToastError);
      const sender = wallet?.address;
      if (!sender || !info?.unitPrice || !info.priceDenom) {
        console.error("invalid mint args");
        return;
      }
      const cosmwasmClient = await getSigningCosmWasmClient();
      const minterClient = new FuryaBunkerMinterClient(
        cosmwasmClient,
        sender,
        mintAddress
      );
      await minterClient.requestMint({ addr: sender }, "auto", "", [
        { amount: info.unitPrice, denom: info.priceDenom },
      ]);
      setMinted(true);
      await sleep(5000);
      setMinted(false);
    } catch (err) {
      console.error(err);
      setToastError({
        title: "Mint failed",
        message: prettyError(err),
      });
    }
  }, [wallet?.address, mintAddress, info?.unitPrice, info?.priceDenom]);

  if (!info) {
    return <ScreenContainer noMargin />;
  }

  const {
    discord: discordLink,
    twitter: twitterLink,
    website: websiteLink,
  } = info;
  const hasLinks = discordLink || twitterLink || websiteLink;

  if (notFound) {
    return (
      <ScreenContainer noMargin>
        <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
          <BrandText>Collection not found</BrandText>
        </View>
      </ScreenContainer>
    );
  } else
    return (
      <ScreenContainer noMargin fullWidth>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 72,
              width: "100%",
            }}
            onLayout={(event) => setViewWidth(event.nativeEvent.layout.width)}
          >
            {/* ===== Left container */}
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 534,
              }}
            >
              <BrandText style={{ marginBottom: 12 }}>{info.name}</BrandText>

              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    margin: -cardsHalfGap,
                  }}
                >
                  <AttributesCard
                    label="Supply"
                    value={info.maxSupply || ""}
                    style={{ margin: cardsHalfGap }}
                  />
                  <AttributesCard
                    label="Price"
                    value={info.prettyUnitPrice || ""}
                    style={{ margin: cardsHalfGap }}
                  />
                  <AttributesCard
                    label="Limit Buy"
                    value={
                      info.maxPerAddress
                        ? `${info.maxPerAddress} by address`
                        : "Unlimited"
                    }
                    style={{ margin: cardsHalfGap }}
                  />
                </View>
              </View>

              <GradientText
                gradientType="grayLight"
                style={[fontSemibold14, { marginBottom: 24, marginRight: 24 }]}
              >
                {info.description}
              </GradientText>

              <ProgressionCard
                label="Tokens Minted"
                valueCurrent={
                  info.mintedAmount ? parseInt(info.mintedAmount, 10) : 0
                }
                valueMax={info.maxSupply ? parseInt(info.maxSupply, 10) : 0}
                style={{
                  marginBottom: 24,
                  maxWidth: 420,
                }}
              />

              <BrandText
                style={{
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                Available Balance:{" "}
                {prettyPrice(
                  networkId || "",
                  balance?.amount || "0",
                  info.priceDenom || ""
                )}
              </BrandText>

              <View style={{ flexDirection: "row", marginBottom: 24 }}>
                {info.isMintable && (
                  <PrimaryButton
                    size="XL"
                    text="Mint now"
                    touchableStyle={{ marginRight: 36 }}
                    width={160}
                    disabled={
                      mintButtonDisabled ||
                      parseInt(balance?.amount || "0", 10) <
                        parseInt(info.unitPrice || "0", 10)
                    }
                    loader
                    onPress={mint}
                  />
                )}

                {getCurrency(process.env.FURYA_NETWORK_ID, info.priceDenom)
                  ?.kind === "ibc" && (
                  <PrimaryButton
                    size="XL"
                    text="Deposit Atom"
                    width={160}
                    disabled={mintButtonDisabled}
                    loader
                    onPress={() => setDepositVisible(true)}
                  />
                )}
              </View>

              {hasLinks && (
                <View style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      margin: -cardsHalfGap,
                    }}
                  >
                    <CollectionSocialButtons collectionInfo={info} />
                  </View>
                </View>
              )}

              {mintAddress === process.env.THE_RIOT_COLLECTION_ADDRESS && (
                <View style={{ flexDirection: "row", marginBottom: 24 }}>
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: neutralA3,
                        textDecorationLine: "none",
                      },
                    ]}
                  >
                    {'By clicking "Mint now", you agree to the '}
                  </BrandText>
                  <ExternalLink
                    gradientType="gray"
                    externalUrl="https://furya.notion.site/The-R-ot-Terms-Conditions-0ea730897c964b04ab563e0648cc2f5b"
                    style={[
                      fontSemibold14,
                      {
                        color: neutral67,
                        textDecorationLine: "none",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    Sale Terms & Conditions
                  </ExternalLink>
                </View>
              )}
            </View>

            {/* ===== Right container */}
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                maxWidth: 534,
                maxHeight: 806,
                paddingBottom: 72,
              }}
            >
              <TertiaryBox style={{ marginBottom: 40 }}>
                {info.image ? (
                  <Image
                    source={{ uri: info.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <ActivityIndicator size="large" style={{ margin: 40 }} />
                )}
              </TertiaryBox>

              <BrandText style={[fontSemibold20, { marginBottom: 24 }]}>
                Activity
              </BrandText>
              {info.mintStarted ? (
                <>
                  {info.hasPresale && (
                    <PresaleActivy
                      running={!info.publicSaleEnded && info.isInPresalePeriod}
                      whitelistSize={info.whitelistSize || 0}
                      maxPerAddress={info.whitelistMaxPerAddress || "0"}
                    />
                  )}
                  <PublicSaleActivity
                    started={!info.isInPresalePeriod}
                    ended={!!info.publicSaleEnded}
                    running={info.maxSupply !== info.mintedAmount}
                    startsAt={info.publicSaleStartTime}
                    onCountdownEnd={refetchCollectionInfo}
                  />
                </>
              ) : (
                <MintNotStartedActivity />
              )}
            </View>
          </View>
        </View>
        <DepositWithdrawModal
          variation="deposit"
          networkId={process.env.FURYA_NETWORK_ID || ""}
          targetCurrency={info.priceDenom}
          onClose={() => setDepositVisible(false)}
          isVisible={isDepositVisible}
        />
        {minted && (
          <ConfettiCannon count={200} origin={{ x: -400, y: 0 }} fadeOut />
        )}
      </ScreenContainer>
    );
};

const AttributesCard: React.FC<{
  style?: StyleProp<ViewStyle>;
  label: string;
  value: string;
}> = ({ style, label, value }) => {
  return (
    <TertiaryBox
      style={style}
      width={132}
      height={62}
      mainContainerStyle={{
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 14,
      }}
    >
      <BrandText
        style={[fontSemibold12, { color: neutral77, marginBottom: 6 }]}
      >
        {label}
      </BrandText>
      <BrandText style={fontMedium14}>{value}</BrandText>
    </TertiaryBox>
  );
};

const PresaleActivy: React.FC<{
  running?: boolean;
  whitelistSize: number;
  maxPerAddress: string;
}> = ({ running, whitelistSize, maxPerAddress }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TertiaryBadge label="Presale" />
        {running ? (
          <BrandText style={[fontSemibold16, { color: primaryColor }]}>
            IN PROGRESS
          </BrandText>
        ) : (
          <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
            ENDED
          </BrandText>
        )}
      </View>

      <View
        style={[
          {
            marginBottom: 24,
          },
          !running && {
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
          >
            Whitelist
          </BrandText>
          <BrandText style={fontSemibold16}>{whitelistSize}</BrandText>

          <View
            style={{
              borderRadius: 999,
              width: 2,
              height: 2,
              marginHorizontal: 12,
              backgroundColor: neutral77,
            }}
          />

          {maxPerAddress && maxPerAddress !== "0" ? (
            <>
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
              >
                Max
              </BrandText>
              <BrandText style={fontSemibold16}>{maxPerAddress}</BrandText>
              <BrandText
                style={[fontSemibold16, { color: neutral77, marginLeft: 5 }]}
              >
                Token
              </BrandText>
            </>
          ) : (
            <BrandText
              style={[fontSemibold16, { color: neutral77, marginRight: 5 }]}
            >
              Unlimited
            </BrandText>
          )}
        </View>
      </View>
    </View>
  );
};

const PublicSaleActivity: React.FC<{
  started?: boolean;
  startsAt?: number;
  ended: boolean;
  running?: boolean;
  onCountdownEnd?: () => void;
}> = ({ started, running, ended, startsAt, onCountdownEnd }) => {
  const now = Date.now() / 1000;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Public Mint" />
      {!started && !ended ? (
        <BrandText style={[fontSemibold16, { color: pinkDefault }]}>
          STARTS IN
          <CountDown
            until={(startsAt || now) - now}
            onFinish={onCountdownEnd}
            size={8}
            style={{ marginLeft: layout.padding_x1 }}
            digitTxtStyle={countDownTxtStyleStarts}
            separatorStyle={countDownTxtStyleStarts}
            digitStyle={{ backgroundColor: "none" }}
            showSeparator
            timeLabels={{ d: "", h: "", m: "", s: "" }}
          />
        </BrandText>
      ) : running ? (
        <BrandText style={[fontSemibold16, { color: primaryColor }]}>
          IN PROGRESS
        </BrandText>
      ) : (
        <BrandText style={[fontSemibold16, { color: yellowDefault }]}>
          ENDED
        </BrandText>
      )}
    </View>
  );
};

const MintNotStartedActivity: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TertiaryBadge label="Mint not started" />
    </View>
  );
};
