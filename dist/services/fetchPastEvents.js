"use strict";
// FILE: src/services/fetchPastEvents.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPastEventsForAddress = void 0;
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
const DEPLOY_BLOCK_NUMBER = 0; // Sostituisci con il numero del blocco di partenza del contratto
const fetchPastEventsForAddress = async (address) => {
    console.log(`Fetching past PaymentReceived events for address ${address}...`);
    const currentBlock = await provider.getBlockNumber();
    const pastEvents = await contract.queryFilter(contract.filters.PaymentReceived(address), DEPLOY_BLOCK_NUMBER, // Recupera gli eventi dall'inizio del deploy del contratto
    currentBlock);
    for (const event of pastEvents) {
        await (0, processPaymentEvent_1.processPaymentEvent)(event);
    }
};
exports.fetchPastEventsForAddress = fetchPastEventsForAddress;
