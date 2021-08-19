const fs = require("fs");
const dayjs = require("dayjs");
const { loggingEnabled } = require("../config");

const filePath = `./logging/text/${dayjs(new Date()).format("M_D_YYYY")}.txt`;
console.log(`auction tester logging file path: ${filePath}`);

const addToLog = async (text) => {
  try {
    const exists = await fs.existsSync(filePath);

    console.log("file exists", exists);

    if (exists) {
      fs.appendFile(filePath, `${text}\n`, (err, results) => {
        if (err) {
          console.log("log write error", err);
        }
      });
    } else {
      fs.writeFile(filePath, `${text}\n`, (err, results) => {
        if (err) {
          console.log("log write error", err);
        } else {
          console.log("log written");
        }
      });
    }
  } catch (err) {
    console.log("log write error", err);
  }
};

const writeLog = async ({ label, text, data, format, consoleLog }) => {
  const time = dayjs(new Date()).format("M/D/YYYY h:mm:ss A");
  let entry = `${time} - ${label || ""}${label ? ":" : ""}${text || ""} ${
    data ? JSON.stringify(data) : ""
  }`;

  switch (format) {
    case "header":
      entry = `------------------------------\n${entry}`;
      break;

    case "reverseHeader":
      entry = `${entry}\n------------------------------`;
      break;

    default:
    //no change
  }

  if (consoleLog) {
    console.log({ label, text, data });
  }

  if (loggingEnabled) {
    await addToLog(entry);
    return true;
  } else {
    console.log("**logging not enabled**");
    return;
  }
};

module.exports = {
  writeLog,
};
