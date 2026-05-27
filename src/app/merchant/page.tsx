"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Store, QrCode, Smartphone, Users } from "lucide-react";
import Link from "next/link";

export default function MerchantDashboard() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-zinc-300">
              <Store size={16} />
            </div>
            <span className="font-semibold text-zinc-100">Starbucks Terminal</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
          <QrCode size={16} /> Show Store QR
        </button>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Today's Sales</h1>
          <p className="text-zinc-400 text-sm">Real-time metrics for your store.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value="₹14,500" trend="+12%" up />
          <StatCard title="Transactions" value="142" trend="+5%" up />
          <StatCard title="Gesture Verified" value="89" subtitle="62% of total" />
          <StatCard title="Failed/Cancelled" value="3" trend="-2%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-base font-semibold text-zinc-100 mb-6">Live Activity Feed</h3>
            <div className="space-y-4">
              <FeedItem amount="₹340" time="Just now" method="HoverPay Gesture" user="Alex S." status="Success" />
              <FeedItem amount="₹850" time="2 min ago" method="Standard UPI" user="Priya M." status="Success" />
              <FeedItem amount="₹120" time="5 min ago" method="HoverPay Gesture" user="Rahul K." status="Success" />
              <FeedItem amount="₹450" time="12 min ago" method="HoverPay Gesture" user="Neha D." status="Failed" />
              <FeedItem amount="₹210" time="15 min ago" method="Standard UPI" user="Amit V." status="Success" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-base font-semibold text-zinc-100 mb-6">Payment Methods</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">HoverPay (Gesture)</span>
                  <span className="text-zinc-100 font-medium">62%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[62%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Standard QR Scan</span>
                  <span className="text-zinc-100 font-medium">38%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[38%]" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex gap-3">
              <Smartphone className="text-emerald-500 shrink-0" size={20} />
              <p className="text-sm text-zinc-400 leading-relaxed">
                HoverPay transactions have a <strong className="text-zinc-200">0% dispute rate</strong> today due to on-device physical confirmation.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend, subtitle, up }: any) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm font-medium text-zinc-400 mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-zinc-100 mb-2">{value}</h3>
      {trend && (
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-500' : 'text-zinc-500'}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend} from yesterday
        </div>
      )}
      {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
    </div>
  )
}

function FeedItem({ amount, time, method, user, status }: any) {
  const isSuccess = status === "Success";
  return (
    <div className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-xl transition-colors border border-transparent hover:border-zinc-800">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuccess ? 'bg-zinc-950 border border-zinc-800' : 'bg-red-500/10 border border-red-500/20'}`}>
          {isSuccess ? <Users size={16} className="text-zinc-400" /> : <span className="text-red-400 text-xs font-bold">!</span>}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-200">{user}</p>
          <p className="text-xs text-zinc-500">{method}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isSuccess ? 'text-zinc-100' : 'text-red-400 line-through opacity-70'}`}>{amount}</p>
        <p className="text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  )
}