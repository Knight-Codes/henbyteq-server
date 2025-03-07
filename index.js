const express = require("express");
const cors = require("cors");
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json({ extended: false }));

server.get("/", (req, res) => {
  res.send("🚀 SERVER WORKING");
});

server.use("/api", require("./routes/routes"));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
