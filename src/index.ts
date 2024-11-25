import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Importa il middleware cors
import connectDB from "./config/db.config";
import userRouter from "./routes/user.routes";
import btcPriceRouter from "./routes/btcPrice.routes";
import "./services/eventListener"; // Importa l'ascoltatore di eventi

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

//  enable support for json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Puzzle 67 Bitcoin</h1>");
});

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/btc-price", btcPriceRouter);

const startDB = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

// connecting to MongoDB and starting the server
startDB();
