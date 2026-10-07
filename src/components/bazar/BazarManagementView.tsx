"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Receipt,
  FileText,
  AlertCircle,
  Clock,
  Layers,
  ShoppingBag,
  TrendingDown,
  Building2,
  X
} from "lucide-react";
import { DailyBazarItem, MadrasaInfo } from "@/types";
import { formatDateToDMY } from "@/lib/dateUtils";

interface BazarManagementViewProps {
  madrasa: MadrasaInfo;
  bazarItems: DailyBazarItem[];
  onAddBazarItem: (item: Omit<DailyBazarItem, "id">) => void;
  onBack: () => void;
  initialTab?: "weekly_entry" | "monthly_entry" | "weekly_list" | "monthly_list" | "weekly_report" | "monthly_report";
}

interface ExtendedBazarItem extends DailyBazarItem {
  type: "weekly" | "monthly";
  category: string;
  unitPrice?: number;
  paymentAccount?: string;
  memoNumber?: string;
}

const INITIAL_BAZAR_DATA: ExtendedBazarItem[] = [
  {
    id: "baz_1",
    date: "2025-03-24",
    item: "মিনিকেট চাল (২ বস্তা), মসুর ডাল (১০ কেজি)",
    quantity: "১১০ কেজি",
    unitPrice: 75,
    cost: 8250,
    shopperName: "মাওলানা আব্দুল মান্নান (বাবুর্চি সহকারী)",
    type: "weekly",
    category: "চাল ও ডাল",
    paymentAccount: "ক্যাশ ফান্ড",
    memoNumber: "BZ-401"
  },
  {
    id: "baz_2",
    date: "2025-03-22",
    item: "রুই মাছ (১৫ কেজি), ব্রয়লার মুরগি (২০ কেজি)",
    quantity: "৩৫ কেজি",
    unitPrice: 220,
    cost: 7700,
    shopperName: "হাফেজ মোঃ ইউসুফ",
    type: "weekly",
    category: "মাছ ও গোশত",
    paymentAccount: "ক্যাশ ফান্ড",
    memoNumber: "BZ-402"
  },
  {
    id: "baz_3",
    date: "2025-03-20",
    item: "সয়াবিন তেল (৫ লিটার ৪টি), পেঁয়াজ, রসুন ও মসলা",
    quantity: "১ কার্টুন ও মসলা",
    unitPrice: 950,
    cost: 5400,
    shopperName: "মাওলানা আব্দুর রহিম",
    type: "weekly",
    category: "তেল ও মশলা",
    paymentAccount: "বিকাশ ফান্ড",
    memoNumber: "BZ-403"
  },
  {
    id: "baz_4",
    date: "2025-03-15",
    item: "আলু, পটল, ঢেঁড়শ, বেগুন, কাঁচামরিচ ও শাকসবজি",
    quantity: "৬০ কেজি",
    unitPrice: 45,
    cost: 2700,
    shopperName: "বাবুর্চি মোঃ কালাম",
    type: "weekly",
    category: "কাঁচা তরকারি",
    paymentAccount: "ক্যাশ ফান্ড",
    memoNumber: "BZ-404"
  },
  {
    id: "baz_5",
    date: "2025-03-01",
    item: "মাসের পাইকারি চাল (১০ বস্তা নাজিরশাইল) ও আটা (৫ বস্তা)",
    quantity: "৬৫০ কেজি",
    unitPrice: 3100,
    cost: 38500,
    shopperName: "মুহতামিম সাহেব ও সহকারী",
    type: "monthly",
    category: "পাইকারি খাদ্য সামগ্রী",
    paymentAccount: "ইসলামী ব্যাংক ফান্ড",
    memoNumber: "MB-101"
  },
  {
    id: "baz_6",
    date: "2025-03-01",
    item: "মাসের রান্নার গ্যাস সিলিন্ডার (৪টি রিফিল)",
    quantity: "৪ টি সিলিন্ডার",
    unitPrice: 1450,
    cost: 5800,
    shopperName: "মাওলানা আব্দুল মান্নান",
    type: "monthly",
    category: "জ্বালানি ও গ্যাস",
    paymentAccount: "ক্যাশ ফান্ড",
    memoNumber: "MB-102"
  }
];

export const BazarManagementView: React.FC<BazarManagementViewProps> = ({
  madrasa,
  bazarItems,
  onAddBazarItem,
  onBack,
  initialTab = "weekly_entry"
}) => {
  const [activeTab, setActiveTab] = useState<"weekly_entry" | "monthly_entry" | "weekly_list" | "monthly_list" | "weekly_report" | "monthly_report">(initialTab);
  const [itemsList, setItemsList] = useState<ExtendedBazarItem[]>(INITIAL_BAZAR_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("মার্চ ২০২৫ - সপ্তাহ ৪");
  const [selectedMonth, setSelectedMonth] = useState("মার্চ ২০২৫");
  const [availableCashBalance, setAvailableCashBalance] = useState<number>(45800); // ভিডিওর ব্যালেন্স চেক লজিক

  // এন্ট্রি ফর্ম স্টেট
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [shopperName, setShopperName] = useState("মাওলানা আব্দুল মান্নান");
  const [category, setCategory] = useState("চাল ও ডাল");
  const [paymentAccount, setPaymentAccount] = useState("ক্যাশ ফান্ড (হাতে নগদ)");
  const [memoNumber, setMemoNumber] = useState(`BZ-${Math.floor(400 + Math.random() * 500)}`);
  const [remarks, setRemarks] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  // প্রিন্ট ভাউচার মডাল
  const [selectedVoucher, setSelectedVoucher] = useState<ExtendedBazarItem | null>(null);

  // অটো মোট খরচ ক্যালকুলেশন
  const handleUnitPriceChange = (price: number) => {
    setUnitPrice(price);
    const qtyNum = parseFloat(quantity.replace(/[^0-9.]/g, "")) || 1;
    setTotalCost(Math.round(price * qtyNum));
  };

  const handleQtyChange = (val: string) => {
    setQuantity(val);
    const qtyNum = parseFloat(val.replace(/[^0-9.]/g, "")) || 1;
    if (typeof unitPrice === "number") {
      setTotalCost(Math.round(unitPrice * qtyNum));
    }
  };

  const handleSaveBazar = (type: "weekly" | "monthly") => {
    setBalanceError("");
    if (!itemName.trim() || totalCost <= 0) {
      alert("অনুগ্রহ করে আইটেম নাম এবং টাকার সঠিক পরিমাণ দিন!");
      return;
    }

    // ভিডিওতে যেমন উল্লেখ: ব্যালেন্স থাকলেই খরচ এন্ট্রি হবে
    if (totalCost > availableCashBalance) {
      setBalanceError(`অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ক্যাশ ব্যালেন্স: ৳${availableCashBalance.toLocaleString("bn-BD")}। ব্যালেন্সের অতিরিক্ত খরচ এন্ট্রি করা যাবে না।`);
      return;
    }

    const newItem: ExtendedBazarItem = {
      id: `baz_${Date.now()}`,
      date: entryDate,
      item: itemName,
      quantity: quantity || "প্রয়োজনীয় পরিমাণ",
      unitPrice: typeof unitPrice === "number" ? unitPrice : 0,
      cost: totalCost,
      shopperName: shopperName || "বাজার ইনচার্জ",
      type,
      category,
      paymentAccount,
      memoNumber: memoNumber || `BZ-${Math.floor(100 + Math.random() * 900)}`
    };

    setItemsList([newItem, ...itemsList]);
    setAvailableCashBalance(prev => prev - totalCost);
    
    // মূল প্রপস হ্যান্ডলারে পাস করা
    onAddBazarItem({
      date: newItem.date,
      item: newItem.item,
      quantity: newItem.quantity,
      cost: newItem.cost,
      shopperName: newItem.shopperName
    });

    setSaveSuccess(true);
    setSelectedVoucher(newItem);

    // ফর্ম রিসেট
    setItemName("");
    setQuantity("");
    setUnitPrice("");
    setTotalCost(0);
    setMemoNumber(`BZ-${Math.floor(400 + Math.random() * 500)}`);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  // ফিল্টার করা তালিকা
  const weeklyItems = itemsList.filter(i => i.type === "weekly");
  const monthlyItems = itemsList.filter(i => i.type === "monthly");

  const totalWeeklyCost = weeklyItems.reduce((acc, curr) => acc + curr.cost, 0);
  const totalMonthlyCost = monthlyItems.reduce((acc, curr) => acc + curr.cost, 0);

  const displayedList = (activeTab === "weekly_list" || activeTab === "weekly_report") ? weeklyItems : monthlyItems;
  const filteredList = displayedList.filter(i => 
    i.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.shopperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.memoNumber && i.memoNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* শীর্ষ হেডার */}
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
              <ShoppingCart className="w-6 h-6 text-amber-600" />
              <span>বাজার ব্যবস্থাপনা ও খাদ্য রসদ খরচ</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মাদরাসার বোর্ডিং ও মেসের সাপ্তাহিক বাজার, মাসিক বাজার, খরচের তালিকা ও প্রতিবেদন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* ক্যাশ ব্যালেন্স স্ট্যাটাস ব্যাজ (ভিডিও অনুযায়ী) */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">বর্তমান ক্যাশ ব্যালেন্স</div>
              <div className="text-sm font-black text-amber-950 font-mono">৳ {availableCashBalance.toLocaleString("bn-BD")}</div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* সাব-ট্যাব ন্যাভিগেশন (ভিডিও টিউটোরিয়ালের হুবহু মেনু) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 no-print overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("weekly_entry")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "weekly_entry"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>সাপ্তাহিক বাজার এন্ট্রি</span>
        </button>

        <button
          onClick={() => setActiveTab("monthly_entry")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "monthly_entry"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>মাসিক বাজার এন্ট্রি</span>
        </button>

        <button
          onClick={() => setActiveTab("weekly_list")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "weekly_list"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>সাপ্তাহিক বাজারের তালিকা</span>
        </button>

        <button
          onClick={() => setActiveTab("monthly_list")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "monthly_list"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>মাসিক বাজারের তালিকা</span>
        </button>

        <button
          onClick={() => setActiveTab("weekly_report")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "weekly_report"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>সাপ্তাহিক বাজারের রিপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveTab("monthly_report")}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === "monthly_report"
              ? "bg-[#0B0F19] text-amber-400 shadow-md font-black"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>মাসিক বাজারের রিপোর্ট</span>
        </button>
      </div>

      {/* ব্যালেন্স অ্যালার্ট এরর মেসেজ */}
      {balanceError && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold no-print">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{balanceError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-bold no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>বাজার খরচের ভাউচার সফলভাবে সংরক্ষণ করা হয়েছে এবং ব্যালেন্স থেকে কর্তন করা হয়েছে!</span>
          </div>
          <button 
            onClick={() => setSelectedVoucher(itemsList[0])}
            className="px-3 py-1 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            ভাউচার প্রিন্ট করুন
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ১ ও ২: সাপ্তাহিক / মাসিক বাজার এন্ট্রি ফর্ম */}
      {/* ========================================================================= */}
      {(activeTab === "weekly_entry" || activeTab === "monthly_entry") && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>
                  {activeTab === "weekly_entry" ? "নতুন সাপ্তাহিক বাজার এন্ট্রি সিস্টেম" : "নতুন মাসিক পাইকারি বাজার এন্ট্রি সিস্টেম"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                আইটেম ও টাকার পরিমাণ লিখে এন্ট্রি করুন। ব্যালেন্স থাকলেই সফলভাবে সংরক্ষণ হবে।
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-xl ${activeTab === "weekly_entry" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"}`}>
              {activeTab === "weekly_entry" ? "সাপ্তাহিক" : "মাসিক"} বাজার ভাউচার
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                বাজারের তারিখ (দিন/মাস/বছর) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                ভাউচার / মেমো নম্বর
              </label>
              <input
                type="text"
                value={memoNumber}
                onChange={(e) => setMemoNumber(e.target.value)}
                placeholder="যেমন: BZ-405"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                বাজারের খাত / শ্রেণি <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="চাল ও ডাল">চাল ও ডাল</option>
                <option value="মাছ ও গোশত">মাছ ও গোশত (গরু, খাসি, মুরগি)</option>
                <option value="তেল ও মশলা">তেল ও মশলা সামগ্রী</option>
                <option value="কাঁচা তরকারি">কাঁচা শাক-সবজি ও আলু</option>
                <option value="পাইকারি খাদ্য সামগ্রী">পাইকারি খাদ্য সামগ্রী</option>
                <option value="জ্বালানি ও গ্যাস">রান্নার গ্যাস ও লাকড়ি</option>
                <option value="নাস্তা ও চা">ছাত্র ও মেহমানদের নাস্তা</option>
                <option value="অন্যান্য খাদ্য খরচ">অন্যান্য খাদ্য খরচ</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">
                বাজার সামগ্রী ও পণ্যের বিবরণ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="যেমন: নাজিরশাইল চাল ২ বস্তা, মসুর ডাল ৫ কেজি, আলু ১০ কেজি"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                পরিমাণ (কেজি / বস্তা / লিটার)
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => handleQtyChange(e.target.value)}
                placeholder="যেমন: ৫০ কেজি বা ২ বস্তা"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                একক দর (প্রতি কেজি/লিটার রেট)
              </label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
                placeholder="যেমন: ৭০"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                মোট খরচ (৳) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={totalCost || ""}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                placeholder="যেমন: ৩৫০০"
                className="w-full px-3.5 py-2.5 bg-amber-50/70 border border-amber-300 rounded-xl font-mono text-sm font-black text-amber-950 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                পেমেন্ট একাউন্ট / ফান্ড <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="ক্যাশ ফান্ড (হাতে নগদ)">ক্যাশ ফান্ড (হাতে নগদ)</option>
                <option value="বিকাশ মার্চেন্ট একাউন্ট">বিকাশ মার্চেন্ট একাউন্ট</option>
                <option value="ইসলামী ব্যাংক বাংলাদেশ লিঃ">ইসলামী ব্যাংক বাংলাদেশ লিঃ</option>
                <option value="আল-আরাফাহ ইসলামী ব্যাংক লিঃ">আল-আরাফাহ ইসলামী ব্যাংক লিঃ</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                বাজারকারীর নাম / দায়িত্বশীল <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={shopperName}
                onChange={(e) => setShopperName(e.target.value)}
                placeholder="যেমন: মাওলানা আব্দুল মান্নান"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1.5">
                মন্তব্য / দোকানের নাম বা বিবরণ
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="যেমন: চকবাজার ভাই ভাই স্টোর থেকে কেনা"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * ব্যালেন্স যাচাই করা হবে। ব্যালেন্সের অতিরিক্ত পরিমাণ এন্ট্রি করতে দেবে না।
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setItemName("");
                  setQuantity("");
                  setUnitPrice("");
                  setTotalCost(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                রিসেট
              </button>
              <button
                type="button"
                onClick={() => handleSaveBazar(activeTab === "weekly_entry" ? "weekly" : "monthly")}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>বাজার খরচ সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৩ ও ৪: সাপ্তাহিক / মাসিক বাজারের তালিকা */}
      {/* ========================================================================= */}
      {(activeTab === "weekly_list" || activeTab === "monthly_list") && (
        <div className="space-y-4">
          {/* সার্চ ও ফিল্টার বার */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আইটেম, বাজারকারী বা মেমো নং খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs font-bold">
              <div className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                মোট খরচ: ৳ {(activeTab === "weekly_list" ? totalWeeklyCost : totalMonthlyCost).toLocaleString("bn-BD")}
              </div>
            </div>
          </div>

          {/* টেবিল */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B0F19] text-white border-b border-slate-800">
                    <th className="py-3.5 px-4 font-bold text-center">মেমো নং</th>
                    <th className="py-3.5 px-4 font-bold">তারিখ (দিন/মাস/বছর)</th>
                    <th className="py-3.5 px-4 font-bold">পণ্য ও সামগ্রীর বিবরণ</th>
                    <th className="py-3.5 px-4 font-bold">খাত</th>
                    <th className="py-3.5 px-4 font-bold">পরিমাণ</th>
                    <th className="py-3.5 px-4 font-bold text-right">খরচের পরিমাণ (৳)</th>
                    <th className="py-3.5 px-4 font-bold">বাজারকারী</th>
                    <th className="py-3.5 px-4 font-bold text-center no-print">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        কোনো বাজারের রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-center">{item.memoNumber || "BZ-101"}</td>
                        <td className="py-3.5 px-4 font-medium">{formatDateToDMY(item.date)}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.item}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{item.quantity}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-rose-600 text-right">
                          ৳ {item.cost.toLocaleString("bn-BD")}
                        </td>
                        <td className="py-3.5 px-4 font-medium">{item.shopperName}</td>
                        <td className="py-3.5 px-4 text-center no-print">
                          <button
                            onClick={() => setSelectedVoucher(item)}
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                            title="ভাউচার রশিদ দেখুন ও প্রিন্ট করুন"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৫ ও ৬: সাপ্তাহিক / মাসিক বাজারের রিপোর্ট */}
      {/* ========================================================================= */}
      {(activeTab === "weekly_report" || activeTab === "monthly_report") && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 no-print">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>
                  {activeTab === "weekly_report" ? "সাপ্তাহিক মেস ও বাজার খরচের পূর্ণাঙ্গ অডিট রিপোর্ট" : "মাসিক মেস ও পাইকারি বাজার খরচের সারসংক্ষেপ রিপোর্ট"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                অডিট ও কমিটির অনুমোদনের জন্য অফিসিয়াল মুদ্রিত প্রতিবেদন
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "weekly_report" ? (
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="মার্চ ২০২৫ - সপ্তাহ ৪">মার্চ ২০২৫ - সপ্তাহ ৪ (২২-২৮ মার্চ)</option>
                  <option value="মার্চ ২০২৫ - সপ্তাহ ৩">মার্চ ২০২৫ - সপ্তাহ ৩ (১৫-২১ মার্চ)</option>
                  <option value="মার্চ ২০২৫ - সপ্তাহ ২">মার্চ ২০২৫ - সপ্তাহ ২ (০৮-১৪ মার্চ)</option>
                  <option value="মার্চ ২০২৫ - সপ্তাহ ১">মার্চ ২০২৫ - সপ্তাহ ১ (০১-০৭ মার্চ)</option>
                </select>
              ) : (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="মার্চ ২০২৫">মার্চ ২০২৫</option>
                  <option value="ফেব্রুয়ারি ২০২৫">ফেব্রুয়ারি ২০২৫</option>
                  <option value="জানুয়ারি ২০২৫">জানুয়ারি ২০২৫</option>
                </select>
              )}

            </div>
          </div>

          {/* প্রিন্ট উপযোগী অফিসিয়াল লেটারহেড রিপোর্ট */}
          <div className="border border-slate-300 rounded-2xl p-6 sm:p-8 space-y-6 bg-slate-50/40">
            {/* প্যাড হেডার */}
            <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{madrasa.address} • মোবাইল: {madrasa.phone}</p>
              <div className="inline-block mt-2 px-4 py-1 bg-slate-900 text-amber-400 rounded-full text-xs font-bold tracking-wide">
                {activeTab === "weekly_report" ? `সাপ্তাহিক বাজার অডিট প্রতিবেদন (${selectedWeek})` : `মাসিক মেস খাদ্য রসদ ব্যয় বিবরণী (${selectedMonth})`}
              </div>
            </div>

            {/* সামারি কার্ডস */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-bold">মোট বাজার ভাউচার</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{displayedList.length} টি</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-bold">মোট খাদ্য রসদ ওজন</div>
                <div className="text-lg font-black text-indigo-700 mt-0.5">৩৮৫ কেজি</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-bold">গড় বাজার খরচ</div>
                <div className="text-lg font-black text-amber-700 mt-0.5">
                  ৳ {displayedList.length ? Math.round((activeTab === "weekly_report" ? totalWeeklyCost : totalMonthlyCost) / displayedList.length).toLocaleString("bn-BD") : 0}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 bg-amber-50/50">
                <div className="text-[11px] text-amber-800 font-bold">সর্বমোট খরচের পরিমাণ</div>
                <div className="text-lg font-black text-rose-700 mt-0.5">
                  ৳ {(activeTab === "weekly_report" ? totalWeeklyCost : totalMonthlyCost).toLocaleString("bn-BD")}
                </div>
              </div>
            </div>

            {/* রিপোর্ট আইটেম তালিকা */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-200/90 text-slate-800 border-b border-slate-300">
                    <th className="py-2.5 px-3 font-bold text-center border-r border-slate-300">ক্রমিক</th>
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300">তারিখ (দিন/মাস/বছর)</th>
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300">খাত</th>
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300">পণ্য ও সামগ্রী</th>
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300">পরিমাণ</th>
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300">দায়িত্বশীল</th>
                    <th className="py-2.5 px-3 font-bold text-right">টাকা (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {displayedList.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 text-center border-r border-slate-200">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{formatDateToDMY(item.date)}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{item.category}</td>
                      <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">{item.item}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{item.quantity}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{item.shopperName}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 text-right">
                        {item.cost.toLocaleString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={6} className="py-2.5 px-3 text-right border-r border-slate-300">সর্বমোট খাদ্য রসদ ব্যয়:</td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-rose-700">
                      ৳ {(activeTab === "weekly_report" ? totalWeeklyCost : totalMonthlyCost).toLocaleString("bn-BD")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* স্বাক্ষর বক্স */}
            <div className="pt-16 grid grid-cols-3 gap-8 text-center text-xs">
              <div className="border-t border-dashed border-slate-400 pt-2 font-bold text-slate-700">
                বাজারকারী / বাবুর্চির স্বাক্ষর
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2 font-bold text-slate-700">
                হিসাবরক্ষকের স্বাক্ষর
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2 font-bold text-slate-700">
                মুহতামিম / সম্পাদকের স্বাক্ষর
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* বাজার ক্যাশ ভাউচার প্রিন্ট মডাল */}
      {/* ========================================================================= */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">বাজার খরচের ডেবিট ভাউচার</h4>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border-2 border-slate-800 rounded-2xl p-5 space-y-4 bg-amber-50/20 printable-area text-xs">
              <div className="text-center pb-2 border-b border-slate-400 space-y-0.5">
                <h3 className="text-base font-black text-slate-900">{madrasa.name}</h3>
                <p className="text-[10px] text-slate-600">{madrasa.address} • মোবা: {madrasa.phone}</p>
                <div className="inline-block mt-1 px-3 py-0.5 bg-slate-900 text-amber-400 font-bold rounded-md text-[10px]">
                  মেস ও বাজার ডেবিট ভাউচার
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <div>মেমো নং: <span className="font-bold text-slate-900">{selectedVoucher.memoNumber || "BZ-401"}</span></div>
                <div>তারিখ: <span className="font-bold text-slate-900">{formatDateToDMY(selectedVoucher.date)}</span></div>
              </div>

              <div className="space-y-2 border-y border-slate-200 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">বাজারের খাত:</span>
                  <span className="font-bold text-slate-900">{selectedVoucher.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">সামগ্রীর বিবরণ:</span>
                  <span className="font-bold text-slate-900 max-w-[240px] text-right">{selectedVoucher.item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পরিমাণ:</span>
                  <span className="font-medium text-slate-900">{selectedVoucher.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">বাজারকারী:</span>
                  <span className="font-bold text-slate-900">{selectedVoucher.shopperName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পেমেন্ট মেথড:</span>
                  <span className="font-medium text-slate-900">{selectedVoucher.paymentAccount || "ক্যাশ ফান্ড"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 text-sm font-black">
                  <span>পরিশোধিত টাকা:</span>
                  <span className="text-rose-600 font-mono">৳ {selectedVoucher.cost.toLocaleString("bn-BD")}</span>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4 text-center text-[10px]">
                <div className="border-t border-dashed border-slate-500 pt-1 font-bold">বাজারকারী স্বাক্ষর</div>
                <div className="border-t border-dashed border-slate-500 pt-1 font-bold">মুহতামিম / হিসাবরক্ষক</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>ভাউচার প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
