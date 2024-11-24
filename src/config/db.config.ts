// FILE: src/config/db.config.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoCluster = process.env.MONGO_CLUSTER;
    const dbName = process.env.DB_NAME;

    if (!mongoUser || !mongoPassword || !mongoCluster || !dbName) {
      throw new Error(
        "MongoDB connection details are not defined in the environment variables"
      );
    }

    const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    // const mongoUri = `mongodb+srv://claudiodallaradev:h4gopzZIxwdePlEM@cluster0.rjlezlk.mongodb.net/puzzle?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoUri);

    console.log("MongoDB is connected!!!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
