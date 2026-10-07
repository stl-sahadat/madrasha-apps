"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  UserPlus, 
  CheckCheck, 
  Printer, 
  Phone, 
  MessageSquare, 
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Check,
  X,
  FileText,
  AlertTriangle,
  Award,
  Bell
} from "lucide-react";
import { MadrasaClass, Student, StudentActivityLog } from "@/types";

interface ClassViewProps {
  classItem: MadrasaClass;
  students: Student[];
  onBack: () => void;
  onOpenStudentProfile: (student: Student) => void;
  onCollectFee: (student: Student) => void;
  onAddNewStudent: () => void;
  onUpdateTeacher?: (classId: string, name: string, phone: string) => void;
  onAddStudentActivity?: (studentId: string, activity: Omit<StudentActivityLog, "id">) => void;
}

export const ClassView: React.FC<ClassViewProps> = ({
  classItem,
  students,
  onBack,
  onOpenStudentProfile,
  onCollectFee,
  onAddNewStudent,
  onUpdateTeacher,
  onAddStudentActivity,
}) => {
  const [filterType, setFilterType] = useState<"all" | "residential" | "due">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // শ্রেণি শিক্ষক এডিট স্টেট (মুহতামিম সাহেব চাইলে পরিবর্তন করতে পারবেন)
  const [teacherName, setTeacherName] = useState(classItem.classTeacherName || "মাওলানা ইমরান হুসাইন");
  const [teacherPhone, setTeacherPhone] = useState(classItem.classTeacherPhone || "01711223344");
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  // ছাত্র অ্যাক্টিভিটি / নোটিশ মডাল স্টেট
  const [selectedStudentForActivity, setSelectedStudentForActivity] = useState<Student | null>(null);
  const [activityType, setActivityType] = useState<"praise" | "warning" | "notice">("praise");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDesc, setActivityDesc] = useState("");

  // ক্লাসের ছাত্রদের ফিল্টার করা
  const classStudents = students.filter(
    (s) => s.classId === classItem.id || s.className === classItem.name
  );

  // লোকাল হাজিরা স্টেট
  const [attendance, setAttendance] = useState<{ [studentId: string]: "present" | "absent" }>({
    "DARUL-2026-101": "present",
    "DARUL-2026-102": "present",
    "DARUL-2026-103": "present",
  });
  const [smsAlert, setSmsAlert] = useState<string | null>(null);

  // উস্তাদ সেভ হ্যান্ডলার
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingTeacher(false);
    setEditSuccessMsg(true);
    setTimeout(() => setEditSuccessMsg(false), 3000);
    if (onUpdateTeacher) {
      onUpdateTeacher(classItem.id, teacherName, teacherPhone);
    }
  };

  // ১ ক্লিকে সব হাজিরা
  const handleMarkAllPresent = () => {
    const updated: { [id: string]: "present" } = {};
    classStudents.forEach((s) => {
      updated[s.id] = "present";
    });
    setAttendance(updated);
  };

  // হাজিরা টগল
  const toggleAttendance = (studentId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // এসএমএস
  const handleSendSingleSms = (studentName: string, phone: string) => {
    setSmsAlert(`${studentName}-এর অভিভাবক (${phone})-কে অনুপস্থিতির SMS পাঠানো হয়েছে।`);
    setTimeout(() => setSmsAlert(null), 3500);
  };

  // নতুন অ্যাক্টিভিটি / নোটিশ সাবমিট
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForActivity || !activityTitle.trim()) return;

    if (onAddStudentActivity) {
      onAddStudentActivity(selectedStudentForActivity.id, {
        studentId: selectedStudentForActivity.id,
        date: new Date().toISOString().split("T")[0],
        type: activityType,
        title: activityTitle,
        description: activityDesc,
        recordedBy: "মুহতামিম সাহেব",
      });
    }

    // ছাত্র অবজেক্টে সরাসরি অ্যাড
    if (!selectedStudentForActivity.activities) {
      selectedStudentForActivity.activities = [];
    }
    selectedStudentForActivity.activities.unshift({
      id: `act_${Date.now()}`,
      studentId: selectedStudentForActivity.id,
      date: new Date().toISOString().split("T")[0],
      type: activityType,
      title: activityTitle,
      description: activityDesc,
      recordedBy: "মুহতামিম সাহেব",
    });

    setSelectedStudentForActivity(null);
    setActivityTitle("");
    setActivityDesc("");
  };

  // ফিল্টার করা ছাত্র তালিকা
  const filteredStudents = classStudents.filter((s) => {
    if (filterType === "residential" && s.status !== "residential") return false;
    if (filterType === "due" && s.dueAmount <= 0) return false;
    if (searchQuery) {
      return (
        s.name.includes(searchQuery) ||
        s.roll.includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const presentCount = Object.values(attendance).filter((s) => s === "present").length;
  const absentCount = classStudents.length - presentCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ১. টপ হেডার ও ব্রেডক্রাম্ব */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>← জামাত তালিকায় ফিরুন</span>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {classItem.name} {classItem.sections?.length > 0 && `(${classItem.sections.join(", ")})`}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              মোট শিক্ষার্থী: <b className="text-emerald-700">{classStudents.length} জন</b>
            </p>
          </div>
        </div>

        {/* সার্চ বার */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা রোল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* ২. সাহাদাত ভাইয়ের নির্দেশিত: ক্লাসের সর্বপ্রথম উস্তাদের নাম ও মোবাইল নাম্বার কার্ড */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#0f172a] text-white p-5 rounded-2xl shadow-lg border border-amber-400/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
              👨‍🏫
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">
                দায়িত্বপ্রাপ্ত শ্রেণি শিক্ষক (ক্লাস ওস্তাদ)
              </span>
              {!isEditingTeacher ? (
                <div className="flex items-center gap-3 flex-wrap mt-0.5">
                  <h3 className="text-lg font-black text-white">{teacherName}</h3>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${teacherPhone}`}
                      className="flex items-center gap-1 px-2.5 py-1 bg-emerald-800/80 hover:bg-emerald-700 rounded-lg text-xs font-mono font-bold text-emerald-200 border border-emerald-600/50"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      <span>{teacherPhone}</span>
                    </a>
                    <a
                      href={`https://wa.me/88${teacherPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 bg-teal-800 hover:bg-teal-700 text-white rounded-lg"
                      title="হোয়াটসঅ্যাপ"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveTeacher} className="flex flex-wrap items-center gap-2 mt-2">
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="উস্তাদের নাম"
                    className="px-3 py-1.5 bg-slate-900 border border-amber-400/50 rounded-xl text-xs font-bold text-white focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    placeholder="মোবাইল নম্বর"
                    className="px-3 py-1.5 bg-slate-900 border border-amber-400/50 rounded-xl text-xs font-bold text-white focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>সেভ করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingTeacher(false)}
                    className="px-2.5 py-1.5 bg-white/10 text-white rounded-xl text-xs"
                  >
                    বাতিল
                  </button>
                </form>
              )}
            </div>
          </div>

          {!isEditingTeacher && (
            <button
              onClick={() => setIsEditingTeacher(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold text-amber-300 transition-all self-start sm:self-auto shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>ওস্তাদ ও নম্বর পরিবর্তন করুন</span>
            </button>
          )}
        </div>

        {editSuccessMsg && (
          <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>সফল! শ্রেণি শিক্ষকের নাম ও মোবাইল নম্বর আপডেট করা হয়েছে।</span>
          </div>
        )}
      </div>

      {/* এসএমএস নোটিশ */}
      {smsAlert && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{smsAlert}</span>
        </div>
      )}

      {/* ৩. অ্যাকশন টুলবার ও ফিল্টার */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064e3b] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-amber-300" />
            <span>১ ক্লিকে সব হাজিরা নিন</span>
          </button>
          <button
            onClick={onAddNewStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>➕ নতুন ছাত্র ভর্তি</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট শিট</span>
          </button>
        </div>

        {/* ফিল্টার বাটন */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === "all" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            সকল ({classStudents.length})
          </button>
          <button
            onClick={() => setFilterType("residential")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === "residential" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            আবাসিক
          </button>
          <button
            onClick={() => setFilterType("due")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === "due" ? "bg-white text-red-700 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            বকেয়া আছে
          </button>
        </div>
      </div>

      {/* ৪. ক্লাসের ছাত্রদের তালিকা টেবিল (ক্লিন ও শক্তিশালী) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            শিক্ষার্থী তালিকা • আজকের উপস্থিতি: <b className="text-emerald-700">{presentCount} জন</b> | অনুপস্থিত: <b className="text-red-600">{absentCount} জন</b>
          </span>
          <span className="text-xs text-slate-500">
            মুহতামিম সাহেব যেকেনো ছাত্রের অ্যাক্টিভিটি, প্রশংসা বা সতর্কবার্তা লিখতে পারেন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">রোল ও আইডি</th>
                <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3.5 px-4">অভিভাবকের মোবাইল</th>
                {/* সাহাদাত ভাইয়ের নির্দেশিত অ্যাক্টিভিটি ও নোটিশ স্তম্ভ */}
                <th className="py-3.5 px-4">অ্যাক্টিভিটি ও নোটিশ রেকর্ড</th>
                <th className="py-3.5 px-4 text-center">বকেয়া ফি</th>
                <th className="py-3.5 px-4 text-center">হাজিরা</th>
                <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isPresent = attendance[s.id] === "present";
                const latestActivity = s.activities && s.activities.length > 0 ? s.activities[0] : null;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-900 flex items-center justify-center">
                        {s.roll}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400 mt-1">{s.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-sm block">{s.name}</span>
                      <span className="text-[11px] text-slate-500">{s.status === "residential" ? "আবাসিক" : "অনাবাসিক"}</span>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <span className="font-medium text-slate-700 block">{s.guardianName}</span>
                      <div className="flex items-center gap-1.5 font-mono text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{s.guardianPhone}</span>
                      </div>
                    </td>

                    {/* অ্যাক্টিভিটি ও নোটিশ সেল */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {latestActivity ? (
                        <div 
                          onClick={() => setSelectedStudentForActivity(s)}
                          className={`p-2 rounded-xl border text-xs cursor-pointer hover:shadow-sm transition-all ${
                            latestActivity.type === "praise"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                              : latestActivity.type === "warning"
                              ? "bg-red-50 border-red-200 text-red-900"
                              : "bg-amber-50 border-amber-200 text-amber-900"
                          }`}
                        >
                          <div className="flex items-center gap-1 font-bold">
                            {latestActivity.type === "praise" && <Award className="w-3.5 h-3.5 text-emerald-700" />}
                            {latestActivity.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                            {latestActivity.type === "notice" && <Bell className="w-3.5 h-3.5 text-amber-700" />}
                            <span>{latestActivity.title}</span>
                          </div>
                          <p className="text-[11px] opacity-80 truncate mt-0.5">{latestActivity.description}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {latestActivity.date} • {latestActivity.recordedBy}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedStudentForActivity(s)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200 flex items-center gap-1"
                        >
                          <span>+ নোটিশ / মন্তব্য লিখুন</span>
                        </button>
                      )}
                    </td>

                    {/* বকেয়া ফি */}
                    <td className="py-3.5 px-4 text-center">
                      {s.dueAmount > 0 ? (
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded font-bold">
                            বকেয়া ৳ {s.dueAmount}
                          </span>
                          <button
                            onClick={() => onCollectFee(s)}
                            className="block mx-auto text-[10px] text-emerald-700 font-bold hover:underline mt-0.5"
                          >
                            [ 💳 ফি জমা নিন ]
                          </button>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
                          ✓ পরিশোধিত
                        </span>
                      )}
                    </td>

                    {/* হাজিরা */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => toggleAttendance(s.id, "present")}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                            isPresent ? "bg-[#064e3b] text-white shadow-sm" : "text-slate-500"
                          }`}
                        >
                          উপস্থিত
                        </button>
                        <button
                          onClick={() => toggleAttendance(s.id, "absent")}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                            !isPresent ? "bg-red-600 text-white shadow-sm" : "text-slate-500"
                          }`}
                        >
                          অনুপস্থিত
                        </button>
                      </div>
                      {!isPresent && (
                        <button
                          onClick={() => handleSendSingleSms(s.name, s.guardianPhone)}
                          className="block mx-auto text-[10px] text-red-600 font-bold hover:underline mt-1"
                        >
                          [ 📢 SMS পাঠান ]
                        </button>
                      )}
                    </td>

                    {/* প্রোফাইল বোতাম */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenStudentProfile(s)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
                      >
                        প্রোফাইল ও আইডি
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৫. মুহতামিম সাহেবের জন্য বিশেষ অ্যাক্টিভিটি, নোটিশ ও প্রশংসাপত্র মডাল */}
      {selectedStudentForActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  📝 অ্যাক্টিভিটি, সতর্কবার্তা ও নোটিশ বোর্ড
                </h3>
                <p className="text-xs text-slate-500">
                  শিক্ষার্থী: <b className="text-slate-800">{selectedStudentForActivity.name}</b> (রোল: {selectedStudentForActivity.roll})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForActivity(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* পূর্বে রেকর্ডকৃত হিস্ট্রি */}
            {selectedStudentForActivity.activities && selectedStudentForActivity.activities.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <span className="text-[11px] font-bold text-slate-500 block">পূর্ববর্তী রেকর্ডসমূহ:</span>
                {selectedStudentForActivity.activities.map((act) => (
                  <div
                    key={act.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      act.type === "praise"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : act.type === "warning"
                        ? "bg-red-50 border-red-200 text-red-950"
                        : "bg-amber-50 border-amber-200 text-amber-950"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        {act.type === "praise" && "🟢 প্রশংসা:"}
                        {act.type === "warning" && "🔴 সতর্কবার্তা:"}
                        {act.type === "notice" && "🟡 নোটিশ:"}
                        {" "}{act.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{act.date}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-700">{act.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* নতুন এন্ট্রি ফরম */}
            <form onSubmit={handleSaveActivity} className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">এন্ট্রির ধরণ নির্ধারণ করুন:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActivityType("praise")}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      activityType === "praise"
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    🟢 ভালো ছাত্র / প্রশংসা
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityType("warning")}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      activityType === "warning"
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    🔴 সতর্কবার্তা / অনিয়ম
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityType("notice")}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      activityType === "notice"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    🟡 বিশেষ নোটিশ
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">বিষয় / শিরোনাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder={
                    activityType === "praise"
                      ? "যেমন: পরীক্ষায় ১ম স্থান / নিয়মিত নামাজী"
                      : activityType === "warning"
                      ? "যেমন: অনুমতি ছাড়া মাদ্রাসার বাইরে যাওয়া"
                      : "যেমন: অভিভাবককে দেখা করার নোটিশ"
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">বিস্তারিত বিবরণ ও মুহতামিম সাহেবের মন্তব্য</label>
                <textarea
                  rows={3}
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  placeholder="ঘটনা বা প্রশংসার বিবরণ লিখুন..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForActivity(null)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#064e3b] hover:bg-emerald-800 text-white font-black rounded-xl shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
