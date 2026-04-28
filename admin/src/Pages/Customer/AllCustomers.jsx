import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUsers, FiCheckCircle, FiAlertCircle, FiSearch,
  FiX, FiEye, FiTrash2, FiPhone, FiMail, FiMapPin,
  FiCalendar, FiShoppingBag,
} from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────
//  👉 WHEN BACKEND IS READY — just change this one line:
//     const API_URL = "http://localhost:5000/api/customers";
// ─────────────────────────────────────────────────────────────────
const API_URL = "/customers.json";

// ── small helpers ─────────────────────────────────────────────────
const fmt     = (n) => "৳" + Number(n).toLocaleString();
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const initials = (n) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const COLORS   = ["bg-green-600","bg-blue-600","bg-purple-600","bg-orange-500","bg-pink-600","bg-teal-600","bg-indigo-600","bg-rose-500"];
const avatarBg = (id) => COLORS[id % COLORS.length];

// ─────────────────────────────────────────────────────────────────
export default function AllCustomers() {
  const [allData,   setAllData]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("all");   // "all" | "paid" | "due"
  const [search,    setSearch]    = useState("");
  const [drawer,    setDrawer]    = useState(null);    // customer object or null
  const [delId,     setDelId]     = useState(null);    // id to confirm delete
  const [toast,     setToast]     = useState("");

  // ── fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        // works for both JSON file (array) and real API ({ data: [...] })
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setAllData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── derived lists ──────────────────────────────────────────────
  const base = tab === "paid"
    ? allData.filter((c) => c.totalDue === 0)
    : tab === "due"
    ? allData.filter((c) => c.totalDue > 0)
    : allData;

  const rows = search
    ? base.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase()))
    : base;

  // ── delete ─────────────────────────────────────────────────────
  const handleDelete = () => {
    setAllData((prev) => prev.filter((c) => c.id !== delId));
    setDelId(null);
    setDrawer(null);
    showToast("Customer removed ✅");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // ── tab config ─────────────────────────────────────────────────
  const TABS = [
    { key: "all",  label: "All Customers",  icon: <FiUsers size={16}/>,       count: allData.length,                          color: "green"  },
    { key: "paid", label: "Paid Customers",  icon: <FiCheckCircle size={16}/>, count: allData.filter(c => c.totalDue === 0).length, color: "blue"   },
    { key: "due",  label: "Due Customers",   icon: <FiAlertCircle size={16}/>, count: allData.filter(c => c.totalDue > 0).length,   color: "red"    },
  ];

  const tabStyle = (key, color) => {
    const active = tab === key;
    const map = {
      green: active ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600",
      blue:  active ? "bg-blue-600 text-white border-blue-600"  : "border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600",
      red:   active ? "bg-red-500 text-white border-red-500"    : "border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500",
    };
    return `flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-base font-semibold transition ${map[color]}`;
  };

  // ── loading ────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-500 text-lg">Loading customers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-base font-medium flex items-center gap-2">
          <FiCheckCircle size={18}/> {toast}
        </div>
      )}

      {/* ── Delete Modal ── */}
      {delId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-3">🗑️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Remove customer?</h3>
            <p className="text-gray-500 text-base mb-6">
              <strong>{allData.find(c => c.id === delId)?.name}</strong> will be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-base hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDelete}         className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl text-base transition">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Side Drawer ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawer(null)}/>
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Customer Info</h2>
              <button onClick={() => setDrawer(null)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <FiX size={20} className="text-gray-500"/>
              </button>
            </div>
            {/* avatar */}
            <div className="px-6 py-6 flex items-center gap-4 border-b border-gray-100">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${avatarBg(drawer.id)}`}>
                {initials(drawer.name)}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{drawer.name}</div>
                <span className={`inline-block text-sm px-3 py-0.5 rounded-full font-semibold mt-1 ${drawer.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {drawer.status}
                </span>
              </div>
            </div>
            {/* details */}
            <div className="px-6 py-5 space-y-4">
              {[
                { icon: <FiPhone size={15}/>,    label: "Phone",      val: drawer.phone },
                { icon: <FiMail size={15}/>,     label: "Email",      val: drawer.email || "Not provided" },
                { icon: <FiMapPin size={15}/>,   label: "Address",    val: drawer.address || "—" },
                { icon: <FiCalendar size={15}/>, label: "Joined",     val: fmtDate(drawer.joinedAt) },
                { icon: <FiCalendar size={15}/>, label: "Last Order", val: fmtDate(drawer.lastOrder) },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">{icon}</div>
                  <div>
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className={`text-base font-medium ${val === "Not provided" ? "text-gray-400 italic" : "text-gray-800"}`}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mx-6"/>
            {/* stats */}
            <div className="px-6 py-5 grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="text-green-700 text-xl font-bold">{fmt(drawer.totalSpent)}</div>
                <div className="text-green-600 text-sm mt-0.5">Total spent</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-blue-700 text-xl font-bold">{drawer.totalOrders}</div>
                <div className="text-blue-600 text-sm mt-0.5">Orders</div>
              </div>
              <div className={`${drawer.totalDue > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"} border rounded-xl p-4 col-span-2`}>
                <div className={`text-xl font-bold ${drawer.totalDue > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {drawer.totalDue > 0 ? fmt(drawer.totalDue) : "No due ✅"}
                </div>
                <div className="text-sm mt-0.5 text-gray-400">Outstanding due</div>
              </div>
            </div>
            <div className="mt-auto px-6 pb-6">
              <button onClick={() => setDrawer(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl text-base transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-7">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Customers 👥</h1>
          <p className="text-gray-500 text-base mt-1">Manage all your customers — see who paid and who owes you 😄</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-3">
          {TABS.map(({ key, label, icon, count, color }) => (
            <button key={key} onClick={() => { setTab(key); setSearch(""); }} className={tabStyle(key, color)}>
              {icon} {label}
              <span className={`ml-1 text-sm px-2 py-0.5 rounded-full font-bold ${tab === key ? "bg-white/25" : "bg-gray-100"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <FiX size={16}/>
            </button>
          )}
        </div>

        <p className="text-gray-400 text-base">{rows.length} customer{rows.length !== 1 ? "s" : ""}</p>

        {/* ── Table — Desktop ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Customer", "Phone", "Address", "Orders", "Total Spent", "Due", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-base font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-gray-400 text-lg">No customers found 🔍</td></tr>
                ) : rows.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    {/* name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarBg(c.id)}`}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900 whitespace-nowrap">{c.name}</div>
                          <div className="text-sm text-gray-400">{c.email || <span className="italic">No email</span>}</div>
                        </div>
                      </div>
                    </td>
                    {/* phone */}
                    <td className="px-5 py-4 text-base text-gray-700 whitespace-nowrap">
                      <span className="flex items-center gap-1.5"><FiPhone size={13} className="text-gray-400"/> {c.phone}</span>
                    </td>
                    {/* address */}
                    <td className="px-5 py-4 text-base text-gray-500 max-w-[150px]">
                      <span className="flex items-center gap-1.5">
                        <FiMapPin size={13} className="text-gray-400 flex-shrink-0"/>
                        <span className="truncate">{c.address || "—"}</span>
                      </span>
                    </td>
                    {/* orders */}
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-base font-semibold text-gray-800">
                        <FiShoppingBag size={13} className="text-gray-400"/> {c.totalOrders}
                      </span>
                    </td>
                    {/* spent */}
                    <td className="px-5 py-4 text-base font-semibold text-gray-800 whitespace-nowrap">{fmt(c.totalSpent)}</td>
                    {/* due */}
                    <td className="px-5 py-4">
                      {c.totalDue > 0
                        ? <span className="bg-red-100 text-red-600 text-base font-semibold px-3 py-1 rounded-lg">{fmt(c.totalDue)}</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    {/* status */}
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-lg capitalize ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.status}
                      </span>
                    </td>
                    {/* actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDrawer(c)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"><FiEye size={16}/></button>
                        <button onClick={() => setDelId(c.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"><FiTrash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {rows.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-lg">No customers found 🔍</div>
            ) : rows.map((c) => (
              <div key={c.id} className="p-5">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${avatarBg(c.id)}`}>
                      {initials(c.name)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1"><FiPhone size={12}/> {c.phone}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg capitalize ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-base font-bold text-gray-900">{c.totalOrders}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Orders</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-sm font-bold text-green-700">{fmt(c.totalSpent)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Spent</div>
                  </div>
                  <div className={`${c.totalDue > 0 ? "bg-red-50" : "bg-gray-50"} rounded-xl p-3 text-center`}>
                    <div className={`text-sm font-bold ${c.totalDue > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {c.totalDue > 0 ? fmt(c.totalDue) : "—"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Due</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDrawer(c)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2.5 rounded-xl text-base transition">
                    <FiEye size={15}/> View
                  </button>
                  <button onClick={() => setDelId(c.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2.5 rounded-xl text-base transition">
                    <FiTrash2 size={15}/> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 text-base pb-4">BuildMart Hardware · {allData.length} total customers 💼</p>
      </div>
    </div>
  );
}
