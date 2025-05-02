import { db } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

// Deletes a single inventory item based on its barcode
export async function deleteInvItem(barcode: string) {
  try {
    // Reference the "Inventory" collection in Firestore
    const inventoryCollection = collection(db, "Inventory");

    // Create a query to find the item with the matching barcode
    const q = query(inventoryCollection, where("barcode", "==", barcode));
    const snapshot = await getDocs(q);

    // If no item is found, throw an error
    if (snapshot.empty) {
      throw new Error(`No item found with barcode: ${barcode}`);
    }

    // Get the document reference and ID of the matching item
    const docRef = snapshot.docs[0];
    const docId = docRef.id;
    const name = docRef.data().name; 

    // Delete the document from Firestore
    await deleteDoc(doc(db, "Inventory", docId));

    console.log(`Deleted item with barcode: ${barcode}`);

    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; 
  }
}
