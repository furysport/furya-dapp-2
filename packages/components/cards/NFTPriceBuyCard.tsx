import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { prettyPrice } from "../../utils/coins";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GradientText } from "../gradientText";

// TODO: Dynamic data + props

export const NFTPriceBuyCard: React.FC<{
  price?: string;
  priceDenom?: string;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ price = "", priceDenom = "", onPressBuy, style }) => {
  return (
    <TertiaryBox
      fullWidth
      height={88}
      style={style}
      mainContainerStyle={{
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <BrandText style={[fontSemibold12, { marginBottom: 6 }]}>
          Current Price
        </BrandText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <GradientText
            gradientType="purple"
            style={[fontSemibold28, { marginRight: 12 }]}
          >
            {prettyPrice(
              process.env.FURYA_NETWORK_ID || "",
              price,
              priceDenom
            )}
          </GradientText>
          <CurrencyIcon
            networkId={process.env.FURYA_NETWORK_ID || ""}
            denom={priceDenom}
            size={24}
          />
        </View>
      </View>
      <PrimaryButton size="XL" text="Buy this NFT" onPress={onPressBuy} />
    </TertiaryBox>
  );
};
