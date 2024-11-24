"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
