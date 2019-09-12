#!/usr/bin/env node
'use strict'

const program = require('commander')
const puppeteer = require("puppeteer");
const nodeConfig = require("dotenv").config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const ts = require("./lib/teamspirits");


require('dotenv').config();
const env = process.env;

const loginUrl = "https://teamspirit.cloudforce.com/";
async function handler(command, options) {
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

program
  .command('in')
  .description('punch in teamspirit')
  .action(handler);
program
  .command('out')
  .description('punch out teamspirit')
  .action(handler);
program
  .option('-u, --user <value>', 'user name', String)
  .option('-p, --password <value>', 'user pass', String)
  .parse(process.argv);

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, env.key)
  let dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
async function init(status) {
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
  await ts.timeRecorder(page, status);
  await browser.close();
  return status;
}

module.exports.init = init;