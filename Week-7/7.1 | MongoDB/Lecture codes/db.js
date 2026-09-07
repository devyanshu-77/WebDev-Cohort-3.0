import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(
      "***REMOVED***",
    );
    console.log("DB connection successful");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default connectDB;
