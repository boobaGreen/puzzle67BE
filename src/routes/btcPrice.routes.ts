// FILE: src/routes/btcPrice.routes.ts
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    res.status(500).json({ error: "Error fetching BTC price" });
  }
});

export default router;
