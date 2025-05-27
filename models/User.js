import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
