const crypto = require("crypto");

const encrypt = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

module.exports = { encrypt };
