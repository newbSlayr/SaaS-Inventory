// ProductsPage.tsx
// This page provides full product management functionality:
// - View all inventory items
// - Edit quantities, prices, and categories inline
// - Delete items
// - Export inventory to Excel
// - Search by name, category, or barcode

"use client"; 

import { useEffect, useState } from "react";
import { getInvItems } from "../api/inventory/getItem"; 
import { deleteInvItem } from "../api/inventory/deleteItem"; 
import { updateInvItem } from "../api/inventory/updateItem"; 
import { useRouter } from "next/navigation"; 
import * as XLSX from "xlsx"; 

// Define the expected structure of an inventory item
interface InventoryItem {
  name: string;
  barcode: string;
  quantity: number;
  category: string;
  price?: number;
  costPrice?: number;
}

// Shape of the form data used during editing
interface EditData {
  name: string;
  category: string;
  salePrice: number;
  costPrice: number;
  quantity: number;
}

export default function ProductsPage() {
  // Local state hooks
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItemId, setEditItemId] = useState<string | null>(null); // Currently editing item
  const [editData, setEditData] = useState<EditData | null>(null); // Data for the item being edited
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  // Fetch items from the backend on first render
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getInvItems();
        setItems(fetchedItems); // Set the inventory data
        setLoading(false);
      } catch {
        console.error("Failed to load items.");
      }
    };

    fetchItems();
  }, []);

  // When user clicks "edit", populate the edit form
  const handleEdit = (item: InventoryItem) => {
    setEditItemId(item.barcode);
    setEditData({
      name: item.name,
      category: item.category,
      salePrice: item.price || 0,
      costPrice: item.costPrice || 0,
      quantity: item.quantity,
    });
  };

  // Track input changes during editing
  const handleInputChange = (field: keyof EditData, value: string | number) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  // Save changes to Firebase and update local state
  const handleSave = async () => {
    if (!editItemId || !editData) return;
    try {
      await updateInvItem(editItemId, {
        name: editData.name,
        category: editData.category,
        price: editData.salePrice,
        costPrice: editData.costPrice,
        quantity: editData.quantity,
      });
      // Update UI after successful save
      setItems((prev) =>
        prev.map((item) =>
          item.barcode === editItemId
            ? {
                ...item,
                name: editData.name,
                category: editData.category,
                price: editData.salePrice,
                costPrice: editData.costPrice,
                quantity: editData.quantity,
              }
            : item
        )
      );
      setEditItemId(null);
      setEditData(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditItemId(null);
    setEditData(null);
  };

  // Delete item from Firestore and remove from local state
  const handleDelete = async (barcode: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await deleteInvItem(barcode);
      setItems((prev) => prev.filter((item) => item.barcode !== barcode));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Export inventory list to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      items.map((item) => ({
        Name: item.name,
        Barcode: item.barcode,
        Category: item.category,
        Quantity: item.quantity,
        Price: item.price,
        Cost: item.costPrice,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory_export.xlsx");
  };

  // Search/filter logic
  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.barcode?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar with navigation, export, search, and add item */}
        <div className="flex justify-between items-center mb-4">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded shadow hover:bg-gray-300"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Products Management</h1>

          {/* Export inventory to Excel */}
          <button
            onClick={handleExportExcel}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
          >
            📄 Export Excel
          </button>

          {/* Search bar and Add Item button */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-md w-72 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => router.push("/add-items")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              ➕ Add New Item
            </button>
          </div>
        </div>

        {/* Main table section */}
        <div className="bg-white shadow rounded-lg p-6">
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                {/* Table headers */}
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Sale Price (£)</th>
                    <th className="p-3 text-left">Cost Price (£)</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table body */}
                <tbody>
                  {filteredItems.length === 0 ? (
                    // Show message if no results
                    <tr>
                      <td colSpan={6} className="text-center p-6 text-gray-400">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    // Render table rows
                    filteredItems.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {/* Name field (editable) */}
                        <td className="p-3">
                          {editItemId === item.barcode ? (
                            <input
                              type="text"
                              value={editData?.name || ""}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              className="border rounded p-1 w-full"
                            />
                          ) : (
                            item.name
                          )}
                        </td>

                        {/* Category field (editable) */}
                        <td className="p-3">
                          {editItemId === item.barcode ? (
                            <input
                              type="text"
                              value={editData?.category || ""}
                              onChange={(e) => handleInputChange("category", e.target.value)}
                              className="border rounded p-1 w-full"
                            />
                          ) : (
                            item.category || "Other"
                          )}
                        </td>

                        {/* Sale Price field (editable) */}
                        <td className="p-3">
                          {editItemId === item.barcode ? (
                            <input
                              type="number"
                              value={editData?.salePrice ?? 0}
                              onChange={(e) =>
                                handleInputChange("salePrice", parseFloat(e.target.value))
                              }
                              className="border rounded p-1 w-24"
                            />
                          ) : (
                            `£${item.price?.toFixed(2) || "0.00"}`
                          )}
                        </td>

                        {/* Cost Price field (editable) */}
                        <td className="p-3">
                          {editItemId === item.barcode ? (
                            <input
                              type="number"
                              value={editData?.costPrice ?? 0}
                              onChange={(e) =>
                                handleInputChange("costPrice", parseFloat(e.target.value))
                              }
                              className="border rounded p-1 w-24"
                            />
                          ) : (
                            `£${item.costPrice?.toFixed(2) || "0.00"}`
                          )}
                        </td>

                        {/* Stock quantity field (editable) */}
                        <td className="p-3">
                          {editItemId === item.barcode ? (
                            <input
                              type="number"
                              value={editData?.quantity ?? 1}
                              onChange={(e) =>
                                handleInputChange("quantity", parseInt(e.target.value))
                              }
                              className="border rounded p-1 w-20"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>

                        {/* Edit / Save / Delete buttons */}
                        <td className="p-3 text-center space-x-2">
                          {editItemId === item.barcode ? (
                            <>
                              <button
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold"
                              >
                                ✅ Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-bold"
                              >
                                ❌ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-bold"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.barcode)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

