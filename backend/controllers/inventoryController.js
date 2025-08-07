import Inventory from "../model/Inventory.js";

// handling get request for all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
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
    const existingItem = await Inventory.findOne({ item_name : incomingdata.item_name});
    //updating if items already exists
    if(existingItem)
    {
      existingItem.item_image = incomingdata.item_image;
      existingItem.item_quantity = existingItem.item_quantity + incomingdata.item_quantity;
      existingItem.item_location = incomingdata.item_location;
      existingItem.item_expirydate = incomingdata.item_expirydate;
      existingItem.item_status = incomingdata.item_status;

      await existingItem.save();

      return res.status(200).json({message : "Item already exists . Item updated", updatedItem : existingItem});
    }
    //creating new if it doesnt exists
    const newItem = await Inventory(incomingdata);
    await newItem.save();
    res.status(200).json({message : "Item added successfully" , item : newItem});
  } catch (error) {
    res.status(400).json({message: "Error adding item" , error : error.message});
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

    if(datatodelete==null)
    {
      res.status(404).json({message:"Item not found"});
      return ;
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting item", error });
  }
};

