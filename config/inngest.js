// Import required modules and models
import { Inngest } from "inngest"; // Event-driven architecture library
import connectDB from "./db"; // Database connection utility
import User from "@/models/User"; // User model/schema
// import Order from "@/models/Order"; // Order model/schema

// Create an Inngest client instance for event handling
// This will be used to send and receive events throughout the application
export const inngest = new Inngest({ id: "ecommerce-class" });

/**
 * Synchronizes user creation from Clerk (authentication service) to our database
 * Triggered by 'clerk/user.created' event
 */
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk", // Unique identifier for this function
  },
  { event: "clerk/user.created" }, // Event that triggers this function
  async ({ event }) => {
    // Destructure user data from the event payload
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Prepare user data for our database
    const userData = {
      _id: id, // Using Clerk's user ID as our primary key
      email: email_addresses[0].email_address, // Taking first email address
      name: first_name + " " + last_name, // Combining first and last name
      imageUrl: image_url, // Profile image URL
    };

    // Connect to database and create new user record
    await connectDB();
    await User.create(userData);
  }
);

/**
 * Synchronizes user updates from Clerk to our database
 * Triggered by 'clerk/user.updated' event
 */
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk", // Unique identifier for this function
  },
  { event: "clerk/user.updated" }, // Event that triggers this function
  async ({ event }) => {
    // Destructure updated user data from the event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Prepare updated user data
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };

    // Connect to database and update existing user record
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

/**
 * Synchronizes user deletion from Clerk to our database
 * Triggered by 'clerk/user.deleted' event
 */
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk", // Unique identifier for this function
  },
  { event: "clerk/user.deleted" }, // Event that triggers this function
  async ({ event }) => {
    // Extract user ID from the event data
    const { id } = event.data;

    // Connect to database and delete the user record
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

/**
 * Creates user orders in bulk (batched processing)
 * Triggered by 'order/created' events
 */
// export const createUserOrder = inngest.createFunction(
//   {
//     id: "create-user-order", // Unique identifier for this function
//     // Batch configuration: process up to 5 events at once with a 5-second timeout
//     batchEvents: {
//       maxSize: 5,
//       timeout: "5s",
//     },
//   },
//   { event: "order/created" }, // Event that triggers this function
//   async ({ events }) => {
//     // Transform each event into an order document for MongoDB
//     const orders = events.map((event) => {
//       return {
//         userId: event.data.userId, // Reference to the user who placed the order
//         items: event.data.items, // Ordered items/products
//         amount: event.data.amount, // Total order amount
//         address: event.data.address, // Shipping address
//         date: event.data.date, // Order date
//       };
//     });

//     // Connect to database and insert all orders in a single operation
//     await connectDB();
//     await Order.insertMany(orders);

//     // Return success status and number of processed orders
//     return { success: true, processed: orders.length };
//   }
// );
