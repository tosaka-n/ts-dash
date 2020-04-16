#!/usr/bin/env node
'use strict'
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const commander = require('commander')
const puppeteer = require("puppeteer");
const ch = require('crypto-simple');
const ts = require("./lib/teamspirits");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const fetch = require("node-fetch");
const slackPostURL = "https://slack.com/api/chat.postMessage";

const loginUrl = "https://teamspirit.cloudforce.com/";

async function punchHandler(command, options) {
  try {
    console.time("log");
    await init(command.name());
    console.timeEnd("log");
    console.log(`ok, now punch ${command.name()}`)
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

async function passHandler(command, options) {
  if (program.username == null || program.key == null || program.password == null) {
    console.log("please set options\nts-dash password -p yourpassword -u yourusername -k any-key")
    return;
  }
  ch.key = program.key;
  const pass = [
    `username=${program.username}`,
    `key=${program.key}`,
    `password=${ch.encrypt(program.password)}`
  ];
  if (program.HUBOT_SLACK_TOKEN) {
    if (program.channel == null) {
      console.log("please set options\nts-dash password -p yourpassword -u yourusername -k any-key --HUBOT_SLACK_TOKEN xoxo-your-token -c --channel")
    }
    pass.push(`HUBOT_SLACK_TOKEN=${program.HUBOT_SLACK_TOKEN}`)
    pass.push(`channel=${program.channel}`);
  }
  console.log(pass.join("\n"))
  await writeFile(path.join(__dirname, "./.env"), pass.join("\n"))
  return;
}

const program = new commander.Command();
program
  .command('in')
  .description('punch in teamspirit')
  .action(punchHandler);

program
  .command('out')
  .description('punch out teamspirit')
  .action(punchHandler);

program
  .command("show")
  .description('show your infomation')
  .action(() => {
    ch.key = process.env.key;
    console.log(`user=${process.env.username}`);
    console.log(`pass=${ch.decrypt(process.env.password)}`);
    console.log(`key=${process.env.key}`);
    console.log(`HUBOT_SLACK_TOKEN=${process.env.HUBOT_SLACK_TOKEN}`);
    console.log(`channel=${process.env.channel}`);
  });

program
  .command('pass')
  .description('convert password')
  .action(passHandler);
program
  .option('-u, --username <value>', 'user name', String)
  .option('-p, --password <value>', 'user pass', String)
  .option('-k, --key <value>', 'encrypt key. the key must be 256 bits (32 characters)', String)
  .option('-t, --HUBOT_SLACK_TOKEN <value>', 'HUBOT_SLACK_TOKEN', String)
  .option('-c, --channel <value>', 'post channel', String);

program.parse(process.argv);

function formatTime(date) {
  return `${("0" + date.getHours()).substr(-2, 2)}:${("0" + date.getMinutes()).substr(-2, 2)}`
}

function reminderText(timestr) {
  const [h, m] = timestr.split(':');
  let lefttime = "";
  let leftHour = Number(h) + 9;
  while (leftHour > 24) {
    leftHour -= 24;
  }
  lefttime = `/remind here "go home" at ${leftHour}:${m}`;
  return lefttime;
}

async function post2Slack(status, date) {
  if (!process.env.HUBOT_SLACK_TOKEN || !process.env.channel) {
    return;
  }
  const time = formatTime(date);
  const HUBOT_SLACK_TOKEN = process.env.HUBOT_SLACK_TOKEN;
  const channel = process.env.channel;
  let message = `punch ${status} at ${time}\n`;
  let text = "";
  if (status == "in") {
    text = `Hello\n${message}${reminderText(time)}`;
  } else {
    text = `See you tomorrow, bye.\n${message}`;
  }
  const json = {
    token: HUBOT_SLACK_TOKEN,
    channel,
    text,
    as_user: true
  }
  try {
    const headers = {
      'Authorization': `Bearer ${HUBOT_SLACK_TOKEN}`,
      "Content-type": "application/json"
    };
    const res = await fetch(slackPostURL, {
      headers,
      method: 'POST',
      body: JSON.stringify(json),
    });
    const responseJson = await res.json();
    console.log(responseJson);
  } catch (e) {
    console.error(e);
  }
  return;
}

async function init(status) {
  const date = new Date();
  if (status != "in" && status != "out") {
    throw Error("set your status IN or OUT");
  }
  console.log(`status to ${status}`);
  ch.key = process.env.key;
  const pass = ch.decrypt(process.env.password, process.env.key);
  const user = process.env.username;
  const browser = await puppeteer.launch();
  if (pass == null) {
    throw Error("please set your password");
  } else if (user == null) {
    throw Error("please set your username");
  }
  const page = await ts.login(loginUrl, user, pass);
  await ts.timeRecorder(page, status);
  await browser.close();
  await post2Slack(status, date);
  return status;
}

module.exports.init = init;