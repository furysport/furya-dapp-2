package collections

import "github.com/furysport/furya-dapp-2/go/pkg/marketplacepb"

type CollectionsProvider interface {
	Collections(limit, offset int) chan *marketplacepb.Collection
}
