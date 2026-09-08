const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "transaction_ledger";

const client = new MongoClient(mongoUri);

let db;

async function connectDB() {
    try {
        await client.connect();

        db = client.db(dbName);

        console.log("MongoDB connected successfully");
        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

function getClient() {
    return client;
}

module.exports = {
    connectDB,
    getDB,
    getClient
};