import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.error("❌ MONGO_URI is missing in .env file!");
            process.exit(1);
        }

        // Connection Lifecycle Event Listeners
        mongoose.connection.on("connected", () => {
            console.log("✅ MongoDB Connection Established Successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB Disconnected. Attempting reconnection...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("🔄 MongoDB Reconnected Successfully");
        });

        // Graceful process shutdown handling
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("🛑 MongoDB connection closed through app termination");
            process.exit(0);
        });

        // Initial Connect
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`📦 MongoDB Connected to Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Initial Database Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;