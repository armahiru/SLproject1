import mongoose from "mongoose";

const connectDB = async () => {
    // Configure mongoose for better connection handling
    mongoose.set("bufferCommands", false);

    const baseUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || "consultation_system";

    if (!baseUri) {
        console.warn(
            "[MongoDB] MONGODB_URI is not set. Server will run without a DB connection."
        );
        return;
    }

    // Connection options
    const options = {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        bufferCommands: false,
    };

    mongoose.connection.on("connected", () => {
        console.log("✅ Database Connected successfully");
    });
    
    mongoose.connection.on("error", (err) => {
        console.error("❌ [MongoDB] connection error:", err?.message || err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("⚠️ MongoDB disconnected");
    });

    try {
        // If the URI already includes a database name, use it as-is. Otherwise append one.
        const hasDbName = /\/[^/?]+(\?|$)/.test(baseUri);
        const uri = hasDbName ? baseUri : `${baseUri.replace(/\/$/, "")}/${dbName}`;
        
        await mongoose.connect(uri, options);
    } catch (err) {
        console.error(
            "❌ [MongoDB] Failed to connect. Error:",
            err?.message || err
        );
        console.log("🔍 Check: 1) MongoDB service is running 2) Connection string is correct");
    }
}

export default connectDB;