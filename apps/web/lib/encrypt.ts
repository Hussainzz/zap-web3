import CryptoJS  from "crypto-js";

export const encryptString = (str: string): string => {
  return CryptoJS.AES.encrypt(str, "secret key 123").toString();
};

export const decryptString = (encryptedStr: string) => {
  var bytes  = CryptoJS.AES.decrypt(encryptedStr, 'secret key 123');
  return bytes.toString(CryptoJS.enc.Utf8);
};
