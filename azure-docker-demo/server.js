const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Azure App Service! 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "azure-docker-demo",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
