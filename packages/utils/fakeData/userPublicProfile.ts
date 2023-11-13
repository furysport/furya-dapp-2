import avatarPNG from "../../../assets/default-images/avatar.png";
import guardianPNG from "../../../assets/default-images/guardian_1.png";
import bidsSVG from "../../../assets/icons/activity-types/bids.svg";
import burnsSVG from "../../../assets/icons/activity-types/burns.svg";
import followingsSVG from "../../../assets/icons/activity-types/followings.svg";
import likesSVG from "../../../assets/icons/activity-types/likes.svg";
import listingSVG from "../../../assets/icons/activity-types/listing.svg";
import purchaseSVG from "../../../assets/icons/activity-types/purchase.svg";
import salesSVG from "../../../assets/icons/activity-types/sales.svg";
import transferSVG from "../../../assets/icons/activity-types/transfer.svg";
import { Activity } from "../../components/cards/ActivityCard";

export const fakeActivities: Activity[] = [
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Listing", iconSVG: listingSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Purchase", iconSVG: purchaseSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Sales", iconSVG: salesSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Transfer", iconSVG: transferSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Burns", iconSVG: burnsSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Likes", iconSVG: likesSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Bids", iconSVG: bidsSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Followings", iconSVG: followingsSVG },
    userFromAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "furya1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
];
