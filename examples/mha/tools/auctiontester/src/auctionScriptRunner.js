const {
  login,
  confirmLogin,
  placeBid,
  createPages,
  getAuctioneerStatus,
  createPageForBidding,
  getAuctionDetails,
  getDebugAuctionDetails,
  getCurrentUserNickname,
  wait,
} = require("./pageUtils");

const { baseUrl, serverUrl, bidders } = require("../config");
const { writeLog } = require("./logging");

const runAuctionScript = async ({ auction, auctionScript }) => {
  console.log("checking site");
  if (!auction || !auctionScript) {
    console.log("missing properties, canceling auctionscript run", {
      auction,
      auctionScript,
    });
  }

  const { bidderCount, label, script } = auctionScript;

  if (!bidderCount || !label || !script) {
    console.log("missing properties, canceling auctionscript run", {
      bidderCount,
      label,
      script,
    });
  }

  const scriptLabel = `${auctionScript.label} auction: ${auction}`;
  writeLog({
    label: "Running Script",
    text: scriptLabel,
    format: "header",
    consoleLog: true,
  });

  const debugAuctionDetails = await getDebugAuctionDetails({ auction });

  writeLog({
    label: "Auction DebugDetails",
    data: debugAuctionDetails.auction,
    consoleLog: true,
  });

  const pages = await createPages({ auction, bidders, bidderCount });
  console.log("created pages length", pages.length);

  const auctionDetails = await getAuctionDetails({ page: pages[0] });

  writeLog({
    label: "Auction Details",
    data: auctionDetails,
    consoleLog: true,
  });
  writeLog({ text: "bidding pages created", consoleLog: true });

  //iterate through script
  let index = 1;

  const completed = await asyncForEachComplete(script, async (scriptItem) => {
    console.log("running script item ", scriptItem);

    const { bidder, bid } = scriptItem;
    const { additiveBid } = bid;

    const page = pages[bidder];

    //assume the scriptItem is always an additive bid for now
    const auctioneerConnection = await getAuctioneerStatus({ page });
    console.log({ auctioneerConnection });

    if (auctioneerConnection !== "true") {
      console.log("auctioneer not connected...bid canceled");
      return;
    }

    await placeBid({
      page,
      auction,
      additiveBid,
      label: bidders[bidder].publicNickName,
    });
    await waitFor(16000);

    index++;
  });

  writeLog({
    label: "Test Complete",
    text: scriptLabel,
    format: "reverseHeader",
    consoleLog: true,
  });
  console.log("script complete");

  process.exit(0); //exit node
};

//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const waitFor = (ms) =>
  new Promise((r) => {
    console.log(`waiting for ${Math.ceil(ms / 1000)} seconds...`);
    setTimeout(r, ms);
  });

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function asyncForEachComplete(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
  return "complete";
}

module.exports = {
  runAuctionScript,
};
