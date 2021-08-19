const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const exportDir = "exports";

const arrayToQuoteString = (array) => array.map((item) => `'${item}'`).join();

const userMetaKeys = [
  "phone_number",
  "user_city",
  "user_state",
  "first_name",
  "last_name",
];

const queryUsers = "SELECT * FROM `wp_users` WHERE 1";
const queryUsersMeta = "SELECT * FROM `wp_usermeta` WHERE 1";
const queryAuctions = "SELECT * FROM `wp_wpa_auctions` WHERE 1";
const queryAuctionBids = "SELECT * FROM `wp_wpa_bids` WHERE 1";
const queryUserMeta = `SELECT meta_key, meta_value FROM wp_usermeta WHERE meta_key IN (${arrayToQuoteString(
  userMetaKeys
)})`;

const createUserMetaQuery = ({ id }) => {
  return `SELECT meta_key, meta_value FROM wp_usermeta WHERE user_id = ${id} AND meta_key IN (${arrayToQuoteString(
    userMetaKeys
  )})`;
};

const queryToFile = async ({ label, results }) => {
  console.log("query to file ");
  const time = dayjs(new Date()).format("M_D_YYYY_h_mm_ss_A");
  const fileName = `${label}_${time}.txt`;
  const filePath = path.resolve(__dirname, `../${exportDir}/${fileName}`);

  await fs.writeFileSync(filePath, JSON.stringify(results), { flag: "w" });
  console.log(`query export written to ${filePath}`);
};

const runQuery = async ({ sqlConnection, query, limit }) => {
  const finalQuery = `${query}${limit ? ` LIMIT ${limit}` : ""}`;
  console.log(`running query: ${finalQuery}`);

  return new Promise((resolve, reject) => {
    sqlConnection.query(finalQuery, (err, results, fields) => {
      if (err) {
        console.log("query error", err);
        reject(null);
      } else {
        const preppedResults = results.map((result) => {
          return { ...result };
        });
        //utils.queryToFile({label:'users', results:preppedResults});
        //console.log('query results:', preppedResults);
        resolve(preppedResults);
      }
    });
  });
};

const exportUsersToFile = async ({ sqlConnection, limit = 6 }) => {
  console.log(`exportUsersToFile, limit ${limit}`);
  const preppedResults = await runQuery({
    sqlConnection,
    query: queryUsers,
    limit,
  });
  console.log(`user query`, preppedResults);
  queryToFile({ label: "users", results: preppedResults });
};

const exportBidsToFile = async ({ sqlConnection, limit = 200 }) => {
  console.log(`exportBidsToFile, limit ${limit}`);
  const preppedResults = await runQuery({
    sqlConnection,
    query: queryAuctionBids,
    limit,
  });
  console.log(`bid query`, preppedResults);
  queryToFile({ label: "bids", results: preppedResults });
};

const exportUserMetaToFile = async ({ sqlConnection, limit = 200 }) => {
  console.log("exportUserMetaToFile");

  const preppedResults = await runQuery({
    sqlConnection,
    query: queryUsersMeta,
  });
  queryToFile({ label: "userMetaMasterFile", results: preppedResults });
};

module.exports = {
  queryUsers,
  runQuery,
  queryAuctions,
  queryAuctionBids,
  createUserMetaQuery,
  queryToFile,
  exportUsersToFile,
  exportBidsToFile,
  exportUserMetaToFile,
};
