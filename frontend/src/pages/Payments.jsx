
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    tenant: "",
    amount: "",
    due_date: new Date().toISOString().slice(0, 10),
    paid_date: "",
    payment_method: "UPI",
    status: "Paid",
    month: new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
  });

  async function loadData() {
    try {
      setLoading(true);
      const [paymentResponse, tenantResponse] = await Promise.all([
        api.get("payments/"),
        api.get("tenants/"),
      ]);

      setPayments(
        Array.isArray(paymentResponse.data)
          ? paymentResponse.data
          : paymentResponse.data.results || []
      );

      setTenants(
        Array.isArray(tenantResponse.data)
          ? tenantResponse.data
          : tenantResponse.data.results || []
      );

      setError("");
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to load payments or tenants."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "status" && value === "Paid" && !next.paid_date) {
        next.paid_date = new Date().toISOString().slice(0, 10);
      }

      if (name === "status" && value !== "Paid") {
        next.paid_date = "";
      }

      return next;
    });
  }

  async function createPayment(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        payment_id: `PAY-${Date.now()}`,
        tenant: Number(form.tenant),
        amount: Number(form.amount),
        paid_date: form.paid_date || null,
        payment_method: form.payment_method || null,
      };

      await api.post("payments/", payload);

      setForm((previous) => ({
        ...previous,
        tenant: "",
        amount: "",
        paid_date: "",
      }));

      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to save payment."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function updatePaymentStatus(payment, status) {
    try {
      await api.patch(`payments/${payment.id}/`, {
        status,
        paid_date:
          status === "Paid"
            ? new Date().toISOString().slice(0, 10)
            : null,
      });

      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to update payment."
        )
      );
    }
  }

  const totalCollected = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const totalPending = payments
    .filter((payment) =>
      ["Pending", "Overdue"].includes(payment.status)
    )
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Payments & Rent</h1>
        <p className="text-gray-500">
          Track tenant rent and payment records
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 break-words">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Recorded Payments Collected</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            ₹{totalCollected.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Pending / Overdue</p>
          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            ₹{totalPending.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <form
        onSubmit={createPayment}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow"
      >
        <h2 className="text-lg font-semibold md:col-span-2">
          Record Payment
        </h2>

        <select
          className="rounded-lg border p-3"
          name="tenant"
          value={form.tenant}
          onChange={handleChange}
          required
        >
          <option value="">Select tenant</option>
          {tenants
            .filter((tenant) => tenant.status === "Active")
            .map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} — {tenant.phone}
              </option>
            ))}
        </select>

        <input
          className="rounded-lg border p-3"
          type="number"
          min="0.01"
          step="0.01"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          className="rounded-lg border p-3"
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          required
        />

        <input
          className="rounded-lg border p-3"
          name="month"
          placeholder="Billing month"
          value={form.month}
          onChange={handleChange}
          required
        />

        <select
          className="rounded-lg border p-3"
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
        >
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>

        <select
          className="rounded-lg border p-3"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <button
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
          type="submit"
          disabled={saving || tenants.filter((t) => t.status === "Active").length === 0}
        >
          {saving ? "Saving..." : "Save Payment"}
        </button>
      </form>

      <section className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">Payment History</h2>

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">No payment records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Tenant</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-3">{payment.payment_id}</td>
                    <td className="p-3">
                      {tenants.find((t) => t.id === payment.tenant)?.name
                        || `Tenant #${payment.tenant}`}
                    </td>
                    <td className="p-3">{payment.month}</td>
                    <td className="p-3">
                      ₹{Number(payment.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">{payment.payment_method || "—"}</td>
                    <td className="p-3">{payment.due_date}</td>
                    <td className="p-3">{payment.status}</td>
                    <td className="p-3">
                      {payment.status !== "Paid" &&
                        payment.status !== "Refunded" && (
                          <button
                            className="text-green-700"
                            onClick={() =>
                              updatePaymentStatus(payment, "Paid")
                            }
                          >
                            Mark Paid
                          </button>
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
