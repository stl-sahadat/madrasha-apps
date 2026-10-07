"use client";

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Receipt, 
  QrCode, 
  CreditCard, 
  Phone, 
  MessageSquare, 
  CheckCircle2,
  Building2,
  Share2,
  Award,
  AlertTriangle,
  Bell,
  Check,
  Plus
} from "lucide-react";
import { Student, MadrasaInfo } from "@/types";

interface StudentProfileModalProps {
  student: Student;
  madrasa: MadrasaInfo;
  onClose: () => void;
  onFeeCollected?: (amount: number, feeType: string, method: string) => void;
  onAddActivity?: (studentId: string, activity: any) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  madrasa,
  onClose,
  onFeeCollected,
  onAddActivity,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "fees" | "activities">("profile");

  // অ্যাক্টিভিটি ফর্ম স্টেট
  const [activitiesList, setActivitiesList] = useState(student.activities || []);
  const [actType, setActType] = useState<"praise" | "warning" | "notice">("praise");
  const [actTitle, setActTitle] = useState("");
  const [actDesc, setActDesc] = useState("");
  
  // ফি কালেকশন স্টেট
  const [feeType, setFeeType] = useState("মাসিক বেতন ও বোর্ডিং ফি");
  const [payAmount, setPayAmount] = useState<number>(student.dueAmount > 0 ? student.dueAmount : student.monthlyFee);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "bank">("cash");
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [printMode, setPrintMode] = useState<"a4" | "thermal">("a4");

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const newAct = {
      id: `act_${Date.now()}`,
      studentId: student.id,
      date: new Date().toISOString().split("T")[0],
      type: actType,
      title: actTitle,
      description: actDesc,
      recordedBy: "মুহতামিম সাহেব",
    };

    const updated = [newAct, ...activitiesList];
    setActivitiesList(updated);
    student.activities = updated;

    if (onAddActivity) {
      onAddActivity(student.id, newAct);
    }

    setActTitle("");
    setActDesc("");
  };

  // মোট ফি, জমা ও বকেয়া হিসাব
  const currentTotalFee = student.monthlyFee;
  const currentDue = Math.max(0, currentTotalFee - payAmount);

  // Esc কী চাপলে মডাল বন্ধ
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptGenerated(true);
    if (onFeeCollected) {
      onFeeCollected(payAmount, feeType, paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto">
        {/* মডাল হেডার */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              {student.roll}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                আইডি: {student.id} | {student.className} ({student.section})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* মোবাইল ও মনিটর ট্যাব বাটন */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "profile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                👤 প্রোফাইল ও আইডি
              </button>
              <button
                onClick={() => setActiveTab("fees")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "fees" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"
                }`}
              >
                💳 ফি ও মানি রিসিট
              </button>
              <button
                onClick={() => setActiveTab("activities")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "activities" ? "bg-white text-amber-900 shadow-sm font-bold" : "text-slate-600"
                }`}
              >
                📝 অ্যাক্টিভিটি ও নোটিশ ({activitiesList.length})
              </button>
            </div>

            <button
              onClick={onClose}
              title="বন্ধ করুন (Esc)"
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition-all"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">বন্ধ করুন</span>
            </button>
          </div>
        </div>

        {/* মডাল বডি */}
        <div className="p-6">
          {/* ট্যাব ১: শিক্ষার্থী প্রোফাইল ও ডিজিটাল আইডি কার্ড */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* বামপাশ: ডিজিটাল আইডি কার্ড (রেডি টু প্রিন্ট) */}
              <div className="md:col-span-5 bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-5 text-white shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between pb-3 border-b border-emerald-600/50 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-300" />
                    <span className="text-xs font-bold truncate max-w-[170px]">{madrasa.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/70 font-semibold uppercase">
                    আইডি কার্ড
                  </span>
                </div>

                {/* ছবি ও নাম */}
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-black mb-3 shadow-inner">
                  👤
                </div>

                <h4 className="text-lg font-extrabold">{student.name}</h4>
                <p className="text-xs text-emerald-200 font-medium mb-1">{student.englishName || "Student"}</p>

                <div className="w-full bg-black/20 rounded-xl p-2.5 my-3 text-xs space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-emerald-300">রোল নং:</span>
                    <span className="font-bold">{student.roll}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">জামাত:</span>
                    <span className="font-bold">{student.className}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">ধরণ:</span>
                    <span className="font-bold">{student.status === "residential" ? "আবাসিক" : "অনাবাসিক"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-red-300">{student.bloodGroup || "O+"}</span>
                  </div>
                </div>

                {/* বারকোড ভিজ্যুয়াল */}
                <div className="w-full bg-white p-2 rounded-xl text-slate-900 mt-1 shadow-md">
                  <div className="font-mono text-center text-xs tracking-widest font-black">
                    ||| | |||| | ||| || ||| | ||
                  </div>
                  <p className="text-[10px] font-mono text-center font-bold text-slate-600 mt-0.5">
                    {student.barcode}
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="no-print w-full mt-4 py-2 bg-white text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨️ আইডি কার্ড প্রিন্ট করুন</span>
                </button>
              </div>

              {/* ডানপাশ: পারিবারিক ও যোগাযোগের বিস্তারিত */}
              <div className="md:col-span-7 space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <h5 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    অভিভাবক ও পারিবারিক তথ্য
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500">পিতা/অভিভাবক:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{student.guardianName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">জরুরি মোবাইল:</span>
                      <p className="font-bold text-slate-800 font-mono mt-0.5">{student.emergencyPhone || student.guardianPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">প্রধান মোবাইল নম্বর:</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-bold text-slate-900 font-mono text-sm">{student.guardianPhone}</span>
                        <a href={`tel:${student.guardianPhone}`} className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`https://wa.me/88${student.guardianPhone}`} target="_blank" rel="noreferrer" className="p-1.5 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">স্থায়ী ঠিকানা:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{student.address}</p>
                    </div>
                  </div>
                </div>

                {/* একাডেমিক ও সিকিউরিটি */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2.5">
                  <h5 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                    একাডেমিক ও গোপন পিন নম্বর
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-600">পড়ার বর্তমান অবস্থা:</span>
                      <p className="font-bold text-slate-900 mt-0.5">{student.currentLesson}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">অভিভাবকের গোপন পিন:</span>
                      <p className="font-mono font-black text-emerald-800 text-sm mt-0.5 bg-white px-2 py-0.5 rounded border border-emerald-300 inline-block">
                        PIN: {student.guardianPin}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">ভর্তির তারিখ:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{student.admissionDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">মাসিক নির্ধারিত ফি:</span>
                      <p className="font-bold text-slate-900 mt-0.5">৳ {student.monthlyFee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ট্যাব ২: ফি আদায় ও বাংলা মানি রিসিট প্রিন্ট */}
          {activeTab === "fees" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* বামপাশ: ফি কালেকশন ফর্ম */}
              <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">চলতি মাসের ফি স্ট্যাটাস</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-slate-800">মোট ধার্য: ৳ {student.monthlyFee}</span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      student.dueAmount > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {student.dueAmount > 0 ? `বকেয়া: ৳ ${student.dueAmount}` : "পরিশোধিত"}
                    </span>
                  </div>
                </div>

                <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ফি-র খাত:</label>
                    <select
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="মাসিক বেতন ও বোর্ডিং ফি">মাসিক বেতন ও বোর্ডিং ফি</option>
                      <option value="ভর্তি ও সেশন ফি">ভর্তি ও সেশন ফি</option>
                      <option value="পরীক্ষা ফি">পরীক্ষা ফি</option>
                      <option value="বই ও কিতাব বাবদ">বই ও কিতাব বাবদ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জমার পরিমাণ (টাকা):</label>
                    <input
                      type="number"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
                      <span>পরিশোধের পর বকেয়া:</span>
                      <span className="font-bold text-red-600">৳ {currentDue}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পেমেন্ট মেথড:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`py-1.5 rounded-lg font-bold text-xs border ${
                          paymentMethod === "cash" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700"
                        }`}
                      >
                        ক্যাশ নগদ
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash")}
                        className={`py-1.5 rounded-lg font-bold text-xs border ${
                          paymentMethod === "bkash" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700"
                        }`}
                      >
                        বিকাশ
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bank")}
                        className={`py-1.5 rounded-lg font-bold text-xs border ${
                          paymentMethod === "bank" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700"
                        }`}
                      >
                        ব্যাংক
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all mt-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>টাকা জমা নিন ও রসিদ তৈরি করুন</span>
                  </button>
                </form>
              </div>

              {/* ডানপাশ: লাইভ বাংলা মানি রিসিট প্রিভিউ */}
              <div className="md:col-span-7">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">মানি রিসিট কপি (#REC-1045)</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                    <button
                      onClick={() => setPrintMode("a4")}
                      className={`px-2 py-0.5 rounded ${printMode === "a4" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                    >
                      A4 হাফ সাইজ
                    </button>
                    <button
                      onClick={() => setPrintMode("thermal")}
                      className={`px-2 py-0.5 rounded ${printMode === "thermal" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                    >
                      POS থার্মাল
                    </button>
                  </div>
                </div>

                {/* মানি রিসিট কার্ড */}
                <div className={`bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-sm text-xs space-y-3 ${
                  printMode === "thermal" ? "max-w-[280px] mx-auto text-[11px]" : "w-full"
                }`}>
                  <div className="text-center pb-2 border-b border-dashed border-slate-300">
                    <h4 className="font-extrabold text-sm text-slate-900">{madrasa.name}</h4>
                    <p className="text-[10px] text-slate-500">{madrasa.address}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                      টাকা জমা প্রাপ্তি রসিদ (ক্যাশ মেমো)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-slate-700">
                    <div>রসিদ নং: <b>#REC-1045</b></div>
                    <div className="text-right">তারিখ: <b>১৫/০৩/২০২৬</b></div>
                    <div>ছাত্রের নাম: <b>{student.name}</b></div>
                    <div className="text-right">রোল নং: <b>{student.roll}</b></div>
                    <div>জামাত: <b>{student.className}</b></div>
                    <div className="text-right">ধরণ: <b>{student.status === "residential" ? "আবাসিক" : "অনাবাসিক"}</b></div>
                  </div>

                  <div className="border-t border-b border-slate-200 py-2 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>বিবরণ: {feeType}</span>
                      <span>৳ {payAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>মাধ্যম: {paymentMethod === "cash" ? "নগদ ক্যাশ" : paymentMethod === "bkash" ? "বিকাশ" : "ব্যাংক"}</span>
                      <span>বকেয়া অবশিষ্ট: ৳ {currentDue}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 font-bold text-sm text-slate-900">
                    <span>মোট আদায়কৃত টাকা:</span>
                    <span className="text-emerald-700">৳ {payAmount.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 flex justify-between items-end text-[10px] text-slate-500">
                    <div>
                      <p>অভিভাবকের স্বাক্ষর</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">মাওলানা ইমরান হুসাইন</p>
                      <p>আদায়কারীর স্বাক্ষর</p>
                    </div>
                  </div>
                </div>

                {/* প্রিন্ট ও শেয়ার অপশন */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>🖨️ রসিদ প্রিন্ট করুন</span>
                  </button>
                  <a
                    href={`https://wa.me/88${student.guardianPhone}?text=আসসালামু আলাইকুম, জামিয়া দারুল উলুম হতে আপনার সন্তানের মার্চ মাসের ফি বাবদ ৳${payAmount} সফলভাবে জমা নেওয়া হয়েছে। রসিদ নং: #REC-1045`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp-এ পাঠান</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ট্যাব ৩: মুহতামিম সাহেবের অ্যাক্টিভিটি, সতর্কবার্তা ও নোটিশ বোর্ড */}
          {activeTab === "activities" && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    শিক্ষার্থী অ্যাক্টিভিটি, সতর্কতা ও নোটিশ রেজিস্টার
                  </h4>
                  <p className="text-xs text-slate-500">
                    ছাত্রের কোনো ভালো কাজ, অনিয়ম বা প্রাতিষ্ঠানিক নোটিশ থাকলে এখানে লিখে সেভ করুন
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-emerald-800">
                    মোট রেকর্ড: {activitiesList.length}টি
                  </span>
                </div>
              </div>

              {/* নতুন এন্ট্রি ফরম */}
              <form onSubmit={handleAddActivitySubmit} className="bg-white p-5 rounded-2xl border-2 border-emerald-600/30 shadow-sm space-y-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>➕ নতুন অ্যাক্টিভিটি বা নোটিশ যোগ করুন</span>
                  </span>
                  <span className="text-[11px] text-slate-400">রেকর্ডকারী: মুহতামিম সাহেব</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">ধরণ নির্ধারণ করুন:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActType("praise")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1.5 ${
                        actType === "praise"
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>🟢 ভালো ছাত্র / প্রশংসা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActType("warning")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1.5 ${
                        actType === "warning"
                          ? "bg-red-600 text-white border-red-600 shadow-md"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>🔴 সতর্কবার্তা / অনিয়ম</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActType("notice")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-center flex items-center justify-center gap-1.5 ${
                        actType === "notice"
                          ? "bg-amber-600 text-white border-amber-600 shadow-md"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>🟡 জরুরি নোটিশ</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    বিষয় / শিরোনাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    placeholder={
                      actType === "praise"
                        ? "যেমন: পরীক্ষায় ১ম স্থান / নিয়মিত নামাজ আদায়কারী"
                        : actType === "warning"
                        ? "যেমন: অনুমতি ছাড়া মাদ্রাসার বাইরে যাওয়া / শৃঙ্খলা ভঙ্গ"
                        : "যেমন: বকেয়া ফি পরিশোধ বা অভিভাবক মিটিংয়ের নোটিশ"
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">বিস্তারিত বিবরণ ও মন্তব্য</label>
                  <textarea
                    rows={3}
                    value={actDesc}
                    onChange={(e) => setActDesc(e.target.value)}
                    placeholder="ঘটনার সংক্ষিপ্ত বিবরণ বা প্রশংসা লিখে রাখুন..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#064e3b] hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>

              {/* পূর্ববর্তী রেকর্ড তালিকা */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>📜 পূর্ববর্তী সকল রেকর্ড ও ইতিহাস ({activitiesList.length}):</span>
                </h5>

                {activitiesList.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                    এখনো কোনো অ্যাক্টিভিটি বা নোটিশ রেকর্ড করা হয়নি।
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activitiesList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          item.type === "praise"
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                            : item.type === "warning"
                            ? "bg-red-50/70 border-red-200 text-red-950"
                            : "bg-amber-50/70 border-amber-200 text-amber-950"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="flex items-center gap-1.5 text-sm">
                            {item.type === "praise" && <Award className="w-4 h-4 text-emerald-700" />}
                            {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                            {item.type === "notice" && <Bell className="w-4 h-4 text-amber-700" />}
                            <span>{item.title}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {item.date} • {item.recordedBy}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-700 mt-1.5 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-black/5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
