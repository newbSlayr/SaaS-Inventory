import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Logs an inventory event (added, updated, or deleted) with a timestamp
export async function logInventoryAction(action: string, itemName: string) {
  try {
    await addDoc(collection(db, "InventoryLogs"), {
      action,              // e.g., "updated", "deleted"
      itemName,            // Item name for traceability
      timestamp: serverTimestamp(), // Store server timestamp
    });

    console.log(`Logged: ${action} - ${itemName}`);
  } catch (error) {
    console.error("Error logging inventory action:", error);
  }
}
