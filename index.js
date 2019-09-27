#!/usr/bin/env node
'use strict'
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
const commander = require('commander')
const puppeteer = require("puppeteer");
const { encrypt, decrypt } = require("./encrypt");
const ts = require("./lib/teamspirits");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

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
async function passHandler(command, options) {
  if (program.username == null || program.key == null || program.password == null) {
    console.log("please set options\nts-dash password -p yourpassword -u yourusername -k any-key")
    return;
  }
  const pass = [
    `username=${program.username}`,
    `key=${program.key}`,
    `password=${encrypt(program.password, program.key.toString())}`
  ];
  console.log(pass.join("\n"))
  await writeFile(path.join(__dirname, "./.env"), pass.join("\n"))
  return;
}
const program = new commander.Command();
program
  .command('in')
  .description('punch in teamspirit')
  .action(handler);

program
  .command('out')
  .description('punch out teamspirit')
  .action(handler);

program
  .command("show")
  .description('show your infomation')
  .action(() => {
    console.log(`user=${process.env.username}`);
    console.log(`pass=${process.env.password}`);
    console.log(`key=${process.env.key}`);
  });

program
  .command('pass')
  .description('convert password')
  .action(passHandler);
program
  .option('-u, --username <value>', 'user name', String)
  .option('-p, --password <value>', 'user pass', String)
  .option('-k, --key <value>', 'encrypt key', String);

program.parse(process.argv);

async function init(status) {
  if (status != "in" && status != "out") {
    throw Error("set your status IN or OUT");
  }
  console.log(`status to ${status}`);
  const pass = decrypt(process.env.password, process.env.key);
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
  return status;
}

module.exports.init = init;