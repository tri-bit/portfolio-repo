const puppeteer = require("puppeteer");
const axios = require("axios");
const { writeLog } = require("./logging");

const { calculateExpectedBidResult } = require("./auctionUtils");

const {
  baseUrl,
  serverUrl,
  waitConfig,
  viewportConfig,
  screenshotPath,
  logging,
} = require("../config");

const testIdSelector = (id) => `[data-testid='${id}']`;
const screenshotDetails = (screenshotName) => {
  return {
    path: `${screenshotPath}${screenshotName}_${new Date().getTime()}.png`,
    fullPage: false,
  };
};

const getPageElementText = async ({ page, selector }) => {
  try {
    const text = await page.$eval(selector, (el) => el.textContent);
    return text;
  } catch (err) {
    console.log(`error getting ${selector}`, err.message);
    return null;
  }
};

const getCurrentUserNickname = async ({ page }) =>
  await page.$eval(testIdSelector("userNickname"), (el) => el.textContent);

const wait = async (duration) => {
  console.log(`waiting ${duration}..`);
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const clickSubmitButton = async ({ page }) => {
  const submitButton = await page.$(testIdSelector("submitButton"));

  if (submitButton) {
    await submitButton.click();
    console.log("submit button clicked");
  } else {
    console.log("error: submit button not found");
  }
};

const clickModalConfirmButton = async ({ page }) => {
  await clickButtonByTestId({ page, testId: "modalConfirm" });
};

const clickButtonByTestId = async ({ page, testId }) => {
  const button = await page.$(testIdSelector(testId));

  if (button) {
    await button.click();
    console.log("button clicked", testId);
  } else {
    console.log("error: button not found:", testId);
  }
};

const getAuctionDetails = async ({ page }) => {
  const details = await page.evaluate(() => {
    const title = document.querySelector("#auctionTitle").textContent;
    const auctionJson = JSON.parse(
      document.querySelector("#auctionJson").textContent
    );
    return { title, auctionJson };
  });

  return details;
};

const getDebugAuctionDetails = async ({ auction }) => {
  const response = await axios.post(`${serverUrl}/api/debugauctiondetails`, {
    id: auction,
  });
  const debugAuctionDetails = response && response.data;
  console.log("debug auction details response", debugAuctionDetails);
  return debugAuctionDetails;
};

const login = async ({ page, bidder }) => {
  console.log("signing in..", bidder);
  await page.goto(`${baseUrl}/sign-in`, waitConfig);
  await page.setViewport(viewportConfig);
  console.log("page loaded..");

  await page.type(testIdSelector("email"), bidder.email, { delay: 100 });
  await page.type(testIdSelector("password"), bidder.password, { delay: 100 });

  page.keyboard.press("Enter");

  await page.waitForTimeout(5000);
  //await( await page.$(testIdSelector('password')).type(bidder.password) );
  await page.screenshot(screenshotDetails(`loginTest1_${bidder.email}`));
};

const getAuctioneerStatus = async ({ page }) => {
  //auctioneerConnectionStatus
  const status = await getPageElementText({
    page,
    selector: testIdSelector("auctioneerConnectionStatus"),
  });
  return status;
};

const confirmLogin = async ({ page, publicNickName }) => {
  //checks header for nickname
  await page.waitForTimeout(4000);

  const foundNickName = await getPageElementText({
    page,
    selector: testIdSelector("userNickname"),
  });

  if (!foundNickName) {
    const screenshotDetails = (screenshotName) => {
      return {
        path: `${screenshotPath}${screenshotName}_${new Date().getTime()}.png`,
        fullPage: true,
      };
    };
    await page.screenshot(
      screenshotDetails(`Error_loginConfirm_${publicNickName}`)
    );
    return null;
  }

  console.log(`confirming ${publicNickName} login, found ${foundNickName}`);
  return foundNickName && foundNickName.trim() == publicNickName;
};

const placeBid = async ({ page, auction, exactBid, additiveBid, label }) => {
  //todo support exactBid

  //re-get details as bids may have updated
  const debugAuctionDetails = await getDebugAuctionDetails({ auction });

  const bidLabel = label ? `${label}: ` : "";

  if (!page) {
    //console.log('page object missing, bidding canceled');
    writeLog({
      text: "page object missing, bidding canceled",
      consoleLog: true,
    });
    return;
  }

  let currentBid = await getPageElementText({
    page,
    selector: testIdSelector("currentBid"),
  });

  if (!currentBid) {
    //console.log('cannot find currentBid, bidding canceled');
    writeLog({
      text: "cannot find currentBid, bidding canceled",
      consoleLog: true,
    });

    return;
  }

  currentBid = parseFloat(currentBid.replace("$", ""));

  const calculatedAdditiveBid =
    additiveBid && currentBid && !Number.isNaN(currentBid)
      ? currentBid + parseInt(additiveBid)
      : null;

  const bid = additiveBid || exactBid;

  console.log("current bid", { currentBid, calculatedAdditiveBid, bid });

  if (!bid || Number.isNaN(calculatedAdditiveBid)) {
    //console.log('bid error, bidding canceled..', { bid, calculatedAdditiveBid});
    writeLog({
      text: "bid error, bidding canceled..",
      data: { bid, calculatedAdditiveBid },
      consoleLog: true,
    });

    return;
  }

  const { topBids, sortedTopBids, customIncrement } = debugAuctionDetails;

  //we pass the broswer observed price (currentbid) rather than the debug currentPrice bid to confirm
  //the browser is correct

  //todo customIncrement or siteSettings (default) increment
  //todo should newBid be bid rather than additive bid?

  const expectedBidResult = calculateExpectedBidResult({
    newBid: calculatedAdditiveBid,
    currentPrice: currentBid,
    sortedTopBids,
    customIncrement,
  });

  //console.log(`${bidLabel}placing bid`, calculatedAdditiveBid);
  writeLog({
    text: `${bidLabel}placing bid`,
    data: { bid, calculatedAdditiveBid },
    consoleLog: true,
  });

  writeLog({ text: "expected bid result", data: expectedBidResult });

  await page.type(testIdSelector("bidInput"), String(calculatedAdditiveBid), {
    delay: 100,
  });
  await clickSubmitButton({ page });
  await page.waitForTimeout(2000);
  await clickModalConfirmButton({ page });

  console.log("waiting 5 seconds...");
  await page.waitForTimeout(5000);

  //const screenshotDetails = (screenshotName)=> {  return {path:`${screenshotPath}${screenshotName}_${new Date().getTime()}.png`, fullPage:true} };
  await page.screenshot(screenshotDetails(`BidPlaced_${bid}`));

  const updatedBid = await getPageElementText({
    page,
    selector: testIdSelector("currentBid"),
  });

  //console.log('current bid', updatedBid);
  writeLog({
    text: `after placing (${calculatedAdditiveBid})bid , current bid in browser check:`,
    data: updatedBid,
    consoleLog: true,
  });

  return true;
};

const createPages = async ({ auction, bidders, bidderCount }) => {
  if (!bidderCount || bidderCount > 5 || bidderCount < 0) {
    console.log(
      "createPages bidderCount error, auctionStript stopped",
      bidderCount
    );
    return null;
  }

  //create an dynamic we can iterate over, 0 is a placeholder value
  const pageSettings = Array(bidderCount)
    .fill(0)
    .map((item, index) => {
      return { auction, bidder: bidders[index] };
    });

  const pages = await Promise.all(
    pageSettings.map((setting) => {
      return createPageForBidding(setting);
    })
  );

  /*
    const [page, page2] = await Promise.all([
        createPageForBidding ({auction, bidder:bidders[0]}),
        createPageForBidding ({auction, bidder:bidders[1]})
    ]);
    */

  return pages;
};

const getAuctionUrl = (auctionId) =>
  `${baseUrl}/auction/auction-name/${auctionId}`;

const createPageForBidding = async ({ auction, bidder }) => {
  const auctionUrl = getAuctionUrl(auction);

  const browser = await puppeteer.launch();

  const { publicNickName } = bidder;
  const page = await browser.newPage();
  await login({ page, bidder });
  console.log(`login complete for ${publicNickName}`);
  console.log(`going to: ${auctionUrl}`);
  await page.goto(auctionUrl, { waitUntil: "networkidle2" });
  const loggedIn = await confirmLogin({ page, publicNickName });
  console.log(`confirming login for:${publicNickName}`, loggedIn);
  await page.screenshot(screenshotDetails(`pageSetup_${bidder.email}`));

  return page;
};

module.exports = {
  login,
  confirmLogin,
  placeBid,
  createPages,
  getAuctionDetails,
  getDebugAuctionDetails,
  getAuctioneerStatus,
  getCurrentUserNickname,
  createPageForBidding,
  wait,
};
