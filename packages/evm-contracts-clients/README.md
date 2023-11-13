## Generate contract clients for EVM

- Clone the repo `https://github.com/FURYA/evm-nft-vault`
- Set the needed hardhat environment 
- Compiles the contracts with: `npx hardhat compile`
- Copy the needed generated files, ex: If the contract name is `FuryaNft` then we need to:
    + copy `types/factories/<FuryaNft__factory.ts` => `packages/evm-contracts-clients/furya-nft` 
    + copy `types/<FuryaNft.d.ts` => `packages/evm-contracts-clients/furya-nft` 
- Adjust the import:
    + `import type { FuryaNft, FuryaNftInterface } from "../FuryaNft";` => `import type { FuryaNft, FuryaNftInterface } from "./FuryaNft";`
    + `import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";` => `import type { TypedEventFilter, TypedEvent, TypedListener } from "../common";`