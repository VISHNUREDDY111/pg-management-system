
import { useEffect, useState } from "react";
import api from "../services/api";

const initialStats = {
  total_rooms: 0,
  occupied_rooms: 0,
  available_rooms: 0,
  total_tenants: 0,
  active_tenants: 0,
  total_bookings: 0,
  pending_bookings: 0,
  payments_collected: 0,
  payments_pending: 0,
  open_complaints: 0,
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setError("");
      const response = await api.get("dashboard/summary/");
      setStats({ ...initialStats, ...response.data });
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(
        "Unable to load dashboard statistics. Check that Django is running and the API endpoint is available."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Rooms",
      value: stats.total_rooms,
      subtitle: `${stats.available_rooms} available`,
    },
    {
      title: "Occupied Rooms",
      value: stats.occupied_rooms,
      subtitle: "Currently occupied",
    },
    {
      title: "Total Tenants",
      value: stats.total_tenants,
      subtitle: `${stats.active_tenants} active`,
    },
    {
      title: "Total Bookings",
      value: stats.total_bookings,
      subtitle: `${stats.pending_bookings} pending`,
    },
    {
      title: "Payments Collected",
      value: formatCurrency(stats.payments_collected),
      subtitle: "Recorded as paid",
    },
    {
      title: "Payments Pending",
      value: formatCurrency(stats.payments_pending),
      subtitle: "Recorded as pending",
    },
    {
      title: "Open Complaints",
      value: stats.open_complaints,
      subtitle: "Require attention",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            SLR Bliss PG — management overview
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            onClick={fetchDashboard}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && !error ? (
        <p className="py-8 text-center text-gray-500">
          Loading dashboard statistics...
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
