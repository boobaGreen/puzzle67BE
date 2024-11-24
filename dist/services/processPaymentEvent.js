"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaymentEvent = void 0;
const ethers_1 = require("ethers");
const paymentPuzzle67_model_1 = require("../models/paymentPuzzle67.model"); // Usa il modello corretto
const user_controller_1 = require("../controllers/user.controller");
const processPaymentEvent = async (event) => {
    const { transactionHash, logIndex, args } = event;
    const { from, amount, chainId, timestamp } = args;
    console.log(`Processing payment from ${from} of amount ${amount} on chain ${chainId} at ${timestamp}`);
    // Verifica se l'evento è già stato elaborato
    const existingPayment = await paymentPuzzle67_model_1.Payment.findOne({ transactionHash, logIndex });
    if (existingPayment) {
        console.log(`Event already processed: ${transactionHash} - ${logIndex}`);
        return;
    }
    // Memorizza l'evento nel database
    const newPayment = new paymentPuzzle67_model_1.Payment({
        transactionHash,
        logIndex,
        address: from,
        amount: ethers_1.ethers.utils.formatEther(amount),
        chain: chainId.toString(),
        timestamp,
    });
    await newPayment.save();
    // Chiamare la funzione createUserOrUpdate
    const req = {
        body: {
            address: from,
            chain: chainId.toString(),
            amount: ethers_1.ethers.utils.formatEther(amount),
        },
    };
    const res = {
        status: (statusCode) => ({
            json: (data) => console.log(`Response: ${statusCode}`, data),
        }),
    };
    await user_controller_1.userController.createUserOrUpdate(req, res);
};
exports.processPaymentEvent = processPaymentEvent;
