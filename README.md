# ts-dash
punch in/out [teamspirit](https://teamspirit.cloudforce.com/) from cli
## Usage
1. git clone && npm i
2. `npm link`
3. convert your password with any key
   - `ts-dash pass -u username -p password -k any-crypto-key`
   - You can show status `ts-dash show`
   - (optional)
     - If you want to post to Slack
     - add environment
       - `HUBOT_SLACK_TOKEN`
       - `channel`
4. change your status
  - punch in: `ts-dash in`
  - punch out: `ts-dash out`
