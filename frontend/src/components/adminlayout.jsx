import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Rooms & Beds", path: "/rooms" },
    { name: "Beds", path: "/beds" },
    { name: "Bookings", path: "/bookings" },
    { name: "Tenants", path: "/tenants" },
    { name: "Payments", path: "/payments" },
    { name: "Complaints", path: "/complaints" },
    { name: "Check-in / Check-out", path: "/check-in-out" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">

        {/* Logo */}
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-xl font-bold">
            SLR Bliss PG
          </h1>

          <p className="text-sm text-slate-400">
            Management System
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 block rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </nav>

      </aside>


      {/* Main Area */}
      <main className="ml-64">

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              PG Management
            </h2>

            <p className="text-sm text-slate-500">
              Admin Panel
            </p>
          </div>


          {/* Admin Profile */}
          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="font-semibold text-slate-800">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              A
            </div>

          </div>

        </header>


        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;