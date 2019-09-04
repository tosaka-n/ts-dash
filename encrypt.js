const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
require('dotenv').config();
const env = process.env;
const key = env.key;
const PASSWORD = process.argv[2];
function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, key)
  let crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64');
  return crypted;
}
function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, key)
  let dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
console.log(`encrypt: ${encrypt(PASSWORD)}`);
console.log(`decrypt: ${decrypt(encrypt(PASSWORD))}`);
