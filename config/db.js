import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_AUTHENTICATION",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error in database connection");
    });
};
