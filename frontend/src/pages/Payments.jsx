import { useMemo, useState } from "react";

const initialPayments = [
  {
    id: "PAY001",
    tenantName: "Rahul Sharma",
    phone: "9876543210",
    room: "203",
    bed: "B2",
    amount: 8000,
    dueDate: "05 Oct 2026",
    paidDate: "04 Oct 2026",
    paymentMethod: "UPI",
    status: "Paid",
    month: "October 2026",
  },
  {
    id: "PAY002",
    tenantName: "Arjun Singh",
    phone: "9123456780",
    room: "105",
    bed: "B1",
    amount: 14000,
    dueDate: "05 Oct 2026",
    paidDate: "",
    paymentMethod: "",
    status: "Pending",
    month: "October 2026",
  },
  {
    id: "PAY003",
    tenantName: "Kiran Kumar",
    phone: "9988776655",
    room: "201",
    bed: "B3",
    amount: 6000,
    dueDate: "01 Oct 2026",
    paidDate: "01 Oct 2026",
    paymentMethod: "Cash",
    status: "Paid",
    month: "October 2026",
  },
  {
    id: "PAY004",
    tenantName: "Suresh Reddy",
    phone: "9012345678",
    room: "102",
    bed: "B1",
    amount: 5500,
    dueDate: "01 Oct 2026",
    paidDate: "",
    paymentMethod: "",
    status: "Overdue",
    month: "October 2026",
  },
  {
    id: "PAY005",
    tenantName: "Vamsi Krishna",
    phone: "9876501234",
    room: "301",
    bed: "B3",
    amount: 5500,
    dueDate: "05 Sep 2026",
    paidDate: "04 Sep 2026",
    paymentMethod: "UPI",
    status: "Paid",
    month: "September 2026",
  },
];

function getStatusStyle(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Overdue":
      return "bg-red-100 text-red-700";

    case "Partial":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function Payments() {
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [paymentForm, setPaymentForm] = useState({
    paymentId: "",
    amount: "",
    paymentMethod: "UPI",
    paidDate: "",
  });

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        payment.tenantName
          .toLowerCase()
          .includes(searchValue) ||
        payment.id.toLowerCase().includes(searchValue) ||
        payment.phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMonth =
        monthFilter === "All" ||
        payment.month === monthFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );
    });
  }, [payments, search, statusFilter, monthFilter]);

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const overdueAmount = payments
    .filter((payment) => payment.status === "Overdue")
    .reduce((total, payment) => total + payment.amount, 0);

  const octoberRevenue = payments
    .filter(
      (payment) =>
        payment.month === "October 2026" &&
        payment.status === "Paid"
    )
    .reduce((total, payment) => total + payment.amount, 0);

  const handleOpenPayment = (payment) => {
    setSelectedPayment(payment);

    setPaymentForm({
      paymentId: payment.id,
      amount: payment.amount,
      paymentMethod: "UPI",
      paidDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setShowPaymentModal(true);
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();

    if (!paymentForm.amount || !paymentForm.paidDate) {
      alert("Please enter payment amount and date.");
      return;
    }

    setPayments((previousPayments) =>
      previousPayments.map((payment) =>
        payment.id === selectedPayment.id
          ? {
              ...payment,
              amount: Number(paymentForm.amount),
              paidDate: paymentForm.paidDate,
              paymentMethod:
                paymentForm.paymentMethod,
              status: "Paid",
            }
          : payment
      )
    );

    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Payments & Rent
        </h1>

        <p className="text-gray-500 mt-1">
          Track monthly rent, payments and outstanding amounts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Collected
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            ₹{paidAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Pending Amount
          </p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-2">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Overdue Amount
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            ₹{overdueAmount.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            October Revenue
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            ₹{octoberRevenue.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search tenant, phone or payment ID..."
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
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={monthFilter}
            onChange={(e) =>
              setMonthFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="All">All Months</option>
            <option value="October 2026">
              October 2026
            </option>
            <option value="September 2026">
              September 2026
            </option>
          </select>

        </div>

      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Rent Payments
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3">
                  Payment ID
                </th>

                <th className="text-left px-5 py-3">
                  Tenant
                </th>

                <th className="text-left px-5 py-3">
                  Room / Bed
                </th>

                <th className="text-left px-5 py-3">
                  Amount
                </th>

                <th className="text-left px-5 py-3">
                  Due Date
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

              {filteredPayments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium text-blue-600">
                    {payment.id}
                  </td>

                  <td className="px-5 py-4">

                    <div className="font-medium text-gray-800">
                      {payment.tenantName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {payment.phone}
                    </div>

                  </td>

                  <td className="px-5 py-4">
                    {payment.room} / {payment.bed}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    {payment.dueDate}
                  </td>

                  <td className="px-5 py-4">
                    {payment.paidDate || (
                      <span className="text-gray-400">
                        Not Paid
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleViewDetails(payment)
                        }
                        className="px-3 py-1.5 border rounded-lg hover:bg-gray-100"
                      >
                        View
                      </button>

                      {payment.status !== "Paid" && (
                        <button
                          onClick={() =>
                            handleOpenPayment(payment)
                          }
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Record Payment
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No payment records found.
            </div>
          )}

        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && selectedPayment && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Record Payment
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedPayment.tenantName}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowPaymentModal(false)
                }
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleRecordPayment}
              className="p-6 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>

                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                >
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Paid Date
                </label>

                <input
                  type="date"
                  value={paymentForm.paidDate}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paidDate: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-2.5"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentModal(false)
                  }
                  className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Payment
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-4 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Details
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedPayment.id}
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
                    Tenant
                  </p>

                  <p className="font-medium">
                    {selectedPayment.tenantName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {selectedPayment.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Room / Bed
                  </p>

                  <p className="font-medium">
                    {selectedPayment.room} /{" "}
                    {selectedPayment.bed}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Month
                  </p>

                  <p className="font-medium">
                    {selectedPayment.month}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Amount
                  </p>

                  <p className="font-medium">
                    ₹
                    {selectedPayment.amount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Due Date
                  </p>

                  <p className="font-medium">
                    {selectedPayment.dueDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Paid Date
                  </p>

                  <p className="font-medium">
                    {selectedPayment.paidDate || "Not Paid"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Method
                  </p>

                  <p className="font-medium">
                    {selectedPayment.paymentMethod || "—"}
                  </p>
                </div>

              </div>

              <div className="border-t pt-4">

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status}
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

export default Payments;