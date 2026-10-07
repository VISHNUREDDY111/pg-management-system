function Dashboard() {
    return (
      <div>
  
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>
  
          <p className="text-sm text-slate-500">
            Overview of your PG operations
          </p>
        </div>
  
  
        {/* Statistics */}
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Rooms
            </p>
  
            <h2 className="mt-2 text-3xl font-bold">
              25
            </h2>
  
            <p className="mt-2 text-sm text-green-600">
              +2 this month
            </p>
          </div>
  
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Beds
            </p>
  
            <h2 className="mt-2 text-3xl font-bold">
              100
            </h2>
  
            <p className="mt-2 text-sm text-green-600">
              +4 this month
            </p>
          </div>
  
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Occupied Beds
            </p>
  
            <h2 className="mt-2 text-3xl font-bold">
              82
            </h2>
  
            <p className="mt-2 text-orange-600">
              82% occupancy
            </p>
          </div>
  
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Available Beds
            </p>
  
            <h2 className="mt-2 text-3xl font-bold">
              18
            </h2>
  
            <p className="mt-2 text-blue-600">
              Available now
            </p>
          </div>
  
        </div>
  
  
        {/* Revenue */}
  
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
  
            <h2 className="text-lg font-semibold">
              Monthly Revenue
            </h2>
  
            <p className="mt-4 text-3xl font-bold text-green-600">
              ₹4,25,000
            </p>
  
            <p className="mt-2 text-sm text-green-600">
              ↑ 12% from last month
            </p>
  
          </div>
  
  
          <div className="rounded-xl bg-white p-6 shadow-sm">
  
            <h2 className="text-lg font-semibold">
              Occupancy
            </h2>
  
            <div className="mt-5">
  
              <div className="mb-2 flex justify-between text-sm">
                <span>Occupied</span>
                <span>82%</span>
              </div>
  
              <div className="h-4 rounded-full bg-slate-200">
  
                <div
                  className="h-4 rounded-full bg-blue-600"
                  style={{ width: "82%" }}
                />
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
  
        {/* Recent Bookings */}
  
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
  
          <h2 className="text-lg font-semibold">
            Recent Bookings
          </h2>
  
          <div className="mt-6 overflow-x-auto">
  
            <table className="w-full text-left">
  
              <thead>
                <tr className="border-b text-sm text-slate-500">
  
                  <th className="pb-3">
                    Tenant
                  </th>
  
                  <th className="pb-3">
                    Room
                  </th>
  
                  <th className="pb-3">
                    Sharing
                  </th>
  
                  <th className="pb-3">
                    Status
                  </th>
  
                </tr>
              </thead>
  
              <tbody>
  
                <tr className="border-b">
  
                  <td className="py-4">
                    Rahul Sharma
                  </td>
  
                  <td>
                    203 / B2
                  </td>
  
                  <td>
                    2 Sharing
                  </td>
  
                  <td>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Approved
                    </span>
                  </td>
  
                </tr>
  
  
                <tr className="border-b">
  
                  <td className="py-4">
                    Arjun Singh
                  </td>
  
                  <td>
                    105 / B1
                  </td>
  
                  <td>
                    1 Sharing
                  </td>
  
                  <td>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                      Pending
                    </span>
                  </td>
  
                </tr>
  
              </tbody>
  
            </table>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  export default Dashboard;