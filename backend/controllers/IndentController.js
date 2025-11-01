import Indent from "../model/Indent.js";

export const createIndent = async (req, res) => {
  try {
    // const indentRequest = req.body;
    const { purpose, requiredBy, requiredTime, requestedBy, items, notes } =
      req.body;
    if (
      !purpose ||
      !requiredBy ||
      !requiredTime ||
      !requestedBy ||
      !items ||
      items.length === 0
    ) {
      res.status(200).json({
        message: "Enter all the required fields",
        backgroundColor: "rgb(145, 18, 18)",
        success: "false",
      });
    }

    for (const item of items) {
      if (!item.item_name || !item.quantity) {
        return res.status(200).json({
          message: "Item Name & quantity are required.",
          backgroundColor: "rgb(145, 18, 18)",
          success: "false",
        });
      }
    }
    const indentRequest = {
      purpose,
      requiredBy,
      requiredTime,
      requestedBy,
      items,
      notes,
    };
    const newIndent = await Indent.create(indentRequest);
    res.status(201).json({
      message: "Indent Request Sent Successfully",
      backgroundColor: "#0f766e",
      success: "true",
      newIndent,
    });
  } catch (error) {
    console.log("Error in createIndent backend :", error.message);

    res.status(400).json({
      message: "Indent Request failed.",
      backgroundColor: "rgb(145, 18, 18)",
      success: "false",
    });
  }
};

export const getAllIndents = async (req, res) => {
  try {
    const indents = await Indent.find().sort({ createdAt: -1 });
    res.status(200).json(indents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching indents",
      error: error.message,
    });
  }
};

export const deleteIndent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIndent = await Indent.findByIdAndDelete(id);

    if (!deletedIndent) {
      return res.status(404).json({ message: "Indent not found" });
    }

    res
      .status(200)
      .json({
        message: "Indent deleted successfully",
        backgroundColor: "#0f766e",
        success: "true",
      });
  } catch (error) {
    console.error("Error deleting indent:", error);
    res.status(500).json({ message: "Server error while deleting indent" });
  }
};
