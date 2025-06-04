import mongoose from "mongoose"; //for object data modeling meaning how we shape the data structure before passing them on to the database

// define the product schema (structure of the product data)
// name, description, price1, price discount, category, date, userId, images

const productSchema = new mongoose.Schema({
  //reference to the user who created the product
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
});

//check if the product is already created to prevent recompilation
//if it is already created, then use the existing one, if not, then create a new one
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
//export the product model to use it in other files
export default Product;
