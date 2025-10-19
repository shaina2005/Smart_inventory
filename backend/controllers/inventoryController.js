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
      existingItem.item_department = incomingdata.item_department;
      existingItem.item_quantity =
        parseInt(existingItem.item_quantity) +
        parseInt(incomingdata.item_quantity);
      existingItem.item_unit = incomingdata.item_unit;
      existingItem.item_location = incomingdata.item_location;
      existingItem.item_expirydate = incomingdata.item_expirydate;

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
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i); // go backwards
      currentDay.setHours(0, 0, 0, 0);

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

      weekData.unshift({ day: dayName, expired: expiredCount }); // unshift → correct order
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
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i);
      currentDay.setHours(0, 0, 0, 0);

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

      weekData.unshift({ day: dayName, newItems: newItemsCount });
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
    const weekData = [];
    let cumulativeLowStock = 0;

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i);
      currentDay.setHours(0, 0, 0, 0);

      const start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      const end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      const wentLowStockToday = await Inventory.countDocuments({
        item_quantity: { $lte: 5 },
        updatedAt: { $gte: start, $lte: end },
      });

      const restockedToday = await Inventory.countDocuments({
        item_quantity: { $gt: 5 },
        updatedAt: { $gte: start, $lte: end },
      });

      cumulativeLowStock += wentLowStockToday;
      cumulativeLowStock -= restockedToday;
      if (cumulativeLowStock < 0) cumulativeLowStock = 0;

      const dayName = currentDay
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();

      weekData.unshift({ day: dayName, lowStock: cumulativeLowStock });
    }

    res.status(200).json(weekData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const departmentCount = async (req, res) => {
  try {
    // Predefined departments
    const departments = [
      "Administration & HR",
      "Banquet & Events",
      "Engineering & Maintenance",
      "F&B production",
      "F&B service",
      "Front office",
      "Housekeeping",
      "Security Departments",
      "others",
    ];

    // Aggregate to count items per department
    const counts = await Inventory.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$item_department", "others"] },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          count: 1,
        },
      },
    ]);

    // Merge with predefined departments, fill 0 for missing
    const result = departments.map((dep) => {
      const found = counts.find((c) => c.department === dep);
      return {
        department: dep,
        count: found ? found.count : 0,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching department stats", error: err });
  }
};
