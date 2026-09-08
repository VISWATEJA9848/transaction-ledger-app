require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017");

async function seedDatabase() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME || "transaction_ledger");

        const users = db.collection("users");
        const transactions = db.collection("transactions");

        console.log("Connected to MongoDB");

        // Delete old data
        await transactions.deleteMany({});
        await users.deleteMany({});

        console.log("Old data deleted");

        // Create sample users with the same IDs used by the frontend
        const usersData = [
            {
                _id: new ObjectId("6a9fffe3a7aae64819d1913c"),
                name: "Rahul",
                balance: 10000
            },
            {
                _id: new ObjectId("6a9fffe3a7aae64819d1913d"),
                name: "Anil",
                balance: 5000
            },
            {
                _id: new ObjectId("6a9fffe3a7aae64819d1913e"),
                name: "Suresh",
                balance: 7500
            }
        ];

        const result = await users.insertMany(usersData);

        console.log("Sample users created");

        const insertedUsers = Object.values(result.insertedIds);

        // Create sample transactions
        const transactionsData = [
            {
                fromUser: insertedUsers[0],
                toUser: insertedUsers[1],
                amount: 1000,
                type: "transfer",
                status: "completed",
                description: "Sample transfer",
                createdAt: new Date()
            },
            {
                fromUser: insertedUsers[1],
                toUser: insertedUsers[2],
                amount: 500,
                type: "transfer",
                status: "completed",
                description: "Sample transfer",
                createdAt: new Date()
            }
        ];

        await transactions.insertMany(transactionsData);

        console.log("Sample transactions created");
        console.log("Seed completed successfully!");
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seedDatabase();