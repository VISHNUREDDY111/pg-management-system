
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    room_number: "",
    floor: "Ground Floor",
    sharing: "2",
    status: "Available",
  });

  async function loadRooms() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("rooms/");
      const data = response.data;
      setRooms(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      setError("Could not load rooms. Check the Django API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function addRoom(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("rooms/", {
        ...form,
        sharing: Number(form.sharing),
      });

      setForm({
        room_number: "",
        floor: "Ground",
        sharing: "2",
        status: "Available",
      });

      setShowForm(false);
      await loadRooms();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Could not add room. Check the backend API."
      );
    } finally {
      setSaving(false);
    }
  }

  const available = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const occupied = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const maintenance = rooms.filter(
    (room) => room.status === "Maintenance"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rooms & Beds
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage rooms and monitor availability.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700"
        >
          {showForm ? "Close Form" : "+ Add Room"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Rooms", rooms.length],
          ["Available", available],
          ["Occupied", occupied],
          ["Maintenance", maintenance],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
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
          onSubmit={addRoom}
          className="grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <label className="text-sm font-medium text-gray-700">
            Room Number
            <input
              required
              value={form.room_number}
              onChange={(e) =>
                setForm({ ...form, room_number: e.target.value })
              }
              placeholder="e.g. 101"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Floor
            <select
              value={form.floor}
              onChange={(e) =>
                setForm({ ...form, floor: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            >
              {["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"].map((floor) => (
                <option key={floor} value={floor}>{floor}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Sharing Capacity
            <select
              value={form.sharing}
              onChange={(e) =>
                setForm({ ...form, sharing: e.target.value })
              }
              className="mt-1 w-full rounded-lg border p-2"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}-sharing</option>
              ))}
            </select>
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
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>

          <button
            disabled={saving}
            className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white disabled:opacity-50 sm:col-span-2 lg:col-span-4"
          >
            {saving ? "Saving..." : "Save Room"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <p className="p-6 text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="p-6 text-gray-500">
            No rooms found. Add your first room above.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Room</th>
                <th className="p-4">Floor</th>
                <th className="p-4">Sharing</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="p-4 font-medium">
                    {room.room_number}
                  </td>
                  <td className="p-4">{room.floor}</td>
                  <td className="p-4">{room.sharing}-sharing</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        room.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : room.status === "Occupied"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={loadRooms}
        disabled={loading}
        className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Refresh Rooms
      </button>
    </div>
  );
}
