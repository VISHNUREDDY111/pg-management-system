
import { useEffect, useState } from "react";
import api from "../services/api";

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
};

const initialForm = {
  tenant: "",
  bed: "",
  check_in_date: today(),
  expected_check_out: "",
  security_deposit: "0",
};

function getList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function CheckInOut() {
  const [records, setRecords] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [beds, setBeds] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [stayResponse, tenantResponse, bedResponse] =
        await Promise.all([
          api.get("check-in-out/"),
          api.get("tenants/"),
          api.get("beds/"),
        ]);

      setRecords(getList(stayResponse.data));
      setTenants(
        getList(tenantResponse.data).filter(
          (tenant) => tenant.status === "Active"
        )
      );
      setBeds(getList(bedResponse.data));
    } catch (err) {
      console.error("Check-in data error:", err);
      setError(
        "Could not load stays, tenants, or beds. Check that all three API endpoints are working."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableBeds = beds.filter(
    (bed) => bed.status === "Available"
  );

  const activeRecords = records.filter(
    (record) => record.status === "Checked In"
  );

  const completedRecords = records.filter(
    (record) => record.status === "Checked Out"
  );

  function bedLabel(bed) {
    const roomId =
      typeof bed.room === "object" ? bed.room?.id : bed.room;
    const room = beds.length
      ? bed.room?.room_number ??
        `Room ${
          typeof bed.room === "object"
            ? bed.room?.room_number ?? roomId
            : roomId
        }`
      : `Room ${roomId}`;

    return `${room} / Bed ${bed.bed_number}`;
  }

  function selectedTenant() {
    return tenants.find(
      (tenant) => String(tenant.id) === String(form.tenant)
    );
  }

  async function checkIn(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("check-in-out/", {
        tenant: Number(form.tenant),
        bed: Number(form.bed),
        check_in_date: form.check_in_date,
        expected_check_out: form.expected_check_out,
        security_deposit: Number(form.security_deposit),
        status: "Checked In",
      });

      setSuccess("Tenant checked in and bed assigned successfully.");
      setForm(initialForm);
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error(
        "Check-in error:",
        err.response?.data || err
      );

      const details = err.response?.data;
      setError(
        typeof details === "object"
          ? Object.entries(details)
              .map(([key, value]) => {
                const message = Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "string"
                  ? value
                  : JSON.stringify(value);
                return `${key}: ${message}`;
              })
              .join(" | ")
          : "Check-in failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function checkOut(record) {
    const confirmed = window.confirm(
      `Check out ${record.tenant_name || `tenant #${record.tenant}`}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await api.patch(`check-in-out/${record.id}/`, {
        status: "Checked Out",
        actual_check_out: today(),
      });

      setSuccess("Tenant checked out and bed released successfully.");
      await loadData();
    } catch (err) {
      console.error(
        "Checkout error:",
        err.response?.data || err
      );

      const details = err.response?.data;
      setError(
        typeof details === "object"
          ? Object.entries(details)
              .map(([key, value]) =>
                `${key}: ${
                  Array.isArray(value) ? value.join(", ") : JSON.stringify(value)
                }`
              )
              .join(" | ")
          : "Checkout failed. Please try again."
      );
    }
  }

  function tenantName(record) {
    if (record.tenant_name) return record.tenant_name;

    if (record.tenant && typeof record.tenant === "object") {
      return record.tenant.name || `Tenant #${record.tenant.id}`;
    }

    const tenant = tenants.find(
      (item) => String(item.id) === String(record.tenant)
    );

    return tenant?.name || `Tenant #${record.tenant}`;
  }

  function tenantBed(record) {
    const tenantId =
      typeof record.tenant === "object"
        ? record.tenant?.id
        : record.tenant;

    const tenant = tenants.find(
      (item) => String(item.id) === String(tenantId)
    );

    if (tenant?.bed && typeof tenant.bed === "object") {
      return `${tenant.bed.bed_number || ""}`;
    }

    const bed = beds.find(
      (item) =>
        tenant?.bed != null &&
        String(item.id) === String(tenant.bed)
    );

    return bed ? bedLabel(bed) : "See tenant record";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Check-In / Check-Out
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Assign beds and manage tenant stays.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
          className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700"
        >
          {showForm ? "Close Form" : "+ Check In Tenant"}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Active Stays", activeRecords.length],
          ["Available Beds", availableBeds.length],
          ["Completed Stays", completedRecords.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={checkIn}
          className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2"
        >
          <label className="text-sm font-medium text-gray-700">
            Tenant
            <select
              required
              value={form.tenant}
              onChange={(e) => setForm({ ...form, tenant: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Select tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} — {tenant.phone}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Available Bed
            <select
              required
              value={form.bed}
              onChange={(e) => setForm({ ...form, bed: e.target.value })}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Select available bed</option>
              {availableBeds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  {bedLabel(bed)}
                </option>
              ))}
            </select>
          </label>

          {selectedTenant() && (
            <p className="text-sm text-gray-500 sm:col-span-2">
              Tenant: {selectedTenant().name}
              {selectedTenant().bed
                ? " — already has a bed assigned; select another tenant."
                : ""}
            </p>
          )}

          <label className="text-sm font-medium text-gray-700">
            Check-In Date
            <input
              type="date"
              required
              value={form.check_in_date}
              onChange={(e) =>
                setForm({ ...form, check_in_date: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Expected Check-Out
            <input
              type="date"
              required
              min={form.check_in_date}
              value={form.expected_check_out}
              onChange={(e) =>
                setForm({ ...form, expected_check_out: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm font-medium text-gray-700 sm:col-span-2">
            Security Deposit (₹)
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.security_deposit}
              onChange={(e) =>
                setForm({ ...form, security_deposit: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <button
            type="submit"
            disabled={
              saving ||
              availableBeds.length === 0 ||
              !tenants.length ||
              Boolean(selectedTenant()?.bed)
            }
            className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white disabled:opacity-50 sm:col-span-2"
          >
            {saving ? "Processing..." : "Confirm Check-In"}
          </button>

          {availableBeds.length === 0 && (
            <p className="text-sm text-amber-700 sm:col-span-2">
              No available beds. Add a bed or complete a checkout first.
            </p>
          )}

          {tenants.length === 0 && (
            <p className="text-sm text-amber-700 sm:col-span-2">
              No active tenants found. Add or activate a tenant first.
            </p>
          )}
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold text-gray-900">Stay Records</h2>
          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-gray-500">No stay records found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Tenant</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Expected Checkout</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="p-4 font-medium">{tenantName(record)}</td>
                  <td className="p-4">{record.check_in_date}</td>
                  <td className="p-4">{record.expected_check_out}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        record.status === "Checked In"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {record.status === "Checked In" ? (
                      <button
                        onClick={() => checkOut(record)}
                        className="rounded-lg border border-orange-300 px-3 py-1.5 text-orange-700 hover:bg-orange-50"
                      >
                        Check Out
                      </button>
                    ) : (
                      <span className="text-gray-400">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
