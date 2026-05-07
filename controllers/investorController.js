const {
  loginUser,
  logoutUser,
  fetchholdings,
  networth,
  getInvestorDB,
  addInvestor,
} = require("../models/investorModel");

const { signJWT } = require("../utility/authManager");

// ======================================================
// LOGIN
// ======================================================

const login = (req, res) => {
  try {
    const { email, password } = req.body;

    const user = loginUser(email, password);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = signJWT({
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
const createInvestor = async (req, res) => {
  try {
    const { investor_id, first_name, last_name, email, phone, pan_number } =
      req.body;

    if (!investor_id || !first_name || !email) {
      return res.status(400).json({
        error: "Required fields missing",
      });
    }

    const result = await addInvestor({
      investor_id,
      first_name,
      last_name,
      email,
      phone,
      pan_number,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to add investor",
    });
  }
};
// ======================================================
// LOGOUT
// ======================================================

const logout = (req, res) => {
  try {
    const token = req.headers.authorization;

    const email = req.user.email;

    const result = logoutUser(email, token);

    if (result) {
      return res.status(200).json({
        message: "Logout successful",
      });
    }

    return res.status(400).json({
      error: "Logout failed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ======================================================
// GET INVESTOR PROFILE
// ======================================================

const getInvestor = async (req, res) => {
  try {
    const { id } = req.params;

    const investorProfile = await getInvestorDB(id);

    if (!investorProfile) {
      return res.status(404).json({
        error: "Investor not found",
      });
    }

    return res.status(200).json(investorProfile);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ======================================================
// CHECK INVESTOR
// ======================================================

const checkInvester = async (req, res) => {
  try {
    const { id } = req.body;

    const investor = await fetchInvesterData(id);

    if (!investor) {
      return res.status(404).json({
        error: "Investor not found",
      });
    }

    return res.status(200).json({
      message: "Investor found",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ======================================================
// GET HOLDINGS
// ======================================================

const getHoldings = async (req, res) => {
  try {
    const { id } = req.params;

    const holdings = await fetchholdings(id);

    if (!holdings || holdings.length === 0) {
      return res.status(404).json({
        error: "Holdings not found",
      });
    }

    return res.status(200).json(holdings);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ======================================================
// GET NET WORTH
// ======================================================

const getNetworth = async (req, res) => {
  try {
    const { id } = req.params;

    const investorNetworth = await networth(id);

    return res.status(200).json(investorNetworth);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  login,
  logout,
  getInvestor,
  checkInvester,
  getHoldings,
  getNetworth,
  createInvestor,
};
