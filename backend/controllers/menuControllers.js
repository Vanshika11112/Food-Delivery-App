const Menu = require("../models/Menu");

const getAllMenuItems = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postMenuItem = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Menu.create(newItem);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteMenuItem = async (req, res) => {
  const menuId = req.params.id;
  console.log("Deleting menu item with ID:", menuId);

  try {
    const filter = { _id: menuId }; // Assuming _id is the field for the document's unique identifier
    const deletedItem = await Menu.findOneAndDelete(filter);

    // console.log("Deleted item:", deletedItem);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ message: "Menu Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: error.message });
  }
};

//  For Single Item
const singleMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    // console.log(menu);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update  single menu Item
const updateMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const { name, recipe, image, category, price } = req.body;
  try {
    const updateMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        name,
        recipe,
        image,
        category,
        price,
      },
      { new: true, runValidators: true }
    );
    if (!updateMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    return res.status(200).json(updateMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllMenuItems,
  postMenuItem,
  deleteMenuItem,
  singleMenuItem,
  updateMenuItem,
};
