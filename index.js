const puppeteer = require("puppeteer");
const nodeConfig = require("dotenv").config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
require('dotenv').config();
const env = process.env;

const loginUrl = "https://teamspirit.cloudforce.com/";
const taikin = "#btnEtInput";
const syussha = "#btnStInput"
function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, env.key)
  let dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

(async () => {
  const pass = decrypt(env.password);
  console.log(env.username);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(loginUrl, { waitUntil: "load" });
  await page.waitFor('#Login');
  await page.type('#username', env.username);
  await page.type('#password', pass);
  await page.screenshot({ path: 'screenshot0.png', fullPage: true });
  await page.click('#Login');
  await page.waitForNavigation({ waitUntil: "load" });
  await page.waitFor("iframe");
  const frames = await page.frames();
  await frames[1].waitForSelector("#btnEtInput");

  const taikinButton = await frames[1].$(taikin);
  const syusshaButton = await frames[1].$(syussha);
  console.log(await (await syusshaButton.getProperty("title")).jsonValue());
  console.log(await (await taikinButton.getProperty("title")).jsonValue());
  // await (await frames[1].$("#btnEtInput")).click();
  await page.screenshot({ path: 'screenshot1.png', fullPage: true });
  // await page.waitFor('div#btnEtInput');

  await browser.close();
})().catch(e => { console.error(e); process.exit() });