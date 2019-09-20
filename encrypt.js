const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
require('dotenv').config();
exports.encrypt = (text, key) => {
  const cipher = crypto.createCipher(algorithm, key)
  let crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64');
  return crypted;
}
exports.decrypt = (text, key) => {
  const decipher = crypto.createDecipher(algorithm, key)
  let dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}