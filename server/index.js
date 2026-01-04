const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Transaction = require("./models/Transaction");

const app = express();
const PORT = 5001;

connectDB();

app.use(cors());
app.use(express.json());

const initializeData = async () => {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    const initialTransactions = [
      {
        type: "income",
        amount: 5000,
        category: "工资",
        description: "月薪",
        date: "2026-01-01",
      },
      {
        type: "expense",
        amount: 1200,
        category: "房租",
        description: "1月房租",
        date: "2026-01-02",
      },
      {
        type: "expense",
        amount: 300,
        category: "餐饮",
        description: "日常餐饮",
        date: "2026-01-03",
      },
      {
        type: "expense",
        amount: 500,
        category: "购物",
        description: "日用品采购",
        date: "2026-01-04",
      },
      {
        type: "income",
        amount: 1000,
        category: "投资",
        description: "股票收益",
        date: "2026-01-05",
      },
    ];

    await Transaction.insertMany(initialTransactions);
    console.log("Initial data inserted");
  }
};

initializeData();

app.get("/api/transactions", async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = startDate;
      }
      if (endDate) {
        query.date.$lte = endDate;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = new Transaction({
      type,
      amount: parseFloat(amount),
      category,
      description: description || "",
      date,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        type,
        amount: amount ? parseFloat(amount) : undefined,
        category,
        description,
        date,
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/summary", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const categorySummary = {};
    transactions.forEach((t) => {
      if (!categorySummary[t.category]) {
        categorySummary[t.category] = { income: 0, expense: 0 };
      }
      categorySummary[t.category][t.type] += t.amount;
    });

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categorySummary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
