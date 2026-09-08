import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const RAHUL_ID = "6a9fffe3a7aae64819d1913c";

function App() {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);

    const [receiver, setReceiver] = useState("Anil");
    const [amount, setAmount] = useState("");

    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);

    function normalizeId(value) {
        return value && typeof value === "object" && value.toString
            ? value.toString()
            : String(value ?? "");
    }

    // Load users and transactions
    async function loadDashboard() {
        try {
            const usersResponse = await axios.get(
                "http://localhost:5000/api/users"
            );

            const rahul = usersResponse.data.find(
                (user) => normalizeId(user._id) === RAHUL_ID
            );

            if (rahul) {
                setBalance(rahul.balance);
            }

            const transactionsResponse = await axios.get(
                `http://localhost:5000/api/transactions/${RAHUL_ID}`
            );

            setTransactions(
                transactionsResponse.data.transactions
            );

        } catch (error) {
            console.error("Failed to load dashboard:", error);
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    // Send money
    async function handleSendMoney() {
        setMessage("");
        setError("");

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        const receiverId =
            receiver === "Anil"
                ? "6a9fffe3a7aae64819d1913d"
                : "6a9fffe3a7aae64819d1913e";

        try {
            setSending(true);

            const response = await axios.post(
                "http://localhost:5000/api/transactions",
                {
                    fromUserId: RAHUL_ID,
                    toUserId: receiverId,
                    amount: Number(amount)
                }
            );

            setMessage(response.data.message);

            setAmount("");

            // Reload balance and transaction history
            await loadDashboard();

        } catch (error) {
            console.error("Transfer failed:", error);

            setError(
                error.response?.data?.message ||
                "Transfer failed"
            );

        } finally {
            setSending(false);
        }
    }

    return (
        <div className="app">
            <div className="dashboard">

                {/* Header */}
                <header>
                    <h1>TRANSACTION LEDGER</h1>
                </header>

                <main>

                    {/* Welcome */}
                    <h2>Welcome, Rahul</h2>

                    {/* Balance */}
                    <div className="balance-card">
                        <p>Current Balance</p>

                        <h3>
                            ₹{balance.toLocaleString("en-IN")}
                        </h3>
                    </div>

                    {/* Messages */}
                    {message && (
                        <p>{message}</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    <hr />

                    {/* Send Money */}
                    <section>
                        <h2>Send Money</h2>

                        <label>
                            Receiver:
                        </label>

                        <select
                            value={receiver}
                            onChange={(e) =>
                                setReceiver(e.target.value)
                            }
                        >
                            <option value="Anil">
                                Anil
                            </option>

                            <option value="Suresh">
                                Suresh
                            </option>
                        </select>

                        <label>
                            Amount:
                        </label>

                        <input
                            type="number"
                            placeholder="₹1000"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />

                        <button
                            onClick={handleSendMoney}
                            disabled={sending}
                        >
                            {sending
                                ? "SENDING..."
                                : "SEND MONEY"}
                        </button>
                    </section>

                    <hr />

                    {/* Transaction History */}
                    <section>
                        <h2>Transaction History</h2>

                        {loading && (
                            <p>
                                Loading transactions...
                            </p>
                        )}

                        {!loading &&
                            !error &&
                            transactions.length === 0 && (
                                <p>
                                    No transactions found.
                                </p>
                            )}

                        {!loading &&
                            transactions.map(
                                (transaction) => {

                                    const isSent =
                                        normalizeId(transaction.fromUser) ===
                                        RAHUL_ID;

                                    return (
                                        <div
                                            className="transaction"
                                            key={transaction._id}
                                        >
                                            <span>
                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                            <span>
                                                {isSent
                                                    ? "Sent"
                                                    : "Received"}
                                            </span>

                                            <span>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                    </section>

                </main>

            </div>
        </div>
    );
}

export default App;