import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";

import {
  GrpcWebImpl,
  MarketplaceServiceClientImpl,
} from "../api/marketplace/v1/marketplace";

const backendEndpoint = "https://dapp-backend.mainnet.furya.xyz";

const rpc = new GrpcWebImpl(backendEndpoint, {
  transport: NodeHttpTransport(),
  debug: false,
  // metadata: new grpc.Metadata({ SomeHeader: "bar" }),
});

export const nodeBackendClient = new MarketplaceServiceClientImpl(rpc);
