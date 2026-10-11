
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    tenant: "",
    category: "Maintenance",
    title: "",
    description: "",
    priority: "Medium",
  });

  async function loadData() {
    try {
      setLoading(true);

      const [complaintResponse, tenantResponse] = await Promise.all([
        api.get("complaints/"),
        api.get("tenants/"),
      ]);

      setComplaints(
        Array.isArray(complaintResponse.data)
          ? complaintResponse.data
          : complaintResponse.data.results || []
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
          err.response?.data || "Unable to load complaints."
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
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function createComplaint(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("complaints/", {
        ...form,
        tenant: Number(form.tenant),
        complaint_id: `CMP-${Date.now()}`,
      });

      setForm({
        tenant: "",
        category: "Maintenance",
        title: "",
        description: "",
        priority: "Medium",
      });

      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to create complaint."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(complaint, status) {
    try {
      await api.patch(`complaints/${complaint.id}/`, { status });
      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to update complaint."
        )
      );
    }
  }

  const openCount = complaints.filter(
    (complaint) => complaint.status === "Open"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Complaints & Maintenance</h1>
        <p className="text-gray-500">
          Track tenant issues and maintenance requests
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 break-words">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Open</p>
          <h2 className="text-2xl font-bold">{openCount}</h2>
        </div>
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">In Progress</p>
          <h2 className="text-2xl font-bold">{inProgressCount}</h2>
        </div>
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-gray-500">Resolved</p>
          <h2 className="text-2xl font-bold">{resolvedCount}</h2>
        </div>
      </div>

      <form
        onSubmit={createComplaint}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow"
      >
        <h2 className="text-lg font-semibold md:col-span-2">
          Register Complaint
        </h2>

        <select
          className="rounded-lg border p-3"
          name="tenant"
          value={form.tenant}
          onChange={handleChange}
          required
        >
          <option value="">Select tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name} — {tenant.phone}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border p-3"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Maintenance">Maintenance</option>
          <option value="Food">Food</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Internet">Internet</option>
          <option value="Other">Other</option>
        </select>

        <input
          className="rounded-lg border p-3"
          name="title"
          placeholder="Complaint title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select
          className="rounded-lg border p-3"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <textarea
          className="rounded-lg border p-3 md:col-span-2"
          name="description"
          placeholder="Describe the issue"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
          type="submit"
          disabled={saving || tenants.length === 0}
        >
          {saving ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <section className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">Complaint Records</h2>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="text-gray-500">No complaints registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="p-3">ID</th>
                  <th className="p-3">Tenant</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b">
                    <td className="p-3">{complaint.complaint_id}</td>
                    <td className="p-3">
                      {tenants.find((tenant) => tenant.id === complaint.tenant)?.name
                        || `Tenant #${complaint.tenant}`}
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-gray-500">{complaint.description}</p>
                    </td>
                    <td className="p-3">{complaint.category}</td>
                    <td className="p-3">{complaint.priority}</td>
                    <td className="p-3">{complaint.status}</td>
                    <td className="p-3">
                      {complaint.status !== "Resolved" && (
                        <select
                          className="rounded border p-2"
                          value={complaint.status}
                          onChange={(event) =>
                            updateStatus(complaint, event.target.value)
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
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
