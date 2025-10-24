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
    res.status(500).json({ message: "Can't load the inventory" });
  }
};

// GET single item
export const getItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item found", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD new item
export const addItem = async (req, res) => {
  try {
    const incomingData = req.body;
    const existingItem = await Inventory.findOne({ item_name: incomingData.item_name });

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
          createNotification(`${existingItem.item_name} has been restocked. Current stock: ${existingItem.item_quantity}`, "success")
        );
      }

      return res.status(200).json({
        message: "Item already exists. Item updated",
        updatedItem: existingItem,
        notifications,
      });
    }

    // Create new item
    const newItem = new Inventory(incomingData);
    await newItem.save();

    notifications.push(createNotification(`${newItem.item_name} added to the system`, "info"));

    res.status(200).json({
      message: "Item added successfully",
      item: newItem,
      notifications,
    });
  } catch (error) {
    res.status(400).json({ message: "Error adding item", error: error.message });
  }
};

// UPDATE existing item
export const putItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    let notifications = [];

    // Low stock notification
    if (updatedItem.item_quantity <= 5) {
      notifications.push(
        createNotification(`${updatedItem.item_name} stock dropped to ${updatedItem.item_quantity}`, "warning")
      );
    } else {
      notifications.push(
        createNotification(`${updatedItem.item_name} has been restocked. Current stock: ${updatedItem.item_quantity}`, "success")
      );
    }

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
      notifications,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error });
  }
};

// REDUCE item quantity (used by staff)
export const useItemQuantity = async (req, res) => {
  try {
    const { usedQuantity } = req.body;
    if (!usedQuantity || isNaN(usedQuantity) || usedQuantity <= 0) {
      return res.status(400).json({ message: "Enter a valid used quantity." });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (item.item_quantity < usedQuantity) {
      return res.status(400).json({ message: "Used quantity exceeds available stock." });
    }

    const prevQuantity = item.item_quantity;
    item.item_quantity -= usedQuantity;
    await item.save();

    let notifications = [];

    // Low stock alert
    if (item.item_quantity <= 5 && prevQuantity > 5) {
      notifications.push(createNotification(`${item.item_name} stock dropped to ${item.item_quantity}`, "warning"));
    }

    res.status(200).json({
      message: "Quantity reduced successfully!",
      item,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity.", error: error.message });
  }
};

// DELETE item
export const deleteItem = async (req, res) => {
  try {
    const itemToDelete = await Inventory.findByIdAndDelete(req.params.id);
    if (!itemToDelete) return res.status(404).json({ message: "Item not found" });

    const notifications = [createNotification(`${itemToDelete.item_name} has been removed from inventory`, "alert")];

    res.status(200).json({
      message: "Item deleted successfully",
      notifications,
    });
  } catch (error) {
    res.status(400).json({ message: "Error deleting item", error });
  }
};

// GET expired items notifications
export const getExpiredNotifications = async (req, res) => {
  try {
    const today = new Date();
    const expiredItems = await Inventory.find({ item_expirydate: { $lte: today } });

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
