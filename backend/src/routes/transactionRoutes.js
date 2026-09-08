const express = require("express");

const {
    createTransfer,
    reverseTransfer,
    getUserTransactions
} = require("../controllers/transactionController");

const router = express.Router();

// Create a money transfer
router.post("/", createTransfer);

// Get transactions for a user
router.get("/:userId", getUserTransactions);

// Reverse a transaction
router.post("/:id/reverse", reverseTransfer);

module.exports = router;