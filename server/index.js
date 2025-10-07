// server/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001; // We'll use a different port than your React app

// Middlewares
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to understand JSON data

// A simple test route to see if the server is alive
app.get("/", (req, res) => {
  res.send("Hello from the Abstract Builder Server!");
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
