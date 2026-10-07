"use client";

import React, { useState, useEffect } from "react";
import { 
  CalendarCheck2, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Search, 
  Sparkles,
  ArrowLeft,
  Users,
  GraduationCap
} from "lucide-react";
import { Student, MadrasaClass, MadrasaInfo, TeacherStaff } from "@/types";
import { formatDateToDMY } from "@/lib/dateUtils";

interface AttendanceHubViewProps {
  students: Student[];
  teachers: TeacherStaff[];
  classes: MadrasaClass[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialTab?: "student_att" | "student_report" | "teacher_att" | "teacher_report";
  onTabChange?: (tab: "student_att" | "student_report" | "teacher_att" | "teacher_report") => void;
}

type AttendanceStatus = "present" | "absent" | "sick" | "leave";

interface StudentAttendanceRecord {
  status: AttendanceStatus;
  remarks: string;
}

export const AttendanceHubView: React.FC<AttendanceHubViewProps> = ({
  students,
  teachers,
  classes,
  madrasa,
  onBack,
  initialTab = "student_att",
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<"student_att" | "student_report" | "teacher_att" | "teacher_report">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "student_att" | "student_report" | "teacher_att" | "teacher_report") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  
  // ফিল্টার স্টেট
  const [selectedJamat, setSelectedJamat] = useState<string>(classes[0]?.name || "হেফজখানা");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ছাত্র হাজিরা স্টেট
  const [studentAttMap, setStudentAttMap] = useState<Record<string, StudentAttendanceRecord>>({});
  // শিক্ষক হাজিরা স্টেট
  const [teacherAttMap, setTeacherAttMap] = useState<Record<string, StudentAttendanceRecord>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // ফিল্টার করা ছাত্র তালিকা
  const filteredStudents = students.filter((s) => {
    const matchesJamat = !selectedJamat || s.className === selectedJamat;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.includes(searchQuery);
    return matchesJamat && matchesSearch;
  });

  // হাজিরা কাউন্ট বের করা
  const getCounts = (map: Record<string, StudentAttendanceRecord>, totalItems: number) => {
    let present = 0;
    let absent = 0;
    let sick = 0;
    let leave = 0;

    Object.values(map).forEach((r) => {
      if (r.status === "present") present++;
      else if (r.status === "absent") absent++;
      else if (r.status === "sick") sick++;
      else if (r.status === "leave") leave++;
    });

    return {
      present,
      absent,
      sick,
      leave,
      unmarked: Math.max(0, totalItems - (present + absent + sick + leave))
    };
  };

  const studentCounts = getCounts(studentAttMap, filteredStudents.length);
  const teacherCounts = getCounts(teacherAttMap, teachers.length);

  const handleStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStudentAttMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || ""
      }
    }));
  };

  const handleStudentRemarks = (studentId: string, remarks: string) => {
    setStudentAttMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || "present",
        remarks
      }
    }));
  };

  const handleTeacherStatus = (teacherId: string, status: AttendanceStatus) => {
    setTeacherAttMap((prev) => ({
      ...prev,
      [teacherId]: {
        status,
        remarks: prev[teacherId]?.remarks || ""
      }
    }));
  };

  const handleSaveAttendance = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* হেডার ও ব্যাক বাটন */}
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
              <CalendarCheck2 className="w-6 h-6 text-emerald-600" />
              <span>ডিজিটাল হাজিরা ব্যবস্থাপনা</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ছাত্র-ছাত্রী ও শিক্ষকদের দৈনিক উপস্থিতি গ্রহণ, লাইভ কাউন্টার ও প্রতিবেদন
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* সাব-ট্যাব ন্যাভিগেশন */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabChange("student_att")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "student_att"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ছাত্র হাজিরা
            </button>
            <button
              onClick={() => handleTabChange("student_report")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "student_report"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ছাত্র হাজিরা রিপোর্ট
            </button>
            <button
              onClick={() => handleTabChange("teacher_att")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "teacher_att"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              শিক্ষক হাজিরা
            </button>
            <button
              onClick={() => handleTabChange("teacher_report")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "teacher_report"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              শিক্ষক রিপোর্ট
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* সেভ সাকসেস মেসেজ */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between no-print animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>সফল! হাজিরা ডাটাবেজে সংরক্ষণ করা হয়েছে।</span>
          </div>
        </div>
      )}

      {/* ১. ছাত্র-ছাত্রী হাজিরা গ্রহণ ট্যাব */}
      {activeTab === "student_att" && (
        <div className="space-y-5">
          {/* ফিল্টার বার (স্ক্রিনশট ৩৯ অনুরূপ) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">জামাত লিস্ট</label>
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">সকল জামাত</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">তারিখ নির্বাচন (দিন/মাস/বছর)</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ছাত্র অনুসন্ধান</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="নাম বা রোল দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* ৪টি রঙিন লাইভ কাউন্টার কার্ড (স্ক্রিনশট ৩৯ অনুরূপ) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 text-center">
                <span className="text-xs font-bold opacity-90 block">উপস্থিত</span>
                <span className="text-2xl font-black mt-1 block">{studentCounts.present}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20 text-center">
                <span className="text-xs font-bold opacity-90 block">অনুপস্থিত</span>
                <span className="text-2xl font-black mt-1 block">{studentCounts.absent}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/20 text-center">
                <span className="text-xs font-bold opacity-90 block">অসুস্থ</span>
                <span className="text-2xl font-black mt-1 block">{studentCounts.sick}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-700 text-white shadow-md shadow-slate-700/20 text-center">
                <span className="text-xs font-bold opacity-90 block">ছুটি</span>
                <span className="text-2xl font-black mt-1 block">{studentCounts.leave}</span>
              </div>
            </div>
          </div>

          {/* ছাত্র উপস্থিতি টেবিল */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3 px-4 w-14">আইডি</th>
                    <th className="py-3 px-4">ছাত্রের নাম</th>
                    <th className="py-3 px-4">উপস্থিতি নির্বাচন</th>
                    <th className="py-3 px-4">মন্তব্য করুন</th>
                    <th className="py-3 px-4">অভিভাবকের ফোন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 font-bold">
                        কোনো শিক্ষার্থী পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const cur = studentAttMap[s.id]?.status;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-500">{s.roll}</td>
                          <td className="py-3 px-4 font-black text-slate-900">
                            <div>{s.name}</div>
                            <div className="text-[10px] text-indigo-600 font-bold">{s.className}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                                <input
                                  type="radio"
                                  name={`att_${s.id}`}
                                  checked={cur === "present"}
                                  onChange={() => handleStudentStatus(s.id, "present")}
                                  className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>উপস্থিত</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                                <input
                                  type="radio"
                                  name={`att_${s.id}`}
                                  checked={cur === "absent"}
                                  onChange={() => handleStudentStatus(s.id, "absent")}
                                  className="text-amber-600 focus:ring-amber-500"
                                />
                                <span>অনুপস্থিত</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700">
                                <input
                                  type="radio"
                                  name={`att_${s.id}`}
                                  checked={cur === "sick"}
                                  onChange={() => handleStudentStatus(s.id, "sick")}
                                  className="text-rose-600 focus:ring-rose-500"
                                />
                                <span>অসুস্থ</span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                                <input
                                  type="radio"
                                  name={`att_${s.id}`}
                                  checked={cur === "leave"}
                                  onChange={() => handleStudentStatus(s.id, "leave")}
                                  className="text-slate-600 focus:ring-slate-500"
                                />
                                <span>ছুটি</span>
                              </label>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="মন্তব্য লিখুন..."
                              value={studentAttMap[s.id]?.remarks || ""}
                              onChange={(e) => handleStudentRemarks(s.id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs w-48"
                            />
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-600">
                            {s.guardianPhone}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* সংরক্ষণ বোতাম */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={handleSaveAttendance}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>উপস্থিতি সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ২. ছাত্র-ছাত্রী হাজিরা প্রতিবেদন (প্রিন্ট উপযোগী - স্ক্রিনশট ৪০ অনুরূপ) */}
      {activeTab === "student_report" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <select
                value={selectedJamat}
                onChange={(e) => setSelectedJamat(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="">সকল জামাত</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* প্রিন্ট উপযোগী রিপোর্ট শীট */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:m-0 print:border-none print:shadow-none">
            <div className="text-center space-y-1">
              <div className="text-sm font-serif text-slate-600">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • মোবাইল: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-300">
                  ছাত্র-ছাত্রী হাজিরা প্রতিবেদন
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold pt-1">
                জামাতের নাম: {selectedJamat || "সকল জামাত"} • তারিখ: {formatDateToDMY(selectedDate)}
              </p>
            </div>

            {/* সামারি টেবিল (স্ক্রিনশট ৪০ অনুরূপ) */}
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-xs font-black">
                    <th className="py-2.5 px-3 border border-slate-700">মোট ছাত্র</th>
                    <th className="py-2.5 px-3 border border-slate-700">উপস্থিত</th>
                    <th className="py-2.5 px-3 border border-slate-700">অনুপস্থিত</th>
                    <th className="py-2.5 px-3 border border-slate-700">অসুস্থ</th>
                    <th className="py-2.5 px-3 border border-slate-700">ছুটি</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-900 divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="py-3 px-3 border border-slate-300 font-black">{filteredStudents.length}</td>
                    <td className="py-3 px-3 border border-slate-300 text-emerald-700 font-black">{studentCounts.present}</td>
                    <td className="py-3 px-3 border border-slate-300 text-amber-700 font-black">{studentCounts.absent}</td>
                    <td className="py-3 px-3 border border-slate-300 text-rose-700 font-black">{studentCounts.sick}</td>
                    <td className="py-3 px-3 border border-slate-300 text-slate-700 font-black">{studentCounts.leave}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* বিস্তারিত তালিকা */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase">
                    <th className="py-2 px-3 border-b">রোল</th>
                    <th className="py-2 px-3 border-b">নাম</th>
                    <th className="py-2 px-3 border-b">জামাত</th>
                    <th className="py-2 px-3 border-b">অবস্থা</th>
                    <th className="py-2 px-3 border-b">মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((s) => {
                    const st = studentAttMap[s.id]?.status || "present";
                    const statusText = {
                      present: "উপস্থিত",
                      absent: "অনুপস্থিত",
                      sick: "অসুস্থ",
                      leave: "ছুটি"
                    }[st];
                    return (
                      <tr key={s.id}>
                        <td className="py-2 px-3 font-bold text-slate-600">{s.roll}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2 px-3 text-slate-600">{s.className}</td>
                        <td className="py-2 px-3 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            st === "present" ? "bg-emerald-100 text-emerald-800" :
                            st === "absent" ? "bg-amber-100 text-amber-800" :
                            st === "sick" ? "bg-rose-100 text-rose-800" : "bg-slate-200 text-slate-800"
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{studentAttMap[s.id]?.remarks || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* স্বাক্ষর লাইন */}
            <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                শ্রেণী শিক্ষকের স্বাক্ষর
              </div>
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                মুহতামিমের স্বাক্ষর ও সীল
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ৩. শিক্ষক হাজিরা ট্যাব (স্ক্রিনশট ৪১ অনুরূপ) */}
      {activeTab === "teacher_att" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-72">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">তারিখ নির্বাচন (দিন/মাস/বছর)</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSaveAttendance}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>উপস্থিতি সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>

            {/* ৪টি কাউন্টার কার্ড */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-500 text-white text-center">
                <span className="text-xs font-bold opacity-90 block">উপস্থিত</span>
                <span className="text-2xl font-black mt-1 block">{teacherCounts.present}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500 text-white text-center">
                <span className="text-xs font-bold opacity-90 block">অনুপস্থিত</span>
                <span className="text-2xl font-black mt-1 block">{teacherCounts.absent}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500 text-white text-center">
                <span className="text-xs font-bold opacity-90 block">অসুস্থ</span>
                <span className="text-2xl font-black mt-1 block">{teacherCounts.sick}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-700 text-white text-center">
                <span className="text-xs font-bold opacity-90 block">ছুটি</span>
                <span className="text-2xl font-black mt-1 block">{teacherCounts.leave}</span>
              </div>
            </div>
          </div>

          {/* শিক্ষক তালিকা টেবিল */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-3 px-4 w-14">আইডি</th>
                    <th className="py-3 px-4">শিক্ষকের নাম</th>
                    <th className="py-3 px-4">উপস্থিতি নির্বাচন</th>
                    <th className="py-3 px-4">মন্তব্য করুন</th>
                    <th className="py-3 px-4">ফোন নম্বর</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {teachers.map((t, idx) => {
                    const cur = teacherAttMap[t.id]?.status;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          <div>{t.name}</div>
                          <div className="text-[10px] text-purple-600 font-bold">{t.designation}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                              <input
                                type="radio"
                                name={`teacher_att_${t.id}`}
                                checked={cur === "present"}
                                onChange={() => handleTeacherStatus(t.id, "present")}
                                className="text-emerald-600"
                              />
                              <span>উপস্থিত</span>
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                              <input
                                type="radio"
                                name={`teacher_att_${t.id}`}
                                checked={cur === "absent"}
                                onChange={() => handleTeacherStatus(t.id, "absent")}
                                className="text-amber-600"
                              />
                              <span>অনুপস্থিত</span>
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700">
                              <input
                                type="radio"
                                name={`teacher_att_${t.id}`}
                                checked={cur === "sick"}
                                onChange={() => handleTeacherStatus(t.id, "sick")}
                                className="text-rose-600"
                              />
                              <span>অসুস্থ</span>
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                              <input
                                type="radio"
                                name={`teacher_att_${t.id}`}
                                checked={cur === "leave"}
                                onChange={() => handleTeacherStatus(t.id, "leave")}
                                className="text-slate-600"
                              />
                              <span>ছুটি</span>
                            </label>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="মন্তব্য লিখুন..."
                            value={teacherAttMap[t.id]?.remarks || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTeacherAttMap((prev) => ({
                                ...prev,
                                [t.id]: { status: prev[t.id]?.status || "present", remarks: val }
                              }));
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs w-48"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">
                          {t.phone}
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

      {/* ৪. শিক্ষক হাজিরা রিপোর্ট */}
      {activeTab === "teacher_report" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">শিক্ষক উপস্থিতি প্রতিবেদন</div>
              <p className="text-xs text-slate-500 font-medium">তারিখ: {formatDateToDMY(selectedDate)}</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-2.5 px-3">ক্রমিক</th>
                    <th className="py-2.5 px-3">নাম</th>
                    <th className="py-2.5 px-3">পদবি</th>
                    <th className="py-2.5 px-3">মোবাইল</th>
                    <th className="py-2.5 px-3">উপস্থিতি অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {teachers.map((t, idx) => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.designation}</td>
                      <td className="py-2.5 px-3 font-mono">{t.phone}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {teacherAttMap[t.id]?.status === "absent" ? "অনুপস্থিত" :
                           teacherAttMap[t.id]?.status === "sick" ? "অসুস্থ" :
                           teacherAttMap[t.id]?.status === "leave" ? "ছুটি" : "উপস্থিত"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                নাজেমে তালিমাত
              </div>
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                মুহতামিমের স্বাক্ষর
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
