const calculateExpectedBidResult = ({
  newBid,
  currentPrice,
  sortedTopBids,
  customIncrement,
}) => {
  //todo calculate bid increment on server? Hardcoded to customeIncrement for now
  console.log("----calculating expected bid result", {
    newBid,
    currentPrice,
    sortedTopBids,
    customIncrement,
  });

  let expectedResult = null;

  console.log("top bid", sortedTopBids[0]);

  const newBidAmountToCents = newBid.bidAmount * 100; //dollars to cents

  //1st bid
  if (sortedTopBids.length === 0 && newBidAmountToCents >= currentPrice) {
    return {
      expectedPrice: currentPrice,
      notes: "1st bid",
    };
  } else if (sortedTopBids.length === 0) {
    return {
      expectedPrice: currentPrice,
      notes: "error or insuficient bid (newBidAmountToCents)",
    };
  }

  const top = sortedTopBids[0];

  const thresholdPrice = top.bidAmount + parseInt(customIncrement);

  if (newBidAmountToCents > thresholdPrice && newBid.user !== top.user) {
    return {
      user: newBid.user,
      expectedPrice: thresholdPrice,
      notes: "new winner",
    };
  } else {
    //if new bid is current top bidder or price requirement not met
    return {
      user: top.user,
      expectedPrice: top.bidAmount,
      notes: "bidder is already top bidder or price requirement not met",
    };
  }

  //shouldn't reach this code
  console.log("error in expected calculation, returning null");
  return null;
};

module.exports = {
  calculateExpectedBidResult,
};
