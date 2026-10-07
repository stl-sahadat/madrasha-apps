"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Printer, 
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Scale
} from "lucide-react";
import { CashTransaction, MadrasaInfo } from "@/types";
import { formatDateToDMY } from "@/lib/dateUtils";

interface DailyAuditReportViewProps {
  transactions: CashTransaction[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialTab?: "daily" | "yearly" | "bank";
  onTabChange?: (tab: "daily" | "yearly" | "bank") => void;
}

export const DailyAuditReportView: React.FC<DailyAuditReportViewProps> = ({
  transactions,
  madrasa,
  onBack,
  initialTab = "daily",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<"daily" | "yearly" | "bank">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "daily" | "yearly" | "bank") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedBank, setSelectedBank] = useState<string>("ইসলামী ব্যাংক বাংলাদেশ লিঃ");

  // দৈনিক লেনদেন ফিল্টার
  const dailyIncome = transactions.filter(t => t.type === "income" && t.date === selectedDate);
  const dailyExpense = transactions.filter(t => t.type === "expense" && t.date === selectedDate);

  // ডিফল্ট বা নমুনা আয়-ব্যয় ডাটা (যদি আজকের দিনে কোনো ট্রানজেকশন না থাকে তাহলে ভিজুয়াল প্রদর্শনীর জন্য)
  const displayIncome = dailyIncome.length > 0 ? dailyIncome : [
    { id: "inc_1", type: "income" as const, category: "ছাত্রদের মাসিক বেতন ও বোর্ডিং ফি", fundType: "general" as const, amount: 18500, date: selectedDate, description: "রশিদ নং ১০১-১১২" },
    { id: "inc_2", type: "income" as const, category: "সাধারণ এককালীন অনুদান", fundType: "general" as const, amount: 5000, date: selectedDate, description: "রশিদ নং ১১৪" },
    { id: "inc_3", type: "income" as const, category: "লিল্লাহ ফান্ড যাকাত গ্রহণ", fundType: "lillah_zakat" as const, amount: 12000, date: selectedDate, description: "রশিদ নং ১১৫" }
  ];

  const displayExpense = dailyExpense.length > 0 ? dailyExpense : [
    { id: "exp_1", type: "expense" as const, category: "দৈনিক বাজার খরচ (চাল, ডাল, তেল)", fundType: "general" as const, amount: 4800, date: selectedDate, description: "ভাউচার নং ২০৪" },
    { id: "exp_2", type: "expense" as const, category: "বিদ্যুৎ ও গ্যাস বিল", fundType: "general" as const, amount: 3200, date: selectedDate, description: "ভাউচার নং ২০৫" },
    { id: "exp_3", type: "expense" as const, category: "মেহমানদারী ও আপ্যায়ন", fundType: "general" as const, amount: 850, date: selectedDate, description: "ভাউচার নং ২০৬" }
  ];

  const totalIncome = displayIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = displayExpense.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>দৈনিক ও বার্ষিক অডিট প্রতিবেদন</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মুহতামিম ও হিসাবরক্ষকের স্বাক্ষর সংবলিত অফিশিয়াল ক্যাশবুক ও বার্ষিক আয়-ব্যয় শিট
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* সাব-ট্যাব */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabChange("daily")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "daily"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              দৈনিক আয়-ব্যয় (ক্যাশবুক)
            </button>
            <button
              onClick={() => handleTabChange("yearly")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "yearly"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              বার্ষিক অডিট শিট
            </button>
            <button
              onClick={() => handleTabChange("bank")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "bank"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ব্যাংক স্টেটমেন্ট
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* ১. দৈনিক জমা ও খরচের প্রতিবেদন (স্ক্রিনশট ৫৯ অনুরূপ) */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">তারিখ নির্বাচন (দিন/মাস/বছর):</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
              style={{ opacity: (madrasa.watermarkOpacity ?? 10) / 100 }}
            >
              <img src={madrasa.logoUrl || "/logo.png"} alt="watermark" className="w-80 h-80 object-contain" />
            </div>

            {/* প্রিন্ট হেডার */}
            <div className="text-center space-y-1 relative z-10">
              <div className="w-12 h-12 mx-auto mb-1">
                <img src={madrasa.logoUrl || "/logo.png"} alt="লোগো" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-300">
                  দৈনিক জমা ও খরচের বিবরণী (রোজনামচা ক্যাশবুক)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold pt-1">তারিখ: {formatDateToDMY(selectedDate)} ইং</p>
            </div>

            {/* দুই কলাম বিশিষ্ট লেজার টেবিল (বামে জমা, ডানে খরচ - স্ক্রিনশট ৫৯ অনুরূপ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-300 rounded-2xl overflow-hidden">
              {/* বাম পাশ: জমা / আয় */}
              <div className="border-r border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-black flex justify-between">
                    <span>আয়ের খাত ও বিবরণ</span>
                    <span>টাকা</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {displayIncome.map((inc) => (
                      <div key={inc.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{inc.category}</div>
                          <div className="text-[10px] text-slate-400">{inc.description}</div>
                        </div>
                        <span className="font-black text-emerald-700">৳ {inc.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-50/80 border-t border-slate-300 p-3 flex justify-between items-center text-xs font-black text-slate-900">
                  <span>মোট জমা:</span>
                  <span className="text-sm text-emerald-700">৳ {totalIncome.toLocaleString()}</span>
                </div>
              </div>

              {/* ডান পাশ: ব্যয় / খরচ */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-black flex justify-between">
                    <span>ব্যয়ের খাত ও বিবরণ</span>
                    <span>টাকা</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {displayExpense.map((exp) => (
                      <div key={exp.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{exp.category}</div>
                          <div className="text-[10px] text-slate-400">{exp.description}</div>
                        </div>
                        <span className="font-black text-rose-700">৳ {exp.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-rose-50/80 border-t border-slate-300 p-3 flex justify-between items-center text-xs font-black text-slate-900">
                  <span>মোট খরচ:</span>
                  <span className="text-sm text-rose-700">৳ {totalExpense.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* সারাংশ স্ট্রিপ (স্ক্রিনশট ৫৯ অনুরূপ) */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
              <div className="border-r border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">মোট জমা</span>
                <span className="text-base font-black text-emerald-700">৳ {totalIncome.toLocaleString()}</span>
              </div>
              <div className="border-r border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">মোট খরচ</span>
                <span className="text-base font-black text-rose-700">৳ {totalExpense.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">অবশিষ্ট নিট স্থিতি</span>
                <span className="text-base font-black text-indigo-700">৳ {netBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* অফিশিয়াল স্বাক্ষর ব্লক (স্ক্রিনশট ৫৯ অনুরূপ) */}
            <div className="pt-16 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-48">
                মুহতামিম সাহেবের স্বাক্ষর
              </div>
              <div className="text-center border-t border-slate-400 pt-2 w-48">
                হিসাব রক্ষকের স্বাক্ষর
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ২. বার্ষিক জমা ও খরচের বিবরণী (স্ক্রিনশট ৬১ অনুরূপ) */}
      {activeTab === "yearly" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block">বছর:</label>
                <input
                  type="text"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold w-24"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block">শুরু তারিখ (দিন/মাস/বছর):</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block">শেষ তারিখ (দিন/মাস/বছর):</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-300">
                  বার্ষিক জমা ও খরচের বিবরণী - {selectedYear} ইং
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold pt-1">{formatDateToDMY(startDate)} থেকে {formatDateToDMY(endDate)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-300 rounded-2xl overflow-hidden">
              <div className="border-r border-slate-300">
                <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-black flex justify-between">
                  <span>আয়ের প্রধান খাতসমূহ</span>
                  <span>টাকা</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs font-medium p-2 space-y-1">
                  <div className="flex justify-between p-2"><span>শিক্ষার্থীদের মাসিক বেতন ও ভর্তি ফি</span><span className="font-bold">৳ ৫,২০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>লিল্লাহ ফান্ড ও যাকাত গ্রহণ</span><span className="font-bold">৳ ৪,৫০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>মাসিক চাঁদাদাতাদের অনুদান</span><span className="font-bold">৳ ২,৪০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>দানবাক্স ও সাধারণ দান-সদকা</span><span className="font-bold">৳ ১,৮০,০০০</span></div>
                </div>
                <div className="bg-emerald-50 border-t border-slate-300 p-3 flex justify-between text-xs font-black">
                  <span>মোট আয়:</span><span className="text-emerald-700">৳ ১৩,৯০,০০০</span>
                </div>
              </div>

              <div>
                <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-black flex justify-between">
                  <span>ব্যয়ের প্রধান খাতসমূহ</span>
                  <span>টাকা</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs font-medium p-2 space-y-1">
                  <div className="flex justify-between p-2"><span>শিক্ষক ও স্টাফগণের বেতন-ভাতা</span><span className="font-bold">৳ ৬,৫০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>বোর্ডিং মেস ও সাপ্তাহিক/মাসিক বাজার</span><span className="font-bold">৳ ৩,৮০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>ভবন ভাড়া, বিদ্যুৎ ও গ্যাস বিল</span><span className="font-bold">৳ ১,১০,০০০</span></div>
                  <div className="flex justify-between p-2"><span>বই-খাতা, প্রিন্টিং ও অফিস খরচ</span><span className="font-bold">৳ ৫০,০০০</span></div>
                </div>
                <div className="bg-rose-50 border-t border-slate-300 p-3 flex justify-between text-xs font-black">
                  <span>মোট খরচ:</span><span className="text-rose-700">৳ ১১,৯০,০০০</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">মোট জমা</span>
                <span className="text-base font-black text-emerald-700">৳ ১৩,৯০,০০০</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">মোট খরচ</span>
                <span className="text-base font-black text-rose-700">৳ ১১,৯০,০০০</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px]">অবশিষ্ট তহবিল (উদ্বৃত্ত)</span>
                <span className="text-base font-black text-indigo-700">৳ ২,০০,০০০</span>
              </div>
            </div>

            <div className="pt-16 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-48">মুহতামিম সাহেবের স্বাক্ষর</div>
              <div className="text-center border-t border-slate-400 pt-2 w-48">হিসাব রক্ষকের স্বাক্ষর</div>
            </div>
          </div>
        </div>
      )}

      {/* ৩. ব্যাংক হিসাব প্রতিবেদন (স্ক্রিনশট ৬২ অনুরূপ) */}
      {activeTab === "bank" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option>ইসলামী ব্যাংক বাংলাদেশ লিঃ (A/C: 2050110022)</option>
                <option>আল-আরাফাহ ইসলামী ব্যাংক লিঃ (A/C: 014233001)</option>
                <option>বিকাশ মার্চেন্ট একাউন্ট (01700000000)</option>
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <div className="text-xs font-bold text-indigo-700 uppercase">ব্যাংক হিসাব ও লেনদেন প্রতিবেদন</div>
              <p className="text-xs text-slate-500 font-medium">হিসাব: {selectedBank}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-2.5 px-3">তারিখ</th>
                    <th className="py-2.5 px-3">বিবরণ / চেক নং</th>
                    <th className="py-2.5 px-3 text-right">জমা (Deposit)</th>
                    <th className="py-2.5 px-3 text-right">উত্তোলন (Withdraw)</th>
                    <th className="py-2.5 px-3 text-right">ব্যালেন্স</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">2025-01-05</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">প্রাথমিক তহবিল জমা</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-700">৳ ৫,০০,০০০</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-black text-indigo-700">৳ ৫,০০,০০০</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">2025-01-20</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">শিক্ষক বেতন উত্তোলন (চেক #৪৫১২)</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-700">৳ ২,০০,০০০</td>
                    <td className="py-2.5 px-3 text-right font-black text-indigo-700">৳ ৩,০০,০০০</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">2025-02-02</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">অনলাইন অনুদান জমা</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-700">৳ ১,৫০,০০০</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-black text-indigo-700">৳ ৪,৫০,০০০</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
