const { ObjectId } = require("mongodb");
const { getDB, getClient } = require("../db");

async function transferMoney(fromUserId, toUserId, amount) {
    const db = getDB();
    const client = getClient();

    // Validate input
    if (!fromUserId || !toUserId || amount === undefined) {
        throw new Error("fromUserId, toUserId and amount are required");
    }

    if (fromUserId === toUserId) {
        throw new Error("Sender and receiver cannot be the same");
    }

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    let senderId;
    let receiverId;

    try {
        senderId = new ObjectId(fromUserId);
        receiverId = new ObjectId(toUserId);
    } catch (error) {
        throw new Error("Invalid user ID");
    }

    const session = client.startSession();

    try {
        let transactionRecord;

        await session.withTransaction(async () => {

            // Find sender
            const sender = await db.collection("users").findOne(
                { _id: senderId },
                { session }
            );

            if (!sender) {
                throw new Error("Sender not found");
            }

            // Find receiver
            const receiver = await db.collection("users").findOne(
                { _id: receiverId },
                { session }
            );

            if (!receiver) {
                throw new Error("Receiver not found");
            }

            // Check balance
            if (sender.balance < amount) {
                throw new Error("Insufficient balance");
            }

            // Deduct money from sender
            await db.collection("users").updateOne(
                { _id: senderId },
                {
                    $inc: {
                        balance: -amount
                    }
                },
                { session }
            );

            // Add money to receiver
            await db.collection("users").updateOne(
                { _id: receiverId },
                {
                    $inc: {
                        balance: amount
                    }
                },
                { session }
            );

            // Create transaction record
            const transaction = {
                fromUser: senderId,
                toUser: receiverId,
                amount: amount,
                type: "transfer",
                status: "completed",
                createdAt: new Date()
            };

            const result = await db.collection("transactions").insertOne(
                transaction,
                { session }
            );

            transactionRecord = {
                _id: result.insertedId,
                ...transaction
            };
        });

        return transactionRecord;

    } finally {
        await session.endSession();
    }
}


// Reverse a completed transaction
async function reverseTransaction(transactionId) {
    const db = getDB();
    const client = getClient();

    let transactionObjectId;

    try {
        transactionObjectId = new ObjectId(transactionId);
    } catch (error) {
        throw new Error("Invalid transaction ID");
    }

    const session = client.startSession();

    try {
        let reversedTransaction;

        await session.withTransaction(async () => {

            // Find transaction
            const transaction = await db.collection("transactions").findOne(
                { _id: transactionObjectId },
                { session }
            );

            if (!transaction) {
                throw new Error("Transaction not found");
            }

            // Prevent reversing twice
            if (transaction.status === "reversed") {
                throw new Error("Transaction already reversed");
            }

            // Only completed transactions can be reversed
            if (transaction.status !== "completed") {
                throw new Error("Only completed transactions can be reversed");
            }

            // Find original sender
            const sender = await db.collection("users").findOne(
                { _id: transaction.fromUser },
                { session }
            );

            if (!sender) {
                throw new Error("Original sender not found");
            }

            // Find original receiver
            const receiver = await db.collection("users").findOne(
                { _id: transaction.toUser },
                { session }
            );

            if (!receiver) {
                throw new Error("Original receiver not found");
            }

            // Make sure receiver has enough money to reverse
            if (receiver.balance < transaction.amount) {
                throw new Error("Receiver has insufficient balance for reversal");
            }

            // Take money back from original receiver
            await db.collection("users").updateOne(
                { _id: transaction.toUser },
                {
                    $inc: {
                        balance: -transaction.amount
                    }
                },
                { session }
            );

            // Return money to original sender
            await db.collection("users").updateOne(
                { _id: transaction.fromUser },
                {
                    $inc: {
                        balance: transaction.amount
                    }
                },
                { session }
            );

            // Mark original transaction as reversed
            await db.collection("transactions").updateOne(
                { _id: transactionObjectId },
                {
                    $set: {
                        status: "reversed",
                        reversedAt: new Date()
                    }
                },
                { session }
            );

            reversedTransaction = {
                ...transaction,
                status: "reversed"
            };
        });

        return reversedTransaction;

    } finally {
        await session.endSession();
    }
}


module.exports = {
    transferMoney,
    reverseTransaction
};