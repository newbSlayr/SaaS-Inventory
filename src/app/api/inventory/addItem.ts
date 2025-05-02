import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export async function addItem(item) {
  try {
    const inventoryCollection = collection(db, "Inventory");

    // Normalise barcode to lowercase before querying
    const normalisedBarcode = item.barcode.trim().toLowerCase();

    // Query Firestore for an existing item with the same barcode
    const q = query(inventoryCollection, where("barcode", "==", normalisedBarcode));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If item exists, update the quantity
      const existingItem = querySnapshot.docs[0];
      const existingQuantity = existingItem.data().quantity || 0;

      await updateDoc(doc(db, "Inventory", existingItem.id), {
        quantity: existingQuantity + item.quantity, 
        updatedAt: serverTimestamp(),
      });

      console.log(`Updated quantity for barcode: ${normalisedBarcode}`);
      return { id: existingItem.id, ...item, barcode: normalisedBarcode, quantity: existingQuantity + item.quantity };
    } else {
      // If no existing item, add a new one
      const newItemWithTimestamp = {
        ...item,
        barcode: normalisedBarcode,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(inventoryCollection, newItemWithTimestamp);

      console.log(`Added new item with barcode: ${normalisedBarcode}`);
      return { id: docRef.id, ...newItemWithTimestamp };
    }
  } catch (error) {
    console.error("Error adding/updating item:", error);
    throw error;
  }
}
