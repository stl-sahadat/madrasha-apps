"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  BookMarked, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Send, 
  Award, 
  Share2, 
  FileText 
} from "lucide-react";
import { HifzRecord, Student } from "@/types";

interface HifzDiaryViewProps {
  records: HifzRecord[];
  students: Student[];
  onBack: () => void;
  onAddRecord: (record: Omit<HifzRecord, "id">) => void;
}

export const HifzDiaryView: React.FC<HifzDiaryViewProps> = ({
  records,
  students,
  onBack,
  onAddRecord,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qualityFilter, setQualityFilter] = useState<"all" | "mumtaz" | "jayyid" | "daif">("all");
  const [smsAlert, setSmsAlert] = useState<string | null>(null);

  // নতুন সবক ফর্ম স্টেট
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [sabakPara, setSabakPara] = useState("পারা ১");
  const [sabakSurah, setSabakSurah] = useState("সূরা আল-বাক্বারাহ");
  const [sabakPage, setSabakPage] = useState("পৃষ্ঠা ৫ (১০ লাইন)");
  const [sabkiPara, setSabkiPara] = useState("পারা ৩০ (আমপারা)");
  const [amparaSurah, setAmparaSurah] = useState("নাজেরা রিভিশন");
  const [quality, setQuality] = useState<"mumtaz" | "jayyid" | "daif">("mumtaz");
  const [teacherRemarks, setTeacherRemarks] = useState("মাশাআল্লাহ, সুন্দর ও শুদ্ধ তেলাওয়াত।");

  // পরিসংখ্যন
  const totalHifzStudents = students.filter(s => s.className.includes("হিফজ") || s.status === "residential").length || 35;
  const mumtazCount = records.filter(r => r.quality === "mumtaz").length;
  const daifCount = records.filter(r => r.quality === "daif").length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId) || students[0];
    onAddRecord({
      studentId: st.id,
      studentName: st.name,
      roll: st.roll,
      date: new Date().toISOString().split("T")[0],
      sabakPara,
      sabakSurah,
      sabakPage,
      sabkiPara,
      amparaSurah,
      quality,
      teacherRemarks,
    });
    setShowAddModal(false);
  };

  const handleSendDiarySms = (r: HifzRecord) => {
    setSmsAlert(`${r.studentName}-এর অভিভাবককে আজকের হিফজ সবকের রিপোর্ট SMS পাঠানো হয়েছে।`);
    setTimeout(() => setSmsAlert(null), 3500);
  };

  const filteredRecords = records.filter(r => {
    if (qualityFilter !== "all" && r.quality !== qualityFilter) return false;
    if (searchQuery) {
      return (
        r.studentName.includes(searchQuery) ||
        r.roll.includes(searchQuery) ||
        r.sabakSurah.includes(searchQuery)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>← ড্যাশবোর্ডে ফিরুন</span>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-emerald-600" />
              <span>হিফজুল কুরআন বিভাগ ও দৈনিক সবক ডায়েরি</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              সবক (নতুন পড়া), সবকি/সাত-সবক (সাম্প্রতিক পারা) ও আমপারা ট্র্যাকিং
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>আজকের নতুন সবক এন্ট্রি</span>
        </button>
      </div>

      {/* এসএমএস এলার্ট ব্যানার */}
      {smsAlert && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{smsAlert}</span>
        </div>
      )}

      {/* ৪টি পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500">মোট হিফজ শিক্ষার্থী</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalHifzStudents} জন</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">সবাই আবাসিক ছাত্র</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500">আজকের সবক সম্পন্ন</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{records.length} জন</p>
          <p className="text-[11px] text-slate-500 mt-1">উস্তাদ: হাফেজ মাও. জুবায়ের</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500">মুমতাজ (উত্তম মান)</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{mumtazCount} জন</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">বিশুদ্ধ মাখরাজ ও তাজবীদ</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500">দুর্বল / পুনরাবৃত্তি</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{daifCount} জন</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">বিশেষ নজরদারি প্রয়োজন</p>
        </div>
      </div>

      {/* ফিল্টার ও সার্চ বার */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setQualityFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              qualityFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            সব শিক্ষার্থী ({records.length})
          </button>
          <button
            onClick={() => setQualityFilter("mumtaz")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              qualityFilter === "mumtaz" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            মুমতাজ (উত্তম)
          </button>
          <button
            onClick={() => setQualityFilter("jayyid")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              qualityFilter === "jayyid" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            জায়্যিদ (চলনসই)
          </button>
          <button
            onClick={() => setQualityFilter("daif")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              qualityFilter === "daif" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            দুর্বল
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, রোল বা সূরা দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* হিফজ রেকর্ড তালিকা (মনিটরে টেবিল, মোবাইলে কার্ড) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ডেস্কটপ ভিউ */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-700">
                <th className="py-3.5 px-4 text-center">রোল</th>
                <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3.5 px-4">আজকের নতুন সবক</th>
                <th className="py-3.5 px-4">সাত-সবক (সবকি)</th>
                <th className="py-3.5 px-4">আমপারা / নাজেরা</th>
                <th className="py-3.5 px-4 text-center">মান / কোয়ালিটি</th>
                <th className="py-3.5 px-4">উস্তাদের মূল্যায়ন</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 text-center font-bold text-slate-900">{r.roll}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-emerald-800 block">{r.sabakPara} — {r.sabakSurah}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{r.sabakPage}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800">{r.sabkiPara}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{r.amparaSurah || "সম্পন্ন"}</td>
                  <td className="py-4 px-4 text-center">
                    {r.quality === "mumtaz" ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">
                        মুমতাজ (উত্তম)
                      </span>
                    ) : r.quality === "jayyid" ? (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg">
                        জায়্যিদ (চলনসই)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg">
                        দুর্বল
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-600 italic max-w-xs">{r.teacherRemarks}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleSendDiarySms(r)}
                      title="অভিভাবককে SMS পাঠান"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3 text-emerald-600" />
                      <span>SMS</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* মোবাইল কার্ড ভিউ */}
        <div className="lg:hidden divide-y divide-slate-100 p-3 space-y-3">
          {filteredRecords.map((r) => (
            <div key={r.id} className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    {r.roll}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{r.studentName}</span>
                </div>
                {r.quality === "mumtaz" ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md">মুমতাজ</span>
                ) : r.quality === "jayyid" ? (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-md">জায়্যিদ</span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">দুর্বল</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">নতুন সবক:</span>
                  <span className="font-bold text-emerald-800">{r.sabakPara} - {r.sabakSurah}</span>
                  <p className="text-[10px] text-slate-500 font-mono">{r.sabakPage}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">সাত-সবক (সবকি):</span>
                  <span className="font-semibold text-slate-700">{r.sabkiPara}</span>
                </div>
              </div>

              <p className="text-slate-600 italic bg-slate-100 p-2 rounded-lg text-[11px]">
                উস্তাদের মন্তব্য: {r.teacherRemarks}
              </p>

              <button
                onClick={() => handleSendDiarySms(r)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>অভিভাবককে সবকের SMS পাঠান</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* নতুন সবক এন্ট্রি মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-600" />
                <span>দৈনিক হিফজ সবক এন্ট্রি ফরম</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1"
              >
                ✕ বন্ধ
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      রোল {s.roll} — {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নতুন সবক পারা *</label>
                  <input
                    type="text"
                    required
                    value={sabakPara}
                    onChange={(e) => setSabakPara(e.target.value)}
                    placeholder="যেমন: পারা ১৮"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সূরা ও আয়াত</label>
                  <input
                    type="text"
                    value={sabakSurah}
                    onChange={(e) => setSabakSurah(e.target.value)}
                    placeholder="যেমন: সূরা মুমিনূন"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পৃষ্ঠা ও লাইন সংখ্যা</label>
                  <input
                    type="text"
                    value={sabakPage}
                    onChange={(e) => setSabakPage(e.target.value)}
                    placeholder="যেমন: পৃষ্ঠা ৫ (১২ লাইন)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সাত-সবক / সবকি পারা *</label>
                  <input
                    type="text"
                    required
                    value={sabkiPara}
                    onChange={(e) => setSabkiPara(e.target.value)}
                    placeholder="যেমন: পারা ১৭"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">তেলাওয়াত মান ও তাজবীদ কোয়ালিটি *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuality("mumtaz")}
                    className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                      quality === "mumtaz"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    মুমতাজ (উত্তম)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality("jayyid")}
                    className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                      quality === "jayyid"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    জায়্যিদ (চলনসই)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality("daif")}
                    className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                      quality === "daif"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    দফ (দুর্বল)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">উস্তাদের মূল্যায়ন ও নির্দেশনা</label>
                <textarea
                  rows={2}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  placeholder="যেমন: মাদ্দের কায়দায় সামান্য দুর্বলতা আছে..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                হিফজ ডায়েরিতে সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
