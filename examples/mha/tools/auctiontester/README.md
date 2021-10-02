## Auction Tester

Node + Puppeteer project than runs a bidding script (on debug auctions only), checks expected values and logs test results.

## Example
```js
runAuctionScript({
  auction: "60da78f3b468b703628c920d",
  auctionScript: scripts.basic4Bidder,
});
```