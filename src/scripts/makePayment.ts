// FILE: src/scripts/makePayment.ts

import { ethers } from "ethers";
import dotenv from "dotenv";
import PaymentReceiverABI from "../artifacts/PaymentReceiver.json"; // Importa l'ABI generata

dotenv.config();

const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
console.log("Provider URL make-payments:", providerUrl);
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const privateKey = process.env.TEST_PRIVATE_KEY_2;
if (!privateKey) {
  throw new Error(
    "TEST_PRIVATE_KEY is not defined in the environment variables"
  );
}
console.log("Private Key:", privateKey);

const wallet = new ethers.Wallet(privateKey, provider);
console.log("Wallet Address:", wallet.address);

const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA!;
console.log("Contract Address:", contractAddress);
const contractABI = PaymentReceiverABI.abi; // Usa l'ABI generata

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const makePayment = async () => {
  try {
    const amountInEther = "0.0001"; // L'importo in Ether

    const tx = await contract.receivePayment({
      value: ethers.utils.parseEther(amountInEther),
    });

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);
  } catch (error) {
    console.error("Error making payment:", error);
  }
};

makePayment();
