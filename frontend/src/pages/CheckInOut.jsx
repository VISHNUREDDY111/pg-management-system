import { useMemo, useState } from "react";

const initialRecords = [
  {
    id: "CIO001",
    tenant: "Rahul Sharma",
    phone: "9876543210",
    room: "203",
    bed: "B2",
    sharing: "2 Sharing",
    checkInDate: "01 Oct 2026",
    expectedCheckOut: "30 Sep 2027",
    actualCheckOut: "",
    deposit: 8000,
    status: "Checked In",
  },
  {
    id: "CIO002",
    tenant: "Arjun Singh",
    phone: "9123456780",
    room: "105",
    bed: "B1",
    sharing: "1 Sharing",
    checkInDate: "03 Oct 2026",
    expectedCheckOut: "02 Oct 2027",
    actualCheckOut: "",
    deposit: 14000,
    status: "Checked In",
  },
  {
    id: "CIO003",
    tenant: "Kiran Kumar",
    phone: "9988776655",
    room: "201",
    bed: "B3",
    sharing: "3 Sharing",
    checkInDate: "15 Sep 2026",
    expectedCheckOut: "14 Sep 2027",
    actualCheckOut: "",
    deposit: 6000,
    status: "Checked In",
  },
  {
    id: "CIO004",
    tenant: "Vamsi Krishna",
    phone: "9876501234",
    room: "301",
    bed: "B3",
    sharing: "4 Sharing",
    checkInDate: "10 Jun 2026",
    expectedCheckOut: "09 Sep 2026",
    actualCheckOut: "09 Sep 2026",
    deposit: 5500,
    status: "Checked Out",
  },
];

function CheckInOut() {
  const [records, setRecords] = useState(initialRecords);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [formData, setFormData] = useState({
    tenant: "",
    phone: "",
    room: "",
    bed: "",
    sharing: "2 Sharing",
    checkInDate: "",
    expectedCheckOut: "",
    deposit: "",
  });

  const stats = useMemo(() => {
    return {
      total: records.length,
      checkedIn: records.filter(
        (record) => record.status === "Checked In"
      ).length,
      checkedOut: records.filter(
        (record) => record.status === "Checked Out"
      ).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.tenant.toLowerCase().includes(search.toLowerCase()) ||
        record.phone.includes(search) ||
        record.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();

    const newRecord = {
      id: `CIO${String(records.length + 1).padStart(3, "0")}`,
      tenant: formData.tenant,
      phone: formData.phone,
      room: formData.room,
      bed: formData.bed,
      sharing: formData.sharing,
      checkInDate: formData.checkInDate,
      expectedCheckOut: formData.expectedCheckOut,
      actualCheckOut: "",
      deposit: Number(formData.deposit) || 0,
      status: "Checked In",
    };

    setRecords((prev) => [newRecord, ...prev]);

    setFormData({
      tenant: "",
      phone: "",
      room: "",
      bed: "",
      sharing: "2 Sharing",
      checkInDate: "",
      expectedCheckOut: "",
      deposit: "",
    });

    setShowAddModal(false);
  };

  const handleCheckOut = (id) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "Checked Out",
              actualCheckOut: today,
            }
          : record
      )
    );

    setSelectedRecord(null);
    setShowDetailsModal(false);
  };

  const openDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const statusClass = (status) => {
    if (status === "Checked In") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Check-in / Check-out
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage tenant arrivals and departures.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          + Check-in Tenant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Records</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Currently Checked In</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {stats.checkedIn}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Checked Out</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-600">
            {stats.checkedOut}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search tenant, phone or record ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">Record</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Room / Bed</th>
                <th className="px-6 py-4">Check-in</th>
                <th className="px-6 py-4">Expected Checkout</th>
                <th className="px-6 py-4">Deposit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-gray-100 text-sm"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {record.id}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {record.tenant}
                    </p>
                    <p className="text-xs text-gray-500">{record.phone}</p>
                  </td>

                  <td className="px-6 py-4">
                    {record.room ? (
                      <>
                        <p className="font-medium text-gray-800">
                          Room {record.room}
                        </p>
                        <p className="text-xs text-gray-500">
                          Bed {record.bed}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {record.checkInDate}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {record.expectedCheckOut}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-700">
                    ₹{record.deposit.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDetails(record)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No check-in/check-out records found.
          </div>
        )}
      </div>

      {/* Add Check-in Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Check-in Tenant
              </h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddRecord}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="tenant"
                value={formData.tenant}
                onChange={handleInputChange}
                placeholder="Tenant Name"
                required
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              <input
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                placeholder="Room Number"
                required
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              <input
                name="bed"
                value={formData.bed}
                onChange={handleInputChange}
                placeholder="Bed Number"
                required
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              <select
                name="sharing"
                value={formData.sharing}
                onChange={handleInputChange}
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              >
                <option>1 Sharing</option>
                <option>2 Sharing</option>
                <option>3 Sharing</option>
                <option>4 Sharing</option>
              </select>

              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleInputChange}
                placeholder="Security Deposit"
                required
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Check-in Date
                </label>

                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">
                  Expected Check-out
                </label>

                <input
                  type="date"
                  name="expectedCheckOut"
                  value={formData.expectedCheckOut}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  Check-in Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Check-in / Check-out Details
              </h2>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Record ID</span>
                <span className="font-medium">{selectedRecord.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tenant</span>
                <span className="font-medium">
                  {selectedRecord.tenant}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span>{selectedRecord.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Room</span>
                <span>
                  {selectedRecord.room
                    ? `${selectedRecord.room} / ${selectedRecord.bed}`
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Sharing</span>
                <span>{selectedRecord.sharing}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span>{selectedRecord.checkInDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Expected Check-out
                </span>
                <span>{selectedRecord.expectedCheckOut}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Security Deposit</span>
                <span>
                  ₹{selectedRecord.deposit.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                    selectedRecord.status
                  )}`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              {selectedRecord.actualCheckOut && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Actual Check-out</span>
                  <span>{selectedRecord.actualCheckOut}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedRecord.status === "Checked In" && (
                <button
                  onClick={() => handleCheckOut(selectedRecord.id)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
                >
                  Check-out Tenant
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInOut;