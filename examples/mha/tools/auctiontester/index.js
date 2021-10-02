const puppeteer = require("puppeteer");

require("dotenv").config();

const { baseUrl, bidders } = require("./config");
const scripts = require("./scripts/biddingScripts");
console.log("auction tester live", { baseUrl, bidders });

const { getDebugAuctionDetails } = require("./src/pageUtils");

const { runAuctionScript } = require("./src/auctionScriptRunner");

