import React, { useEffect, useState } from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import {
  neutral44,
  neutral77,
  successColor,
} from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold16 } from "../../../utils/style/fonts";
import { modalMarginPadding } from "../../../utils/style/modals";
import { txExplorerLink } from "../../../utils/furya";
import { BrandText } from "../../BrandText";
import { CopyToClipboardIcon } from "../../CopyToClipboardIcon";
import { ExternalLink } from "../../ExternalLink";
import { tinyAddress } from "../../WalletSelector";
import { SpacerRow } from "../../spacer";
import ModalBase from "../ModalBase";

// Modal with a success message after transaction
export const TransactionSuccessModal: React.FC<{
  image?: ImageSourcePropType;
  // BrandText with style props. Used to display text with multiple styles (White, gray, ..)
  textComponent: JSX.Element;
  transactionHash?: string;
  onClose: () => void;
  visible?: boolean;
}> = ({
  image,
  textComponent,
  transactionHash = "",
  onClose,
  visible = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const width = 372;

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={width}
      label="Success"
      noBrokenCorners
    >
      <>{image ? <Image source={image} /> : null}</>
      {textComponent}

      <View
        style={{
          height: 1,
          width,
          backgroundColor: neutral44,
          marginVertical: 20,
          marginLeft: -modalMarginPadding - 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View>
          <BrandText
            style={[fontSemibold12, { color: neutral77, marginBottom: 4 }]}
          >
            Status
          </BrandText>
          {/*// TODO: Real time status ? (Processing, processed, ...) */}
          <BrandText style={[fontSemibold16, { color: successColor }]}>
            Sucess
          </BrandText>
        </View>
        <View>
          <BrandText
            style={[fontSemibold12, { color: neutral77, marginBottom: 4 }]}
          >
            Transaction hash
          </BrandText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ExternalLink
              style={fontSemibold16}
              externalUrl={txExplorerLink(transactionHash)}
            >
              {tinyAddress(transactionHash, 21)}
            </ExternalLink>
            <SpacerRow size={1} />
            <CopyToClipboardIcon text={transactionHash} />
          </View>
        </View>
      </View>

      {/*TODO: Share with friend via social networks*/}
      {/*<View style={{height: 1, width, backgroundColor: neutral44, marginVertical: 20}}/>*/}
    </ModalBase>
  );
};
