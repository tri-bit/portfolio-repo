const baseUrl = process.env.BASEURL || "http://localhost:3000";
const serverUrl = process.env.SERVERURL || "http://localhost:4000";
const waitConfig = { waitUntil: "networkidle2" };
const viewportConfig = { width: 1100, height: 900 };
const screenshotPath = "./logging/screenshots/";
const loggingEnabled = true;

const parseBidders = () => {
  const parsed = [];

  const parse = (bidderString) => {
    if (!bidderString) {
      console.log("bidder not found for parsing, skipping");
      return;
    }

    const email = bidderString.split("|")[0];
    const password = bidderString.split("|")[1];
    const publicNickName = bidderString.split("|")[2];

    parsed.push({ email, password, publicNickName });
  };

  parse(process.env.BIDDER1);
  parse(process.env.BIDDER2);
  parse(process.env.BIDDER3);
  parse(process.env.BIDDER4);
  parse(process.env.BIDDER5);

  return parsed;
};

const bidders = parseBidders();

module.exports = {
  baseUrl,
  serverUrl,
  bidders,
  waitConfig,
  viewportConfig,
  screenshotPath,
  loggingEnabled,
};
