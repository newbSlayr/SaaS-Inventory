import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

// Retrieves inventory items where quantity is 5 or less (low stock threshold)
export async function getLowStockItems() {
  try {
    const inventoryCollection = collection(db, "Inventory");

    // Firestore query: find items with quantity <= 5
    const q = query(inventoryCollection, where("quantity", "<=", 5)); 
    const snapshot = await getDocs(q);

    // Map documents into structured objects with fallbacks
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name ?? "Unnamed Item",
        barcode: data.barcode ?? doc.id,
        quantity: data.quantity ?? 0,
        category: data.category ?? "Uncategorized",
        price: data.price ?? 0,
        costPrice: data.costPrice ?? 0,
        supplier: data.supplier ?? "Unknown",
      };
    });

    console.log("Low Stock Items:", items);
    return items;
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return [];
  }
}
