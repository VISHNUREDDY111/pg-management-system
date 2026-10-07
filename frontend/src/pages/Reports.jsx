import { useMemo, useState } from "react";

const monthlyRevenue = [
  { month: "May", revenue: 320000 },
  { month: "Jun", revenue: 355000 },
  { month: "Jul", revenue: 380000 },
  { month: "Aug", revenue: 395000 },
  { month: "Sep", revenue: 410000 },
  { month: "Oct", revenue: 425000 },
];

const occupancyData = [
  { month: "May", occupancy: 72 },
  { month: "Jun", occupancy: 76 },
  { month: "Jul", occupancy: 78 },
  { month: "Aug", occupancy: 80 },
  { month: "Sep", occupancy: 81 },
  { month: "Oct", occupancy: 82 },
];

const bookingData = [
  { month: "May", bookings: 18 },
  { month: "Jun", bookings: 22 },
  { month: "Jul", bookings: 25 },
  { month: "Aug", bookings: 28 },
  { month: "Sep", bookings: 31 },
  { month: "Oct", bookings: 35 },
];

const paymentSummary = [
  { label: "Paid", amount: 318000 },
  { label: "Pending", amount: 62000 },
  { label: "Overdue", amount: 45000 },
];

function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("October 2026");

  const currentRevenue = useMemo(() => {
    const selected = monthlyRevenue[monthlyRevenue.length - 1];
    return selected.revenue;
  }, []);

  const totalPayments = paymentSummary.reduce(
    (total, item) => total + item.amount,
    0
  );

  const paidPercentage = Math.round(
    (paymentSummary[0].amount / totalPayments) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze PG performance, revenue, occupancy and payments.
          </p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
        >
          <option>October 2026</option>
          <option>September 2026</option>
          <option>August 2026</option>
          <option>July 2026</option>
          <option>June 2026</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            ₹{currentRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="mt-2 text-sm text-green-600">
            ↑ 3.7% from last month
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Occupancy Rate</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">82%</h2>
          <p className="mt-2 text-sm text-green-600">
            ↑ 1% from last month
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">35</h2>
          <p className="mt-2 text-sm text-green-600">
            ↑ 12.9% from last month
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Tenants</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">82</h2>
          <p className="mt-2 text-sm text-gray-500">
            Out of 100 beds
          </p>
        </div>
      </div>

      {/* Revenue and Occupancy */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Monthly Revenue
            </h2>
            <p className="text-sm text-gray-500">
              Revenue collected over the last 6 months
            </p>
          </div>

          <div className="space-y-4">
            {monthlyRevenue.map((item) => {
              const width = (item.revenue / 450000) * 100;

              return (
                <div key={item.month}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {item.month}
                    </span>

                    <span className="text-gray-500">
                      ₹{item.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occupancy */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Occupancy Trend
            </h2>

            <p className="text-sm text-gray-500">
              Percentage of occupied beds
            </p>
          </div>

          <div className="space-y-4">
            {occupancyData.map((item) => (
              <div key={item.month}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.month}
                  </span>

                  <span className="text-gray-500">
                    {item.occupancy}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${item.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking + Payment */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Booking Trend */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">
            Booking Trend
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Number of bookings received
          </p>

          <div className="flex h-64 items-end justify-between gap-3">
            {bookingData.map((item) => {
              const height = (item.bookings / 40) * 100;

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs font-medium text-gray-600">
                    {item.bookings}
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-lg bg-indigo-500"
                    style={{ height: `${height}%` }}
                  />

                  <span className="mt-2 text-xs text-gray-500">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">
            Payment Summary
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Current payment collection status
          </p>

          <div className="space-y-5">
            {paymentSummary.map((item) => {
              const percentage = Math.round(
                (item.amount / totalPayments) * 100
              );

              return (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium text-gray-700">
                      {item.label}
                    </span>

                    <span className="font-medium text-gray-800">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        item.label === "Paid"
                          ? "bg-green-500"
                          : item.label === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-gray-500">
                    {percentage}%
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">
                Total Amount
              </span>

              <span className="font-bold text-gray-800">
                ₹{totalPayments.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span className="text-sm text-gray-500">
                Collection Rate
              </span>

              <span className="text-sm font-medium text-green-600">
                {paidPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Monthly Performance
          </h2>

          <p className="text-sm text-gray-500">
            Overall performance for {selectedMonth}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Total Beds
            </p>
            <p className="mt-1 text-xl font-bold text-gray-800">
              100
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Occupied Beds
            </p>
            <p className="mt-1 text-xl font-bold text-green-600">
              82
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Available Beds
            </p>
            <p className="mt-1 text-xl font-bold text-blue-600">
              18
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Open Complaints
            </p>
            <p className="mt-1 text-xl font-bold text-red-600">
              2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;