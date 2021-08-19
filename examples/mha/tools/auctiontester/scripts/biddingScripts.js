const basic1Bidder = {
  label: "basic1Bidder",
  bidderCount: 1,
  script: [{ bidder: 0, bid: { additiveBid: 600 } }],
};

const basic2Bidder = {
  label: "basic2Bidder",
  bidderCount: 2,
  script: [
    { bidder: 0, bid: { additiveBid: 1000 } },
    { bidder: 1, bid: { additiveBid: 1220 } },
    { bidder: 2, bid: { additiveBid: 1000 } },
  ],
};

const basic4Bidder = {
  label: "basic4Bidder",
  bidderCount: 4,
  script: [
    { bidder: 0, bid: { additiveBid: 1000 } },
    { bidder: 1, bid: { additiveBid: 1200 } },
    { bidder: 2, bid: { additiveBid: 2200 } },
    { bidder: 3, bid: { additiveBid: 2200 } },
  ],
};

const basic5Bidder = {
  label: "basic5Bidder",
  bidderCount: 5,
  script: [
    { bidder: 0, bid: { additiveBid: 1000 } },
    { bidder: 1, bid: { additiveBid: 1202 } },
    { bidder: 2, bid: { additiveBid: 2000 } },
    { bidder: 3, bid: { additiveBid: 400 } },
    { bidder: 4, bid: { additiveBid: 300 } },
  ],
};

module.exports = {
  basic1Bidder,
  basic2Bidder,
  basic4Bidder,
  basic5Bidder,
};
