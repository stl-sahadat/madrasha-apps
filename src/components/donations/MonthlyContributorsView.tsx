"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  Wallet,
  Phone,
  MapPin,
  X,
  UserPlus,
  FileText,
  CalendarDays,
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
  Receipt,
  Eye,
  Check,
  Filter
} from "lucide-react";
import { MadrasaInfo, MonthlyDonor } from "@/types";

interface MonthlyContributorsViewProps {
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialTab?: "add_donor" | "donor_list" | "collect_fee" | "single_statement" | "all_matrix";
  onTabChange?: (tab: "add_donor" | "donor_list" | "collect_fee" | "single_statement" | "all_matrix") => void;
}

const INITIAL_DONORS: MonthlyDonor[] = [
  {
    id: "donor_1",
    name: "আলহাজ্ব মো. আব্দুল করিম",
    fatherName: "করিম বক্স",
    phone: "01710000001",
    address: "ধানমন্ডি, ঢাকা",
    type: "monthly",
    amount: 500,
    remarks: "নিয়মিত মাসিক দাতা",
    payments: [
      { month: "জানুয়ারি", amount: 500, date: "2025-01-10", receiptNo: "1001", bookNo: "B-1", receiver: "মাওলানা সাহাদাত", remarks: "নগদ পরিশোধ" },
      { month: "ফেব্রুয়ারি", amount: 500, date: "2025-02-12", receiptNo: "1050", bookNo: "B-1", receiver: "মাওলানা সাহাদাত", remarks: "বিকাশে প্রাপ্ত" },
      { month: "মার্চ", amount: 500, date: "2025-03-08", receiptNo: "1120", bookNo: "B-2", receiver: "মাওলানা সাহাদাত", remarks: "নগদ পরিশোধ" },
    ]
  },
  {
    id: "donor_2",
    name: "রহিমা বেগম",
    fatherName: "আব্দুল খালেক",
    phone: "01820000002",
    address: "নবীগঞ্জ, চট্টগ্রাম",
    type: "yearly",
    amount: 6000,
    remarks: "বার্ষিক অনুদান",
    payments: [
      { month: "জানুয়ারি", amount: 6000, date: "2025-01-15", receiptNo: "1005", bookNo: "B-1", receiver: "মুহতামিম সাহেব", remarks: "ব্যাংক জমা" }
    ]
  },
  {
    id: "donor_3",
    name: "মিজানুর রহমান",
    fatherName: "মকবুল হোসেন",
    phone: "01930000003",
    address: "আম্বরখানা, সিলেট",
    type: "one_time",
    amount: 2000,
    remarks: "ভবন সংস্কারের জন্য বিশেষ অনুদান",
    payments: [
      { month: "মার্চ", amount: 2000, date: "2025-03-14", receiptNo: "1145", bookNo: "B-2", receiver: "মাওলানা সাহাদাত", remarks: "নগদ প্রাপ্ত" }
    ]
  },
  {
    id: "donor_4",
    name: "মাওলানা মাহমুদুল হাসান",
    fatherName: "মুফতি নূর হোসেন",
    phone: "01755123456",
    address: "মিরপুর-১০, ঢাকা",
    type: "monthly",
    amount: 1000,
    remarks: "মাদ্রাসার শুভাকাঙ্ক্ষী",
    payments: [
      { month: "জানুয়ারি", amount: 1000, date: "2025-01-05", receiptNo: "1002", bookNo: "B-1", receiver: "মাওলানা সাহাদাত", remarks: "নগদ পরিশোধ" },
      { month: "ফেব্রুয়ারি", amount: 1000, date: "2025-02-05", receiptNo: "1052", bookNo: "B-1", receiver: "মাওলানা সাহাদাত", remarks: "নগদ পরিশোধ" },
    ]
  }
];

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

// বাংলা সংখ্যা থেকে কথায় রূপান্তর হেল্পার
const numberToBanglaWords = (n: number): string => {
  if (n <= 0) return "শূন্য টাকা মাত্র";
  const units: Record<number, string> = {
    1: "এক", 2: "দুই", 3: "তিন", 4: "চার", 5: "পাঁচ",
    6: "ছয়", 7: "সাত", 8: "আট", 9: "নয়", 10: "দশ",
    20: "বিশ", 30: "ত্রিশ", 40: "চল্লিশ", 50: "পঞ্চাশ",
    60: "ষাট", 70: "সত্তর", 80: "আশি", 90: "নব্বই",
    100: "এক শত", 500: "পাঁচ শত", 1000: "এক হাজার", 2000: "দুই হাজার",
    5000: "পাঁচ হাজার", 6000: "ছয় হাজার", 10000: "দশ হাজার",
    20000: "বিশ হাজার", 50000: "পঞ্চাশ হাজার", 100000: "এক লক্ষ"
  };
  if (units[n]) return `${units[n]} টাকা মাত্র`;
  return `${n.toLocaleString("bn-BD")} টাকা মাত্র`;
};

export const MonthlyContributorsView: React.FC<MonthlyContributorsViewProps> = ({
  madrasa,
  onBack,
  initialTab = "donor_list",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<"add_donor" | "donor_list" | "collect_fee" | "single_statement" | "all_matrix">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "add_donor" | "donor_list" | "collect_fee" | "single_statement" | "all_matrix") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const [donors, setDonors] = useState<MonthlyDonor[]>(INITIAL_DONORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "monthly" | "yearly" | "one_time">("all");
  
  // শিক্ষাবর্ষ / সাল স্টেট
  const [availableYears, setAvailableYears] = useState<string[]>(["2024", "2025", "2026", "2027"]);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState("");

  const [selectedDonorId, setSelectedDonorId] = useState<string>(donors[0]?.id || "");
  
  // নোটিফিকেশন মেসেজ
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ১. নতুন চাঁদাদাতা যুক্ত করার ফর্ম স্টেট (Tab 1: add_donor)
  const [newDonorForm, setNewDonorForm] = useState({
    name: "",
    fatherName: "",
    phone: "",
    altPhone: "",
    designation: "",
    address: "",
    type: "monthly" as "monthly" | "yearly" | "one_time",
    amount: 500,
    startYear: "2025",
    startMonth: "জানুয়ারি",
    paymentMethod: "ক্যাশ / নগদ",
    collector: "মাওলানা সাহাদাত",
    remarks: ""
  });

  // ২. ডোনার এডিট মডাল স্টেট
  const [editingDonor, setEditingDonor] = useState<MonthlyDonor | null>(null);

  // ৩. একক চাঁদা গ্রহণ স্টেট (Quick Collection)
  const [singleCollectDonorId, setSingleCollectDonorId] = useState<string>(donors[0]?.id || "");
  const [singleCollectAmount, setSingleCollectAmount] = useState<number>(donors[0]?.amount || 500);
  const [singleCollectDate, setSingleCollectDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [singleCollectMonth, setSingleCollectMonth] = useState<string>("জানুয়ারি");
  const [singleCollectBookNo, setSingleCollectBookNo] = useState<string>("B-1");
  const [singleCollectReceiptNo, setSingleCollectReceiptNo] = useState<string>(`10${Math.floor(10 + Math.random() * 90)}`);
  const [singleCollectPaymentMethod, setSingleCollectPaymentMethod] = useState<string>("ক্যাশ / নগদ");
  const [singleCollectReceiver, setSingleCollectReceiver] = useState<string>("মাওলানা সাহাদাত");
  const [singleCollectRemarks, setSingleCollectRemarks] = useState<string>("");

  // ব্যাচ চাঁদা গ্রহণ স্টেট
  const [batchEntries, setBatchEntries] = useState<Record<string, { amount: number; bookNo: string; receiptNo: string; receiver: string; remarks: string }>>({});

  // ডিজিটাল মানি রসিদ মডাল স্টেট
  const [activeReceipt, setActiveReceipt] = useState<{
    donorName: string;
    fatherName?: string;
    phone: string;
    address: string;
    amount: number;
    month: string;
    year: string;
    date: string;
    receiptNo: string;
    bookNo: string;
    receiver: string;
    paymentMethod: string;
    remarks?: string;
  } | null>(null);

  // যখন দ্রুত চাঁদা আদায়ের ডোনার ড্রপডাউন পরিবর্তন হয়
  const handleSelectQuickDonor = (dId: string) => {
    setSingleCollectDonorId(dId);
    const d = donors.find(x => x.id === dId);
    if (d) {
      setSingleCollectAmount(d.amount);
    }
  };

  // নতুন সাল যুক্ত করার হ্যান্ডলার
  const handleAddNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanYear = newYearInput.trim();
    if (!cleanYear) return;
    if (!availableYears.includes(cleanYear)) {
      const updated = [...availableYears, cleanYear].sort();
      setAvailableYears(updated);
      setSelectedYear(cleanYear);
    } else {
      setSelectedYear(cleanYear);
    }
    setNewYearInput("");
    setIsAddYearModalOpen(false);
  };

  // নতুন চাঁদাদাতা সংরক্ষণ
  const handleSaveNewDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorForm.name.trim() || !newDonorForm.phone.trim()) {
      alert("অনুগ্রহ করে চাঁদাদাতার নাম ও মোবাইল নম্বর পূরণ করুন।");
      return;
    }

    const createdDonor: MonthlyDonor = {
      id: `donor_${Date.now()}`,
      name: newDonorForm.name.trim(),
      fatherName: newDonorForm.fatherName.trim() || undefined,
      phone: newDonorForm.phone.trim(),
      address: newDonorForm.address.trim() || "ঠিকানা উল্লেখ নেই",
      type: newDonorForm.type,
      amount: Number(newDonorForm.amount) || 0,
      remarks: newDonorForm.remarks.trim() || undefined,
      payments: []
    };

    setDonors(prev => [createdDonor, ...prev]);
    setSuccessMessage(`আলহামদুলিল্লাহ! "${createdDonor.name}" সফলভাবে চাঁদাদাতা হিসেবে নিবন্ধিত হয়েছে।`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // রিসেট ফর্ম
    setNewDonorForm({
      name: "",
      fatherName: "",
      phone: "",
      altPhone: "",
      designation: "",
      address: "",
      type: "monthly",
      amount: 500,
      startYear: selectedYear,
      startMonth: "জানুয়ারি",
      paymentMethod: "ক্যাশ / নগদ",
      collector: "মাওলানা সাহাদাত",
      remarks: ""
    });

    // সরাসরি তালিকায় নিয়ে যাওয়া
    handleTabChange("donor_list");
  };

  // চাঁদাদাতার তথ্য এডিট ও সংরক্ষণ
  const handleSaveEditDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    setDonors(prev => prev.map(d => d.id === editingDonor.id ? editingDonor : d));
    setEditingDonor(null);
    setSuccessMessage(`চাঁদাদাতা "${editingDonor.name}"-এর তথ্য সফলভাবে আপডেট করা হয়েছে।`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // চাঁদাদাতা ডিলিট হ্যান্ডলার
  const handleDeleteDonor = (donorId: string, donorName: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${donorName}"-কে তালিকা থেকে মুছে ফেলতে চান?`)) {
      setDonors(prev => prev.filter(d => d.id !== donorId));
      setSuccessMessage(`চাঁদাদাতা "${donorName}" তালিকা থেকে মুছে ফেলা হয়েছে।`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // একক চাঁদা আদায় ও রসিদ তৈরি
  const handleCollectSingleFee = (e: React.FormEvent) => {
    e.preventDefault();
    const donor = donors.find(d => d.id === singleCollectDonorId);
    if (!donor) return;

    const newPayment = {
      month: singleCollectMonth,
      amount: Number(singleCollectAmount),
      date: singleCollectDate,
      receiptNo: singleCollectReceiptNo || `R-${Date.now().toString().slice(-4)}`,
      bookNo: singleCollectBookNo || "B-1",
      receiver: singleCollectReceiver || "মাওলানা সাহাদাত",
      remarks: singleCollectRemarks || singleCollectPaymentMethod
    };

    // আপডেট ডোনার পেমেন্ট হিস্ট্রি
    setDonors(prev => prev.map(d => {
      if (d.id === singleCollectDonorId) {
        return {
          ...d,
          payments: [...(d.payments || []), newPayment]
        };
      }
      return d;
    }));

    // মানি রসিদ প্রদর্শন
    setActiveReceipt({
      donorName: donor.name,
      fatherName: donor.fatherName,
      phone: donor.phone,
      address: donor.address,
      amount: Number(singleCollectAmount),
      month: singleCollectMonth,
      year: selectedYear,
      date: singleCollectDate,
      receiptNo: newPayment.receiptNo,
      bookNo: newPayment.bookNo,
      receiver: newPayment.receiver,
      paymentMethod: singleCollectPaymentMethod,
      remarks: singleCollectRemarks
    });

    setSuccessMessage(`সফল! ${donor.name}-এর ${singleCollectMonth} মাসের চাঁদা ৳${singleCollectAmount} জমা হয়েছে।`);
    setTimeout(() => setSuccessMessage(null), 3500);

    // রশিদ নম্বর বাড়ানো
    setSingleCollectReceiptNo(prev => `${Number(prev) + 1}`);
  };

  // ব্যাচ এন্ট্রি সেভ
  const handleSaveBatchCollection = () => {
    const donorIds = Object.keys(batchEntries);
    if (donorIds.length === 0) {
      alert("কোনো চাঁদা এন্ট্রি করা হয়নি।");
      return;
    }

    setDonors(prev => prev.map(d => {
      const entry = batchEntries[d.id];
      if (entry && entry.amount > 0) {
        const pay = {
          month: singleCollectMonth,
          amount: Number(entry.amount),
          date: singleCollectDate,
          receiptNo: entry.receiptNo || `R-${Math.floor(1000 + Math.random() * 9000)}`,
          bookNo: entry.bookNo || "B-1",
          receiver: entry.receiver || "মাওলানা সাহাদাত",
          remarks: entry.remarks || "ব্যাচ এন্ট্রি"
        };
        return {
          ...d,
          payments: [...(d.payments || []), pay]
        };
      }
      return d;
    }));

    setBatchEntries({});
    setSuccessMessage(`আলহামদুলিল্লাহ! ${donorIds.length} জন দাতার মাসিক চাঁদা সফলভাবে এন্ট্রি হয়েছে।`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // ফিল্টার্ড চাঁদাদাতা তালিকা
  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.phone.includes(searchQuery) ||
                          d.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (d.fatherName && d.fatherName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" ? true : d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // পরিসংখ্যান হিসাব
  const totalDonorsCount = donors.length;
  const totalMonthlyPledge = donors.filter(d => d.type === "monthly").reduce((sum, d) => sum + d.amount, 0);
  const totalYearlyPledge = donors.filter(d => d.type === "yearly").reduce((sum, d) => sum + d.amount, 0);
  const totalCollectedAllTime = donors.reduce((sum, d) => sum + (d.payments?.reduce((s, p) => s + p.amount, 0) || 0), 0);

  const activeDonor = donors.find(d => d.id === selectedDonorId) || donors[0];

  return (
    <div className="space-y-6">
      {/* ১. শীর্ষ হেডার ও ন্যাভিগেশন বার (একটিমাত্র প্রিন্ট বাটন সহ) */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shrink-0"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-indigo-600 shrink-0" />
              <span>মাসিক চাঁদাদাতা ও অনুদান ব্যবস্থাপনা</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মাদ্রাসার নিয়মিত ডোনার তালিকা, চাঁদা আদায়, একক খতিয়ান ও বার্ষিক ম্যাট্রিক্স রিপোর্ট
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-end">
          {/* ৫টি সাব-ট্যাব ন্যাভিগেশন (সাইডবারের হুবহু ৫টি মেনু) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/70">
            <button
              onClick={() => handleTabChange("add_donor")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "add_donor"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>নতুন চাঁদাদাতা যুক্ত</span>
            </button>
            <button
              onClick={() => handleTabChange("donor_list")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "donor_list"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              <span>চাঁদাদাতা তালিকা</span>
            </button>
            <button
              onClick={() => handleTabChange("collect_fee")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "collect_fee"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>মাসিক চাঁদা গ্রহণ</span>
            </button>
            <button
              onClick={() => handleTabChange("single_statement")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "single_statement"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>একক দাতার বিবরণী</span>
            </button>
            <button
              onClick={() => handleTabChange("all_matrix")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "all_matrix"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
              <span>বাৎসরিক চাঁদা তালিকা</span>
            </button>
          </div>

          {/* পেজের একমাত্র শীর্ষ প্রিন্ট বাটন */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
            title="বর্তমান পেজ প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* সাকসেস নোটিফিকেশন ব্যানার */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-fade-in no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ট্যাব ১: নতুন চাঁদাদাতা যুক্ত (add_donor)                                  */}
      {/* ========================================================================= */}
      {activeTab === "add_donor" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <span>নতুন চাঁদাদাতা নিবন্ধন ফরম</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  মাদ্রাসার নিয়মিত বা এককালীন দাতার সকল তথ্য নির্ভুলভাবে এন্ট্রি করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange("donor_list")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <span>চাঁদাদাতা তালিকা দেখুন</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewDonor} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* কলাম ১: ব্যক্তিগত তথ্য */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-indigo-900 font-black text-xs uppercase tracking-wider">
                    <span>১. দাতার ব্যক্তিগত বিবরণ</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">চাঁদাদাতার পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আলহাজ্ব মো. আব্দুল করিম"
                      value={newDonorForm.name}
                      onChange={(e) => setNewDonorForm({ ...newDonorForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">পিতা / স্বামীর নাম</label>
                    <input
                      type="text"
                      placeholder="পিতার নাম লিখুন..."
                      value={newDonorForm.fatherName}
                      onChange={(e) => setNewDonorForm({ ...newDonorForm, fatherName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={newDonorForm.phone}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-indigo-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">পেশা / পদবী</label>
                      <input
                        type="text"
                        placeholder="ব্যবসায়ী / প্রবাসী..."
                        value={newDonorForm.designation}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, designation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">পূর্ণাঙ্গ ঠিকানা *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="গ্রাম/রোড, ডাকঘর, থানা/উপজেলা, জেলা..."
                      value={newDonorForm.address}
                      onChange={(e) => setNewDonorForm({ ...newDonorForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* কলাম ২: চাঁদা ও অনুদানের বিবরণ */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-indigo-900 font-black text-xs uppercase tracking-wider">
                    <span>২. চাঁদা ও অঙ্গীকারের বিবরণ</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">চাঁদার ধরন *</label>
                      <select
                        value={newDonorForm.type}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, type: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="monthly">মাসিক নিয়মিত দাতা</option>
                        <option value="yearly">বাৎসরিক এককালীন দাতা</option>
                        <option value="one_time">এককালীন অনুদানকারী</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">নির্ধারিত চাঁদার পরিমাণ (৳) *</label>
                      <input
                        type="number"
                        required
                        min={10}
                        placeholder="টাকার পরিমাণ..."
                        value={newDonorForm.amount}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, amount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">শুরুর সন / শিক্ষাবর্ষ *</label>
                      <select
                        value={newDonorForm.startYear}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, startYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        {availableYears.map(y => (
                          <option key={y} value={y}>{y} ইং</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">শুরুর মাস *</label>
                      <select
                        value={newDonorForm.startMonth}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, startMonth: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        {MONTHS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">চাঁদা প্রদানের মাধ্যম *</label>
                      <select
                        value={newDonorForm.paymentMethod}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, paymentMethod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="ক্যাশ / নগদ">ক্যাশ / নগদ</option>
                        <option value="বিকাশ">বিকাশ (bKash)</option>
                        <option value="নগদ">নগদ (Nagad)</option>
                        <option value="রকেট">রকেট (Rocket)</option>
                        <option value="ব্যাংক ট্রান্সফার">ব্যাংক ট্রান্সফার</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">আদায়কারী / প্রতিনিধি</label>
                      <input
                        type="text"
                        placeholder="দায়িত্বশীলের নাম..."
                        value={newDonorForm.collector}
                        onChange={(e) => setNewDonorForm({ ...newDonorForm, collector: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">বিশেষ মন্তব্য / নোট</label>
                    <input
                      type="text"
                      placeholder="কোনো বিশেষ অঙ্গীকার বা শর্ত..."
                      value={newDonorForm.remarks}
                      onChange={(e) => setNewDonorForm({ ...newDonorForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* ফর্ম সাবমিট অ্যাকশন */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleTabChange("donor_list")}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>চাঁদাদাতা সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ট্যাব ২: চাঁদাদাতা তালিকা (donor_list)                                    */}
      {/* ========================================================================= */}
      {activeTab === "donor_list" && (
        <div className="space-y-6">
          {/* দ্রুত পরিসংখ্যান কার্ড */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">মোট চাঁদাদাতা</p>
                <p className="text-base font-black text-slate-900">{totalDonorsCount} জন</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">মাসিক নির্ধারিত ধার্য</p>
                <p className="text-base font-black text-emerald-700">৳ {totalMonthlyPledge.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">বাৎসরিক নির্ধারিত</p>
                <p className="text-base font-black text-blue-700">৳ {totalYearlyPledge.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500">সর্বমোট সংগৃহীত</p>
                <p className="text-base font-black text-purple-700">৳ {totalCollectedAllTime.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* সার্চ ও ফিল্টার বার */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নাম, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* ফিল্টার পিল */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === "all" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                >
                  সকল
                </button>
                <button
                  onClick={() => setTypeFilter("monthly")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === "monthly" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                >
                  মাসিক
                </button>
                <button
                  onClick={() => setTypeFilter("yearly")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === "yearly" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                >
                  বাৎসরিক
                </button>
                <button
                  onClick={() => setTypeFilter("one_time")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${typeFilter === "one_time" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"}`}
                >
                  এককালীন
                </button>
              </div>
            </div>

            <button
              onClick={() => handleTabChange("add_donor")}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন চাঁদাদাতা যুক্ত</span>
            </button>
          </div>

          {/* চাঁদাদাতা তালিকা টেবিল */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-3 px-4 w-12 text-center">নং</th>
                    <th className="py-3 px-4">চাঁদাদাতার নাম ও পিতা</th>
                    <th className="py-3 px-4">মোবাইল</th>
                    <th className="py-3 px-4">ঠিকানা</th>
                    <th className="py-3 px-4 text-center">ধরন</th>
                    <th className="py-3 px-4 text-right">নির্ধারিত চাঁদা</th>
                    <th className="py-3 px-4 text-right">মোট আদায়</th>
                    <th className="py-3 px-4 text-center no-print">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDonors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                        কোনো চাঁদাদাতা পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredDonors.map((d, idx) => {
                      const totalPaid = d.payments?.reduce((s, p) => s + p.amount, 0) || 0;
                      return (
                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="font-black text-slate-900">{d.name}</div>
                            {d.fatherName && <div className="text-[11px] text-slate-500">পিতা: {d.fatherName}</div>}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-indigo-700">{d.phone}</td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{d.address}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              d.type === "monthly" ? "bg-emerald-100 text-emerald-800" :
                              d.type === "yearly" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {d.type === "monthly" ? "মাসিক" : d.type === "yearly" ? "বাৎসরিক" : "এককালীন"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">৳ {d.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-black text-emerald-700">৳ {totalPaid.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center no-print">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* চাঁদা আদায় বাটন */}
                              <button
                                onClick={() => {
                                  handleSelectQuickDonor(d.id);
                                  handleTabChange("collect_fee");
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                title="চাঁদা গ্রহণ করুন"
                              >
                                <Wallet className="w-4 h-4" />
                              </button>
                              {/* বিবরণী বাটন */}
                              <button
                                onClick={() => {
                                  setSelectedDonorId(d.id);
                                  handleTabChange("single_statement");
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                                title="একক স্টেটমেন্ট দেখুন"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              {/* এডিট বাটন */}
                              <button
                                onClick={() => setEditingDonor(d)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                                title="তথ্য পরিবর্তন / এডিট"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              {/* ডিলিট বাটন */}
                              <button
                                onClick={() => handleDeleteDonor(d.id, d.name)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ট্যাব ৩: মাসিক চাঁদা গ্রহণ (collect_fee)                                  */}
      {/* ========================================================================= */}
      {activeTab === "collect_fee" && (
        <div className="space-y-6">
          {/* সাল ও মাস নির্বাচন কন্ট্রোল বার */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
            <div className="flex flex-wrap items-center gap-3">
              {/* সাল ড্রপডাউন ও নতুন সাল যোগ করার বাটন (+) */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">সাল / শিক্ষাবর্ষ:</label>
                <div className="flex items-center gap-1">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>{y} ইং</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddYearModalOpen(true)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                    title="নতুন সাল যুক্ত করুন"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* তারিখ */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700">জমার তারিখ (দিন/মাস/বছর):</label>
                <input
                  type="date"
                  value={singleCollectDate}
                  onChange={(e) => setSingleCollectDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* ১২ মাসের বাটন নেভিগেশন */}
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto max-w-full">
              {MONTHS.map(m => (
                <button
                  key={m}
                  onClick={() => setSingleCollectMonth(m)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    singleCollectMonth === m
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* ১. একক দ্রুত চাঁদা আদায় ও রসিদ তৈরি ফরম */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 no-print">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>একক চাঁদা গ্রহণ ফরম ({singleCollectMonth} {selectedYear})</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                রশিদ নং: <span className="font-mono text-indigo-700">#{singleCollectReceiptNo}</span>
              </span>
            </div>

            <form onSubmit={handleCollectSingleFee} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* চাঁদাদাতা নির্বাচন */}
                <div className="sm:col-span-2">
                  <label className="block mb-1.5 text-slate-800">চাঁদাদাতা নির্বাচন করুন *</label>
                  <select
                    value={singleCollectDonorId}
                    onChange={(e) => handleSelectQuickDonor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {donors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} • {d.phone} (ধার্য: ৳{d.amount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* চাঁদার পরিমাণ */}
                <div>
                  <label className="block mb-1.5 text-slate-800">চাঁদার পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={singleCollectAmount}
                    onChange={(e) => setSingleCollectAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* মাধ্যম */}
                <div>
                  <label className="block mb-1.5 text-slate-800">পেমেন্ট মাধ্যম *</label>
                  <select
                    value={singleCollectPaymentMethod}
                    onChange={(e) => setSingleCollectPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="ক্যাশ / নগদ">ক্যাশ / নগদ</option>
                    <option value="বিকাশ">বিকাশ (bKash)</option>
                    <option value="নগদ">নগদ (Nagad)</option>
                    <option value="রকেট">রকেট (Rocket)</option>
                    <option value="ব্যাংক জমা">ব্যাংক জমা</option>
                  </select>
                </div>

                {/* বই নং */}
                <div>
                  <label className="block mb-1.5 text-slate-800">রশিদ বই নং</label>
                  <input
                    type="text"
                    value={singleCollectBookNo}
                    onChange={(e) => setSingleCollectBookNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    placeholder="B-1"
                  />
                </div>

                {/* রশিদ নং */}
                <div>
                  <label className="block mb-1.5 text-slate-800">রশিদ নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={singleCollectReceiptNo}
                    onChange={(e) => setSingleCollectReceiptNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-indigo-700"
                    placeholder="1001"
                  />
                </div>

                {/* গ্রহণকারী */}
                <div>
                  <label className="block mb-1.5 text-slate-800">আদায়কারী / গ্রহণকারী *</label>
                  <input
                    type="text"
                    required
                    value={singleCollectReceiver}
                    onChange={(e) => setSingleCollectReceiver(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    placeholder="মাওলানা সাহাদাত"
                  />
                </div>

                {/* মন্তব্য */}
                <div>
                  <label className="block mb-1.5 text-slate-800">মন্তব্য</label>
                  <input
                    type="text"
                    value={singleCollectRemarks}
                    onChange={(e) => setSingleCollectRemarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    placeholder="নগদ গ্রহণ"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>চাঁদা জমা করুন ও রসিদ তৈরি করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* ২. চাঁদা আদায় তালিকা ও হিস্ট্রি ({singleCollectMonth} {selectedYear}) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {singleCollectMonth} {selectedYear} মাসের চাঁদা আদায়ের তালিকা
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">নিচের তালিকা থেকে সরাসরি যে কারো রসিদ দেখতে বা প্রিন্ট করতে পারেন</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-3 px-4 w-12 text-center">নং</th>
                    <th className="py-3 px-4">দাতার নাম</th>
                    <th className="py-3 px-4">মোবাইল</th>
                    <th className="py-3 px-4 text-right">ধার্য</th>
                    <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">আদায়কৃত টাকা</th>
                    <th className="py-3 px-4">বই ও রশিদ নং</th>
                    <th className="py-3 px-4">আদায়কারী</th>
                    <th className="py-3 px-4 text-center no-print">রসিদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {donors.map((d, idx) => {
                    const pay = d.payments?.find(p => p.month === singleCollectMonth);
                    return (
                      <tr key={d.id} className={pay ? "bg-emerald-50/20" : "hover:bg-slate-50"}>
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-black text-slate-900">{d.name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{d.phone}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-700">৳ {d.amount}</td>
                        <td className="py-3 px-4 text-center">
                          {pay ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                              পরিশোধিত
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">
                              বকেয়া
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">
                          {pay ? `৳ ${pay.amount}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {pay ? `${pay.bookNo} / #${pay.receiptNo}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{pay?.receiver || "-"}</td>
                        <td className="py-3 px-4 text-center no-print">
                          {pay ? (
                            <button
                              onClick={() => {
                                setActiveReceipt({
                                  donorName: d.name,
                                  fatherName: d.fatherName,
                                  phone: d.phone,
                                  address: d.address,
                                  amount: pay.amount,
                                  month: singleCollectMonth,
                                  year: selectedYear,
                                  date: pay.date,
                                  receiptNo: pay.receiptNo,
                                  bookNo: pay.bookNo,
                                  receiver: pay.receiver,
                                  paymentMethod: "ক্যাশ",
                                  remarks: pay.remarks
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center gap-1 mx-auto"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>রসিদ</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleSelectQuickDonor(d.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center gap-1 mx-auto"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              <span>জমা নিন</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ট্যাব ৪: একক দাতার বিবরণী (single_statement)                             */}
      {/* ========================================================================= */}
      {activeTab === "single_statement" && (
        <div className="space-y-6">
          {/* কন্ট্রোল বার: ডোনার ও সাল নির্বাচন */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700">চাঁদাদাতা নির্বাচন:</label>
              <select
                value={selectedDonorId}
                onChange={(e) => setSelectedDonorId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-800"
              >
                {donors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-slate-700">সাল:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-indigo-700"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y} ইং</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddYearModalOpen(true)}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                title="নতুন সাল যুক্ত করুন"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* একক চাঁদাদাতার ১২ মাসের পূর্ণাঙ্গ স্টেটমেন্ট কার্ড */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* প্রাতিষ্ঠানিক হেডার */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-300">
                  একক চাঁদাদাতার ১২ মাসের বিবরণী ও খতিয়ান - {selectedYear} ইং
                </span>
              </div>
            </div>

            {/* চাঁদাদাতার পরিচিতি ও পরিসংখ্যান সামারি */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <p><span className="text-slate-500 font-bold">দাতার নাম:</span> <strong className="text-slate-900 text-sm font-black">{activeDonor.name}</strong></p>
                <p><span className="text-slate-500 font-bold">পিতার নাম:</span> <strong className="text-slate-800">{activeDonor.fatherName || "—"}</strong></p>
                <p><span className="text-slate-500 font-bold">মোবাইল:</span> <strong className="text-indigo-700 font-mono font-bold">{activeDonor.phone}</strong></p>
                <p><span className="text-slate-500 font-bold">পূর্ণ ঠিকানা:</span> <strong className="text-slate-700">{activeDonor.address}</strong></p>
              </div>

              <div className="space-y-1 sm:text-right">
                <p><span className="text-slate-500 font-bold">চাঁদার ধরন:</span> <strong className="text-slate-900">
                  {activeDonor.type === "monthly" ? "মাসিক নিয়মিত" : activeDonor.type === "yearly" ? "বাৎসরিক" : "এককালীন"}
                </strong></p>
                <p><span className="text-slate-500 font-bold">নির্ধারিত ধার্য:</span> <strong className="text-indigo-700 font-black">৳ {activeDonor.amount}</strong></p>
                <p><span className="text-slate-500 font-bold">১২ মাসের মোট ধার্য:</span> <strong className="text-slate-900 font-black">৳ {(activeDonor.amount * 12).toLocaleString()}</strong></p>
                <p><span className="text-slate-500 font-bold">মোট পরিশোধিত:</span> <strong className="text-emerald-700 font-black">
                  ৳ {(activeDonor.payments?.reduce((s, p) => s + p.amount, 0) || 0).toLocaleString()}
                </strong></p>
              </div>
            </div>

            {/* ১২ মাসের লেজার টেবিল */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-2.5 px-3">মাস</th>
                    <th className="py-2.5 px-3">তারিখ</th>
                    <th className="py-2.5 px-3">বুক নং</th>
                    <th className="py-2.5 px-3">রশিদ নং</th>
                    <th className="py-2.5 px-3">আদায়কারী</th>
                    <th className="py-2.5 px-3 text-right">টাকার পরিমাণ</th>
                    <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                    <th className="py-2.5 px-3">মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MONTHS.map(m => {
                    const pay = activeDonor.payments?.find(p => p.month === m);
                    return (
                      <tr key={m} className={pay ? "bg-emerald-50/20" : ""}>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{m}</td>
                        <td className="py-2.5 px-3 text-slate-600">{pay?.date || "-"}</td>
                        <td className="py-2.5 px-3 text-slate-600">{pay?.bookNo || "-"}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono font-bold text-indigo-700">{pay?.receiptNo || "-"}</td>
                        <td className="py-2.5 px-3 text-slate-600">{pay?.receiver || "-"}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {pay ? `৳ ${pay.amount.toLocaleString()}` : "-"}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {pay ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">পরিশোধিত</span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">অনাদায়ী</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{pay?.remarks || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-xs text-slate-900 border-t border-slate-300">
                    <td colSpan={5} className="py-3 px-3 text-right">সর্বমোট আদায়কৃত টাকা:</td>
                    <td className="py-3 px-3 text-right text-emerald-700 text-sm">
                      ৳ {(activeDonor.payments?.reduce((s, p) => s + p.amount, 0) || 0).toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* অফিশিয়াল স্বাক্ষর সেকশন */}
            <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                আদায়কারীর স্বাক্ষর
              </div>
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                মুহতামিমের স্বাক্ষর ও সীল
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ট্যাব ৫: বাৎসরিক চাঁদা তালিকা (all_matrix)                                */}
      {/* ========================================================================= */}
      {activeTab === "all_matrix" && (
        <div className="space-y-6">
          {/* সাল নির্বাচন ফিল্টার */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">বছর / শিক্ষাবর্ষ:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-indigo-700"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y} ইং</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddYearModalOpen(true)}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                title="নতুন সাল যুক্ত করুন"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-slate-600">
              মোট চাঁদাদাতা: <strong className="text-indigo-700 font-black">{donors.length} জন</strong>
            </div>
          </div>

          {/* বাৎসরিক ১২ মাসের ম্যাট্রিক্স টেবিল */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:p-0 print:border-none">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <div className="text-xs font-bold text-indigo-700 uppercase">
                মাসিক চাঁদা দানকারীদের বাৎসরিক তালিকা ও খতিয়ান - {selectedYear} ইং
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-800 text-white font-black text-center">
                    <th className="py-2.5 px-2 text-left w-10">ক্রমিক</th>
                    <th className="py-2.5 px-3 text-left">নাম ও মোবাইল</th>
                    <th className="py-2.5 px-2">ধার্য</th>
                    {MONTHS.map(m => (
                      <th key={m} className="py-2.5 px-1 text-[10px]">{m.slice(0, 3)}</th>
                    ))}
                    <th className="py-2.5 px-2 text-right">মোট আদায়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-center">
                  {donors.map((d, idx) => {
                    const donorTotal = d.payments?.reduce((s, p) => s + p.amount, 0) || 0;
                    return (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-2 text-left font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 text-left">
                          <div className="font-black text-slate-900">{d.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{d.phone}</div>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-indigo-700">৳{d.amount}</td>
                        {MONTHS.map(m => {
                          const paid = d.payments?.find(p => p.month === m);
                          return (
                            <td key={m} className={`py-2 px-1 ${paid ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-slate-300"}`}>
                              {paid ? `৳${paid.amount}` : "—"}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-2 text-right font-black text-emerald-700">
                          ৳{donorTotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-slate-900 text-xs border-t-2 border-slate-300">
                    <td colSpan={2} className="py-3 px-3 text-left">সর্বমোট যোগফল:</td>
                    <td className="py-3 px-2 text-center text-indigo-700">
                      ৳{donors.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                    </td>
                    {MONTHS.map(m => {
                      const monthSum = donors.reduce((sum, d) => {
                        const p = d.payments?.find(pay => pay.month === m);
                        return sum + (p ? p.amount : 0);
                      }, 0);
                      return (
                        <td key={m} className="py-3 px-1 text-center font-bold text-emerald-700 text-[10px]">
                          {monthSum > 0 ? `৳${monthSum}` : "—"}
                        </td>
                      );
                    })}
                    <td className="py-3 px-2 text-right text-emerald-800 text-xs">
                      ৳{totalCollectedAllTime.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* মডাল ১: নতুন সাল / শিক্ষাবর্ষ যুক্ত করার মডাল                             */}
      {/* ========================================================================= */}
      {isAddYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>নতুন সাল যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsAddYearModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewYear} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1.5">সালের নাম (যেমন: 2028 বা ২০২৮) *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="যেমন: 2028"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  সাল যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* মডাল ২: চাঁদাদাতার তথ্য এডিট করার মডাল                                   */}
      {/* ========================================================================= */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <span>চাঁদাদাতার তথ্য সংশোধন / এডিট</span>
              </h3>
              <button
                onClick={() => setEditingDonor(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDonor} className="space-y-3.5 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">চাঁদাদাতার নাম *</label>
                <input
                  type="text"
                  required
                  value={editingDonor.name}
                  onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">পিতার নাম</label>
                <input
                  type="text"
                  value={editingDonor.fatherName || ""}
                  onChange={(e) => setEditingDonor({ ...editingDonor, fatherName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={editingDonor.phone}
                    onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1">চাঁদার ধরন *</label>
                  <select
                    value={editingDonor.type}
                    onChange={(e) => setEditingDonor({ ...editingDonor, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="monthly">মাসিক</option>
                    <option value="yearly">বাৎসরিক</option>
                    <option value="one_time">এককালীন</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">চাঁদার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingDonor.amount}
                    onChange={(e) => setEditingDonor({ ...editingDonor, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block mb-1">ঠিকানা *</label>
                  <input
                    type="text"
                    required
                    value={editingDonor.address}
                    onChange={(e) => setEditingDonor({ ...editingDonor, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">মন্তব্য</label>
                <input
                  type="text"
                  value={editingDonor.remarks || ""}
                  onChange={(e) => setEditingDonor({ ...editingDonor, remarks: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* মডাল ৩: ডিজিটাল মানি রসিদ ও প্রিন্ট প্রিভিউ                              */}
      {/* ========================================================================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            {/* মানি রসিদ কার্ড কন্টেন্ট */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 space-y-4">
              {/* মাদ্রাসার তথ্য */}
              <div className="text-center border-b border-indigo-200 pb-3">
                <h3 className="text-xl font-black text-slate-900">{madrasa.name}</h3>
                <p className="text-xs text-slate-600 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider">
                  মাসিক চাঁদা আদায়ের মানি রসিদ
                </div>
              </div>

              {/* রসিদ মেটাডেটা */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 border-b border-indigo-100 pb-2">
                <div>
                  রশিদ নং: <span className="font-mono text-indigo-700">#{activeReceipt.receiptNo}</span>
                  {activeReceipt.bookNo && <span className="ml-2 text-slate-500">(বই: {activeReceipt.bookNo})</span>}
                </div>
                <div>
                  তারিখ: <span className="text-slate-900">{activeReceipt.date}</span>
                </div>
              </div>

              {/* দাতার তথ্য */}
              <div className="space-y-2 text-xs font-medium text-slate-800">
                <div className="flex justify-between">
                  <span>দাতার নাম: <strong className="text-slate-900 text-sm font-black">{activeReceipt.donorName}</strong></span>
                  {activeReceipt.fatherName && <span>পিতা: <strong>{activeReceipt.fatherName}</strong></span>}
                </div>
                <div className="flex justify-between">
                  <span>মোবাইল: <strong className="font-mono">{activeReceipt.phone}</strong></span>
                  <span>ঠিকানা: <strong>{activeReceipt.address}</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>চাঁদার মাস ও সাল: <strong className="text-indigo-800 font-black">{activeReceipt.month} {activeReceipt.year} ইং</strong></span>
                  <span>পেমেন্ট মাধ্যম: <strong className="text-emerald-700">{activeReceipt.paymentMethod}</strong></span>
                </div>
              </div>

              {/* টাকার পরিমাণ হাইলাইট বক্স */}
              <div className="p-3.5 rounded-xl bg-white border border-indigo-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold">টাকার পরিমাণ (কথায়): </span>
                  <div className="text-xs font-black text-slate-800">
                    {numberToBanglaWords(activeReceipt.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold">মোট টাকা</span>
                  <div className="text-xl font-black text-emerald-700">
                    ৳ {activeReceipt.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {activeReceipt.remarks && (
                <div className="text-[11px] text-slate-500 italic">
                  মন্তব্য: {activeReceipt.remarks}
                </div>
              )}

              {/* স্বাক্ষর সেকশন */}
              <div className="pt-8 flex justify-between items-center text-[11px] font-bold text-slate-700">
                <div className="text-center border-t border-slate-400 pt-1 w-32">
                  আদায়কারীর স্বাক্ষর<br />
                  <span className="text-[10px] text-slate-500 font-normal">({activeReceipt.receiver})</span>
                </div>
                <div className="text-center border-t border-slate-400 pt-1 w-36">
                  মুহতামিমের সীল ও স্বাক্ষর
                </div>
              </div>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="flex items-center justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
