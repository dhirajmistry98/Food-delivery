import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};
//ADD food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
//Remove food items

const removeFood = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line

    // Check if id exists in request body
    if (!req.body.id) {
      return res
        .status(400)
        .json({ success: false, message: "Food ID is required" });
    }

    const food = await foodModel.findById(req.body.id);

    // Check if the food item exists
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }

    if (food.image) {
      fs.unlink(path.join(uploadsDir, food.image), (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }

    // Delete the food item from the database
    await foodModel.findByIdAndDelete(req.body.id);

    // Send success response
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("Error removing food item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addFood, listFood, removeFood };
