import Inventory from "../model/Inventory.js";

// Helper function to generate notification object
const createNotification = (message, type = "info") => ({
  message,
  type,
  date: new Date(),
});

// GET all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    if (!items) return res.status(404).json({ message: "Database not found" });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Can't load the inventory",
      backgroundColor: "rgb(145, 18, 18)",
    });
  }
};

// GET single item
export const getItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item found", item });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, backgroundColor: "rgb(145, 18, 18)" });
  }
};

// ADD new item
export const addItem = async (req, res) => {
  try {
    const incomingData = req.body;
    const existingItem = await Inventory.findOne({
      item_name: incomingData.item_name,
    });

    let notifications = [];

    if (existingItem) {
      // Update existing item
      const prevQuantity = existingItem.item_quantity;

      existingItem.item_department = incomingData.item_department;
      existingItem.item_quantity += parseInt(incomingData.item_quantity);
      existingItem.item_unit = incomingData.item_unit;
      existingItem.item_location = incomingData.item_location;
      existingItem.item_expirydate = incomingData.item_expirydate;

      await existingItem.save();

      // If restocked
      if (existingItem.item_quantity > prevQuantity) {
        notifications.push(
          createNotification(
            `${existingItem.item_name} has been restocked. Current stock: ${existingItem.item_quantity}`,
            "success"
          )
        );
      }

      return res.status(200).json({
        message: "Item already exists. Item updated",
        updatedItem: existingItem,
        notifications,
        backgroundColor: "#0f766e",
      });
    }

    // Create new item
    const newItem = new Inventory(incomingData);
    await newItem.save();

    notifications.push(
      createNotification(`${newItem.item_name} added to the system`, "info")
    );

    res.status(200).json({
      message: "Item added successfully",
      item: newItem,
      notifications,
      backgroundColor: "#0f766e",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding item",
      error: error.message,
      backgroundColor: "rgb(145, 18, 18)",
    });
  }
};

// UPDATE existing item
export const putItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    let notifications = [];

    // Low stock notification
    if (updatedItem.item_quantity <= 5) {
      notifications.push(
        createNotification(
          `${updatedItem.item_name} stock dropped to ${updatedItem.item_quantity}`,
          "warning"
        )
      );
    } else {
      notifications.push(
        createNotification(
          `${updatedItem.item_name} has been restocked. Current stock: ${updatedItem.item_quantity}`,
          "success"
        )
      );
    }

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
      notifications,
      backgroundColor: "#0f766e",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating item",
      error,
      backgroundColor: "rgb(145, 18, 18)",
    });
  }
};

// REDUCE item quantity (used by staff)
export const useItemQuantity = async (req, res) => {
  try {
    const { usedQuantity } = req.body;
    if (!usedQuantity || isNaN(usedQuantity) || usedQuantity <= 0) {
      return res.status(400).json({
        message: "Enter a valid used quantity.",
        backgroundColor: "rgb(145, 18, 18)",
      });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item)
      return res.status(404).json({
        message: "Item not found.",
        backgroundColor: "rgb(145, 18, 18)",
      });

    if (item.item_quantity < usedQuantity) {
      return res.status(400).json({
        message: "Used quantity exceeds available stock.",
        backgroundColor: "rgb(145, 18, 18)",
      });
    }

    const prevQuantity = item.item_quantity;
    item.item_quantity -= usedQuantity;
    await item.save();

    let notifications = [];

    // Low stock alert
    if (item.item_quantity <= 5 && prevQuantity > 5) {
      notifications.push(
        createNotification(
          `${item.item_name} stock dropped to ${item.item_quantity}`,
          "warning"
        )
      );
    }

    res.status(200).json({
      message: "Quantity reduced successfully!",
      item,
      notifications,
      backgroundColor: "#0f766e",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update quantity.",
      error: error.message,
      backgroundColor: "rgb(145, 18, 18)",
    });
  }
};

// DELETE item
export const deleteItem = async (req, res) => {
  try {
    const itemToDelete = await Inventory.findByIdAndDelete(req.params.id);
    if (!itemToDelete)
      return res.status(404).json({ message: "Item not found" });

    const notifications = [
      createNotification(
        `${itemToDelete.item_name} has been removed from inventory`,
        "alert"
      ),
    ];

    res.status(200).json({
      message: "Item deleted successfully",
      notifications,
      backgroundColor: "#0f766e",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting item",
      backgroundColor: "rgb(145, 18, 18)",
      error,
    });
  }
};

// GET expired items notifications
export const getExpiredNotifications = async (req, res) => {
  try {
    const today = new Date();
    const expiredItems = await Inventory.find({
      item_expirydate: { $lte: today },
    });

    const notifications = expiredItems.map((item) =>
      createNotification(`${item.item_name} has expired`, "alert")
    );

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expired items", err });
  }
};

// GET upcoming expiry notifications (1 day before expiry)
export const getUpcomingExpiryNotifications = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setHours(23, 59, 59, 999);

    const expiringItems = await Inventory.find({
      item_expirydate: { $gte: tomorrow, $lte: nextDay },
    });

    const notifications = expiringItems.map((item) =>
      createNotification(`${item.item_name} will expire tomorrow`, "warning")
    );

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching upcoming expiry", err });
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
