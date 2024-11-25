// FILE: src/models/lastProcessedBlock.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ILastProcessedBlock extends Document {
  blockNumber: number;
}

const LastProcessedBlockSchema: Schema = new Schema({
  blockNumber: { type: Number, required: true },
});

export const LastProcessedBlock = mongoose.model<ILastProcessedBlock>(
  "LastProcessedBlock",
  LastProcessedBlockSchema
);
