"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addItem } from "../api/inventory/addItem";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Define the expected structure of an inventory item
export interface Item {
  name: string;
  barcode: string;
  quantity: number;
  category: string;
  supplier: string;
  costPrice: number;
  price: number;
}

// Main AddItem component (UI and logic for adding a new product)
export default function AddItem() {
  // State variables to capture form inputs
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);

  // State variables for feedback and scanner toggle
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);

  const router = useRouter(); // Next.js router for navigation

  // Handles form submission and adds item to Firestore
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const normalizedBarcode = barcode.trim().toLowerCase(); // Normalise barcode string
      const newItem: Item = { name, barcode: normalizedBarcode, quantity, category, supplier, costPrice, price };

      await addItem(newItem); // Save to Firestore

      setSuccess(true); // Show success message
      setTimeout(() => router.push("/"), 2000); // Redirect after 2s
    } catch {
      setError("Failed to add/update item. Please try again."); // Show error if submission fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded shadow hover:bg-gray-300"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Add New Inventory Item</h1>

      {/* Display success or error messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Item added successfully! Redirecting...</p>}

      {/* Inventory form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {/* Name input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Category input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Supplier input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Sale price input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Sale Price (£)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Cost price input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Cost Price (£)</label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Barcode input and scanner toggle */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Barcode</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setScanning(!scanning)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {scanning ? "Stop Scanner" : "Scan"}
            </button>
          </div>
        </div>

        {/* Barcode scanner UI */}
        {scanning && (
          <div className="w-full flex justify-center">
            <BarcodeScannerComponent
              width={300}
              height={200}
              onUpdate={(_, result) => {
                if (result && result.getText) {
                  setBarcode(result.getText());
                  setScanning(false); // Stop scanner once barcode is detected
                }
              }}
            />
          </div>
        )}

        {/* Quantity input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
            min="1"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
