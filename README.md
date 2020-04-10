# ts-dash
punch in/out [teamspirit](https://teamspirit.cloudforce.com/) from cli
[日本語版](./README.js.md)
## Initial setting
1. git clone && npm i
2. `npm link`
3. convert your password with any key
   - `ts-dash pass -u username -p password -k any-crypto-key(ex. aaabbbccc)`
   - You can show status `ts-dash show`
   - _Optional_
     - If you want to post to Slack
     - add environment
       - `HUBOT_SLACK_TOKEN`
       - `channel`
## Usage
  - punch in: `ts-dash in`
  - punch out: `ts-dash out`

## Commands
  - in  : punch in teamspirit
  - out : punch out teamspirit
  - show: show your infomation
  - pass: convert password
    - Options
      - -u, --username `<value>`           : user name
      - -p, --password `<value>`           : user pass
      - -k, --key `<value>`                : encrypt key
      - -t, --HUBOT_SLACK_TOKEN `<value>`
      - -c, --channel `<value>`            : post channel