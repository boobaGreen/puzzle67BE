// FILE: src/models/payment.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionHash: string;
  logIndex: number;
  address: string;
  amount: string;
  chain: string;
  timestamp: number;
}

const PaymentSchema: Schema = new Schema({
  transactionHash: { type: String, required: true, unique: true },
  logIndex: { type: Number, required: true },
  address: { type: String, required: true },
  amount: { type: String, required: true },
  chain: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema, "paymentsPuzzle67");