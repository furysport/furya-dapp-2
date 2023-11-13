// FIXME: use contract parameter instead of hardcoded list

import { Collection } from "../api/marketplace/v1/marketplace";

export const secondaryDuringMintList = [
  `furya-${process.env.FURYA_NAME_SERVICE_CONTRACT_ADDRESS}`, // TNS
  "furya-furya1r8raaqul4j05qtn0t05603mgquxfl8e9p7kcf7smwzcv2hc5rrlq0vket0", // Furya's pets
  "furya-furya167xst2jy9n6u92t3n8hf762adtpe3cs6acsgn0w5n2xlz9hv3xgs4ksc6t", // Diseases of the Brain AI
  "furya-furya1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37", // RIOT gen 1
  "furya-furya1qdgvugdnscwnj8lc96q666000gyjv434kn9zl9ey3dph6p0cunusy6r42x", // furyasouls
];

export const launchpadCollectionsFilter = (c: Collection): boolean => {
  return ![
    "furya-furya1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37", // RIOT gen 1
  ].includes(c.id);
};
