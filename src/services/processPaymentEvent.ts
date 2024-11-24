import { ethers } from "ethers";
import { Payment } from "../models/paymentPuzzle67.model"; // Usa il modello corretto
import { userController } from "../controllers/user.controller";

const processPaymentEvent = async (event: any) => {
  const { transactionHash, logIndex, args } = event;
  const { from, amount, chainId, timestamp } = args;

  console.log(
    `Processing payment from ${from} of amount ${amount} on chain ${chainId} at ${timestamp}`
  );

  // Verifica se l'evento è già stato elaborato
  const existingPayment = await Payment.findOne({ transactionHash, logIndex });
  if (existingPayment) {
    console.log(`Event already processed: ${transactionHash} - ${logIndex}`);
    return;
  }

  // Memorizza l'evento nel database
  const newPayment = new Payment({
    transactionHash,
    logIndex,
    address: from,
    amount: ethers.utils.formatEther(amount),
    chain: chainId.toString(),
    timestamp,
  });
  await newPayment.save();

  // Chiamare la funzione createUserOrUpdate
  const req = {
    body: {
      address: from,
      chain: chainId.toString(),
      amount: ethers.utils.formatEther(amount),
    },
  };

  const res = {
    status: (statusCode: number) => ({
      json: (data: any) => console.log(`Response: ${statusCode}`, data),
    }),
  };

  await userController.createUserOrUpdate(req as any, res as any);
};

export { processPaymentEvent };
