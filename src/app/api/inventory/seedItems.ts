// src/app/api/inventory/seedItems.ts

import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function seedInventoryItems() {
  const items = [
    { name: "Coca-Cola 500ml", category: "Drinks", supplier: "Coca-Cola", quantity: 50, price: 1.5 },
    { name: "Pepsi Max 500ml", category: "Drinks", supplier: "PepsiCo", quantity: 40, price: 1.5 },
    { name: "Walkers Crisps", category: "Snacks", supplier: "Walkers", quantity: 30, price: 1.2 },
    { name: "Doritos Cool Original", category: "Snacks", supplier: "PepsiCo", quantity: 25, price: 1.5 },
    { name: "Cadbury Dairy Milk", category: "Confectionery", supplier: "Cadbury", quantity: 20, price: 1.0 },
    { name: "Galaxy Chocolate Bar", category: "Confectionery", supplier: "Mars", quantity: 15, price: 1.1 },
    { name: "Kingsmill Bread", category: "Bakery", supplier: "Kingsmill", quantity: 10, price: 1.2 },
    { name: "Milk 2L", category: "Dairy", supplier: "Local Farm", quantity: 20, price: 2.0 },
    { name: "Butter 250g", category: "Dairy", supplier: "Anchor", quantity: 12, price: 2.5 },
    { name: "Eggs (12 pack)", category: "Dairy", supplier: "Farm Fresh", quantity: 18, price: 2.2 },
    { name: "Bananas (per kg)", category: "Produce", supplier: "Fruit Market", quantity: 25, price: 1.3 },
    { name: "Apples (per kg)", category: "Produce", supplier: "Fruit Market", quantity: 20, price: 1.5 },
    { name: "Potatoes (2kg)", category: "Produce", supplier: "Local Farm", quantity: 10, price: 2.8 },
    { name: "Ready Meal (Lasagna)", category: "Frozen", supplier: "Iceland", quantity: 8, price: 3.0 },
    { name: "Frozen Peas", category: "Frozen", supplier: "Birds Eye", quantity: 15, price: 2.0 },
  ];

  try {
    const inventoryCollection = collection(db, "Inventory");

    for (const item of items) {
      await addDoc(inventoryCollection, {
        ...item,
        barcode: generateRandomBarcode(),
        createdAt: serverTimestamp(),
      });
    }

    console.log(" Inventory items seeded successfully!");
  } catch (error) {
    console.error("Failed to seed inventory items:", error);
  }
}

// Helper function to generate random 12-digit barcode
function generateRandomBarcode() {
  const digits = "0123456789";
  let barcode = "";
  for (let i = 0; i < 12; i++) {
    barcode += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return barcode;
}
