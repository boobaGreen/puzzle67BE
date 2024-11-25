// FILE: src/services/eventListener.ts

import { ethers } from "ethers";
import dotenv from "dotenv";
import { processPaymentEvent } from "./processPaymentEvent";
import PaymentReceiverABI from "../artifacts/PaymentReceiver.json"; // Importa l'ABI generata

dotenv.config();

const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL event-listener:", providerUrl);
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA!;
console.log("Contract Address:", contractAddress);
const contractABI = PaymentReceiverABI.abi; // Usa l'ABI generata

const contract = new ethers.Contract(contractAddress, contractABI, provider);

const listenToPayments = () => {
  console.log("Listening for PaymentReceived events...");
  contract.on(
    "PaymentReceived",
    async (from, amount, chainId, timestamp, event) => {
      await processPaymentEvent(event);
    }
  );
};

listenToPayments();
