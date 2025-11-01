import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
      lowercase: true
    },
    item_department: {
      type: String,
      required: true,
    },
    item_quantity: {
      type: Number,
      required: true,
    },
    item_unit: {
      type: String,
      required: true,
    },

    item_location: {
      type: String,
      required: true,
      lowercase: true
    },

    item_expirydate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
