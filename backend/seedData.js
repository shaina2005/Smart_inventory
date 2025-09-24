// import mongoose from "mongoose";
// import dotenv from 'dotenv';
// import Inventory from "./model/Inventory.js";

// dotenv.config();

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Database connected for seeding"))
//   .catch((err) => console.log("Database connection failed:", err));



// // Function to seed the database
// const seedDatabase = async () => {
//   try {
//     // Clear existing data
//     await Inventory.deleteMany({});
//     console.log("Cleared existing inventory data");

//     // Insert sample data
//     const result = await Inventory.insertMany(sampleData);
//     console.log(`Successfully seeded ${result.length} inventory items`);

//     // Close the connection
//     mongoose.connection.close();
//     console.log("Database connection closed");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     mongoose.connection.close();
//   }
// };

// // Run the seeding function
// seedDatabase(); 