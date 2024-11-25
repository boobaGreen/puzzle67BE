// FILE: src/services/fetchPastEvents.ts

import { ethers } from "ethers";
import dotenv from "dotenv";
import { processPaymentEvent } from "./processPaymentEvent";
import { LastProcessedBlock } from "../models/lastProcessedBlock.model";
import PaymentReceiverABI from "../artifacts/PaymentReceiver.json"; // Importa l'ABI generata

dotenv.config();

const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL fetchPastEvent:", providerUrl);
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

const fetchAllPastEvents = async () => {
  console.log("Fetching all past PaymentReceived events...");

  // Recupera l'ultimo blocco elaborato dal database
  let lastProcessedBlock = await LastProcessedBlock.findOne();
  if (!lastProcessedBlock) {
    lastProcessedBlock = new LastProcessedBlock({
      blockNumber: DEPLOY_BLOCK_NUMBER,
    });
  }

  const currentBlock = await provider.getBlockNumber();
  const pastEvents = await contract.queryFilter(
    contract.filters.PaymentReceived(),
    lastProcessedBlock.blockNumber + 1, // Recupera gli eventi dal blocco successivo all'ultimo elaborato
    currentBlock
  );

  for (const event of pastEvents) {
    await processPaymentEvent(event);
  }

  // Aggiorna l'ultimo blocco elaborato nel database
  lastProcessedBlock.blockNumber = currentBlock - 1;
  await lastProcessedBlock.save();
};

export { fetchPastEventsForAddress, fetchAllPastEvents };
