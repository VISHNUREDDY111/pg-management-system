import { useState } from "react";

const initialRooms = [
  {
    id: 1,
    roomNumber: "101",
    floor: "Ground Floor",
    sharing: "4 Sharing",
    status: "Available",
    beds: [
      { id: "B1", status: "Available" },
      { id: "B2", status: "Occupied" },
      { id: "B3", status: "Occupied" },
      { id: "B4", status: "Available" },
    ],
  },
  {
    id: 2,
    roomNumber: "102",
    floor: "Ground Floor",
    sharing: "4 Sharing",
    status: "Occupied",
    beds: [
      { id: "B1", status: "Occupied" },
      { id: "B2", status: "Available" },
      { id: "B3", status: "Maintenance" },
      { id: "B4", status: "Available" },
    ],
  },
  {
    id: 3,
    roomNumber: "201",
    floor: "1st Floor",
    sharing: "3 Sharing",
    status: "Occupied",
    beds: [
      { id: "B1", status: "Occupied" },
      { id: "B2", status: "Occupied" },
      { id: "B3", status: "Available" },
    ],
  },
  {
    id: 4,
    roomNumber: "202",
    floor: "1st Floor",
    sharing: "2 Sharing",
    status: "Available",
    beds: [
      { id: "B1", status: "Available" },
      { id: "B2", status: "Available" },
    ],
  },
  {
    id: 5,
    roomNumber: "301",
    floor: "2nd Floor",
    sharing: "4 Sharing",
    status: "Maintenance",
    beds: [
      { id: "B1", status: "Maintenance" },
      { id: "B2", status: "Maintenance" },
      { id: "B3", status: "Available" },
      { id: "B4", status: "Available" },
    ],
  },
];

function getBedStyle(status) {
  switch (status) {
    case "Available":
      return "bg-green-50 border-green-200 text-green-700";

    case "Occupied":
      return "bg-red-50 border-red-200 text-red-700";

    case "Maintenance":
      return "bg-yellow-50 border-yellow-200 text-yellow-700";

    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";

    case "Occupied":
      return "bg-red-100 text-red-700";

    case "Maintenance":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Rooms() {
  const [rooms, setRooms] = useState(initialRooms);

  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add room modal
  const [showAddRoom, setShowAddRoom] = useState(false);

  // Edit room modal
  const [showEditRoom, setShowEditRoom] = useState(false);

  // Bed status modal
  const [showBedModal, setShowBedModal] = useState(false);

  // Selected room
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Selected bed
  const [selectedBed, setSelectedBed] = useState(null);

  // Add room form
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    floor: "Ground Floor",
    sharing: "4 Sharing",
    beds: 4,
  });

  // Edit room form
  const [editRoom, setEditRoom] = useState({
    roomNumber: "",
    floor: "",
    sharing: "",
    beds: 4,
  });

  // -----------------------------
  // Statistics
  // -----------------------------

  const totalRooms = rooms.length;

  const totalBeds = rooms.reduce(
    (total, room) => total + room.beds.length,
    0
  );

  const occupiedBeds = rooms.reduce(
    (total, room) =>
      total +
      room.beds.filter((bed) => bed.status === "Occupied").length,
    0
  );

  const availableBeds = rooms.reduce(
    (total, room) =>
      total +
      room.beds.filter((bed) => bed.status === "Available").length,
    0
  );

  const maintenanceBeds = rooms.reduce(
    (total, room) =>
      total +
      room.beds.filter((bed) => bed.status === "Maintenance").length,
    0
  );

  // -----------------------------
  // Filtering
  // -----------------------------

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFloor =
      floorFilter === "All" || room.floor === floorFilter;

    const matchesStatus =
      statusFilter === "All" || room.status === statusFilter;

    return matchesSearch && matchesFloor && matchesStatus;
  });

  // -----------------------------
  // Add Room
  // -----------------------------

  const handleAddRoom = (e) => {
    e.preventDefault();

    if (!newRoom.roomNumber.trim()) {
      alert("Please enter a room number.");
      return;
    }

    const roomExists = rooms.some(
      (room) =>
        room.roomNumber.toLowerCase() ===
        newRoom.roomNumber.trim().toLowerCase()
    );

    if (roomExists) {
      alert("This room number already exists.");
      return;
    }

    const bedCount = Number(newRoom.beds);

    const beds = Array.from(
      { length: bedCount },
      (_, index) => ({
        id: `B${index + 1}`,
        status: "Available",
      })
    );

    const roomToAdd = {
      id: Date.now(),
      roomNumber: newRoom.roomNumber.trim(),
      floor: newRoom.floor,
      sharing: newRoom.sharing,
      status: "Available",
      beds,
    };

    setRooms((previousRooms) => [
      ...previousRooms,
      roomToAdd,
    ]);

    setNewRoom({
      roomNumber: "",
      floor: "Ground Floor",
      sharing: "4 Sharing",
      beds: 0,
    });

    setShowAddRoom(false);
  };

  // -----------------------------
  // Open Edit Room
  // -----------------------------

  const handleOpenEditRoom = (room) => {
    setSelectedRoom(room);

    setEditRoom({
      roomNumber: room.roomNumber,
      floor: room.floor,
      sharing: room.sharing,
      beds: room.beds.length,
    });

    setShowEditRoom(true);
  };

  // -----------------------------
  // Save Edit Room
  // -----------------------------

  const handleSaveEditRoom = (e) => {
    e.preventDefault();
  
    if (!editRoom.roomNumber.trim()) {
      alert("Room number cannot be empty.");
      return;
    }
  
    const duplicateRoom = rooms.some(
      (room) =>
        room.id !== selectedRoom.id &&
        room.roomNumber.toLowerCase() ===
          editRoom.roomNumber.trim().toLowerCase()
    );
  
    if (duplicateRoom) {
      alert("Another room already uses this room number.");
      return;
    }
  
    const newBedCount = Number(editRoom.beds);
  
    setRooms((previousRooms) =>
      previousRooms.map((room) => {
        if (room.id !== selectedRoom.id) {
          return room;
        }
  
        let updatedBeds = [...room.beds];
  
        // Add new beds if bed count increased
        if (newBedCount > updatedBeds.length) {
          for (
            let i = updatedBeds.length;
            i < newBedCount;
            i++
          ) {
            updatedBeds.push({
              id: `B${i + 1}`,
              status: "Available",
            });
          }
        }
  
        // Remove beds if bed count decreased
        if (newBedCount < updatedBeds.length) {
          updatedBeds = updatedBeds.slice(0, newBedCount);
        }
  
        // Calculate room status
        const allOccupied = updatedBeds.every(
          (bed) => bed.status === "Occupied"
        );
  
        const allMaintenance = updatedBeds.every(
          (bed) => bed.status === "Maintenance"
        );
  
        const roomStatus = allOccupied
          ? "Occupied"
          : allMaintenance
          ? "Maintenance"
          : "Available";
  
        return {
          ...room,
          roomNumber: editRoom.roomNumber.trim(),
          floor: editRoom.floor,
          sharing: editRoom.sharing,
          beds: updatedBeds,
          status: roomStatus,
        };
      })
    );
  
    setShowEditRoom(false);
    setSelectedRoom(null);
  };

  // -----------------------------
  // Open Bed Status
  // -----------------------------

  const handleOpenBedStatus = (room, bed) => {
    setSelectedRoom(room);
    setSelectedBed(bed);
    setShowBedModal(true);
  };

  // -----------------------------
  // Save Bed Status
  // -----------------------------

  const handleSaveBedStatus = (newStatus) => {
    setRooms((previousRooms) =>
      previousRooms.map((room) => {
        if (room.id !== selectedRoom.id) {
          return room;
        }

        const updatedBeds = room.beds.map((bed) =>
          bed.id === selectedBed.id
            ? {
                ...bed,
                status: newStatus,
              }
            : bed
        );

        const allOccupied = updatedBeds.every(
          (bed) => bed.status === "Occupied"
        );

        const allMaintenance = updatedBeds.every(
          (bed) => bed.status === "Maintenance"
        );

        const roomStatus = allOccupied
          ? "Occupied"
          : allMaintenance
          ? "Maintenance"
          : "Available";

        return {
          ...room,
          beds: updatedBeds,
          status: roomStatus,
        };
      })
    );

    setShowBedModal(false);
    setSelectedBed(null);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Rooms & Beds
          </h1>

          <p className="text-gray-500 mt-1">
            Manage rooms, beds and their availability.
          </p>
        </div>

        <button
          onClick={() => setShowAddRoom(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
        >
          + Add Room
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-sm">Total Rooms</p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {totalRooms}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            {totalBeds} total beds
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-sm">Occupied Beds</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {occupiedBeds}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Currently occupied
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-sm">Available Beds</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {availableBeds}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Ready for booking
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-sm">Maintenance</p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {maintenanceBeds}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Beds under maintenance
          </p>
        </div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search Room
            </label>

            <input
              type="text"
              placeholder="Enter room number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Floor
            </label>

            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            >
              <option value="All">All Floors</option>
              <option value="Ground Floor">Ground Floor</option>
              <option value="1st Floor">1st Floor</option>
              <option value="2nd Floor">2nd Floor</option>
              <option value="3rd Floor">3rd Floor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Room Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

        </div>

      </div>

      {/* Room List */}

      <div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Room List
        </h2>

        {filteredRooms.length === 0 ? (

          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-gray-500">
              No rooms found.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {filteredRooms.map((room) => (

              <div
                key={room.id}
                className="bg-white border rounded-xl shadow-sm p-5"
              >

                {/* Room Header */}

                <div className="flex items-start justify-between mb-5">

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Room {room.roomNumber}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {room.floor} • {room.sharing}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>

                </div>

                {/* Beds */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  {room.beds.map((bed) => (

                    <button
                      key={bed.id}
                      onClick={() =>
                        handleOpenBedStatus(room, bed)
                      }
                      className={`border rounded-lg p-3 text-left hover:shadow-md transition ${getBedStyle(
                        bed.status
                      )}`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="font-semibold">
                          {bed.id}
                        </span>

                        <span className="text-lg">
                          {bed.status === "Available"
                            ? "🟢"
                            : bed.status === "Occupied"
                            ? "🔴"
                            : "🟡"}
                        </span>

                      </div>

                      <p className="text-xs mt-2">
                        {bed.status}
                      </p>

                    </button>

                  ))}

                </div>

                {/* Actions */}

                <div className="flex gap-3 mt-5 pt-4 border-t">

                  <button
                    onClick={() => handleOpenEditRoom(room)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Edit Room
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          ADD ROOM MODAL
      ===================================================== */}

      {showAddRoom && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Room
                </h2>

                <p className="text-sm text-gray-500">
                  Enter room details.
                </p>
              </div>

              <button
                onClick={() => setShowAddRoom(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleAddRoom}
              className="p-6 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium mb-2">
                  Room Number
                </label>

                <input
                  type="text"
                  value={newRoom.roomNumber}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      roomNumber: e.target.value,
                    })
                  }
                  placeholder="Example: 103"
                  className="w-full border rounded-lg px-4 py-2.5"
                  required
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Floor
                </label>

                <select
                  value={newRoom.floor}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      floor: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option>Ground Floor</option>
                  <option>1st Floor</option>
                  <option>2nd Floor</option>
                  <option>3rd Floor</option>
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Sharing Type
                </label>

                <select
                  value={newRoom.sharing}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
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
                  Number of Beds
                </label>

                <select
                  value={newRoom.beds}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      beds: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option value={1}>1 Bed</option>
                  <option value={2}>2 Beds</option>
                  <option value={3}>3 Beds</option>
                  <option value={4}>4 Beds</option>
                </select>

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="flex-1 border py-2.5 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg"
                >
                  Add Room
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          EDIT ROOM MODAL
      ===================================================== */}

      {showEditRoom && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Room
                </h2>

                <p className="text-sm text-gray-500">
                  Update room information.
                </p>
              </div>

              <button
                onClick={() => setShowEditRoom(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSaveEditRoom}
              className="p-6 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium mb-2">
                  Room Number
                </label>

                <input
                  type="text"
                  value={editRoom.roomNumber}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      roomNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                  required
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Floor
                </label>

                <select
                  value={editRoom.floor}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
                      floor: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option>Ground Floor</option>
                  <option>1st Floor</option>
                  <option>2nd Floor</option>
                  <option>3rd Floor</option>
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Sharing Type
                </label>
                <select
                  value={editRoom.sharing}
                  onChange={(e) =>
                    setEditRoom({
                      ...editRoom,
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
                <div>

                    <label className="block text-sm font-medium mb-2">
                        Number of Beds
                    </label>

                    <select
                        value={editRoom.beds}
                        onChange={(e) =>
                        setEditRoom({
                            ...editRoom,
                            beds: Number(e.target.value),
                        })
                        }
                        className="w-full border rounded-lg px-4 py-2.5"
                    >
                        <option value={1}>1 Bed</option>
                        <option value={2}>2 Beds</option>
                        <option value={3}>3 Beds</option>
                        <option value={4}>4 Beds</option>
                    </select>

                </div>
                

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowEditRoom(false)}
                  className="flex-1 border py-2.5 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          BED STATUS MODAL
      ===================================================== */}

      {showBedModal && selectedBed && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

            <div className="px-6 py-5 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                Change Bed Status
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Room {selectedRoom.roomNumber} •{" "}
                {selectedBed.id}
              </p>

            </div>

            <div className="p-6">

              <p className="text-sm font-medium text-gray-600 mb-4">
                Select new status
              </p>

              <div className="space-y-3">

                <button
                  onClick={() =>
                    handleSaveBedStatus("Available")
                  }
                  className="w-full border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-left font-medium"
                >
                  🟢 Available
                  <span className="block text-xs font-normal mt-1">
                    Bed is ready for booking
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleSaveBedStatus("Occupied")
                  }
                  className="w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg text-left font-medium"
                >
                  🔴 Occupied
                  <span className="block text-xs font-normal mt-1">
                    Bed is currently occupied
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleSaveBedStatus("Maintenance")
                  }
                  className="w-full border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg text-left font-medium"
                >
                  🟡 Maintenance
                  <span className="block text-xs font-normal mt-1">
                    Bed is unavailable for maintenance
                  </span>
                </button>

              </div>

              <button
                onClick={() => {
                  setShowBedModal(false);
                  setSelectedBed(null);
                  setSelectedRoom(null);
                }}
                className="w-full border mt-5 py-2.5 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Rooms;
