"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_models_1 = require("../models/user.models");
const http_status_codes_1 = require("http-status-codes");
const axios_1 = __importDefault(require("axios"));
const fetchPastEvents_1 = require("../services/fetchPastEvents");
class UserController {
    constructor() {
        this.createUserOrUpdate = async (req, res) => {
            const { address, chain, amount } = req.body;
            if (!address || !chain || !amount) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    msg: "Address, chain and amount must be provided.",
                });
                return;
            }
            try {
                // Ottieni il prezzo corrente di Ether in USD
                const response = await axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
                const etherToUsdRate = response.data.ethereum.usd;
                // Converti l'importo in USD
                const amountInUsd = parseFloat(amount) * etherToUsdRate;
                // Calcola i leftTry basati sull'importo in USD
                const leftTry = Math.floor(amountInUsd / 0.1);
                let user = await user_models_1.User.findOne({ address, chain });
                if (user) {
                    user.leftTry += leftTry;
                    await user.save();
                }
                else {
                    user = await user_models_1.User.create({ address, chain, leftTry });
                }
                res
                    .status(http_status_codes_1.StatusCodes.CREATED)
                    .json({ user, msg: "User has been created or updated!" });
            }
            catch (error) {
                console.error("Error fetching Ether price:", error);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ msg: "Error fetching Ether price" });
            }
        };
        this.fetchPastEvents = async (req, res) => {
            const { address } = req.body;
            if (!address) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    msg: "Address must be provided.",
                });
                return;
            }
            try {
                await (0, fetchPastEvents_1.fetchPastEventsForAddress)(address);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ msg: "Past events fetched and processed successfully." });
            }
            catch (error) {
                console.error("Error fetching past events:", error);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ msg: "Error fetching past events" });
            }
        };
    }
}
exports.userController = new UserController();
