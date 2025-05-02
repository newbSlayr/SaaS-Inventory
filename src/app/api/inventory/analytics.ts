import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";

// This function retrieves real-time analytics from the Inventory collection in Firestore.
// It calculates total items, total stock quantity, and item distribution by category.

export async function getInventoryAnalytics() {
  try {
    // Reference the "Inventory" collection in Firestore
    const inventoryCollection = collection(db, "Inventory");

    // Retrieve all documents from the collection
    const snapshot = await getDocs(inventoryCollection);

    // Initialise summary values
    let totalItems = 0;
    let totalStock = 0;
    const categories: { [key: string]: number } = {};

    // Loop through each inventory item
    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      totalItems += 1; 
      totalStock += Number(data.quantity) || 0;

      // Count items by category
      if (data.category) {
        categories[data.category] = (categories[data.category] || 0) + 1;
      }
    });

    // Construct analytics result
    const analyticsData = {
      totalItems,  
      totalStock,   
      categories,   
    };

    console.log("Inventory Analytics:", analyticsData);

    return analyticsData;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    
    // Return default fallback data to avoid app crash
    return {
      totalItems: 0,
      totalStock: 0,
      categories: {},
    };
  }
}
