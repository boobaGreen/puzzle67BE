import { Request, Response } from "express";
import { User } from "../models/user.models";
import { Payment } from "../models/paymentPuzzle67.model"; // Usa il modello corretto
import { EtherPrice } from "../models/etherPrice.model"; // Usa il modello corretto
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  fetchPastEventsForAddress,
  fetchAllPastEvents,
} from "../services/fetchPastEvents";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

class UserController {
  createUserOrUpdate = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const { address, chain, amount } = req.body;

    if (!address || !chain || !amount) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Address, chain and amount must be provided.",
      });
      return;
    }

    try {
      // Verifica se il prezzo di Ether è già memorizzato nel database e se è aggiornato
      let etherPrice = await EtherPrice.findOne();
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      if (!etherPrice || etherPrice.updatedAt < fiveMinutesAgo) {
        // Ottieni il prezzo corrente di Ether in USD da CoinGecko
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const etherToUsdRate = response.data.ethereum.usd;

        // Aggiorna il prezzo di Ether nel database
        if (etherPrice) {
          etherPrice.price = etherToUsdRate;
          etherPrice.updatedAt = now;
          await etherPrice.save();
        } else {
          etherPrice = await EtherPrice.create({
            price: etherToUsdRate,
            updatedAt: now,
          });
        }
      }

      // Converti l'importo in USD
      const amountInUsd = parseFloat(amount) * etherPrice.price;

      // Calcola i leftTry basati sull'importo in USD
      const leftTry = Math.floor(amountInUsd / 0.1);

      let user = await User.findOne({ address, chain });
      if (user) {
        user.leftTry += leftTry;
        await user.save();
      } else {
        user = await User.create({ address, chain, leftTry });
      }

      // Genera un JWT
      const token = jwt.sign({ address, chain }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res
        .status(StatusCodes.CREATED)
        .json({ user, token, msg: "User has been created or updated!" });
    } catch (error) {
      console.error("Error fetching Ether price:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Error fetching Ether price" });
    }
  };

  connect = async (req: CustomRequest, res: Response): Promise<void> => {
    const { address } = req.body;

    if (!address) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Address must be provided.",
      });
      return;
    }

    // Genera un JWT
    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: "1h" });

    res.status(StatusCodes.OK).json({ token });
  };

  fetchPastEvents = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    const { address } = req.body;

    if (!address) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Address must be provided.",
      });
      return;
    }

    try {
      await fetchPastEventsForAddress(address);
      res
        .status(StatusCodes.OK)
        .json({ msg: "Past events fetched and processed successfully." });
    } catch (error) {
      console.error("Error fetching past events:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Error fetching past events" });
    }
  };

  fetchAllPastEvents = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      console.log("req.user:", req.user); // Log per verificare se req.user è definito
      await fetchAllPastEvents();
      res
        .status(StatusCodes.OK)
        .json({ msg: "All past events fetched and processed successfully." });
    } catch (error) {
      console.error("Error fetching all past events:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Error fetching all past events" });
    }
  };
}

export const userController = new UserController();
