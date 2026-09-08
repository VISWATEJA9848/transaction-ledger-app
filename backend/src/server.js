const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db");

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow React frontend to communicate with backend
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Transaction Ledger Backend is running");
});

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();