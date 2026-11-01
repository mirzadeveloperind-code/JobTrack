
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to JobTrack API!");
});

// Authentication routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/profile", require("./routes/profileRoutes"));

// Application routes
app.use("/api/applications", require("./routes/applicationRoutes"));

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server only once
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

startServer();
