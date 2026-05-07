const { verifyJWT } = require("../utility/authManager");

const { invalidToken } = require("../models/investorModel");

function authLogin(requiredRole) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          error: "Token missing",
        });
      }

      if (invalidToken.includes(token)) {
        return res.status(401).json({
          error: "Token expired",
        });
      }

      const payload = verifyJWT(token);

      console.log(payload);

      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({
          error: "Invalid Permission",
        });
      }

      req.user = payload;

      next();
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        error: "Authentication Failed",
      });
    }
  };
}

module.exports = authLogin;
