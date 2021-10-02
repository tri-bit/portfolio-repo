// portfolio example code from magic horse auction server app (node.js) - used to import users into the mongoDB database
// by referencing the two exported files created with this tool: https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/sqlexporter


// importing 'legacy' database information, should only should be used during development

const mongoose = require('mongoose');
const passport = require('passport');
const axios = require('axios');
const path = require('path');
const dayjs = require('dayjs');
const crypto = require('crypto');


const fs = require('fs').promises;

require('dotenv').config();

const User = require('./srcServer/models/user');
const Auction = require('./srcServer/models/auction');

const exportPath = '../tools/sqlexporter/exports/';

const { asyncForEachComplete } = require('./srcServer/utils');

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DB connected');
    runImportTask();
  })
  .catch(err => {
    console.log('problem connecting to DB', err);
  });

const readFileAsJson = async ({ file }) => {

  const data = await fs.readFile(`${exportPath}${file}`);
  if (data) {
    return JSON.parse(data.toString('utf8'));
  }
  return null;

};

const logToFile = async ({ log }) => {

  console.log('query to file ');
  const time = dayjs(new Date()).format('M_D_YYYY_h_mm_ss_A');
  const fileName = `userImportLog_${time}.txt`;
  const filePath = path.resolve(__dirname, `./logs/${fileName}`);

  const output = log.join('\n');

  console.log(output);

  await fs.writeFile(filePath, output, { flag: 'w' });
  console.log(`log written to ${filePath}`);

};

const createToken = (size) => crypto.randomBytes(size).toString('hex');

const convertUser = ({ legacyUser, userMetaData }) => {

  const {
    ID, user_email, user_nicename, display_name, user_pass,
  } = legacyUser;

  const metaData = { id: ID };

  const metaFields = userMetaData.filter(data => data.user_id === ID);

  metaFields.forEach(data => {

    const { id, meta_key, meta_value } = data;
    metaData[meta_key] = meta_value;

  });

  // console.log(`fields for ${ID}: `, { metaData });

  const missingString = 'missing';

  //console.log({sms:metaData.sms_on, conversion:metaData.sms_on === "on"});

  const convertedUser = {

    firstName: metaData.first_name || missingString,
    lastName: metaData.last_name || missingString,
    publicNickname: metaData.nickname || display_name,
    phone: metaData.phone_number || missingString,
    city: metaData.user_city || missingString,
    state: metaData.user_state || missingString,
    email: user_email,
    smsMessagingNews: metaData.sms_on === "on",
    smsMessagingOutbid: metaData.sms_on === "on",
    legacyID: ID,
    legacyProfileJSON: JSON.stringify(legacyUser),

    //placeholder password
    password: createToken(20)


  };

  return convertedUser;

};

const importUsers = async ({
  userFile, limit = 3, userMetaMasterFile, debugOnly,
}) => {

  const users = await readFileAsJson({ file: userFile });

  const userMetaData = await readFileAsJson({ file: userMetaMasterFile });

  const convertedUsers = users.map(user => convertUser({ legacyUser: user, userMetaData }));

  console.log(`converted users ${convertedUsers.length}`);

  if (users && convertedUsers && !debugOnly) {
    console.log('uploading users');
    await uploadUsers({ users: convertedUsers, limit });
    console.log('import complete');
  } else {
    console.log('upload skipped');
  }

};

const uploadUsers = async ({ users, limit }) => {

  const log = [];
  let count = 1;
  let newUserCount = 0;

  log.push(`upload users, limit ${limit}`);

  const completed = await asyncForEachComplete(users, async (user) => {

    if (count > limit) {
      return;
    }

    // const convertedUser = convertUser(user);
    const { email } = user;
    log.push(`user: ${email}`);

    console.log(`user:${count} upload attempt ${email}`);

    const previousUser = await User.findOne({ email });
    if (previousUser) {
      log.push(`user skipped (already created): ${email}`);
      // console.log({ previousUser });
    } else {

      const newUser = await new User({ ...user });
      if (newUser) {
        await newUser.save();
        newUserCount++;
        log.push(`new user created: ${email}`);
      } else {
        log.push(`error adding ${email}`);
      }
    }

    count++;

  });

  console.log(`${newUserCount} users uploaded `);
  logToFile({ log });
};

const runImportTask = () => {

  console.log('running import task');
  importUsers({
    userFile: 'users_2_16_2021_10_18_30_PM.txt',
    userMetaMasterFile: 'userMetaMasterFile_2_16_2021_9_08_34_PM.txt',
    limit: 4500,
    debugOnly: false,
  });

};


// runImportTask();
