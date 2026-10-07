import { useMemo, useState } from "react";

const initialComplaints = [
  {
    id: "CMP001",
    tenant: "Rahul Sharma",
    phone: "9876543210",
    room: "203",
    category: "Maintenance",
    title: "AC not working",
    description: "The AC in the room is not cooling properly.",
    priority: "High",
    status: "Open",
    date: "06 Oct 2026",
  },
  {
    id: "CMP002",
    tenant: "Arjun Singh",
    phone: "9123456780",
    room: "105",
    category: "Food",
    title: "Food quality issue",
    description: "Food quality was not good during dinner.",
    priority: "Medium",
    status: "In Progress",
    date: "05 Oct 2026",
  },
  {
    id: "CMP003",
    tenant: "Kiran Kumar",
    phone: "9988776655",
    room: "201",
    category: "Cleaning",
    title: "Room cleaning required",
    description: "Room cleaning has not been done today.",
    priority: "Low",
    status: "Resolved",
    date: "04 Oct 2026",
  },
  {
    id: "CMP004",
    tenant: "Suresh Reddy",
    phone: "9012345678",
    room: "102",
    category: "Electricity",
    title: "Power issue",
    description: "Power socket near the bed is not working.",
    priority: "High",
    status: "Open",
    date: "06 Oct 2026",
  },
];

function getPriorityStyle(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-700";

    case "In Progress":
      return "bg-yellow-100 text-yellow-700";

    case "Resolved":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Complaints() {
  const [complaints, setComplaints] =
    useState(initialComplaints);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [newComplaint, setNewComplaint] = useState({
    tenant: "",
    phone: "",
    room: "",
    category: "Maintenance",
    title: "",
    description: "",
    priority: "Medium",
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        complaint.tenant
          .toLowerCase()
          .includes(searchValue) ||
        complaint.id
          .toLowerCase()
          .includes(searchValue) ||
        complaint.title
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
  ]);

  const totalComplaints = complaints.length;

  const openComplaints = complaints.filter(
    (complaint) => complaint.status === "Open"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const handleAddComplaint = (e) => {
    e.preventDefault();

    if (
      !newComplaint.tenant.trim() ||
      !newComplaint.room.trim() ||
      !newComplaint.title.trim() ||
      !newComplaint.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const complaint = {
      id: `CMP${String(complaints.length + 1).padStart(
        3,
        "0"
      )}`,
      tenant: newComplaint.tenant.trim(),
      phone: newComplaint.phone.trim(),
      room: newComplaint.room.trim(),
      category: newComplaint.category,
      title: newComplaint.title.trim(),
      description: newComplaint.description.trim(),
      priority: newComplaint.priority,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setComplaints((previousComplaints) => [
      complaint,
      ...previousComplaints,
    ]);

    setNewComplaint({
      tenant: "",
      phone: "",
      room: "",
      category: "Maintenance",
      title: "",
      description: "",
      priority: "Medium",
    });

    setShowAddModal(false);
  };

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints((previousComplaints) =>
      previousComplaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              status: newStatus,
            }
          : complaint
      )
    );

    setSelectedComplaint((previous) =>
      previous
        ? {
            ...previous,
            status: newStatus,
          }
        : previous
    );
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Complaints
          </h1>

          <p className="text-gray-500 mt-1">
            Manage tenant complaints and track their resolution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Complaint
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Complaints
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {totalComplaints}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Open
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {openComplaints}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-2">
            {inProgressComplaints}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {resolvedComplaints}
          </h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search complaint, tenant or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

        </div>

      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Complaint List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3">
                  ID
                </th>

                <th className="text-left px-5 py-3">
                  Tenant
                </th>

                <th className="text-left px-5 py-3">
                  Room
                </th>

                <th className="text-left px-5 py-3">
                  Category
                </th>

                <th className="text-left px-5 py-3">
                  Complaint
                </th>

                <th className="text-left px-5 py-3">
                  Priority
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

              {filteredComplaints.map((complaint) => (

                <tr
                  key={complaint.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium text-blue-600">
                    {complaint.id}
                  </td>

                  <td className="px-5 py-4">

                    <div className="font-medium text-gray-800">
                      {complaint.tenant}
                    </div>

                    <div className="text-xs text-gray-500">
                      {complaint.phone}
                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {complaint.room}
                  </td>

                  <td className="px-5 py-4">
                    {complaint.category}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">
                      {complaint.title}
                    </div>

                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {complaint.description}
                    </div>
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <button
                      onClick={() =>
                        handleViewDetails(complaint)
                      }
                      className="px-3 py-1.5 border rounded-lg hover:bg-gray-100"
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No complaints found.
            </div>
          )}

        </div>

      </div>

      {/* Add Complaint Modal */}
      {showAddModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add Complaint
                </h2>

                <p className="text-sm text-gray-500">
                  Create a new tenant complaint.
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
              onSubmit={handleAddComplaint}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tenant Name *
                  </label>

                  <input
                    type="text"
                    value={newComplaint.tenant}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        tenant: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter tenant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={newComplaint.phone}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Enter phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room *
                  </label>

                  <input
                    type="text"
                    value={newComplaint.room}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        room: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Example: 203"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <select
                    value={newComplaint.category}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        category: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                  >
                    <option>Maintenance</option>
                    <option>Food</option>
                    <option>Cleaning</option>
                    <option>Electricity</option>
                    <option>Water</option>
                    <option>Internet</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>

                  <select
                    value={newComplaint.priority}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        priority: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complaint Title *
                  </label>

                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5"
                    placeholder="Example: AC not working"
                  />
                </div>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>

                <textarea
                  rows="4"
                  value={newComplaint.description}
                  onChange={(e) =>
                    setNewComplaint({
                      ...newComplaint,
                      description: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5 resize-none"
                  placeholder="Describe the complaint..."
                />

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
                  Add Complaint
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Complaint Details Modal */}
      {showDetailsModal && selectedComplaint && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Complaint Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedComplaint.id}
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

            <div className="p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Tenant
                  </p>

                  <p className="font-medium">
                    {selectedComplaint.tenant}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {selectedComplaint.phone || "Not Provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Room
                  </p>

                  <p className="font-medium">
                    {selectedComplaint.room}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Category
                  </p>

                  <p className="font-medium">
                    {selectedComplaint.category}
                  </p>
                </div>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Complaint
                </p>

                <p className="font-semibold mt-1">
                  {selectedComplaint.title}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  {selectedComplaint.description}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Priority
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority}
                  </span>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-medium mt-1">
                    {selectedComplaint.date}
                  </p>

                </div>

              </div>

              <div>

                <label className="block text-sm text-gray-500 mb-2">
                  Update Status
                </label>

                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedComplaint.id,
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>

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

export default Complaints;