"use strict";
// FILE: src/services/eventListener.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const processPaymentEvent_1 = require("./processPaymentEvent");
const PaymentReceiver_json_1 = __importDefault(require("../artifacts/PaymentReceiver.json")); // Importa l'ABI generata
dotenv_1.default.config();
const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL:", providerUrl);
const provider = new ethers_1.ethers.providers.JsonRpcProvider(providerUrl);
const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA;
console.log("Contract Address:", contractAddress);
const contractABI = PaymentReceiver_json_1.default.abi; // Usa l'ABI generata
const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, provider);
const listenToPayments = () => {
    console.log("Listening for PaymentReceived events...");
    contract.on("PaymentReceived", async (from, amount, chainId, timestamp, event) => {
        await (0, processPaymentEvent_1.processPaymentEvent)(event);
    });
};
listenToPayments();
