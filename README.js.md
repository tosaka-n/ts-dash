# ts-dash
[teamspirit](https://teamspirit.cloudforce.com/)の打刻を行うCLIツールです
ターミナルからコマンドで打刻できます
また、打刻時にSlackへ投稿も可能です

## 初期設定
_npmを用いるため、npmを先にインストールしてください_

1. このリポジトリをローカルにcloneします
   `$ git clone git@github.com:tosaka-n/ts-dash.git`
2. 必要なライブラリをインストールします
    `$ npm i`
3. どのディレクトリでも実行可能なようにnpm linkを張ります
    `$ npm link`
4. teamspiritのユーザー名、任意の暗号キー(適当な文字列 ex.aaabbbccc)、
  暗号化されたパスワードを保存します
  (ログイン情報は.envファイルに保存されます)
   - `$ ts-dash pass -u username -p password -k any-crypto-key(32 characters)`
   - 保存された情報を確認するためにはshowコマンドをつかいます
     - `$ts-dash show`
   - _Optional_
     - Slackへ投稿するためにはTOKENとチャンネルIDが必要です
     - 下記の項目を.envファイルに追記してください
       - `HUBOT_SLACK_TOKEN`
       - `channel`
       - 投稿する文言を変更する場合は下記の部分を変更してください
        https://github.com/tosaka-n/ts-dash/blob/2297c3efbc8334465affe7398eb6543d7c0520e0/index.js#L107-L113
# 使い方
  - 出勤時: `ts-dash in`
  - 退勤時: `ts-dash out`

## コマンド
  - in  : 出勤
  - out : 退勤
  - show: .envに保存された情報の確認
  - pass: ログイン/Slackへの投稿情報を保存する
      - -u, --username `<value>`           : ユーザー名
      - -p, --password `<value>`           : パスワード
      - -k, --key `<value>`                : 任意の暗号キー(32文字)
      - -t, --HUBOT_SLACK_TOKEN `<value>`
      - -c, --channel `<value>`            : 投稿先チャンネルID