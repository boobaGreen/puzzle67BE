import { Request, Response } from "express";
import { User } from "../models/user.models";
import { Payment } from "../models/paymentPuzzle67.model"; // Usa il modello corretto
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { fetchPastEventsForAddress } from "../services/fetchPastEvents";

class UserController {
  createUserOrUpdate = async (req: Request, res: Response): Promise<void> => {
    const { address, chain, amount } = req.body;

    if (!address || !chain || !amount) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Address, chain and amount must be provided.",
      });
      return;
    }

    try {
      // Ottieni il prezzo corrente di Ether in USD
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const etherToUsdRate = response.data.ethereum.usd;

      // Converti l'importo in USD
      const amountInUsd = parseFloat(amount) * etherToUsdRate;

      // Calcola i leftTry basati sull'importo in USD
      const leftTry = Math.floor(amountInUsd / 0.1);

      let user = await User.findOne({ address, chain });
      if (user) {
        user.leftTry += leftTry;
        await user.save();
      } else {
        user = await User.create({ address, chain, leftTry });
      }

      res
        .status(StatusCodes.CREATED)
        .json({ user, msg: "User has been created or updated!" });
    } catch (error) {
      console.error("Error fetching Ether price:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Error fetching Ether price" });
    }
  };

  fetchPastEvents = async (req: Request, res: Response): Promise<void> => {
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
}

export const userController = new UserController();
