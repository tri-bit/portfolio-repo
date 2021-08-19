console.log("exporter active");

require("dotenv").config();

const { program } = require("commander");

const mysql = require("mysql");
const utils = require("./src/utils");

const connnectionConfig = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
};

const setupCommands = () => {
  program
    .option("-m, --meta", "create users metadata file")
    .option("-eu --exportusers <amount>", "export sql users to file");
};

console.log({ connnectionConfig });

const sqlConnection = mysql.createConnection(connnectionConfig);

sqlConnection.connect(async (err) => {
  if (err) {
    console.log("connection err", err);
  } else {
    console.log("db connected");

    runCommands();
  }
});

const runCommands = async () => {
  program.parse();

  if (program.exportusers) {
    const count = program.exportusers;
    console.log(`export ${count} users`);
    utils.exportUsersToFile({ sqlConnection, limit: count });
  } else if (program.meta) {
    console.log("creating user master meta file");
    utils.exportUserMetaToFile({ sqlConnection });
  }
};

setupCommands();
