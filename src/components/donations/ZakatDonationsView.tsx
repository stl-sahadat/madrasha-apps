"use client";

import React, { useState } from "react";
import { 
  HeartHandshake, 
  Plus, 
  Receipt, 
  Search, 
  Printer, 
  Sparkles, 
  Coins, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  X,
  CreditCard,
  Banknote
} from "lucide-react";
import { DonationRecord, MadrasaInfo } from "@/types";

interface ZakatDonationsViewProps {
  donations: DonationRecord[];
  madrasa: MadrasaInfo;
  onAddDonation: (donation: Omit<DonationRecord, "id">) => void;
  onBack?: () => void;
}

export const ZakatDonationsView: React.FC<ZakatDonationsViewProps> = ({
  donations,
  madrasa,
  onAddDonation,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonationForReceipt, setSelectedDonationForReceipt] = useState<DonationRecord | null>(null);

  // নতুন দান ফর্ম স্টেট
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donationType, setDonationType] = useState<DonationRecord["type"]>("zakat");
  const [amount, setAmount] = useState<number>(5000);
  const [purpose, setPurpose] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<DonationRecord["paymentMethod"]>("cash");

  // হিসাবসমূহ
  const totalZakat = donations
    .filter((d) => d.type === "zakat")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalFitra = donations
    .filter((d) => d.type === "fitra")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalSadqa = donations
    .filter((d) => d.type === "sadqa" || d.type === "general")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDonationAmount = totalZakat + totalFitra + totalSadqa;

  // ফিল্টার করা তালিকা
  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmitNewDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || amount <= 0) return;

    const receiptNumber = `${donationType === "zakat" ? "ZKT" : donationType === "fitra" ? "FTR" : "DON"}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonationData = {
      donorName,
      phone: donorPhone || "০১৭১১০০০০০০",
      address: donorAddress || "ঢাকা",
      type: donationType,
      amount: Number(amount),
      purpose: purpose || (donationType === "zakat" ? "লিল্লাহ ফান্ডে যাকাত" : "সাধারণ দান"),
      paymentMethod,
      date: new Date().toISOString().split("T")[0],
      receiptNumber,
    };

    onAddDonation(newDonationData);
    setShowAddModal(false);

    // অটো রসিদ প্রিভিউ খোলা
    setSelectedDonationForReceipt({
      ...newDonationData,
      id: `don_${Date.now()}`,
    });

    // ফর্ম রিসেট
    setDonorName("");
    setDonorPhone("");
    setDonorAddress("");
    setAmount(5000);
    setPurpose("");
  };

  const getTypeName = (type: DonationRecord["type"]) => {
    switch (type) {
      case "zakat":
        return "যাকাত ফান্ড";
      case "fitra":
        return "সদকাতুল ফিতর";
      case "sadqa":
        return "নফল সদকা";
      default:
        return "সাধারণ দান";
    }
  };

  const getTypeBadgeClass = (type: DonationRecord["type"]) => {
    switch (type) {
      case "zakat":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "fitra":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "sadqa":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* হেডার ও রসিদ বাটন */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#022c22] to-[#0f172a] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-amber-400/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
                ৪র্থ স্তম্ভ • দান ও সদকা ফান্ড
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              যাকাত, ফিতরা ও দান-সদকা ব্যবস্থাপনা
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              এতিম ও গরীব ছাত্রদের খাবার ফান্ড, লিল্লাহ ফান্ড এবং তাৎক্ষণিক ডিজিটাল মানি রিসিট প্রদান
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>➕ নতুন দান গ্রহণ ও রসিদ তৈরি</span>
            </button>
          </div>
        </div>
      </div>

      {/* ৪টি আর্থিক সারসংক্ষেপ কার্ড (রয়েল গোল্ড ও এমারেল্ড লুক) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* মোট ফান্ড */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-sm relative overflow-hidden">
          <div className="w-2 h-full bg-amber-500 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 block">মোট দান-অনুদান</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ৳ {totalDonationAmount.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            {donations.length} জন সম্মানিত দানকারী
          </span>
        </div>

        {/* যাকাত ফান্ড */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="w-2 h-full bg-emerald-600 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 block">যাকাত ফান্ড (লিল্লাহ)</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ৳ {totalZakat.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            এতিম ও গরীব ছাত্রদের জন্য সংরক্ষিত
          </span>
        </div>

        {/* সদকাতুল ফিতর */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-yellow-200/80 shadow-sm relative overflow-hidden">
          <div className="w-2 h-full bg-yellow-500 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 block">সদকাতুল ফিতর</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ৳ {totalFitra.toLocaleString()}
          </p>
          <span className="text-[11px] text-yellow-700 font-semibold mt-1 block">
            রমযান ও ঈদুল ফিতর কালেকশন
          </span>
        </div>

        {/* নফল সদকা ও সাধারণ দান */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/80 shadow-sm relative overflow-hidden">
          <div className="w-2 h-full bg-purple-600 absolute left-0 top-0" />
          <span className="text-xs font-bold text-slate-500 block">সদকা ও সাধারণ অনুদান</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ৳ {totalSadqa.toLocaleString()}
          </p>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            মাদরাসার উন্নয়ন ও উন্নয়ন কাজ
          </span>
        </div>
      </div>

      {/* ফিল্টার ও সার্চ বার */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="দানকারীর নাম, মোবাইল বা রসিদ নং দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            সকল দান
          </button>
          <button
            onClick={() => setFilterType("zakat")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === "zakat"
                ? "bg-emerald-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            যাকাত
          </button>
          <button
            onClick={() => setFilterType("fitra")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === "fitra"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ফিতরা
          </button>
          <button
            onClick={() => setFilterType("sadqa")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === "sadqa"
                ? "bg-purple-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            সদকা
          </button>
        </div>
      </div>

      {/* দানকারীদের রসিদ তালিকা */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>দান ও অনুদানের ভাউচার রেজিস্টার ({filteredDonations.length}টি এন্ট্রি)</span>
          </h3>
          <span className="text-xs text-slate-500">
            রসিদ নম্বরে ক্লিক করে ডিজিটাল মানি রিসিট প্রিন্ট করুন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">রসিদ নং</th>
                <th className="p-3.5">দানকারীর নাম</th>
                <th className="p-3.5">মোবাইল ও ঠিকানা</th>
                <th className="p-3.5">দানের খাত</th>
                <th className="p-3.5">উদ্দেশ্য / বিবরণ</th>
                <th className="p-3.5 text-right">টাকার পরিমাণ</th>
                <th className="p-3.5 text-center">ডিজিটাল রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDonations.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-slate-900 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                      {item.receiptNumber}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">{item.date}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 text-sm">
                    {item.donorName}
                  </td>
                  <td className="p-3.5 space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{item.phone}</span>
                    </div>
                    {item.address && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.address}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {getTypeName(item.type)}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-xs truncate text-slate-600">
                    {item.purpose || "লিল্লাহ ফান্ডে অনুদান"}
                    <span className="block text-[10px] text-slate-400 capitalize">
                      পেমেন্ট: {item.paymentMethod === "bkash" ? "বিকাশ" : item.paymentMethod === "bank" ? "ব্যাংক" : "ক্যাশ ক্যাশ"}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-black text-sm text-emerald-800">
                    ৳ {item.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedDonationForReceipt(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs transition-all active:scale-95 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                      <span>রসিদ দেখুন</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* নতুন দান গ্রহণ মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ➕ নতুন যাকাত / দান-সদকা ভাউচার তৈরি
                </h3>
                <p className="text-xs text-slate-500">তাত্ক্ষণিকভাবে ডিজিটাল রসিদ জেনারেট হবে</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewDonation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সম্মানিত দানকারীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="যেমন: আলহাজ্ব রফিকুল ইসলাম"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="০১৭১১০০০০০০"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    value={donorAddress}
                    onChange={(e) => setDonorAddress(e.target.value)}
                    placeholder="ধানমন্ডি, ঢাকা"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">দানের খাত</label>
                  <select
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="zakat">যাকাত ফান্ড (লিল্লাহ)</option>
                    <option value="fitra">সদকাতুল ফিতর</option>
                    <option value="sadqa">নফল সদকা</option>
                    <option value="general">সাধারণ অনুদান</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-black text-emerald-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পরিশোধের মাধ্যম</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-1.5 rounded-xl font-bold border ${
                      paymentMethod === "cash"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    নগদ ক্যাশ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`py-1.5 rounded-xl font-bold border ${
                      paymentMethod === "bkash"
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    বিকাশ/নগদ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`py-1.5 rounded-xl font-bold border ${
                      paymentMethod === "bank"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    ব্যাংক একাউন্ট
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">দানের উদ্দেশ্য বা দোয়া চাওয়া</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="যেমন: মরহুম পিতা-মাতার মাগফিরাত কামনায়..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>জমা করুন ও রসিদ কাটুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ডিজিটাল মানি রিসিট প্রিন্ট মডাল */}
      {selectedDonationForReceipt && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-auto relative">
            <button
              onClick={() => setSelectedDonationForReceipt(null)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* প্রিন্টযোগ্য মানি রিসিট বক্স */}
            <div className="p-6 border-2 border-dashed border-emerald-600 rounded-2xl bg-emerald-50/30 space-y-4">
              {/* রসিদের হেডার */}
              <div className="text-center border-b border-emerald-200/80 pb-3">
                <span className="text-[11px] font-bold text-emerald-800 tracking-wider">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{madrasa.name}</h3>
                <p className="text-[11px] text-slate-500">{madrasa.address} | ফোন: {madrasa.phone}</p>
                <div className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-full text-xs shadow-sm">
                  দান ও অনুদানের মানি রিসিট
                </div>
              </div>

              {/* রসিদ মেটা তথ্য */}
              <div className="flex justify-between items-center text-xs text-slate-600 pb-2 border-b border-slate-200">
                <span>
                  রসিদ নং: <b className="font-mono text-slate-900">{selectedDonationForReceipt.receiptNumber}</b>
                </span>
                <span>
                  তারিখ: <b className="text-slate-900">{selectedDonationForReceipt.date}</b>
                </span>
              </div>

              {/* দানকারীর তথ্য */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">সম্মানিত দানকারীর নাম:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedDonationForReceipt.donorName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedDonationForReceipt.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">দানের খাত:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {getTypeName(selectedDonationForReceipt.type)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">উদ্দেশ্য / বিবরণ:</span>
                  <span className="text-slate-700 font-medium">
                    {selectedDonationForReceipt.purpose || "লিল্লাহ ফান্ডে সদকা"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm">
                  <span className="font-bold text-slate-800">আদায়কৃত টাকার পরিমাণ:</span>
                  <span className="font-black text-emerald-800 text-lg">
                    ৳ {selectedDonationForReceipt.amount.toLocaleString()} /-
                  </span>
                </div>
              </div>

              {/* দোয়া ও কিউআর নোট */}
              <div className="pt-2 text-center text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                <p className="font-semibold text-amber-900">
                  “আল্লাহ তাআলা আপনার দানকে কবুল করুন এবং দুনিয়া ও আখিরাতে উত্তম বিনিময় দান করুন। আমিন।”
                </p>
              </div>

              {/* স্বাক্ষর */}
              <div className="flex justify-between items-end pt-6 text-[11px] text-slate-500">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 mb-1" />
                  <span>আদায়কারীর স্বাক্ষর</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-slate-400 mb-1" />
                  <span>মুহতামিম / ক্যাশিয়ার</span>
                </div>
              </div>
            </div>

            {/* প্রিন্ট ও বন্ধ অ্যাকশন */}
            <div className="flex gap-2 justify-end no-print pt-2">
              <button
                onClick={() => setSelectedDonationForReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন (Print Slip)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
