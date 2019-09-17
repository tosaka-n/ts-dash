#!/usr/bin/env node
'use strict'

const program = require('commander')
const puppeteer = require("puppeteer");
const nodeConfig = require("dotenv").config();
const { encrypt, decrypt } = require("./encrypt");
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
function passHandler(str) {
  if (process.env.key == null || process.env.key === "") {
    console.log("please set key\nkey=hogefuga ts-dash pass yourpassword")
    return;
  }
  console.log(str)
  console.log(`key: ${process.env.key}`)
  console.log(`encrypt: ${encrypt(str)}`);
  console.log(`decrypt: ${decrypt(encrypt(str.toString()))}`);
  return;
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
  .command('pass')
  .description('convert password')
  .action(passHandler);
program
  .option('-u, --user <value>', 'user name', String)
  .option('-p, --password <value>', 'user pass', String)
  .parse(process.argv);

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
    throw Error("please set your username");
  }
  const page = await ts.login(loginUrl, user, pass);
  await ts.timeRecorder(page, status);
  await browser.close();
  return status;
}

module.exports.init = init;