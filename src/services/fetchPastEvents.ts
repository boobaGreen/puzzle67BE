// FILE: src/services/fetchPastEvents.ts

import { ethers } from "ethers";
import dotenv from "dotenv";
import { processPaymentEvent } from "./processPaymentEvent";
import PaymentReceiverABI from "../artifacts/PaymentReceiver.json"; // Importa l'ABI generata

dotenv.config();

const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL:", providerUrl);
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA!;
console.log("Contract Address:", contractAddress);
const contractABI = PaymentReceiverABI.abi; // Usa l'ABI generata

const contract = new ethers.Contract(contractAddress, contractABI, provider);

const DEPLOY_BLOCK_NUMBER = 0; // Sostituisci con il numero del blocco di partenza del contratto

const fetchPastEventsForAddress = async (address: string) => {
  console.log(`Fetching past PaymentReceived events for address ${address}...`);
  const currentBlock = await provider.getBlockNumber();
  const pastEvents = await contract.queryFilter(
    contract.filters.PaymentReceived(address),
    DEPLOY_BLOCK_NUMBER, // Recupera gli eventi dall'inizio del deploy del contratto
    currentBlock
  );

  for (const event of pastEvents) {
    await processPaymentEvent(event);
  }
};

export { fetchPastEventsForAddress };
