import { db } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { logInventoryAction } from "./logInventoryAction";

// Updates an inventory item using its barcode
export async function updateInvItem(
  barcode: string,
  updatedData: {
    name?: string;
    quantity?: number;
    category?: string;
    price?: number;
    costPrice?: number;
    supplier?: string;
  }
) {
  try {
    // Reference to Inventory collection
    const inventoryCollection = collection(db, "Inventory");

    // Find item with matching barcode
    const q = query(inventoryCollection, where("barcode", "==", barcode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`No document found with barcode: ${barcode}`);
    }

    // Extract document reference
    const docRef = querySnapshot.docs[0];
    const docId = docRef.id;
    const name = docRef.data().name;

    // Update Firestore document and log action
    await updateDoc(doc(db, "Inventory", docId), {
      ...updatedData,
      lastUpdated: serverTimestamp(), // Record update time
    });

    await logInventoryAction("updated", name);

    console.log(`Updated item with barcode: ${barcode}`);
    return true;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}
