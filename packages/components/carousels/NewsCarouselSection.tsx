import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { News } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { backendClient } from "../../utils/backend";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { NewsBox } from "../hub/NewsBox";

const useNews = (testnet: boolean) => {
  const { data } = useQuery(
    ["news", testnet],
    async () => {
      const { news } = await backendClient.News({ testnet });
      return news;
    },
    {
      staleTime: Infinity,
    }
  );
  return data;
};
