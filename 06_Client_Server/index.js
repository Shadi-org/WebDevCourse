const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "client")));

// Clean URL routes (no .html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "home.html"));
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
