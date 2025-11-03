// import { _descriptors } from "chart.js/helpers";
import mongoose from "mongoose";
const helpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    screenshots: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
const Help = mongoose.model("Help", helpSchema);
export default Help;
