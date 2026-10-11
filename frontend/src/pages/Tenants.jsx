
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    sharing: "2",
    rent: "8000",
    joining_date: new Date().toISOString().slice(0, 10),
    payment_status: "Pending",
    status: "Active",
  });

  async function loadTenants() {
    try {
      setLoading(true);
      const response = await api.get("tenants/");
      setTenants(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
      setError("");
    } catch {
      setError("Unable to load tenants.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenants();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSharingChange(event) {
    const sharing = event.target.value;
    const rents = {
      "1": "14000",
      "2": "8000",
      "3": "6000",
      "4": "5500",
    };

    setForm((previous) => ({
      ...previous,
      sharing,
      rent: rents[sharing],
    }));
  }

  async function createTenant(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        sharing: Number(form.sharing),
        rent: Number(form.rent),
        email: form.email || null,
        bed: null,
      };

      await api.post("tenants/", payload);

      setForm({
        name: "",
        phone: "",
        email: "",
        sharing: "2",
        rent: "8000",
        joining_date: new Date().toISOString().slice(0, 10),
        payment_status: "Pending",
        status: "Active",
      });

      await loadTenants();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to create tenant."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateTenant(tenant) {
    try {
      await api.patch(`tenants/${tenant.id}/`, {
        status: "Inactive",
      });
      await loadTenants();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to update tenant."
        )
      );
    }
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tenants</h1>
        <p className="text-gray-500">
          Manage residents at SLR Bliss PG
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 break-words">
          {error}
        </div>
      )}

      <form
        onSubmit={createTenant}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow"
      >
        <h2 className="text-lg font-semibold md:col-span-2">
          Register Tenant
        </h2>

        <input
          className="rounded-lg border p-3"
          name="name"
          placeholder="Full name"
          value={form.name}
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

        <input
          className="rounded-lg border p-3"
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
        />

        <select
          className="rounded-lg border p-3"
          name="sharing"
          value={form.sharing}
          onChange={handleSharingChange}
        >
          <option value="1">1 Sharing</option>
          <option value="2">2 Sharing</option>
          <option value="3">3 Sharing</option>
          <option value="4">4 Sharing</option>
        </select>

        <input
          className="rounded-lg border p-3"
          type="number"
          min="0"
          step="0.01"
          name="rent"
          value={form.rent}
          onChange={handleChange}
          required
        />

        <input
          className="rounded-lg border p-3"
          type="date"
          name="joining_date"
          value={form.joining_date}
          onChange={handleChange}
          required
        />

        <button
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Register Tenant"}
        </button>
      </form>

      <section className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          Tenant Records
        </h2>

        {loading ? (
          <p>Loading tenants...</p>
        ) : tenants.length === 0 ? (
          <p className="text-gray-500">No tenants registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Sharing</th>
                  <th className="p-3">Monthly Rent</th>
                  <th className="p-3">Joining Date</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b">
                    <td className="p-3">{tenant.name}</td>
                    <td className="p-3">{tenant.phone}</td>
                    <td className="p-3">{tenant.sharing}</td>
                    <td className="p-3">
                      ₹{Number(tenant.rent).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">{tenant.joining_date}</td>
                    <td className="p-3">{tenant.payment_status}</td>
                    <td className="p-3">{tenant.status}</td>
                    <td className="p-3">
                      {tenant.status === "Active" && (
                        <button
                          className="text-red-700"
                          onClick={() => deactivateTenant(tenant)}
                        >
                          Deactivate
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
