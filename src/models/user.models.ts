import { Schema, model } from "mongoose";
// Creating an interface
interface Users {
  address: string;
  chain: string;
  leftTry: number;
}

const userSchema = new Schema<Users>(
  {
    address: {
      type: String,
      required: [true, "Address should not be empty!"],
    },

    chain: {
      type: String,
      required: [true, "Chain should not be empty!"],
    },

    leftTry: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = model<Users>("User", userSchema);
