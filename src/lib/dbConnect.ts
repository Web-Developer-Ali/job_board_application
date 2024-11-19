import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("DataBase is Already Connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DataBase connected");
  } catch (error) {
    console.log("Error in DataBase:",error);
    process.exit(1);
  }
}

export default dbConnection