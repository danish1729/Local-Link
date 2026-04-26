import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const uri =
  "mongodb+srv://locallinkuser:Danish-2329@locallink-cluster.20c1zki.mongodb.net/?appName=LocalLink-Cluster";

if (!uri) {
  console.error("❌ MONGODB_URI missing");
  process.exit(1);
}

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ CONNECTED TO MONGODB");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED");
    console.error(err);
    process.exit(1);
  });
