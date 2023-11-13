#!/bin/sh

backend_image=$registry/furya/furya-dapp-2-backend:$(git rev-parse --short HEAD)
docker build .. -f ../go/cmd/furya-dapp-2-backend/Dockerfile -t $backend_image
docker push $backend_image

indexer_image=$registry/furya/furya-indexer:$(git rev-parse --short HEAD)
docker build .. -f ../go/cmd/furya-indexer/Dockerfile -t $indexer_image
docker push $indexer_image
