import { useState } from "react";

function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    pgName: "SLR Bliss PG for Gents",
    ownerName: "G. Vishnu Vardhan Reddy",
    phone: "8340968829",
    alternatePhone: "9148141544",
    email: "admin@slrblisspg.com",
    address: "Tirupati, Andhra Pradesh",

    checkInTime: "12:00",
    checkOutTime: "11:00",
    securityDeposit: "8000",

    oneShare: "14000",
    twoShare: "8000",
    threeShare: "6000",
    fourShare: "5500",

    dailyOneShare: "800",
    dailyTwoShare: "500",
    dailyThreeShare: "400",
    dailyFourShare: "350",

    whatsappNotifications: true,
    paymentReminders: true,
    complaintNotifications: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "rent", label: "Rent Plans" },
    { id: "rules", label: "Rules & Timing" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage PG information, rent plans, rules and notifications.
        </p>
      </div>

      {/* Save Message */}
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSave}
          className="rounded-xl bg-white p-6 shadow-sm lg:col-span-3"
        >
          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  PG Information
                </h2>

                <p className="text-sm text-gray-500">
                  Basic information about your PG.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    PG Name
                  </label>

                  <input
                    name="pgName"
                    value={settings.pgName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Owner Name
                  </label>

                  <input
                    name="ownerName"
                    value={settings.ownerName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Primary Phone
                  </label>

                  <input
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Alternate Phone
                  </label>

                  <input
                    name="alternatePhone"
                    value={settings.alternatePhone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <input
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* RENT */}
          {activeTab === "rent" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Rent Plans
                </h2>

                <p className="text-sm text-gray-500">
                  Configure monthly and daily room rates.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-700">
                  Monthly Rent
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <RentInput
                    label="1 Sharing"
                    name="oneShare"
                    value={settings.oneShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="2 Sharing"
                    name="twoShare"
                    value={settings.twoShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="3 Sharing"
                    name="threeShare"
                    value={settings.threeShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="4 Sharing"
                    name="fourShare"
                    value={settings.fourShare}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 font-semibold text-gray-700">
                  Daily Rent
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <RentInput
                    label="1 Sharing"
                    name="dailyOneShare"
                    value={settings.dailyOneShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="2 Sharing"
                    name="dailyTwoShare"
                    value={settings.dailyTwoShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="3 Sharing"
                    name="dailyThreeShare"
                    value={settings.dailyThreeShare}
                    onChange={handleChange}
                  />

                  <RentInput
                    label="4 Sharing"
                    name="dailyFourShare"
                    value={settings.dailyFourShare}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* RULES */}
          {activeTab === "rules" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Rules & Timing
                </h2>

                <p className="text-sm text-gray-500">
                  Configure check-in, check-out and deposit settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Check-in Time
                  </label>

                  <input
                    type="time"
                    name="checkInTime"
                    value={settings.checkInTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Check-out Time
                  </label>

                  <input
                    type="time"
                    name="checkOutTime"
                    value={settings.checkOutTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Default Security Deposit
                  </label>

                  <div className="flex items-center">
                    <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="securityDeposit"
                      value={settings.securityDeposit}
                      onChange={handleChange}
                      className="w-full rounded-r-lg border border-gray-300 px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="font-semibold text-yellow-800">
                  PG Rules
                </h3>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-700">
                  <li>Food in rooms is strictly not allowed.</li>
                  <li>Tenants must maintain cleanliness.</li>
                  <li>Damage to PG property may be charged.</li>
                  <li>Check-out must follow the configured timing.</li>
                </ul>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Notifications
                </h2>

                <p className="text-sm text-gray-500">
                  Control which notifications the admin receives.
                </p>
              </div>

              <NotificationToggle
                title="WhatsApp Notifications"
                description="Send booking and tenant updates through WhatsApp."
                name="whatsappNotifications"
                checked={settings.whatsappNotifications}
                onChange={handleChange}
              />

              <NotificationToggle
                title="Payment Reminders"
                description="Receive reminders for pending and overdue rent."
                name="paymentReminders"
                checked={settings.paymentReminders}
                onChange={handleChange}
              />

              <NotificationToggle
                title="Complaint Notifications"
                description="Receive alerts when a new complaint is created."
                name="complaintNotifications"
                checked={settings.complaintNotifications}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Save */}
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RentInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center">
        <span className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500">
          ₹
        </span>

        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-r-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  description,
  name,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
      <div>
        <h3 className="font-medium text-gray-800">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5"
      />
    </label>
  );
}

export default Settings;