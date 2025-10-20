import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const CATFACT_URL = process.env.CATFACT_URL || "https://catfact.ninja/fact";
const CATFACT_TIMEOUT_MS = parseInt(process.env.CATFACT_TIMEOUT_MS || "5000", 10);
const FACT_FALLBACK = process.env.FACT_FALLBACK || "No cat fact available at the moment.";

function getUserFromEnv() {
  return {
    email: process.env.EMAIL || "nwosudavid77@gmail.com",
    name: process.env.FULL_NAME || "Nwosu David",
    stack: process.env.STACK || "Node.js/Express",
  };
}

app.get("/me", async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const response = await axios.get(CATFACT_URL, { timeout: CATFACT_TIMEOUT_MS });
    const fact = response?.data?.fact || FACT_FALLBACK;
    const data = {
      status: "success",
      user: getUserFromEnv(),
      timestamp,
      fact,
    };
    res.status(200).json(data);
  } catch (err) {
    // If there's a fallback configured, return 200 with fallback fact.
    if (process.env.FACT_FALLBACK) {
      const data = {
        status: "success",
        user: getUserFromEnv(),
        timestamp,
        fact: FACT_FALLBACK,
      };
      return res.status(200).json(data);
    }

    // Otherwise return 502 Bad Gateway with an error JSON
    res.status(502).json({
      status: "error",
      message: "Unable to fetch cat fact from external API",
      timestamp,
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
