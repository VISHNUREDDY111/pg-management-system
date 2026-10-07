import { useMemo, useState } from "react";

const initialTenants = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
    room: "203",
    bed: "B2",
    sharing: "2 Sharing",
    rent: 8000,
    joiningDate: "01 Oct 2026",
    paymentStatus: "Paid",
    status: "Active",
  },
  {
    id: 2,
    name: "Arjun Singh",
    phone: "9123456780",
    email: "arjun@gmail.com",
    room: "105",
    bed: "B1",
    sharing: "1 Sharing",
    rent: 14000,
    joiningDate: "03 Oct 2026",
    paymentStatus: "Pending",
    status: "Active",
  },
  {
    id: 3,
    name: "Kiran Kumar",
    phone: "9988776655",
    email: "kiran@gmail.com",
    room: "201",
    bed: "B3",
    sharing: "3 Sharing",
    rent: 6000,
    joiningDate: "15 Sep 2026",
    paymentStatus: "Paid",
    status: "Active",
  },
  {
    id: 4,
    name: "Suresh Reddy",
    phone: "9012345678",
    email: "suresh@gmail.com",
    room: "102",
    bed: "B1",
    sharing: "4 Sharing",
    rent: 5500,
    joiningDate: "20 Aug 2026",
    paymentStatus: "Overdue",
    status: "Active",
  },
  {
    id: 5,
    name: "Vamsi Krishna",
    phone: "9876501234",
    email: "vamsi@gmail.com",
    room: "301",
    bed: "B3",
    sharing: "4 Sharing",
    rent: 5500,
    joiningDate: "10 Jun 2026",
    paymentStatus: "Paid",
    status: "Inactive",
  },
];

function getPaymentStyle(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Overdue":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getTenantStatusStyle(status) {
  return status === "Active"
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-700";
}

function Tenants() {
  const [tenants, setTenants] = useState(initialTenants);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState(null);

  const [newTenant, setNewTenant] = useState({
    name: "",
    phone: "",
    email: "",
    room: "",
    bed: "",
    sharing: "4 Sharing",
    rent: "",
    joiningDate: "",
    paymentStatus: "Pending",
  });

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        tenant.name.toLowerCase().includes(searchValue) ||
        tenant.phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        tenant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tenants, search, statusFilter]);

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "Active"
  ).length;

  const inactiveTenants = tenants.filter(
    (tenant) => tenant.status === "Inactive"
  ).length;

  const pendingPayments = tenants.filter(
    (tenant) =>
      tenant.paymentStatus === "Pending" ||
      tenant.paymentStatus === "Overdue"
  ).length;

  const totalMonthlyRent = tenants
    .filter((tenant) => tenant.status === "Active")
    .reduce((total, tenant) => total + Number(tenant.rent), 0);

  const handleAddTenant = (e) => {
    e.preventDefault();

    if (
      !newTenant.name.trim() ||
      !newTenant.phone.trim() ||
      !newTenant.room.trim() ||
      !newTenant.bed.trim() ||
      !newTenant.rent
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const tenant = {
      id: Date.now(),
      name: newTenant.name.trim(),
      phone: newTenant.phone.trim(),
      email: newTenant.email.trim(),
      room: newTenant.room.trim(),
      bed: newTenant.bed.trim(),
      sharing: newTenant.sharing,
      rent: Number(newTenant.rent),
      joiningDate:
        newTenant.joiningDate || "Not Provided",
      paymentStatus: newTenant.paymentStatus,
      status: "Active",
    };

    setTenants((previousTenants) => [
      ...previousTenants,
      tenant,
    ]);

    setNewTenant({
      name: "",
      phone: "",
      email: "",
      room: "",
      bed: "",
      sharing: "4 Sharing",
      rent: "",
      joiningDate: "",
      paymentStatus: "Pending",
    });

    setShowAddModal(false);
  };

  const handleToggleStatus = (tenantId) => {
    setTenants((previousTenants) =>
      previousTenants.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              status:
                tenant.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : tenant
      )
    );
  };

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tenants
          </h1>

          <p className="text-gray-500 mt-1">
            Manage tenant profiles, rooms, rent and payment status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Tenant
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Tenants
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {tenants.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Active Tenants
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {activeTenants}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Inactive Tenants
          </p>

          <h2 className="text-2xl font-bold text-gray-600 mt-2">
            {inactiveTenants}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Active Monthly Rent
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            ₹{totalMonthlyRent.toLocaleString("en-IN")}
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            {pendingPayments} pending/overdue
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by tenant name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="All">All Tenants</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

      </div>

      {/* Tenant Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Tenant List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3">
                  Tenant
                </th>

                <th className="text-left px-5 py-3">
                  Room / Bed
                </th>

                <th className="text-left px-5 py-3">
                  Sharing
                </th>

                <th className="text-left px-5 py-3">
                  Monthly Rent
                </th>

                <th className="text-left px-5 py-3">
                  Payment
                </th>

                <th className="text-left px-5 py-3">
                  Status
                </th>

                <th className="text-left px-5 py-3">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTenants.map((tenant) => (

                <tr
                  key={tenant.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium text-gray-800">
                      {tenant.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {tenant.phone}
                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {tenant.room} / {tenant.bed}
                  </td>

                  <td className="px-5 py-4">
                    {tenant.sharing}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ₹{tenant.rent.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStyle(
                        tenant.paymentStatus
                      )}`}
                    >
                      {tenant.paymentStatus}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTenantStatusStyle(
                        tenant.status
                      )}`}
                    >
                      {tenant.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleViewDetails(tenant)
                        }
                        className="px-3 py-1.5 border rounded-lg hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleToggleStatus(tenant.id)
                        }
                        className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                      >
                        {tenant.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredTenants.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No tenants found.
            </div>
          )}

        </div>

      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add Tenant
                </h2>

                <p className="text-sm text-gray-500">
                  Create a new tenant profile.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleAddTenant}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    value={newTenant.name}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        name: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter tenant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    value={newTenant.phone}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={newTenant.email}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        email: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Joining Date
                  </label>

                  <input
                    type="date"
                    value={newTenant.joiningDate}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        joiningDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room *
                  </label>

                  <input
                    type="text"
                    value={newTenant.room}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        room: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Example: 203"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bed *
                  </label>

                  <input
                    type="text"
                    value={newTenant.bed}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        bed: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Example: B2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sharing
                  </label>

                  <select
                    value={newTenant.sharing}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        sharing: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                  >
                    <option>1 Sharing</option>
                    <option>2 Sharing</option>
                    <option>3 Sharing</option>
                    <option>4 Sharing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Rent *
                  </label>

                  <input
                    type="number"
                    value={newTenant.rent}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        rent: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter rent amount"
                  />
                </div>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Payment Status
                </label>

                <select
                  value={newTenant.paymentStatus}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      paymentStatus: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Tenant
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Tenant Details Modal */}
      {showDetailsModal && selectedTenant && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tenant Details
                </h2>

                <p className="text-sm text-gray-500">
                  Tenant ID: {selectedTenant.id}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowDetailsModal(false)
                }
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Name
                  </p>
                  <p className="font-medium">
                    {selectedTenant.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>
                  <p className="font-medium">
                    {selectedTenant.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>
                  <p className="font-medium">
                    {selectedTenant.email || "Not Provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Joining Date
                  </p>
                  <p className="font-medium">
                    {selectedTenant.joiningDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Room
                  </p>
                  <p className="font-medium">
                    {selectedTenant.room}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Bed
                  </p>
                  <p className="font-medium">
                    {selectedTenant.bed}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Sharing
                  </p>
                  <p className="font-medium">
                    {selectedTenant.sharing}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Monthly Rent
                  </p>
                  <p className="font-medium">
                    ₹{selectedTenant.rent.toLocaleString("en-IN")}
                  </p>
                </div>

              </div>

              <div className="border-t pt-4">

                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPaymentStyle(
                    selectedTenant.paymentStatus
                  )}`}
                >
                  {selectedTenant.paymentStatus}
                </span>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Tenant Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getTenantStatusStyle(
                    selectedTenant.status
                  )}`}
                >
                  {selectedTenant.status}
                </span>

              </div>

            </div>

            <div className="px-6 py-4 border-t flex justify-end">

              <button
                onClick={() =>
                  setShowDetailsModal(false)
                }
                className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Tenants;