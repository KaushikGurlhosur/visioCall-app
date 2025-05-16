import express from "express";
import dotenv from "dotenv"; // import "dotenv/config"; will also work
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// connectDB()
//   .then(() => {
//     app.use("/api/auth", authRoutes);

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB. Server not started.", err);
//   });
