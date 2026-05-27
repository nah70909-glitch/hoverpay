"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, WalletCards, History, Shield, Settings, Store, LogOut, QrCode } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

const chartData = [
  { name: '1', value: 1200 },
  { name: '2', value: 2100 },
  { name: '3', value: 1800 },
  { name: '4', value: 3200 },
  { name: '5', value: 2800 },
  { name: '6', value: 4500 },
  { name: '7', value: 4100 },
];

export default function Dashboard() {
  const { balance, transactions } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format currency for Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total spent this month from transactions
  const spentThisMonth = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-sans">H</div>
            HoverPay
          </Link>
          <div className="mt-8">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Consumer</p>
            <nav className="space-y-1">
              <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
              <NavItem icon={<WalletCards size={18} />} label="Bank Accounts" />
              <NavItem icon={<History size={18} />} label="Transactions" />
              <NavItem icon={<Shield size={18} />} label="Security" />
            </nav>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Business</p>
            <nav className="space-y-1">
              <Link href="/merchant" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">
                <Store size={18} /> Switch to Merchant
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700" />
            <div>
              <p className="text-sm font-medium text-zinc-100">Alex Sharma</p>
              <p className="text-xs text-zinc-500">alex@hoverpay</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
            <p className="text-sm text-zinc-400">Welcome back, Alex.</p>
          </div>
          <Link href="/pay" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg font-medium transition-colors">
            <QrCode size={18} /> Scan QR
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Virtual ID Card */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Shield size={120} />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-zinc-400 mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold text-zinc-100 mb-6">
                {mounted ? formatCurrency(balance) : "₹---,---"}
              </h2>
              
              <div className="flex items-end justify-between mt-8">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Linked Bank</p>
                  <p className="text-sm font-medium text-zinc-200">HDFC Bank •••• 4092</p>
                  <p className="text-xs text-zinc-500 mt-1">UPI ID: alex.sharma@okicici</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/20">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Spent recently</p>
              <h3 className="text-2xl font-bold text-zinc-100">
                {mounted ? formatCurrency(spentThisMonth) : "₹---"}
              </h3>
            </div>
            <div className="text-sm text-zinc-400">
              <span className="text-emerald-500 font-medium">Synced securely</span> with ledger
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-base font-semibold text-zinc-100 mb-6">Spending Trend</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fafafa' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Txns */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-zinc-100">Recent History</h3>
              <button className="text-xs text-emerald-500 font-medium">View all</button>
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              {mounted && transactions.map((txn) => (
                <TxnItem 
                  key={txn.id}
                  name={txn.name} 
                  date={txn.date} 
                  amount={`-₹${txn.amount}`} 
                />
              ))}
              <TxnItem name="Salary" date="Oct 22" amount="+₹85,000" positive />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }: any) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
      active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
    }`}>
      {icon}
      {label}
    </div>
  )
}

function TxnItem({ name, date, amount, positive }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{name}</p>
          <p className="text-xs text-zinc-500">{date}</p>
        </div>
      </div>
      <p className={`text-sm font-medium ${positive ? 'text-emerald-500' : 'text-zinc-100'}`}>{amount}</p>
    </div>
  )
}