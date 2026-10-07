import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./components/adminlayout";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Tenants from "./pages/Tenants";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import CheckInOut from "./pages/CheckInOut";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<AdminLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route path="/bookings" element={<Bookings />} />

          <Route path="/tenants" element={<Tenants />} />

          <Route path="/payments" element={<Payments />} />

          <Route path="/complaints" element={<Complaints />} />

          <Route
            path="/check-in-out"
            element={<CheckInOut />}
          />

          <Route path="/reports" element={<Reports />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;