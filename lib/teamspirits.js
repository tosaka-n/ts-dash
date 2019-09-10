const syussha = "div#btnStInput.pw_btnnst"
const taikin = "div#btnEtInput.pw_btnnet";
const puppeteer = require("puppeteer");

module.exports.login = async (pageUrl, user, pass) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(pageUrl);
  await page.waitFor('#Login');
  await page.type('#username', user);
  await page.type('#password', pass);
  await page.click('#Login');
  await page.waitForNavigation({ waitUntil: "load" });
  return page;
}
module.exports.timeRecorder = async (page, status) => {
  await page.waitFor("iframe");
  page.on('dialog', dialog => {
    throw new Error(dialog.message());
  });
  const frames = page.frames();
  const frame = frames[1];
  const changeStatus = status == "in" ? syussha : taikin;
  try {
    await frame.waitForSelector(changeStatus, { timeout: 5000 });
  } catch (e) {
    throw Error(`already stamped? [status: ${status}]`);
  }
  await frame.click(changeStatus);
  // check: status has changed
  await frame.waitForSelector(`${changeStatus}_dis`, { timeout: 5000 });
  return;
}
