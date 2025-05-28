import { serve } from "inngest/next";
import {
  inngest,
  //   createUserOrder,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    // createUserOrder,
    /* your functions will be passed here later! */
  ],
});
