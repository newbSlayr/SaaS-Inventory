// Utility function to estimate how long an inventory item will last
// Returns: estimated weeks left based on usage, and how recently the item was updated

export function getForecastDetails(item: {
  quantity: number;
  weeklyUsage?: number;
  lastUpdated?: { seconds?: number };
}) {
  // Use provided weeklyUsage or default to 1 to avoid division by zero
  const weeklyUsage = item.weeklyUsage || 1;

  // Use provided quantity or default to 0
  const quantity = item.quantity || 0;

  // Calculate weeks left until stock runs out
  const weeksLeft = Math.ceil(quantity / weeklyUsage);

  // Default fallback if no timestamp is available
  let daysSinceUpdate: string = "Unknown";

  // If a valid lastUpdated timestamp exists, calculate how long ago it was
  if (item.lastUpdated?.seconds) {
    const now = new Date(); // Current time
    const last = new Date(item.lastUpdated.seconds * 1000); // Convert from Firestore timestamp (seconds → ms)
    const diff = now.getTime() - last.getTime(); // Time difference in milliseconds

    // Convert time difference to days and hours
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    // Format as human-readable output
    daysSinceUpdate = days > 0
      ? `${days} day(s) ago`
      : `${hours} hour(s) ago`;
  }

  // Return calculated data
  return {
    weeksLeft,         // Estimated time until stock depletion
    daysSinceUpdate,   // Time since the item was last updated
  };
}
