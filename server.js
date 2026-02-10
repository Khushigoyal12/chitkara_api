require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL;


const fibonacci = (n) => {
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result.slice(0, n);
};

const getPrimes = (arr) => {
  return arr.filter((num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  });
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const getHCF = (arr) => {
  return arr.reduce((a, b) => gcd(a, b));
};

const getLCM = (arr) => {
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
};


app.get("/health", (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// Main API
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: "Exactly one key required",
      });
    }

    const key = keys[0];
    const value = body[key];

    // Fibonacci
    if (key === "fibonacci") {
      if (!Number.isInteger(value) || value < 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid Fibonacci input",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: fibonacci(value),
      });
    }

    // Prime
    if (key === "prime") {
      if (!Array.isArray(value)) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid Prime input",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: getPrimes(value),
      });
    }

    // LCM
    if (key === "lcm") {
      if (!Array.isArray(value) || value.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid LCM input",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: getLCM(value),
      });
    }

    // HCF
    if (key === "hcf") {
      if (!Array.isArray(value) || value.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid HCF input",
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: getHCF(value),
      });
    }

    // AI
    if (key === "AI") {
      if (typeof value !== "string") {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Invalid AI input",
        });
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: value }] }],
        }
      );

      const aiText =
        response.data.candidates[0].content.parts[0].text.split(" ")[0];

      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: aiText,
      });
    }

    return res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: "Invalid key",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

