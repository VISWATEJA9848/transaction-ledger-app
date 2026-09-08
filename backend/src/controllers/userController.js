const { getDB } = require("../db");

async function getUsers(req, res) {
    try {
        const db = getDB();

        const users = await db
            .collection("users")
            .find({})
            .toArray();

        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);

        res.status(500).json({
            error: "Failed to get users"
        });
    }
}

module.exports = {
    getUsers
};