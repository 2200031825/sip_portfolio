const jwt = require("jsonwebtoken");

const secret = "nddfnsdnsfnsdnfjdfjsdifhis";

function signJWT(payload) {
  const token = jwt.sign(payload, secret, {
    expiresIn: "50m",
  });

  return token;
}

function verifyJWT(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  signJWT,
  verifyJWT,
};
