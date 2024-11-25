// FILE: src/models/etherPrice.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IEtherPrice extends Document {
  price: number;
  updatedAt: Date;
}

const EtherPriceSchema: Schema = new Schema({
  price: { type: Number, required: true },
  updatedAt: { type: Date, required: true },
});

export const EtherPrice = mongoose.model<IEtherPrice>("EtherPrice", EtherPriceSchema);