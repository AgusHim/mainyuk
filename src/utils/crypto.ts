import * as Crypto from 'crypto-js';

export const encryptData = (data: any) => {
  const encryptedData = Crypto.AES.encrypt(
    JSON.stringify(data),
    process.env.AUTH_SECRET ?? "secret"
  ).toString();
  return encryptedData;
};

// Function to decrypt data
export const decryptData = (encrypted: string) => {
  const bytes = Crypto.AES.decrypt(
    encrypted,
    process.env.AUTH_SECRET ?? "secret"
  );
  const decryptedData = JSON.parse(bytes.toString(Crypto.enc.Utf8));
  return decryptedData;
};
