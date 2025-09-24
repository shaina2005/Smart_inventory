import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({

  item_name: {
    type: String,
    required: true,
  },

  item_image: {
    type: String,
  },

  item_quantity: {
    type: Number,
    required: true,
  },
  item_unit :{
    type : String,
    required : true,
  },

  item_location: {
    type: String,
    required: true,
  },

  item_expirydate: {
    type: Date,
    required: true,
  },

  item_status: {
    type: String,
    enum: ["good-stock", "low-stock", "out-of-stock" , "expired"],
  },
} , { timestamps: true });

export default mongoose.model("Inventory" , inventorySchema);