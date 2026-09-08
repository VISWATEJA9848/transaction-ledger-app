require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function seedDatabase() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);

        const users = db.collection("users");
        const transactions = db.collection("transactions");

        console.log("Connected to MongoDB");

        // Delete old data
        await transactions.deleteMany({});
        await users.deleteMany({});

        console.log("Old data deleted");

        // Create sample users
        const usersData = [
            {
                name: "Rahul",
                balance: 10000
            },
            {
                name: "Anil",
                balance: 5000
            },
            {
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
                description: "Sample transfer",
                createdAt: new Date()
            },
            {
                fromUser: insertedUsers[1],
                toUser: insertedUsers[2],
                amount: 500,
                type: "transfer",
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