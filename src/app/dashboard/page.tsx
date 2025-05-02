"use client"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInvItems } from "../api/inventory/getItem"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; 

// Type definition for inventory item
interface InventoryItem {
  name: string;
  quantity: number;
  category?: string;
  supplier?: string;
  price?: number;
}

export default function Home() {
  const router = useRouter(); // Next.js navigation hook
  const [items, setItems] = useState<InventoryItem[]>([]); // Store all inventory items
  const [loading, setLoading] = useState(true); // Track data loading status

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const fetchedItems = await getInvItems();
        setItems(fetchedItems);
        setLoading(false);
      } catch {
        console.error("Failed to load inventory.");
      }
    };

    fetchInventory();
  }, []);

  // Key dashboard metrics
  const totalProducts = items.length;
  const lowStock = items.filter((item) => item.quantity <= 5).length;
  const outOfStock = items.filter((item) => item.quantity === 0).length;
  const suppliers = new Set(items.map((item) => item.supplier)).size;

  // Calculate total stock value
  const stockValue = items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  // Prepare data for bar chart
  const warehouseData = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header bar */}
      <header className="bg-[#0b1120] text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inventory Management Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Button to go to reporting view */}
            <button
              onClick={() => router.push("/reporting")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              📊 Reporting
            </button>
            <div className="text-gray-300 text-sm">Admin</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stat Cards (Top metrics) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Products" value={totalProducts} onClick={() => router.push("/products")} />
          <StatCard label="Low Stock" value={lowStock} onClick={() => router.push("/reporting")} />
          <StatCard label="Out of Stock" value={outOfStock} />
          <StatCard label="Suppliers" value={suppliers} />
        </section>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar section */}
          <div className="lg:col-span-1 bg-white shadow rounded-lg p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Value of Stock</h3>
              <p className="text-2xl font-bold text-green-600">£{stockValue.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Stock Purchases</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>Unfulfilled: 4</li>
                <li>Received: 1</li>
              </ul>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Bar chart showing stock quantities */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Warehouse Stock</h2>
              {loading ? (
                <p className="text-gray-400">Loading chart...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={warehouseData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Table showing individual items and quantity status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Stock Levels</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state if no items */}
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center p-6 text-gray-400">
                          No inventory items found.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.category || "Other"}</td>
                          <td className="p-3 font-bold text-right align-top">
                            <div className="flex flex-col items-end">
                              {/* Color coded quantity */}
                              <span
                                className={
                                  item.quantity === 0
                                    ? "text-red-500"
                                    : item.quantity <= 5
                                    ? "text-yellow-500"
                                    : "text-green-600"
                                }
                              >
                                {item.quantity}
                              </span>

                              {/* Label tag based on quantity level */}
                              {item.quantity === 0 ? (
                                <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  Out of Stock
                                </span>
                              ) : item.quantity <= 5 ? (
                                <span className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Low Stock
                                </span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable stat card component for dashboard metrics
function StatCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow rounded-lg p-6 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:shadow-lg transition" : ""
      }`}
    >
      <p className="text-gray-600 text-sm">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
