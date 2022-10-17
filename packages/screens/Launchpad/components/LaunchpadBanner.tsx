import React from "react";
import { Image, StyleSheet, View } from "react-native";

import LaunchpadBannerImage from "../../../../assets/banners/launchpad.png";
import LogoSimpleSvg from "../../../../assets/icons/logo-simple.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { useImageResizer } from "../../../hooks/useImageResizer";
import { useMaxResolution } from "../../../hooks/useMaxResolution";

export const LaunchpadBanner: React.FC = () => {
  // variables
  const { width: maxWidth } = useMaxResolution();
  const { height, width } = useImageResizer({
    image: LaunchpadBannerImage,
    maxSize: { width: maxWidth },
  });

  // returns
  return (
    <View style={styles.container}>
      <Image
        source={LaunchpadBannerImage}
        style={{ width, height, resizeMode: "contain" }}
      />
      <View style={styles.detailContainer}>
        <SVG source={LogoSimpleSvg} />
        <SpacerColumn size={2} />
        <BrandText>Launchpad Submission Form</BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  detailContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});