import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
  if (!MONGODB_URI) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to the database");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.error("Unknown error during database connection");
    }
    throw error; // re-throw to handle it at a higher level
  }
};

const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from the database");
  } catch (error) {
    if(error instanceof Error) {
      console.error("Error disconnecting from the database:", error.message);
    }
    else {
      console.error("Unknown error during database disconnection");
    }
  }
}

export { connectToDatabase, disconnectFromDatabase };
