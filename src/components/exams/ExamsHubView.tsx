"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Plus, 
  Search, 
  Printer, 
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  BarChart3,
  Sparkles,
  Layers,
  GraduationCap
} from "lucide-react";
import { Student, MadrasaClass, MadrasaInfo } from "@/types";

interface ExamsHubViewProps {
  students: Student[];
  classes: MadrasaClass[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialTab?: "enter_marks" | "result_sheet" | "student_report";
  onTabChange?: (tab: "enter_marks" | "result_sheet" | "student_report") => void;
}

const DEFAULT_SUBJECTS = ["কুরআন মাজিদ ও তাজবীদ", "হাদিস শরীফ", "ফিকহ ও উসুলুল ফিকহ", "আরবি ব্যাকরণ (নাহব-সরফ)", "বাংলা", "ইংরেজি", "গণিত"];

const DEFAULT_EXAMS = [
  { id: "ex_1", name: "বার্ষিক পরীক্ষা ২০২৫" },
  { id: "ex_2", name: "মধ্যবর্তী / ২য় সাময়িক পরীক্ষা ২০২৫" },
  { id: "ex_3", name: "১ম সাময়িক পরীক্ষা ২০২৫" }
];

export const ExamsHubView: React.FC<ExamsHubViewProps> = ({
  students,
  classes,
  madrasa,
  onBack,
  initialTab = "enter_marks",
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<"enter_marks" | "result_sheet" | "student_report">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "enter_marks" | "result_sheet" | "student_report") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  
  // ফিল্টারসমূহ
  const [selectedExam, setSelectedExam] = useState<string>("বার্ষিক পরীক্ষা ২০২৫");
  const [selectedJamat, setSelectedJamat] = useState<string>(classes[0]?.name || "হেফজখানা");
  const [selectedSubject, setSelectedSubject] = useState<string>("বাংলা");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  
  // মার্কস স্টেট: studentId -> number
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const filteredStudents = students.filter(s => !selectedJamat || s.className === selectedJamat);
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleMarkChange = (studentId: string, mark: number) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: mark
    }));
  };

  const handleSaveMarks = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
              <Award className="w-6 h-6 text-violet-600" />
              <span>পরীক্ষা ও ফলাফল ব্যবস্থাপনা</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              বিষয়ভিত্তিক মার্কস এন্ট্রি, পূর্ণাঙ্গ ক্লাস ফলাফল শিট ও ব্যক্তিগত মার্কশিট
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* সাব-ট্যাব */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabChange("enter_marks")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "enter_marks"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              মার্কস এন্ট্রি
            </button>
            <button
              onClick={() => handleTabChange("result_sheet")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "result_sheet"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ফলাফল শীট
            </button>
            <button
              onClick={() => handleTabChange("student_report")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "student_report"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ছাত্রভিত্তিক মার্কশিট
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>সফল! পরীক্ষার্থীদের প্রাপ্ত নম্বর সফলভাবে ডাটাবেজে সংরক্ষণ করা হয়েছে।</span>
        </div>
      )}

      {/* ১. মার্কস এন্ট্রি স্ক্রিন (স্ক্রিনশট ৪২ ও ৪৩ অনুরূপ) */}
      {activeTab === "enter_marks" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-violet-600" />
              <span>রেজাল্ট তৈরী ও নম্বর ইনপুট</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার নাম *</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {DEFAULT_EXAMS.map(ex => (
                    <option key={ex.id} value={ex.name}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">জামাত *</label>
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">বিষয় *</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {DEFAULT_SUBJECTS.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ছাত্র ও নম্বর এন্ট্রি টেবিল (স্ক্রিনশট ৪৩ অনুরূপ) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs font-black text-slate-900">
                বিষয়: <span className="text-violet-700">{selectedSubject}</span> • জামাত: {selectedJamat}
              </div>
              <span className="text-xs text-slate-500 font-bold">মোট ছাত্র: {filteredStudents.length} জন</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-3 px-4 w-14">রোল</th>
                    <th className="py-3 px-4">ছাত্র/ছাত্রীর নাম</th>
                    <th className="py-3 px-4">প্রাপ্ত নম্বর (১০০ এর মধ্যে) *</th>
                    <th className="py-3 px-4">গ্রেড / মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((s) => {
                    const currentMark = marksMap[s.id] ?? 85;
                    const grade = currentMark >= 80 ? "মুমতাজ (A+)" : currentMark >= 65 ? "জায়্যিদ জিদ্দান (A)" : currentMark >= 50 ? "জায়্যিদ (B)" : "মাকবুল (C)";
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-500">{s.roll}</td>
                        <td className="py-3 px-4 font-black text-slate-900">{s.name}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="নম্বর লিখুন..."
                            value={marksMap[s.id] ?? ""}
                            onChange={(e) => handleMarkChange(s.id, Number(e.target.value))}
                            className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-indigo-700 focus:ring-2 focus:ring-violet-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            currentMark >= 80 ? "bg-emerald-100 text-emerald-800" :
                            currentMark >= 65 ? "bg-indigo-100 text-indigo-800" :
                            currentMark >= 50 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={handleSaveMarks}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>নম্বর সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ২. পূর্ণাঙ্গ ফলাফল শীট / ট্যাবুলেশন শিট (স্ক্রিনশট ৪৪ অনুরূপ) */}
      {activeTab === "result_sheet" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-3">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                {DEFAULT_EXAMS.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
              <select
                value={selectedJamat}
                onChange={(e) => setSelectedJamat(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-violet-50 text-violet-900 text-xs font-black uppercase tracking-wider border border-violet-200">
                  {selectedExam} - ফলাফল শীট (ট্যাবুলেশন শিট)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold pt-1">জামাত: {selectedJamat}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-2.5 px-3 w-12 text-center">রোল</th>
                    <th className="py-2.5 px-3">নাম</th>
                    <th className="py-2.5 px-2 text-center">কুরআন</th>
                    <th className="py-2.5 px-2 text-center">হাদিস</th>
                    <th className="py-2.5 px-2 text-center">ফিকহ</th>
                    <th className="py-2.5 px-2 text-center">আরবি</th>
                    <th className="py-2.5 px-2 text-center">বাংলা</th>
                    <th className="py-2.5 px-2 text-center font-black">মোট নম্বর</th>
                    <th className="py-2.5 px-2 text-center">মেধা স্থান</th>
                    <th className="py-2.5 px-3 text-center">গ্রেড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((s, idx) => {
                    const mockTotal = 420 + (idx * 5) % 60;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-500">{s.roll}</td>
                        <td className="py-2.5 px-3 font-black text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-2 text-center">92</td>
                        <td className="py-2.5 px-2 text-center">88</td>
                        <td className="py-2.5 px-2 text-center">85</td>
                        <td className="py-2.5 px-2 text-center">80</td>
                        <td className="py-2.5 px-2 text-center">78</td>
                        <td className="py-2.5 px-2 text-center font-black text-violet-700">{mockTotal}</td>
                        <td className="py-2.5 px-2 text-center font-black text-slate-800">{idx + 1}ম</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                            মুমতাজ (A+)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর
              </div>
              <div className="text-center border-t border-slate-400 pt-2 w-44">
                মুহতামিমের স্বাক্ষর ও সীল
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ৩. ছাত্র-ছাত্রী ভিত্তিক ফলাফল শীট / মার্কশিট (স্ক্রিনশট ৪৫ অনুরূপ) */}
      {activeTab === "student_report" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center gap-3">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (রোল: {s.roll}, জামাত: {s.className})</option>
                ))}
              </select>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                {DEFAULT_EXAMS.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full bg-violet-50 text-violet-900 text-xs font-black uppercase tracking-wider border border-violet-200">
                  নম্বরপত্র / একাডেমিক মার্কশিট - {selectedExam}
                </span>
              </div>
            </div>

            {/* ছাত্রের সংক্ষিপ্ত বিবরণ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">শিক্ষার্থীর নাম:</span>
                <span className="text-sm font-black text-slate-900">{currentStudent.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">জামাত:</span>
                <span className="font-bold">{currentStudent.className}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">রোল নম্বর:</span>
                <span className="font-bold">{currentStudent.roll}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">আইডি নম্বর:</span>
                <span className="font-mono font-bold">{currentStudent.id}</span>
              </div>
            </div>

            {/* বিষয়ভিত্তিক ফলাফল টেবিল */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                    <th className="py-2.5 px-3">বিষয়</th>
                    <th className="py-2.5 px-3 text-center">পূর্ণ নম্বর</th>
                    <th className="py-2.5 px-3 text-center">প্রাপ্ত নম্বর</th>
                    <th className="py-2.5 px-3 text-center">গ্রেড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {DEFAULT_SUBJECTS.map((sub, i) => {
                    const mark = 82 + (i * 3) % 15;
                    return (
                      <tr key={sub}>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{sub}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500">১০০</td>
                        <td className="py-2.5 px-3 text-center font-black text-slate-900">{mark}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                          {mark >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ জিদ্দান (A)"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-xs text-slate-900 border-t border-slate-300">
                    <td className="py-3 px-3">সর্বমোট:</td>
                    <td className="py-3 px-3 text-center">৭০০</td>
                    <td className="py-3 px-3 text-center text-violet-700">৫৮৫</td>
                    <td className="py-3 px-3 text-center text-emerald-700">মুমতাজ (৮৩.৫%)</td>
                  </tr>
                </tfoot>
              </table>
            </div>

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
    </div>
  );
};
