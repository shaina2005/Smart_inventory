import mongoose from "mongoose";

const indentschema = new mongoose.Schema(
  {
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    requiredBy: {
      type: String,
      required: true,
    },
    requiredTime: {
      type: String,
      required: true,
    },
    requestedBy: {
      type: String,
      required: true,
    },
    items: [
      {
        item_name: {
          type: String,
          required: true,
        },
        specification: {
          type: String,
        },
        quantity: {
          type: String,
          required: true,
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Indent = mongoose.model("Indent" , indentschema);
export default Indent;