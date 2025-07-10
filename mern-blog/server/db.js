import mongoose from 'mongoose';

const connectDB = async () => {
  console.log("🔌 Connecting to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGO_URI); // no need for options here
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;
