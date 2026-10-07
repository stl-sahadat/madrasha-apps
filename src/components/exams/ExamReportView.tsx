"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  GraduationCap, 
  Printer, 
  Award, 
  Search, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  Building2,
  X
} from "lucide-react";
import { StudentReportCard, Student, MadrasaInfo } from "@/types";

interface ExamReportViewProps {
  reports: StudentReportCard[];
  students: Student[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  onAddReport: (report: Omit<StudentReportCard, "id">) => void;
}

export const ExamReportView: React.FC<ExamReportViewProps> = ({
  reports,
  students,
  madrasa,
  onBack,
  onAddReport,
}) => {
  const [selectedReportForPrint, setSelectedReportForPrint] = useState<StudentReportCard | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // নতুন ফলাফল ফর্ম স্টেট
  const [examName, setExamName] = useState("১ম সাময়িক পরীক্ষা — ২০২৬");
  const [chosenStudentId, setChosenStudentId] = useState(students[0]?.id || "");
  const [meritPos, setMeritPos] = useState<number>(1);
  const [quranMarks, setQuranMarks] = useState<number>(95);
  const [deenMarks, setDeenMarks] = useState<number>(90);
  const [banglaMarks, setBanglaMarks] = useState<number>(85);
  const [mathMarks, setMathMarks] = useState<number>(90);
  const [englishMarks, setEnglishMarks] = useState<number>(80);
  const [characterRemark, setCharacterRemark] = useState("মাশাআল্লাহ, আখলাক ও পড়াশোনায় অনেক মনোযোগী।");

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === chosenStudentId) || students[0];
    const subjects = [
      { subjectName: "কুরআন মাজীদ ও তাজবীদ", fullMarks: 100, obtainedMarks: quranMarks, grade: quranMarks >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ জিদ্দান" },
      { subjectName: "দ্বীনিয়্যাত ও মাসআলা", fullMarks: 100, obtainedMarks: deenMarks, grade: deenMarks >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ জিদ্দান" },
      { subjectName: "বাংলা ও ব্যাকরণ", fullMarks: 100, obtainedMarks: banglaMarks, grade: banglaMarks >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ" },
      { subjectName: "গণিত", fullMarks: 100, obtainedMarks: mathMarks, grade: mathMarks >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ জিদ্দান" },
      { subjectName: "ইংরেজি", fullMarks: 100, obtainedMarks: englishMarks, grade: englishMarks >= 80 ? "মুমতাজ (A+)" : "জায়্যিদ" },
    ];

    const totalFull = 500;
    const totalObt = quranMarks + deenMarks + banglaMarks + mathMarks + englishMarks;
    const pct = parseFloat(((totalObt / totalFull) * 100).toFixed(1));
    const overall = pct >= 80 ? "মুমতাজ (Star Marks)" : pct >= 70 ? "জায়্যিদ জিদ্দান (১ম বিভাগ)" : "জায়্যিদ (২য় বিভাগ)";

    onAddReport({
      examName,
      studentId: st.id,
      studentName: st.name,
      roll: st.roll,
      className: st.className,
      subjects,
      totalFullMarks: totalFull,
      totalObtainedMarks: totalObt,
      percentage: pct,
      overallGrade: overall,
      meritPosition: meritPos,
      attendanceDays: 88,
      characterRemark,
    });

    setShowAddModal(false);
  };

  const filteredReports = reports.filter(r => {
    if (searchQuery) {
      return (
        r.studentName.includes(searchQuery) ||
        r.roll.includes(searchQuery) ||
        r.className.includes(searchQuery)
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
              <GraduationCap className="w-6 h-6 text-emerald-700" />
              <span>পরীক্ষা ও প্রগ্রেস রিপোর্ট কার্ড জেনারেটর</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              কওমি ও আলিয়া গ্রেডিং অনুযায়ী বিষয়ভিত্তিক নম্বর এন্ট্রি ও ১-ক্লিকে রেজাল্ট শিট প্রিন্ট
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ফলাফল ও মার্কস এন্ট্রি</span>
        </button>
      </div>

      {/* সার্চ ও পরিসংখ্যান */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-500">মোট প্রস্তুতকৃত ফলাফল:</span>
          <b className="text-slate-900 text-sm ml-1.5">{reports.length} জন শিক্ষার্থীর মার্কশিট প্রস্তুত</b>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ছাত্রের নাম বা রোল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* রেজাল্ট কার্ড গ্রিড তালিকা */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-md">
                  {r.examName}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{r.studentName}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  রোল: <b className="text-slate-800">{r.roll}</b> | {r.className}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">মেধা স্থান:</span>
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center ml-auto">
                  {r.meritPosition}ম
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">মোট প্রাপ্ত নম্বর:</span>
                <b className="text-slate-900">{r.totalObtainedMarks} / {r.totalFullMarks}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">প্রাপ্ত ফলাফল ও গ্রেড:</span>
                <b className="text-emerald-700">{r.overallGrade} ({r.percentage}%)</b>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 italic bg-emerald-50/40 p-2.5 rounded-lg">
              "{r.characterRemark}"
            </p>

            <button
              onClick={() => setSelectedReportForPrint(r)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>বাংলা প্রগ্রেস রিপোর্ট কার্ড প্রিন্ট করুন</span>
            </button>
          </div>
        ))}
      </div>

      {/* প্রিন্টযোগ্য প্রগ্রেস রিপোর্ট কার্ড মডাল */}
      {selectedReportForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-auto space-y-6">
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">প্রিন্ট প্রিভিউ মোড</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>এখনই প্রিন্ট করুন (A4)</span>
                </button>
                <button
                  onClick={() => setSelectedReportForPrint(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* প্রিন্ট কন্টেন্ট (A4 প্রাতিষ্ঠানিক মার্কশিট ফরম্যাট) */}
            <div className="border-4 border-double border-emerald-800 p-6 rounded-2xl space-y-5 bg-white text-slate-900">
              {/* প্রাতিষ্ঠানিক হেডার */}
              <div className="text-center pb-4 border-b-2 border-emerald-700">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Building2 className="w-6 h-6 text-emerald-700" />
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight">
                    {madrasa.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-600">{madrasa.address} | ফোন: {madrasa.phone}</p>
                <div className="inline-block mt-2 px-4 py-1 bg-emerald-100/80 text-emerald-900 font-extrabold text-sm rounded-full">
                  {selectedReportForPrint.examName} — শিক্ষাবর্ষ ২০২৬
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">শিক্ষার্থীর মেধা ও চারিত্রিক মূল্যায়ন পত্র</h3>
              </div>

              {/* শিক্ষার্থীর তথ্য গ্রিড */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">শিক্ষার্থীর নাম: </span>
                  <b className="text-slate-900">{selectedReportForPrint.studentName}</b>
                </div>
                <div>
                  <span className="text-slate-500">রোল নম্বর: </span>
                  <b className="text-slate-900">{selectedReportForPrint.roll}</b>
                </div>
                <div>
                  <span className="text-slate-500">জামাত / শ্রেণি: </span>
                  <b className="text-slate-900">{selectedReportForPrint.className}</b>
                </div>
                <div>
                  <span className="text-slate-500">মেধা স্থান: </span>
                  <b className="text-amber-800 font-bold">{selectedReportForPrint.meritPosition}ম স্থান</b>
                </div>
              </div>

              {/* বিষয়ভিত্তিক নম্বরের টেবিল */}
              <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-950 font-bold">
                    <th className="border border-slate-300 py-2 px-3">বিষয়</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">পূর্ণমান</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">প্রাপ্ত নম্বর</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">বিভাগ / গ্রেড</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReportForPrint.subjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-300 py-2 px-3 font-semibold">{sub.subjectName}</td>
                      <td className="border border-slate-300 py-2 px-3 text-center">{sub.fullMarks}</td>
                      <td className="border border-slate-300 py-2 px-3 text-center font-bold">{sub.obtainedMarks}</td>
                      <td className="border border-slate-300 py-2 px-3 text-center font-bold text-emerald-800">{sub.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-black">
                    <td className="border border-slate-300 py-2 px-3">সর্বমোট</td>
                    <td className="border border-slate-300 py-2 px-3 text-center">{selectedReportForPrint.totalFullMarks}</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-emerald-800">{selectedReportForPrint.totalObtainedMarks}</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-emerald-800">{selectedReportForPrint.overallGrade}</td>
                  </tr>
                </tbody>
              </table>

              {/* সার্বিক মূল্যায়ন মন্তব্য */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">উস্তাদের সার্বিক চারিত্রিক মন্তব্য:</span>
                <p className="text-slate-600 italic">{selectedReportForPrint.characterRemark}</p>
              </div>

              {/* স্বাক্ষরের জায়গা */}
              <div className="pt-10 grid grid-cols-3 gap-4 text-center text-xs text-slate-700">
                <div className="border-t border-slate-400 pt-1 font-bold">
                  শ্রেণি শিক্ষকের স্বাক্ষর
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold">
                  অভিভাবকের স্বাক্ষর
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold text-emerald-900">
                  মুহতামিমের সিল ও স্বাক্ষর
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* নতুন ফলাফল এন্ট্রি মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>শিক্ষার্থীর পরীক্ষার নম্বর এন্ট্রি</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕ বন্ধ
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মেধা স্থান (র‌্যাংক)</label>
                  <input
                    type="number"
                    min={1}
                    value={meritPos}
                    onChange={(e) => setMeritPos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
                <select
                  value={chosenStudentId}
                  onChange={(e) => setChosenStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      রোল {s.roll} — {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">বিষয়ভিত্তিক নম্বর (১০০ এর মধ্যে):</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block">কুরআন ও তাজবীদ:</label>
                    <input
                      type="number"
                      max={100}
                      value={quranMarks}
                      onChange={(e) => setQuranMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">দ্বীনিয়্যাত ও মাসআলা:</label>
                    <input
                      type="number"
                      max={100}
                      value={deenMarks}
                      onChange={(e) => setDeenMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">বাংলা:</label>
                    <input
                      type="number"
                      max={100}
                      value={banglaMarks}
                      onChange={(e) => setBanglaMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">গণিত:</label>
                    <input
                      type="number"
                      max={100}
                      value={mathMarks}
                      onChange={(e) => setMathMarks(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">উস্তাদের চারিত্রিক মূল্যায়ন মন্তব্য</label>
                <input
                  type="text"
                  value={characterRemark}
                  onChange={(e) => setCharacterRemark(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                প্রগ্রেস রিপোর্ট কার্ড তৈরি করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
