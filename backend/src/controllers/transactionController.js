const { ObjectId } = require("mongodb");

const { getDB } = require("../db");
const {
    transferMoney,
    reverseTransaction
} = require("../services/transactionService");

async function createTransfer(req, res) {
    try {
        const { fromUserId, toUserId, amount } = req.body;

        const transaction = await transferMoney(
            fromUserId,
            toUserId,
            amount
        );

        res.status(201).json({
            success: true,
            message: "Money transferred successfully",
            transaction
        });

    } catch (error) {
        console.error("Transfer failed:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


async function reverseTransfer(req, res) {
    try {
        const { id } = req.params;

        const transaction = await reverseTransaction(id);

        res.json({
            success: true,
            message: "Transaction reversed successfully",
            transaction
        });

    } catch (error) {
        console.error("Reversal failed:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


// Get transactions for a user
async function getUserTransactions(req, res) {
    try {
        const { userId } = req.params;

        let objectId;

        try {
            objectId = new ObjectId(userId);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const db = getDB();

        const transactions = await db
            .collection("transactions")
            .find({
                $or: [
                    { fromUser: objectId },
                    { toUser: objectId }
                ]
            })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            transactions
        });

    } catch (error) {
        console.error("Error getting transactions:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get transactions"
        });
    }
}


module.exports = {
    createTransfer,
    reverseTransfer,
    getUserTransactions
};