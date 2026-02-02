import mongoose from "mongoose";

const connectDB = async () => {
    // If DB is down/disabled, don't "buffer" queries for 10s then timeout.
    mongoose.set("bufferCommands", false);

    const baseUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || "prescripto";

    if (!baseUri) {
        console.warn(
            "[MongoDB] MONGODB_URI is not set. Server will run without a DB connection."
        );
        return;
    }

    // If the URI already includes a database name, use it as-is. Otherwise append one.
    const hasDbName = /\/[^/?]+(\?|$)/.test(baseUri);
    const uri = hasDbName ? baseUri : `${baseUri.replace(/\/$/, "")}/${dbName}`;

    mongoose.connection.on("connected", () => console.log("Database Connected"));
    mongoose.connection.on("error", (err) =>
        console.error("[MongoDB] connection error:", err?.message || err)
    );

    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.error(
            "[MongoDB] Failed to connect. Check MONGODB_URI. Error:",
            err?.message || err
        );
    }
}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error