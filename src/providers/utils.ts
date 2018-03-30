declare function require(moduleName: string): any;
const CryptoNS = require('../vendor/jsencrypt/jsencrypt.min.js');
const CryptoJS = require("crypto-js");

export function guid() {
  function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function bin2hex (s) {
  var i, l, o = '', n;
  s += '';

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16)
    o += n.length < 2 ? '0' + n : n;
  }

  return o;
}

export function encrypt(data, key) {
  let encryptor = new CryptoNS.JSEncrypt();
  encryptor.setPublicKey(key);
  return encryptor.encrypt(data);
}

export function decypher(token, password, IV) {
  var key = CryptoJS.enc.Hex.parse(bin2hex(CryptoJS.MD5(password).toString()));
  var iv = CryptoJS.enc.Hex.parse(bin2hex(atob(IV)));

  var cipherParams = CryptoJS.lib.CipherParams.create(
  {ciphertext: CryptoJS.enc.Hex.parse(bin2hex(atob(token)))}
  );

  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

