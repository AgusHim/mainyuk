import Crypto from "crypto-js";

export const encryptData = (data: any, secretKey: string) => {
  const encryptedData = Crypto.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  localStorage.setItem("encryptedData", encryptedData);
};

// Function to decrypt data
export const decryptData = (secretKey: string) => {
  const encryptedData = localStorage.getItem("encryptedData");
  if (encryptedData) {
    const bytes = Crypto.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(Crypto.enc.Utf8));
    return decryptedData;
  }
  return null;
};
