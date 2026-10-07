import { useMemo, useState } from "react";

const initialBookings = [
  {
    id: "BK001",
    tenantName: "Rahul Sharma",
    phone: "9876543210",
    room: "203",
    bed: "B2",
    sharing: "2 Sharing",
    bookingType: "Monthly",
    amount: 8000,
    paymentStatus: "Paid",
    status: "Approved",
    bookingDate: "05 Oct 2026",
  },
  {
    id: "BK002",
    tenantName: "Arjun Singh",
    phone: "9123456780",
    room: "105",
    bed: "B1",
    sharing: "1 Sharing",
    bookingType: "Monthly",
    amount: 14000,
    paymentStatus: "Pending",
    status: "Pending",
    bookingDate: "06 Oct 2026",
  },
  {
    id: "BK003",
    tenantName: "Kiran Kumar",
    phone: "9988776655",
    room: "201",
    bed: "B3",
    sharing: "3 Sharing",
    bookingType: "Daily",
    amount: 400,
    paymentStatus: "Paid",
    status: "Approved",
    bookingDate: "06 Oct 2026",
  },
  {
    id: "BK004",
    tenantName: "Suresh Reddy",
    phone: "9012345678",
    room: "",
    bed: "",
    sharing: "4 Sharing",
    bookingType: "Monthly",
    amount: 5500,
    paymentStatus: "Pending",
    status: "Pending",
    bookingDate: "06 Oct 2026",
  },
  {
    id: "BK005",
    tenantName: "Vamsi Krishna",
    phone: "9876501234",
    room: "",
    bed: "",
    sharing: "2 Sharing",
    bookingType: "Monthly",
    amount: 8000,
    paymentStatus: "Refunded",
    status: "Cancelled",
    bookingDate: "04 Oct 2026",
  },
];
const availableRooms = [
    {
      roomNumber: "101",
      sharing: "4 Sharing",
      beds: ["B1", "B4"],
    },
    {
      roomNumber: "102",
      sharing: "4 Sharing",
      beds: ["B2", "B4"],
    },
    {
      roomNumber: "201",
      sharing: "3 Sharing",
      beds: ["B3"],
    },
    {
      roomNumber: "202",
      sharing: "2 Sharing",
      beds: ["B1", "B2"],
    },
  ];

function getStatusStyle(status) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getPaymentStyle(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Refunded":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [assignment, setAssignment] = useState({
    room: "",
    bed: "",
    });
  const handleAssignRoom = (booking) => {
    setSelectedBooking(booking);
  
    setAssignment({
      room: "",
      bed: "",
    });
  
    setShowAssignModal(true);
  };
  const handleSaveAssignment = (e) => {
    e.preventDefault();
  
    if (!assignment.room || !assignment.bed) {
      alert("Please select both room and bed.");
      return;
    }
  
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? {
              ...booking,
              room: assignment.room,
              bed: assignment.bed,
            }
          : booking
      )
    );
  
    setShowAssignModal(false);
    setSelectedBooking(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.tenantName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "Approved"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const handleApprove = (bookingId) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "Approved",
            }
          : booking
      )
    );
  };

  const handleReject = (bookingId) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "Rejected",
            }
          : booking
      )
    );
  };

  const handleCancel = (bookingId) => {
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "Cancelled",
            }
          : booking
      )
    );
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bookings
          </h1>

          <p className="text-gray-500 mt-1">
            Manage PG booking requests and reservations.
          </p>
        </div>

        <button
          onClick={() => alert("New booking form will be added later.")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + New Booking
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Bookings
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {totalBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-2">
            {pendingBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Approved
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {approvedBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Cancelled
          </p>

          <h2 className="text-2xl font-bold text-gray-600 mt-2">
            {cancelledBookings}
          </h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search by tenant name or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Booking Requests
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">
                  Booking ID
                </th>

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
                  Amount
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

              {filteredBookings.map((booking) => (

                <tr
                  key={booking.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium text-blue-600">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">
                      {booking.tenantName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {booking.phone}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {booking.room ? (
                      <span>
                        {booking.room} / {booking.bed}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {booking.sharing}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStyle(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleViewDetails(booking)
                        }
                        className="px-3 py-1.5 border rounded-lg hover:bg-gray-100"
                      >
                        View
                      </button>

                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(booking.id)
                            }
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleReject(booking.id)
                            }
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* {booking.status === "Approved" && (
                        <button
                          onClick={() =>
                            handleCancel(booking.id)
                          }
                          className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                      )} */}
                      {booking.status === "Approved" && (
                            <>
                                {!booking.room && (
                                <button
                                    onClick={() => handleAssignRoom(booking)}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Assign Room
                                </button>
                                )}

                                <button
                                onClick={() => handleCancel(booking.id)}
                                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                                >
                                Cancel
                                </button>
                            </>
                            )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No bookings found.
            </div>
          )}

        </div>

      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Booking Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedBooking.id}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Tenant
                  </p>
                  <p className="font-medium">
                    {selectedBooking.tenantName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>
                  <p className="font-medium">
                    {selectedBooking.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Sharing
                  </p>
                  <p className="font-medium">
                    {selectedBooking.sharing}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Booking Type
                  </p>
                  <p className="font-medium">
                    {selectedBooking.bookingType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Room
                  </p>
                  <p className="font-medium">
                    {selectedBooking.room || "Not Assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Bed
                  </p>
                  <p className="font-medium">
                    {selectedBooking.bed || "Not Assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Amount
                  </p>
                  <p className="font-medium">
                    ₹{selectedBooking.amount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>
                  <p className="font-medium">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>

              </div>

              <div className="border-t pt-4">

                <p className="text-sm text-gray-500">
                  Booking Date
                </p>

                <p className="font-medium">
                  {selectedBooking.bookingDate}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-1">
                  Status
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>

              </div>

            </div>

            <div className="px-6 py-4 border-t flex justify-end">

              <button
                onClick={() => setShowDetails(false)}
                className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}
      
      {/* Assign Room Modal */}
{showAssignModal && selectedBooking && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

      <div className="flex items-center justify-between px-6 py-4 border-b">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Assign Room & Bed
          </h2>

          <p className="text-sm text-gray-500">
            {selectedBooking.tenantName} • {selectedBooking.id}
          </p>
        </div>

        <button
          onClick={() => setShowAssignModal(false)}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

      </div>

      <form
        onSubmit={handleSaveAssignment}
        className="p-6 space-y-5"
      >

        {/* Room */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Room
          </label>

          <select
            value={assignment.room}
            onChange={(e) =>
              setAssignment({
                room: e.target.value,
                bed: "",
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="">
              Select Room
            </option>

            {availableRooms
              .filter(
                (room) =>
                  room.sharing === selectedBooking.sharing
              )
              .map((room) => (
                <option
                  key={room.roomNumber}
                  value={room.roomNumber}
                >
                  Room {room.roomNumber} — {room.sharing}
                </option>
              ))}
          </select>
        </div>

        {/* Bed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bed
          </label>

          <select
            value={assignment.bed}
            onChange={(e) =>
              setAssignment({
                ...assignment,
                bed: e.target.value,
              })
            }
            disabled={!assignment.room}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-100"
          >
            <option value="">
              Select Bed
            </option>

            {availableRooms
              .find(
                (room) =>
                  room.roomNumber === assignment.room
              )
              ?.beds.map((bed) => (
                <option key={bed} value={bed}>
                  {bed}
                </option>
              ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3">

          <button
            type="button"
            onClick={() => setShowAssignModal(false)}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Assign Bed
          </button>

        </div>

      </form>

    </div>

  </div>
)}

    </div>
  );
}

export default Bookings;