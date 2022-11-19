package airtable_fetcher

type Client struct {
	config ClientConfig
}

type ClientConfig struct {
	APIKey           string
	BaseID           string
	LaunchpadTableID string
	BannersTableID   string
	NewsTableID      string
}

func NewClient() *Client {
	return &Client{config: ClientConfig{
		APIKey:           "keyNTJ1BbH31oTuwQ",
		BaseID:           "appetXQzVoElrsJs5",
		LaunchpadTableID: "tbla2ZD8MtljtvHKt",
		BannersTableID:   "tblUXvHaNCABlq8zg",
		NewsTableID:      "tblOlJKlbNsSpdAVq",
	}}
}