const taikin = "#btnEtInput";
const syussha = "#btnStInput"
const puppeteer = require("puppeteer");

module.exports.login = async (pageUrl, user, pass) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(pageUrl);
  await page.waitFor('#Login');
  await page.screenshot({ path: 'screenshot0.png', fullPage: true });
  await page.type('#username', user);
  await page.type('#password', pass);
  await page.click('#Login');
  await page.waitForNavigation({ waitUntil: "load" });
  return page;
}
module.exports.timeRecorder = async (page, frame, status) => {
  const changeStatus = status == "in" ? syussha : taikin;
  await frame.waitForSelector(changeStatus);
  await page.waitFor(1000);
  await page.screenshot({ path: 'screenshot1.png', fullPage: true });
  await page.waitFor(1000);
  await frame.focus(changeStatus);
  // await page.waitForSelector("#busyWaitMessage");
  await page.screenshot({ path: 'screenshot2.png', fullPage: true });
  return;
}
