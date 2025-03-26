const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON parsing for request bodies

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes (ensure that the fileRoutes module exists, if you need file handling routes)
const fileRoutes = require("./routes/fileRoutes"); // Adjust the path if necessary
app.use("/api", fileRoutes);

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
