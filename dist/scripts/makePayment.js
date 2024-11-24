"use strict";
// FILE: src/scripts/makePayment.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const PaymentReceiver_json_1 = __importDefault(require("../artifacts/PaymentReceiver.json")); // Importa l'ABI generata
dotenv_1.default.config();
const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL:", providerUrl);
const provider = new ethers_1.ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = process.env.TEST_PRIVATE_KEY;
if (!privateKey) {
    throw new Error("TEST_PRIVATE_KEY is not defined in the environment variables");
}
console.log("Private Key:", privateKey);
const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
console.log("Wallet Address:", wallet.address);
const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA;
console.log("Contract Address:", contractAddress);
const contractABI = PaymentReceiver_json_1.default.abi; // Usa l'ABI generata
const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, wallet);
const makePayment = async () => {
    try {
        const amountInEther = "0.0001"; // L'importo in Ether
        const tx = await contract.receivePayment({
            value: ethers_1.ethers.utils.parseEther(amountInEther),
        });
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt.transactionHash);
    }
    catch (error) {
        console.error("Error making payment:", error);
    }
};
makePayment();
