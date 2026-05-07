const {
  createSip,
  getSipById,
  processSip,
  getSipTransactions,
} = require("../models/sipModel");

const addSip = async (req, res) => {
  try {
    const result = await createSip(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to create SIP",
    });
  }
};

const fetchSip = async (req, res) => {
  try {
    const { sipId } = req.params;

    const sip = await getSipById(sipId);

    if (!sip) {
      return res.status(404).json({
        error: "SIP not found",
      });
    }

    return res.status(200).json(sip);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to fetch SIP",
    });
  }
};

const processSipTransaction = async (req, res) => {
  try {
    const { sipId } = req.params;

    const result = await processSip(sipId);

    if (!result) {
      return res.status(404).json({
        error: "SIP not found",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to process SIP",
    });
  }
};

const fetchSipTransactions = async (req, res) => {
  try {
    const { sipId } = req.params;

    const transactions = await getSipTransactions(sipId);

    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  addSip,
  fetchSip,
  processSipTransaction,
  fetchSipTransactions,
};
