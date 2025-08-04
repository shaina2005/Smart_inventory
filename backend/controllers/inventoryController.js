import Inventory from "../model/Inventory";

// handling get request for all items
export const getAllItems = async (req, res)=>{
    try {
        const items =  await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message : "can't load the inventory"});
    }
}


// handling post request to add item in inventory
export const addItem = async (req , res)=>{

    try{
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(200).json({message : "Item added successfully" , item : newItem})
    }
    catch(error)
    {
        res.status(400).json({message : "error adding item"});
    }
}


// handling put request to update inventory
export const putItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error });
  }
};

// DELETE remove an inventory item
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting item", error });
  }
};
