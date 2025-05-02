import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";

// Fetches all inventory items from the "Inventory" collection in Firestore
export async function getInvItems() {
  try {
    // Reference the "Inventory" collection
    const inventoryCollection = collection(db, "Inventory");

    // Fetch all documents from the collection
    const snapshot = await getDocs(inventoryCollection);

    // Map each document into a structured inventory item object
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        quantity: data.quantity,
        category: data.category ?? "Uncategorized",
        price: data.price,
        barcode: data.barcode,
        costPrice: data.costPrice,
        supplier: data.supplier ?? "Unknown", 
      } as {
        id: string;
        name: string;
        quantity: number;
        category: string;
        price?: number;
        barcode: string;
        costPrice?: number;
        supplier: string;
      };
    });

    return items;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}
