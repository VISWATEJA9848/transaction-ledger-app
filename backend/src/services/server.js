const express = require("express");
const { connectDB } = require("./db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Transaction Ledger Backend is running");
});

app.use("/api/users", userRoutes);

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();