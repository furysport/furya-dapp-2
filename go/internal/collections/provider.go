package collections

import "github.com/FURYA/furya-dapp/go/pkg/marketplacepb"

type CollectionsProvider interface {
	Collections(limit, offset int) chan *marketplacepb.Collection
}
