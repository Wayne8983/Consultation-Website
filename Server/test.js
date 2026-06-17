const crypto = require('crypto');




 const generateStrongPassword = (length = 8) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % charset.length;
    password += charset[index];
  }

  return password;
};
console.log(generateStrongPassword()) ;