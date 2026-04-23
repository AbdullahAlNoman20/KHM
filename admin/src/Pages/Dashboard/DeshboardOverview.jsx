import { useState, useEffect } from "react";

// ── tiny sparkline SVG ──────────────────────────────────────────────
function Spark({ data, color = "#22c55e" }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 80, h = 28;
    const pts = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / (max - min || 1)) * h;
            return `${x},${y}`;
        })
        .join(" ");
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── animated counter ────────────────────────────────────────────────
function Counter({ target, prefix = "", suffix = "", duration = 1200 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ── data ─────────────────────────────────────────────────────────────
const STAT_CARDS = [
    {
        id: "sales",
        emoji: "💰",
        label: "Today's Sales",
        value: 87430,
        prefix: "৳",
        change: "+12%",
        up: true,
        spark: [40, 55, 48, 70, 65, 80, 87],
        sparkColor: "#22c55e",
        bg: "from-emerald-500 to-green-600",
        funny: "Cha-ching! 🎉",
    },
    {
        id: "orders",
        emoji: "📦",
        label: "Today's Orders",
        value: 34,
        prefix: "",
        suffix: " orders",
        change: "+8%",
        up: true,
        spark: [10, 18, 14, 22, 20, 28, 34],
        sparkColor: "#3b82f6",
        bg: "from-blue-500 to-indigo-600",
        funny: "Pipes flying out! 🔩",
    },
    {
        id: "due",
        emoji: "⏰",
        label: "Today's Due",
        value: 23800,
        prefix: "৳",
        change: "-3%",
        up: false,
        spark: [80, 70, 85, 60, 75, 50, 40],
        sparkColor: "#f59e0b",
        bg: "from-amber-400 to-orange-500",
        funny: "Go collect it, boss 😅",
    },
    {
        id: "stock",
        emoji: "🏪",
        label: "Low Stock Items",
        value: 7,
        prefix: "",
        suffix: " items",
        change: "Urgent",
        up: false,
        spark: [2, 3, 5, 4, 6, 7, 7],
        sparkColor: "#ef4444",
        bg: "from-red-400 to-rose-600",
        funny: "Restock before chaos! 😱",
    },
];

const RECENT_SALES = [
    { id: "#1042", customer: "Karim Bhai", items: "PVC Pipe x10, Elbow x5", amount: 4200, status: "paid", time: "10 mins ago" },
    { id: "#1041", customer: "Rahim Construction", items: "Berger Paint 4L x3", amount: 8700, status: "paid", time: "32 mins ago" },
    { id: "#1040", customer: "Selim Hardware", items: "Hammer x2, Wrench Set", amount: 1850, status: "due", time: "1 hr ago" },
    { id: "#1039", customer: "Faruk & Sons", items: "Jaquar Tap x4, Basin", amount: 12400, status: "paid", time: "2 hrs ago" },
    { id: "#1038", customer: "Mamun Electricals", items: "MCB 20A x10, Wire 50m", amount: 5600, status: "due", time: "3 hrs ago" },
    { id: "#1037", customer: "Tushar Builders", items: "Drill Machine, Grinder", amount: 9300, status: "paid", time: "4 hrs ago" },
];

const TOP_PRODUCTS = [
    { name: "PVC Pipe 1 inch", sold: 120, stock: 340, emoji: "🔩" },
    { name: "Berger Emulsion Paint", sold: 85, stock: 60, emoji: "🎨" },
    { name: "Jaquar Wall Tap", sold: 72, stock: 28, emoji: "🚰" },
    { name: "Stanley Hammer", sold: 65, stock: 90, emoji: "🔨" },
    { name: "Bosch Drill 550W", sold: 41, stock: 12, emoji: "🪛" },
];

const DUE_LIST = [
    { name: "Selim Hardware", amount: 11200, days: 5, phone: "017XX-XXXX01" },
    { name: "Mamun Electricals", amount: 5600, days: 2, phone: "018XX-XXXX44" },
    { name: "Raju Constructions", amount: 23000, days: 12, phone: "019XX-XXXX77" },
    { name: "Babu & Brothers", amount: 8400, days: 7, phone: "016XX-XXXX22" },
];

const ACTIVITY = [
    { icon: "🛒", text: "New order #1042 by Karim Bhai", time: "Just now", color: "bg-green-100 text-green-700" },
    { icon: "⚠️", text: "Bosch Drill stock below 15 units", time: "20 mins", color: "bg-yellow-100 text-yellow-700" },
    { icon: "💸", text: "Due collected from Nizam Store — ৳7,200", time: "1 hr", color: "bg-blue-100 text-blue-700" },
    { icon: "📦", text: "Restocked: PVC Pipe 200 units added", time: "2 hrs", color: "bg-purple-100 text-purple-700" },
    { icon: "🎉", text: "Monthly target 82% achieved!", time: "Today", color: "bg-emerald-100 text-emerald-700" },
];

const FUNNY_GREETINGS = [
    "Ready to count the bolts, boss? 🔩",
    "Another day, another wrench turned! 🔧",
    "The pipes are calling your name! 🚰",
    "Let's see how much paint we sold! 🎨",
    "Hammer time, boss! 🔨",
];

// ── sidebar nav ──────────────────────────────────────────────────────
const NAV = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: "🛒", label: "Sales" },
    { icon: "📦", label: "Inventory" },
    { icon: "👥", label: "Customers" },
    { icon: "💸", label: "Due & Credit" },
    { icon: "🏭", label: "Suppliers" },
    { icon: "📈", label: "Reports" },
    { icon: "⚙️", label: "Settings" },
];

const DeshboardOverview = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const greeting = FUNNY_GREETINGS[Math.floor(Date.now() / 1000) % FUNNY_GREETINGS.length];
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div className="flex h-screen bg- font-sans overflow-hidden">



            {/* ── MAIN ── */}
            <main className="flex-1 flex flex-col overflow-hidden">


                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 space-y-6">

                    {/* ── STAT CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STAT_CARDS.map((card, i) => (
                            <div
                                key={card.id}
                                className={`relative bg-gradient-to-br ${card.bg} rounded-2xl p-5 text-white overflow-hidden`}
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="absolute -top-4 -right-4 text-6xl opacity-10 select-none">{card.emoji}</div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-2xl">{card.emoji}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.up ? "bg-white/20" : "bg-black/20"}`}>
                                        {card.change}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold leading-none mb-1">
                                    <Counter target={card.value} prefix={card.prefix || ""} suffix={card.suffix || ""} />
                                </div>
                                <div className="text-white/70 text-xl mb-3">{card.label}</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-xs text-white/60 italic">{card.funny}</span>
                                    <Spark data={card.spark} color="rgba(255,255,255,0.7)" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── QUICK INFO ROW ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Total Customers", val: "248", icon: "👥", sub: "12 new this month" },
                            { label: "Monthly Revenue", val: "৳6.2L", icon: "📈", sub: "82% of target" },
                            { label: "Total Due", val: "৳48,200", icon: "⚠️", sub: "4 customers", warn: true },
                            { label: "Products", val: "5,240", icon: "📦", sub: "7 low stock", warn: true },
                        ].map(({ label, val, icon, sub, warn }) => (
                            <div key={label} className={`bg-gray-200 border  ${warn ? "border-gray-300" : "border-gray-300"} rounded-xl p-4`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{icon}</span>
                                    <span className="text-gray-400 text-xs">{label}</span>
                                </div>
                                <div className="text-gray-600 text-4xl font-bold">{val}</div>
                                <div className={`text-xl mt-1 text-gray-500`}>{sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── MAIN 2-COL ── */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Recent Sales — takes 2 cols */}
                        <div className="xl:col-span-2 text-gray-600 bg-gray-200 border border-gray-300 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
                                <div>
                                    <h2 className=" font-bold text-2xl">Recent Sales </h2>
                                    <p className="text-gray-500 text-xs mt-0.5">Today's transactions — go count that cash!</p>
                                </div>
                                
                            </div>
                            <div className="divide-y divide-gray-400/60">
                                {RECENT_SALES.map((sale) => (
                                    <div key={sale.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-750 transition">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl flex-shrink-0 font-bold text-gray-100">
                                            {sale.customer[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text- text-xl font-semibold truncate">{sale.customer}</span>
                                                <span className="text-gray-600 text-xs">{sale.id}</span>
                                            </div>
                                            <div className="text-gray-500 text-xs truncate">{sale.items}</div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className=" text-xl font-bold">৳{sale.amount.toLocaleString()}</div>
                                            <div className="flex items-center justify-end gap-1 mt-0.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sale.status === "paid" ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"}`}>
                                                    {sale.status === "paid" ? "✅ Paid" : "⏰ Due"}
                                                </span>
                                            </div>
                                            <div className="text-gray-600 text-xs mt-0.5">{sale.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity feed — 1 col */}
                        <div className="bg-gray-200 text-gray-600 border border-gray-300 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-700">
                                <h2 className="text-gray-600 font-bold text-2xl">Live Activity 🔴</h2>
                                <p className="text-gray-500 text-xs mt-0.5">Stuff happening right now</p>
                            </div>
                            <div className="p-4 space-y-3">
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${a.color}`}>
                                            {a.icon}
                                        </div>
                                        <div>
                                            <div className="text-gray-600 text-xl leading-snug">{a.text}</div>
                                            <div className="text-gray-600 text-xs mt-0.5">{a.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── BOTTOM 2-COL ── */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                        {/* Top Products */}
                        {/* <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                                <div>
                                    <h2 className="text-white font-bold text-sm">Top Products 🏆</h2>
                                    <p className="text-gray-500 text-xs mt-0.5">Today's bestsellers — your MVPs!</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {TOP_PRODUCTS.map((p, i) => {
                                    const pct = Math.round((p.sold / 130) * 100);
                                    const lowStock = p.stock < 30;
                                    return (
                                        <div key={p.name}>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-lg">{p.emoji}</span>
                                                <span className="text-gray-200 text-xs flex-1 truncate font-medium">{p.name}</span>
                                                <span className="text-gray-400 text-xs">{p.sold} sold</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lowStock ? "bg-red-900/60 text-red-400" : "bg-gray-700 text-gray-400"}`}>
                                                    {lowStock ? `⚠️ ${p.stock} left` : `${p.stock} in stock`}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${i === 0 ? "bg-green-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-amber-500" : i === 3 ? "bg-orange-500" : "bg-red-500"}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div> */}

                        {/* Due List */}
                        {/* <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                                <div>
                                    <h2 className="text-white font-bold text-sm">Due Collections ⏰</h2>
                                    <p className="text-gray-500 text-xs mt-0.5">Go knock some doors, boss 🚪</p>
                                </div>
                                <span className="bg-red-900/60 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium">৳{(48200).toLocaleString()} total</span>
                            </div>
                            <div className="divide-y divide-gray-700/60">
                                {DUE_LIST.map((d) => (
                                    <div key={d.name} className="flex items-center gap-3 px-5 py-3">
                                        <div className="w-9 h-9 rounded-full bg-red-900/40 border border-red-700/40 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
                                            {d.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white text-xs font-semibold">{d.name}</div>
                                            <div className="text-gray-500 text-xs">{d.phone}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-red-400 text-sm font-bold">৳{d.amount.toLocaleString()}</div>
                                            <div className={`text-xs mt-0.5 ${d.days > 10 ? "text-red-400 font-semibold" : "text-gray-500"}`}>
                                                {d.days} days overdue {d.days > 10 ? "😤" : ""}
                                            </div>
                                        </div>
                                        <button className="ml-2 text-xs bg-green-900/50 hover:bg-green-700 text-green-400 hover:text-white px-3 py-1.5 rounded-lg transition font-medium">
                                            Call
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    {/* ── MONTHLY TARGET BAR ── */}
                    <div className="bg-gradient-to-r from-white-600 to-blue-800 border border-gray-700 rounded-2xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text- font-bold text-2xl text-gray-600">Monthly Target </h2>
                                <p className="text-gray-500 text-xs mt-0.5">You're 82% there — push it, boss! Almost pizza time! 🍕</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold">৳6,20,000 <span className="text-gray-500 font-normal text-xs">/ ৳7,50,000</span></div>
                                <div className="text-green-400 text-xs">৳1,30,000 left to go!</div>
                            </div>
                        </div>
                        <div className="mt-4 h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" style={{ width: "82%" }} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-gray-600 text-xs">৳0</span>
                            <span className="text-green-400 text-xs font-semibold">82% complete 🚀</span>
                            <span className="text-gray-600 text-xs">৳7,50,000</span>
                        </div>
                    </div>

                    

                </div>
            </main>
        </div>
    );
}
export default DeshboardOverview;