
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    tenant_name: "",
    phone: "",
    sharing: "2",
    booking_type: "Monthly",
    amount: "8000",
    payment_status: "Pending",
    status: "Pending",
  });

  async function loadBookings() {
    try {
      setLoading(true);
      const response = await api.get("bookings/");
      setBookings(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
      setError("");
    } catch (err) {
      setError("Could not load bookings. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function createBooking(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        booking_id: `BK-${Date.now()}`,
        sharing: Number(form.sharing),
        amount: Number(form.amount),
        bed: null,
      };

      await api.post("bookings/", payload);

      setForm({
        tenant_name: "",
        phone: "",
        sharing: "2",
        booking_type: "Monthly",
        amount: "8000",
        payment_status: "Pending",
        status: "Pending",
      });

      await loadBookings();
    } catch (err) {
      const details = err.response?.data;
      setError(
        details
          ? JSON.stringify(details)
          : "Unable to create booking. Check your connection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(booking, status) {
    try {
      await api.patch(`bookings/${booking.id}/`, { status });
      await loadBookings();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Could not update booking."
        )
      );
    }
  }

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-gray-500">
          Manage SLR Bliss PG reservations
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 break-words">
          {error}
        </div>
      )}

      <form
        onSubmit={createBooking}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow"
      >
        <h2 className="text-lg font-semibold md:col-span-2">
          Create Booking
        </h2>

        <input
          className="rounded-lg border p-3"
          name="tenant_name"
          placeholder="Tenant full name"
          value={form.tenant_name}
          onChange={handleChange}
          required
        />

        <input
          className="rounded-lg border p-3"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <select
          className="rounded-lg border p-3"
          name="sharing"
          value={form.sharing}
          onChange={(event) => {
            const sharing = event.target.value;
            const monthlyRents = {
              "1": "14000",
              "2": "8000",
              "3": "6000",
              "4": "5500",
            };
            const dailyRents = {
              "1": "800",
              "2": "500",
              "3": "400",
              "4": "350",
            };

            setForm((previous) => ({
              ...previous,
              sharing,
              amount:
                previous.booking_type === "Daily"
                  ? dailyRents[sharing]
                  : monthlyRents[sharing],
            }));
          }}
        >
          <option value="1">1 Sharing</option>
          <option value="2">2 Sharing</option>
          <option value="3">3 Sharing</option>
          <option value="4">4 Sharing</option>
        </select>

        <select
          className="rounded-lg border p-3"
          name="booking_type"
          value={form.booking_type}
          onChange={(event) => {
            const booking_type = event.target.value;
            const rents =
              booking_type === "Daily"
                ? { "1": "800", "2": "500", "3": "400", "4": "350" }
                : { "1": "14000", "2": "8000", "3": "6000", "4": "5500" };

            setForm((previous) => ({
              ...previous,
              booking_type,
              amount: rents[previous.sharing],
            }));
          }}
        >
          <option value="Monthly">Monthly</option>
          <option value="Daily">Daily</option>
        </select>

        <input
          className="rounded-lg border p-3"
          type="number"
          min="0.01"
          step="0.01"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <button
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Create Booking"}
        </button>
      </form>

      <section className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          Booking Records
        </h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Tenant</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-3">{booking.booking_id}</td>
                    <td className="p-3">{booking.tenant_name}</td>
                    <td className="p-3">{booking.phone}</td>
                    <td className="p-3">{booking.booking_type}</td>
                    <td className="p-3">
                      ₹{Number(booking.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">{booking.status}</td>
                    <td className="p-3">
                      {booking.status === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            className="text-green-700"
                            onClick={() => updateStatus(booking, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-700"
                            onClick={() => updateStatus(booking, "Cancelled")}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}