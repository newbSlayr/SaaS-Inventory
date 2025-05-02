"use client"; 

import { useEffect, useState } from 'react';
import { getLowStockItems } from '../api/inventory/getLowStockItems'; 
import { getInventoryAnalytics } from '../api/inventory/analytics'; 
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"; 
import { getForecastDetails } from "../utils/forecastHelpers"; 
import { useRouter } from "next/navigation"; 

// Define types for inventory items and analytics structure
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  costPrice: number;
  weeklyUsage?: number;
  lastUpdated?: { seconds: number };
}

interface AnalyticsData {
  totalItems: number;
  totalStock: number;
  categories: { [key: string]: number };
}

export default function ReportingDashboard() {
  // Chart colours
  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"];

  // State hooks
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(""); // Placeholder for future error handling
  const router = useRouter();

  // Load reporting data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch low stock data and analytics
        const lowStockData = await getLowStockItems();
        const analyticsData = await getInventoryAnalytics();

        // Set state
        setLowStockItems(lowStockData);
        setAnalytics(analyticsData);
      } catch {
        console.log("Failed to fetch reporting data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Navigation button */}
      <button
        onClick={() => router.back()}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded shadow hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8">📊 Inventory Reporting Dashboard</h1>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-gray-500 text-lg">
          Loading dashboard...
        </div>
      )}

      {/* Error state (placeholder) */}
      {!loading && error && (
        <div className="text-center text-red-500 text-lg">
          {error}
        </div>
      )}

      {/* Main dashboard content */}
      {!loading && !error && (
        <>
          {/* Analytics summary cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Items card */}
            <div
              onClick={() => router.push("/products")}
              className="bg-white rounded-xl shadow-md p-6 text-center space-y-2 hover:shadow-lg transition cursor-pointer"
            >
              <p className="text-gray-500">Total Items</p>
              <h2 className="text-3xl font-bold">{analytics?.totalItems}</h2>
            </div>

            {/* Total Stock card */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-2 hover:shadow-lg transition">
              <p className="text-gray-500">Total Stock</p>
              <h2 className="text-3xl font-bold">{analytics?.totalStock ?? 0}</h2>
            </div>

            {/* Total Categories card */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-2 hover:shadow-lg transition">
              <p className="text-gray-500">Categories</p>
              <h2 className="text-3xl font-bold">
                {Object.keys(analytics?.categories || {}).length}
              </h2>
            </div>
          </section>

          {/* Low stock items section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">🔔 Low Stock Items</h2>
            {lowStockItems.length === 0 ? (
              <p className="text-green-600 text-center py-4">
                ✅ All items are sufficiently stocked.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left text-gray-600">Item</th>
                      <th className="p-3 text-left text-gray-600">Quantity</th>
                      <th className="p-3 text-left text-gray-600">Category</th>
                      <th className="p-3 text-left text-gray-600">Weeks Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item, idx) => {
                      const forecast = getForecastDetails(item); // Calculate stock longevity
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">{item.category}</td>
                          <td className="p-3">{forecast.weeksLeft} week(s)</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Pie chart of items by category */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📈 Inventory by Category</h2>
            {analytics?.categories && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.categories).map(([key, value]) => ({
                        name: key,
                        value: Number(value) || 0,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#4f46e5"
                      label
                    >
                      {/* Color mapping for each slice */}
                      {Object.keys(analytics.categories).map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
