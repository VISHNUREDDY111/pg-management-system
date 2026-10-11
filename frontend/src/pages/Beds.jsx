
import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY_FORM = {
  room: "",
  bed_number: "",
  status: "Available",
};

export default function Beds() {
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [bedResponse, roomResponse] = await Promise.all([
        api.get("beds/"),
        api.get("rooms/"),
      ]);

      const bedData = bedResponse.data;
      const roomData = roomResponse.data;

      setBeds(
        Array.isArray(bedData) ? bedData : bedData.results || []
      );
      setRooms(
        Array.isArray(roomData) ? roomData : roomData.results || []
      );
    } catch (err) {
      console.error(err);
      setError("Could not load beds and rooms. Check your Django API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addBed(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("beds/", {
        ...form,
        room: Number(form.room),
      });

      setForm(EMPTY_FORM);
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error("Bed creation error:", err.response?.data || err);
      setError(
        JSON.stringify(
          err.response?.data || "Could not create bed."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  const visibleBeds =
    filter === "All"
      ? beds
      : beds.filter((bed) => bed.status === filter);

  const count = (status) =>
    beds.filter((bed) => bed.status === status).length;

  function roomLabel(bed) {
    if (bed.room && typeof bed.room === "object") {
      return bed.room.room_number ?? `Room ${bed.room.id}`;
    }

    const room = rooms.find(
      (item) => String(item.id) === String(bed.room)
    );

    return room?.room_number ?? `Room ${bed.room}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Beds Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage beds and monitor availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
        >
          {showForm ? "Close Form" : "+ Add Bed"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Total Beds", beds.length],
          ["Available", count("Available")],
          ["Occupied", count("Occupied")],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={addBed}
          className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 sm:grid-cols-3"
        >
          <label className="text-sm font-medium text-gray-700">
            Room
            <select
              required
              value={form.room}
              onChange={(e) =>
                setForm({ ...form, room: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_number} — {room.floor}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Bed Number
            <input
              required
              value={form.bed_number}
              onChange={(e) =>
                setForm({ ...form, bed_number: e.target.value })
              }
              placeholder="e.g. 101-A"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>

          <button
            disabled={saving}
            className="rounded-lg bg-orange-600 px-4 py-2 text-white disabled:opacity-50 sm:col-span-3"
          >
            {saving ? "Saving..." : "Save Bed"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {["All", "Available", "Occupied", "Maintenance"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === status
                  ? "bg-orange-600 text-white"
                  : "border bg-white text-gray-700"
              }`}
            >
              {status}
            </button>
          )
        )}

        <button
          onClick={loadData}
          className="ml-auto rounded-lg border px-4 py-2 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        {loading ? (
          <p className="p-6 text-gray-500">Loading beds...</p>
        ) : visibleBeds.length === 0 ? (
          <p className="p-6 text-gray-500">
            No beds found for this filter.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Bed Number</th>
                <th className="p-4">Room</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visibleBeds.map((bed) => (
                <tr key={bed.id}>
                  <td className="p-4 font-medium">
                    {bed.bed_number}
                  </td>
                  <td className="p-4">{roomLabel(bed)}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        bed.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : bed.status === "Occupied"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {bed.status}
                    </span>
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
