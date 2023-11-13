import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View, Image, Linking } from "react-native";

import defaultNewsBanner from "../../../assets/default-images/default-news-banner.png";
import airdropSVG from "../../../assets/icons/airdrop.svg";
import labsSVG from "../../../assets/icons/labs.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import stakingSVG from "../../../assets/icons/staking.svg";
import {
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useImageResizer } from "../../hooks/useImageResizer";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { backendClient } from "../../utils/backend";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { Link } from "../Link";
import { Section } from "../Section";
import { DAppCard } from "../cards/DAppCard";
import { LabelCard } from "../cards/LabelCard";
import { MyWalletsCard } from "../cards/MyWalletsCard";
import { CollectionsCarouselSection } from "../carousels/CollectionsCarouselSection";
import { NewsCarouselSection } from "../carousels/NewsCarouselSection";

const gridHalfGutter = 12;

export const HubLanding: React.FC = () => {
  const navigation = useAppNavigation();
  const { width: maxWidth } = useMaxResolution();
  const { width, height } = useImageResizer({
    image: defaultNewsBanner,
    maxSize: { width: maxWidth },
  });
  const banners = useBanners(
    process.env.FURYA_NETWORK_ID === "furya-testnet"
  );
  const banner = banners?.length ? banners[0] : undefined;

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }}>
        <Link to={banner?.url || ""}>
          <Image
            source={{
              uri: ipfsURLToHTTPURL(banner?.image),
            }}
            style={{
              height,
              width,
              borderRadius: 20,
              marginTop: 56,
            }}
          />
        </Link>

        <Section title="My Dashboard">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -gridHalfGutter,
            }}
          >
            <MyWalletsCard
              onPress={() => navigation.navigate("WalletManager")}
            />
            <DAppCard
              onPress={() => navigation.navigate("Staking")}
              label="Staking"
              description="Participate to the Security Get rewards by delegating to Furya validators"
              info="Staking on Keplr!"
              iconSVG={stakingSVG}
            />
          </View>
        </Section>
        <Section title="Coming soon dApps">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -gridHalfGutter,
            }}
          >
            <LabelCard label="Raffle" style={{ margin: gridHalfGutter }} />
            <LabelCard label="Lottery" style={{ margin: gridHalfGutter }} />
            <LabelCard
              label="Group
Chats"
              style={{ margin: gridHalfGutter }}
            />
            <LabelCard
              label="DAO
Launch"
              style={{ margin: gridHalfGutter }}
            />
            <DAppCard
              label="Contribute!"
              description="Want to build new dApps? Join the Bounty Program & get your project funded."
              info="Apply here"
              iconSVG={airdropSVG}
              onPress={() => Linking.openURL("https://app.dework.xyz/furya")}
            />
          </View>
        </Section>
      </View>
    </View>
  );
};

const useBanners = (testnet: boolean) => {
  const { data } = useQuery(
    ["banners", testnet],
    async () => {
      const { banners } = await backendClient.Banners({ testnet });
      return banners;
    },
    { staleTime: Infinity }
  );
  return data;
};
