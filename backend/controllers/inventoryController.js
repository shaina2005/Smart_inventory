import Inventory from "../model/Inventory.js";

// handling get request for all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();

    if (items == null) {
      res.status(404).json({ message: "Database not found" });
      return;
    }
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "can't load the inventory" });
  }
};

//handling get request for a particular item
export const getItem = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await Inventory.findById(id);
    if (items === null) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item Found", item: items });
  } catch (error) {
    res.json({ message: error });
  }
};
// handling post request to add item in inventory
export const addItem = async (req, res) => {
  try {
    const incomingdata = await req.body;
    //checking is item already existe if it does update it
    const existingItem = await Inventory.findOne({
      item_name: incomingdata.item_name,
    });
    //updating if items already exists
    if (existingItem) {
      existingItem.item_image = incomingdata.item_image;
      existingItem.item_quantity =
        parseInt(existingItem.item_quantity) +
        parseInt(incomingdata.item_quantity);
      existingItem.item_unit = incomingdata.item_unit;
      existingItem.item_location = incomingdata.item_location;
      existingItem.item_expirydate = incomingdata.item_expirydate;
      existingItem.item_status = incomingdata.item_status;

      await existingItem.save();

      return res.status(200).json({
        message: "Item already exists . Item updated",
        updatedItem: existingItem,
      });
    }
    //creating new if it doesnt exists
    const newItem = await Inventory(incomingdata);
    await newItem.save();
    res.status(200).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding item", error: error.message });
  }
};

// handling put request to update inventory
export const putItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedItem === null) {
      return res.status(404).json({ message: "Item not found" });
    }
    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error });
  }
};

// DELETE remove an inventory item
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const datatodelete = await Inventory.findByIdAndDelete(id);

    if (datatodelete == null) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting item", error });
  }
};

export const getExpiredItem = async (req, res) => {
  try {
    const today = new Date();

    // Get Monday of the current week
    const startOfWeek = new Date(today);
    const day = today.getDay(); // Sunday = 0, Monday = 1
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = [];

    for (let i = 0; i <= today.getDay() - 1; i++) {
      // Only Monday → today
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      const end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      const expiredCount = await Inventory.countDocuments({
        item_expirydate: { $gte: start, $lte: end },
      });

      const dayName = currentDay
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();

      weekData.push({ day: dayName, expired: expiredCount });
    }

    res.json(weekData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getNewItemsWeek = async (req, res) => {
  try {
    const today = new Date();

    // Get Monday of the current week
    const startOfWeek = new Date(today);
    const day = today.getDay(); // Sunday = 0, Monday = 1
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = [];

    for (let i = 0; i <= today.getDay() - 1; i++) {
      // Monday → today
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      const end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      const newItemsCount = await Inventory.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const dayName = currentDay
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();

      weekData.push({ day: dayName, newItems: newItemsCount });
    }

    res.json(weekData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getLowStockWeek = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay(); // Sunday = 0
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = [];
    let cumulativeLowStock = 0;

    // Simulate day-by-day
    for (let i = 0; i <= day; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      const end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      // Find items that went low stock that day
      const wentLowStockToday = await Inventory.countDocuments({
        item_quantity: { $lte: 5 }, // threshold
        updatedAt: { $gte: start, $lte: end },
      });

      // Find items that were restocked above threshold
      const restockedToday = await Inventory.countDocuments({
        item_quantity: { $gt: 5 },
        updatedAt: { $gte: start, $lte: end },
      });

      // Update cumulative low stock count
      cumulativeLowStock += wentLowStockToday;
      cumulativeLowStock -= restockedToday;
      if (cumulativeLowStock < 0) cumulativeLowStock = 0;

      const dayName = currentDay
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();

      weekData.push({ day: dayName, lowStock: cumulativeLowStock });
    }

    res.status(200).json(weekData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
