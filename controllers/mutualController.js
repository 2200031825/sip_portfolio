const {
  createFund,
  getAllFunds,
  updateFundNav,
} = require("../models/mutualModel");

const addFund = async (req, res) => {
  try {
    const result = await createFund(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to create fund",
    });
  }
};

const fetchFunds = async (req, res) => {
  try {
    const funds = await getAllFunds();

    return res.status(200).json(funds);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to fetch funds",
    });
  }
};

const updateNav = async (req, res) => {
  try {
    const { fundId } = req.params;
    const { current_nav } = req.body;

    const result = await updateFundNav(fundId, current_nav);

    if (result.updatedRows === 0) {
      return res.status(404).json({
        error: "Fund not found",
      });
    }

    return res.status(200).json({
      message: "NAV updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to update NAV",
    });
  }
};

module.exports = {
  addFund,
  fetchFunds,
  updateNav,
};
