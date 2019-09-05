const puppeteer = require("puppeteer");
const nodeConfig = require("dotenv").config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const ts = require("./lib/teamspirits");

require('dotenv').config();
const env = process.env;

const loginUrl = "https://teamspirit.cloudforce.com/";

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, env.key)
  let dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports.init = async () => {
  let status = process.argv[2] ? process.argv[2].toLocaleLowerCase() : null;
  if (status != "in" && status != "out") {
    throw Error("set your status IN or OUT");
  }
  console.log(`status to ${status}`);
  const pass = decrypt(env.password);
  const user = env.username;
  const browser = await puppeteer.launch();
  if (pass == null) {
    throw Error("please set your pass");
  } else if (user == null) {
    throw Error("please set your user");
  }
  const page = await ts.login(loginUrl, user, pass);
  await page.waitFor("iframe");
  const frames = page.frames();
  await ts.timeRecorder(page, frames[1], status);
  await browser.close();
  return status;
}

(async () => {
  const status = await this.init();
  console.log(`change to ${status}`)
  process.exit();
})().catch(e => { console.error(e); process.exit(1) });
