"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  CreditCard, 
  Printer, 
  Download, 
  ArrowLeft, 
  Users, 
  QrCode, 
  Pencil,
  PencilOff,
  Save,
  RotateCcw,
  CheckCircle2,
  Phone, 
  MapPin, 
  Calendar,
  Sparkles
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Student, TeacherStaff, MadrasaInfo } from "@/types";

interface IdCardGeneratorViewProps {
  students: Student[];
  teachers: TeacherStaff[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialType?: "student" | "teacher";
  onTypeChange?: (type: "student" | "teacher") => void;
  onUpdateStudent?: (student: Student) => void;
  onUpdateTeacher?: (teacher: TeacherStaff) => void;
}

// জামাতের নাম থেকে ব্র্যাকেট ও অতিরিক্ত তথ্য বাদ দেওয়ার ইউটিলিটি
const cleanClassName = (name: string): string => {
  return name ? name.replace(/\s*\([^)]*\)/g, "").trim() : "";
};

export const IdCardGeneratorView: React.FC<IdCardGeneratorViewProps> = ({
  students,
  teachers,
  madrasa,
  onBack,
  initialType = "student",
  onTypeChange,
  onUpdateStudent,
  onUpdateTeacher
}) => {
  // সাইডবার বা প্যারেন্ট থেকে আসা টাইপ অনুযায়ী ছাত্র ও শিক্ষক ভিউ আলাদা করা
  const [personType, setPersonType] = useState<"student" | "teacher">(initialType);

  useEffect(() => {
    if (initialType) {
      setPersonType(initialType);
      setShowCard(true);
    }
  }, [initialType]);

  // জামাতের তালিকা (ব্র্যাকেট ছাড়া শুধু জামাতের নাম)
  const uniqueJamats = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      const clean = cleanClassName(s.className);
      if (clean) set.add(clean);
    });
    return Array.from(set);
  }, [students]);

  // ফিল্টার স্টেট
  const [selectedJamat, setSelectedJamat] = useState<string>("all");
  
  // জামাতভিত্তিক ফিল্টার করা ছাত্র তালিকা
  const filteredStudents = useMemo(() => {
    if (selectedJamat === "all") return students;
    return students.filter((s) => cleanClassName(s.className) === selectedJamat);
  }, [students, selectedJamat]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    filteredStudents[0]?.id || students[0]?.id || ""
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || "");
  const [showCard, setShowCard] = useState<boolean>(true);

  // লাইভ এডিট মোড স্টেট
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const currentStudent = students.find((s) => s.id === selectedStudentId) || filteredStudents[0] || students[0];
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // এডিটেবল অবজেক্ট স্টেট
  const [editableStudent, setEditableStudent] = useState<Student>(currentStudent);
  const [editableTeacher, setEditableTeacher] = useState<TeacherStaff>(currentTeacher);
  const [officePhone, setOfficePhone] = useState<string>(madrasa.phone || "০১৭১১-০০০০০০");

  // ছাত্র পরিবর্তন হলে এডিট স্টেট আপডেট
  useEffect(() => {
    if (currentStudent) {
      setEditableStudent({ ...currentStudent });
    }
  }, [currentStudent, selectedStudentId]);

  // শিক্ষক পরিবর্তন হলে এডিট স্টেট আপডেট
  useEffect(() => {
    if (currentTeacher) {
      setEditableTeacher({ ...currentTeacher });
    }
  }, [currentTeacher, selectedTeacherId]);

  // জামাত ড্রপডাউন পরিবর্তনের হ্যান্ডলার
  const handleJamatChange = (jamat: string) => {
    setSelectedJamat(jamat);
    const matched = jamat === "all" 
      ? students 
      : students.filter((s) => cleanClassName(s.className) === jamat);
    if (matched.length > 0) {
      setSelectedStudentId(matched[0].id);
    }
    setShowCard(true);
  };

  // লাইভ এডিট রিসেট
  const handleReset = () => {
    if (personType === "student" && currentStudent) {
      setEditableStudent({ ...currentStudent });
    } else if (personType === "teacher" && currentTeacher) {
      setEditableTeacher({ ...currentTeacher });
    }
    setOfficePhone(madrasa.phone || "০১৭১১-০০০০০০");
    setToastMessage("পূর্বাবস্থায় ফিরিয়ে আনা হয়েছে");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // স্থায়ীভাবে সেভ
  const handleSavePermanently = () => {
    if (personType === "student" && editableStudent) {
      if (onUpdateStudent) {
        onUpdateStudent(editableStudent);
      }
      // লোকাল স্টোরেজ সিঙ্ক
      try {
        const stored = localStorage.getItem("madrasha_students");
        if (stored) {
          const list = JSON.parse(stored) as Student[];
          const updated = list.map((s) => (s.id === editableStudent.id ? editableStudent : s));
          localStorage.setItem("madrasha_students", JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
      setToastMessage("শিক্ষার্থীর তথ্য সফলভাবে স্থায়ীভাবে সংরক্ষিত হয়েছে!");
    } else if (personType === "teacher" && editableTeacher) {
      if (onUpdateTeacher) {
        onUpdateTeacher(editableTeacher);
      }
      // লোকাল স্টোরেজ সিঙ্ক
      try {
        const stored = localStorage.getItem("madrasha_teachers");
        if (stored) {
          const list = JSON.parse(stored) as TeacherStaff[];
          const updated = list.map((t) => (t.id === editableTeacher.id ? editableTeacher : t));
          localStorage.setItem("madrasha_teachers", JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
      setToastMessage("শিক্ষকের তথ্য সফলভাবে স্থায়ীভাবে সংরক্ষিত হয়েছে!");
    }
    setIsEditMode(false);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  // ১. ছাত্রের কিউআর কোডের জন্য পূর্ণাঙ্গ তথ্য এনকোডিং (এডিট হওয়া ডাটা ও মাদ্রাসার নাম সহ)
  const studentQrData = useMemo(() => {
    const s = editableStudent || currentStudent;
    if (!s) return "";
    return `=== শিক্ষার্থী ডিজিটাল পরিচয়পত্র ===
মাদ্রাসার নাম: ${madrasa.name}
মাদ্রাসা কোড/রেজি: ${madrasa.eiinOrBefaqCode || "REG-DUL-01"}
ছাত্রের নাম: ${s.name}
জামাত: ${cleanClassName(s.className)}
রোল নম্বর: ${s.roll}
রক্তের গ্রুপ: ${s.bloodGroup || "B+"}
অভিভাবকের নাম: ${s.guardianName || "তথ্য নেই"}
অভিভাবকের মোবাইল: ${s.guardianPhone || "তথ্য নেই"}
জরুরি যোগাযোগ: ${s.emergencyPhone || s.guardianPhone || "তথ্য নেই"}
ভর্তির তারিখ: ${s.admissionDate || "২০২৫-০১-১০"}
বর্তমান ঠিকানা: ${s.address || "মাদরাসা কমপ্লেক্স"}
মাদ্রাসা অফিস ফোন: ${officePhone}
মাদ্রাসা ঠিকানা: ${madrasa.address}`;
  }, [editableStudent, currentStudent, madrasa, officePhone]);

  // ২. শিক্ষকের কিউআর কোডের জন্য পূর্ণাঙ্গ তথ্য এনকোডিং (শিক্ষক এড করার সময়ের সকল ডাটা সহ)
  const teacherQrData = useMemo(() => {
    const t = editableTeacher || currentTeacher;
    if (!t) return "";
    return `=== শিক্ষক/কর্মকর্তা ডিজিটাল পরিচয়পত্র ===
মাদ্রাসার নাম: ${madrasa.name}
শিক্ষকের নাম: ${t.name}
পদবী: ${t.designation}
শিক্ষক আইডি: ${t.id}
রক্তের গ্রুপ: ${t.bloodGroup || "B+"}
মোবাইল নম্বর: ${t.phone}
শিক্ষাগত যোগ্যতা: ${t.qualification || "দাওরায়ে হাদিস"}
যোগদানের তারিখ: ${t.joiningDate || "২০১৮-০১-০১"}
জাতীয় পরিচয়পত্র (NID): ${t.nid || "তথ্য নেই"}
দায়িত্বপ্রাপ্ত জামাত: ${t.classAssigned || "সকল বিভাগ"}
মাদ্রাসা অফিস ফোন: ${officePhone}
মাদ্রাসা ঠিকানা: ${madrasa.address}`;
  }, [editableTeacher, currentTeacher, madrasa, officePhone]);

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
              <CreditCard className={`w-6 h-6 ${personType === "student" ? "text-indigo-600" : "text-purple-600"}`} />
              <span>
                {personType === "student" ? "শিক্ষার্থী ডিজিটাল আইডি কার্ড" : "শিক্ষক ও কর্মকর্তা ডিজিটাল আইডি কার্ড"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {personType === "student" 
                ? "ছাত্র-ছাত্রীদের ছবিসহ দ্বিমুখী স্মার্ট পরিচয়পত্র (এপিঠ ও ওপিঠ)" 
                : "উস্তাদ ও শিক্ষকবৃন্দের ছবিসহ দ্বিমুখী স্মার্ট পরিচয়পত্র (এপিঠ ও ওপিঠ)"}
            </p>
          </div>
        </div>

        {/* ছাত্র ও শিক্ষক ট্যাব সুইচার (পরস্পর সম্পূর্ণ আলাদা) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setPersonType("student");
              onTypeChange?.("student");
              setShowCard(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              personType === "student"
                ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/25"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span>ছাত্র আইডি কার্ড</span>
          </button>
          <button
            onClick={() => {
              setPersonType("teacher");
              onTypeChange?.("teacher");
              setShowCard(true);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              personType === "teacher"
                ? "bg-purple-700 text-white shadow-md shadow-purple-700/25"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <span>শিক্ষক আইডি কার্ড</span>
          </button>
        </div>
      </div>

      {/* সাহাদাত ভাইয়ের নির্দেশিত: ফিল্টার, ড্রপডাউন ও লাইভ এডিট টুলবার */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {personType === "student" ? (
            <>
              {/* ১. জামাত নির্বাচন ড্রপডাউন (কোনো ব্র্যাকেট ছাড়া শুধু জামাতের নাম) */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 shrink-0">
                  জামাত নির্বাচন:
                </label>
                <select
                  value={selectedJamat}
                  onChange={(e) => handleJamatChange(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                >
                  <option value="all">সকল জামাত</option>
                  {uniqueJamats.map((jamat) => (
                    <option key={jamat} value={jamat}>
                      {jamat}
                    </option>
                  ))}
                </select>
              </div>

              {/* ২. ছাত্রদের নাম নির্বাচন ড্রপডাউন (জামাতভিত্তিক ও ব্র্যাকেট ছাড়া শুধু ছাত্রের নাম) */}
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <label className="text-xs font-bold text-slate-700 shrink-0">
                  ছাত্র/ছাত্রী নির্বাচন:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setShowCard(true);
                  }}
                  className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                >
                  {filteredStudents.length === 0 ? (
                    <option value="">কোনো ছাত্র পাওয়া যায়নি</option>
                  ) : (
                    filteredStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          ) : (
            /* শিক্ষকদের নির্বাচন ড্রপডাউন (সিরিয়াল অনুযায়ী শুধু শিক্ষকের নাম) */
            <div className="flex items-center gap-2 flex-1 min-w-[250px]">
              <label className="text-xs font-bold text-slate-700 shrink-0">
                শিক্ষক নির্বাচন:
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => {
                  setSelectedTeacherId(e.target.value);
                  setShowCard(true);
                }}
                className="w-full max-w-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* সাহাদাত ভাইয়ের নির্দেশিত: লাইভ এডিট মোড টগল বাটন */}
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isEditMode 
                ? "bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
            title="কার্ডের ভেতরের লেখা পরিবর্তন করতে এটি চালু করুন"
          >
            {isEditMode ? <PencilOff className="w-4 h-4 text-slate-950" /> : <Pencil className="w-4 h-4 text-indigo-600" />}
            <span>{isEditMode ? "এডিট সম্পন্ন / লক" : "কার্ড এডিট করুন"}</span>
          </button>
        </div>

        {/* প্রিন্ট ও ডাউনলোড বাটন */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
          <button
            onClick={handlePrint}
            className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95 ${
              personType === "student" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20" : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>পিডিএফ ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* এডিট মোড অন থাকলে নোটিশ ও অ্যাকশন বার */}
      {isEditMode && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold shadow-sm animate-fadeIn no-print">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✏️</span>
            <div>
              <p className="font-black text-amber-950">লাইভ এডিট মোড চালু আছে</p>
              <p className="text-[11px] text-amber-800 font-medium">
                কার্ডের যেকোনো লেখার ওপর সরাসরি ক্লিক করে সংশোধন করতে পারেন। কিউআর কোড তাৎক্ষণিকভাবে পরিবর্তিত ডাটা দিয়ে আপডেট হবে।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleSavePermanently}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>স্থায়ীভাবে সেভ করুন</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
        </div>
      )}

      {/* টোস্ট নোটিফিকেশন */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-fadeIn no-print">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* আইডি কার্ড ডিসপ্লে (Front ও Back পাশাপাশি - প্রিন্ট ফ্রেন্ডলি) */}
      {showCard && (
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-100/70 rounded-3xl border border-slate-200 print:bg-white print:p-0 print:border-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full justify-items-center">
            
            {/* ========================================================================= */}
            {/* ১. সামনের দিক (FRONT SIDE) */}
            {/* ========================================================================= */}
            <div className="w-[320px] h-[510px] bg-white rounded-3xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between relative print:shadow-none print:border-2 print:border-slate-800">
              
              {/* টপ হেডার ব্যানার (পারফেক্ট অরিজিনাল কালার ও ডিজাইন) */}
              <div className={`p-4 text-center relative overflow-hidden text-white ${
                personType === "student" 
                  ? "bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950"
                  : "bg-gradient-to-r from-purple-900 via-purple-800 to-purple-950"
              }`}>
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 ring-1 ring-white/20 p-1 mb-1.5 flex items-center justify-center">
                  <img src={madrasa.logoUrl || "/logo.png"} alt="মাদরাসা লোগো" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-sm font-black leading-tight tracking-tight">{madrasa.name}</h3>
                <p className="text-[10px] text-indigo-200 mt-0.5 leading-tight truncate px-2">{madrasa.address}</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide shadow-xs">
                  {personType === "student" ? "শিক্ষার্থীর পরিচয়পত্র" : "শিক্ষক পরিচয়পত্র"}
                </div>
              </div>

              {/* ছবি ও মূল তথ্য (ব্যাকগ্রাউন্ড জলছাপ সহ) */}
              <div className="p-4 flex-1 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
                  style={{ opacity: (madrasa.watermarkOpacity ?? 10) / 100 }}
                >
                  <img src={madrasa.logoUrl || "/logo.png"} alt="watermark" className="w-44 h-44 object-contain" />
                </div>
                <div className={`w-24 h-24 rounded-2xl border-2 overflow-hidden shadow-md bg-slate-100 flex items-center justify-center relative z-10 ${
                  personType === "student" ? "border-indigo-600" : "border-purple-600"
                }`}>
                  <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-400">
                    <Users className="w-12 h-12" />
                  </div>
                </div>

                {/* নাম ও জামাত/পদবী (এডিটেবল) */}
                <div className="w-full px-2">
                  {personType === "student" ? (
                    <>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editableStudent?.name || ""}
                            onChange={(e) => setEditableStudent(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full text-center text-base font-black text-slate-900 bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500 print:bg-transparent print:border-none print:p-0"
                            placeholder="ছাত্রের নাম"
                          />
                          <div className="flex items-center justify-center gap-1 text-xs font-bold text-indigo-600">
                            <span>জামাত:</span>
                            <input
                              type="text"
                              value={editableStudent?.className || ""}
                              onChange={(e) => setEditableStudent(prev => ({ ...prev, className: e.target.value }))}
                              className="text-center font-bold text-indigo-700 bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 print:bg-transparent print:border-none print:p-0"
                              placeholder="জামাত"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-base font-black text-slate-900">
                            {editableStudent?.name || currentStudent?.name}
                          </h4>
                          <p className="text-xs font-bold text-indigo-600 mt-0.5">
                            জামাত: {cleanClassName(editableStudent?.className || currentStudent?.className || "")}
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editableTeacher?.name || ""}
                            onChange={(e) => setEditableTeacher(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full text-center text-base font-black text-slate-900 bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500 print:bg-transparent print:border-none print:p-0"
                            placeholder="শিক্ষকের নাম"
                          />
                          <input
                            type="text"
                            value={editableTeacher?.designation || ""}
                            onChange={(e) => setEditableTeacher(prev => ({ ...prev, designation: e.target.value }))}
                            className="text-center font-bold text-purple-700 bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 print:bg-transparent print:border-none print:p-0 text-xs"
                            placeholder="পদবী (যেমন: সিনিয়র মুহাদ্দিস)"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-base font-black text-slate-900">
                            {editableTeacher?.name || currentTeacher?.name}
                          </h4>
                          <p className="text-xs font-bold text-purple-700 mt-0.5">
                            {editableTeacher?.designation || currentTeacher?.designation}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* সাহাদাত ভাইয়ের নির্দেশিত তথ্য বক্স:
                    - ছাত্র: রোল নম্বর, রক্তের গ্রুপ (আইডি নং বাদ)
                    - শিক্ষক: আইডি নাম্বার, রক্তের গ্রুপ এবং উপরে কোন পদে আছে */}
                <div className="w-full px-4 text-xs font-medium text-slate-700 space-y-1.5 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  {personType === "student" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">রোল নম্বর:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editableStudent?.roll || ""}
                            onChange={(e) => setEditableStudent(prev => ({ ...prev, roll: e.target.value }))}
                            className="w-20 text-right font-black text-slate-900 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none print:bg-transparent print:border-none print:p-0"
                          />
                        ) : (
                          <span className="font-black text-slate-900">{editableStudent?.roll || currentStudent?.roll}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">রক্তের গ্রুপ:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editableStudent?.bloodGroup || ""}
                            onChange={(e) => setEditableStudent(prev => ({ ...prev, bloodGroup: e.target.value }))}
                            className="w-16 text-right font-bold text-rose-600 font-mono bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none print:bg-transparent print:border-none print:p-0"
                          />
                        ) : (
                          <span className="font-bold text-rose-600 font-mono">
                            {editableStudent?.bloodGroup || currentStudent?.bloodGroup || "B+"}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">আইডি নাম্বার:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editableTeacher?.id || ""}
                            onChange={(e) => setEditableTeacher(prev => ({ ...prev, id: e.target.value }))}
                            className="w-24 text-right font-mono font-black text-slate-900 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none print:bg-transparent print:border-none print:p-0"
                          />
                        ) : (
                          <span className="font-mono font-black text-slate-900">{editableTeacher?.id || currentTeacher?.id}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">রক্তের গ্রুপ:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editableTeacher?.bloodGroup || ""}
                            onChange={(e) => setEditableTeacher(prev => ({ ...prev, bloodGroup: e.target.value }))}
                            className="w-16 text-right font-bold text-rose-600 font-mono bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none print:bg-transparent print:border-none print:p-0"
                          />
                        ) : (
                          <span className="font-bold text-rose-600 font-mono">
                            {editableTeacher?.bloodGroup || currentTeacher?.bloodGroup || "B+"}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* সিগনেচার সেকশন */}
              <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex items-end justify-between text-[9px] font-bold text-slate-500">
                <div className="text-center">
                  <div className="h-6 border-b border-dashed border-slate-400 w-20 mb-1"></div>
                  <span>{personType === "student" ? "অভিভাবকের স্বাক্ষর" : "শিক্ষকের স্বাক্ষর"}</span>
                </div>
                <div className="text-center">
                  <div className="h-6 border-b border-dashed border-slate-400 w-20 mb-1"></div>
                  <span>মুহতামিমের স্বাক্ষর</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ২. পেছনের দিক (BACK SIDE - কিউআর কোড ও অফিস নম্বর সহ) */}
            {/* ========================================================================= */}
            <div className="w-[320px] h-[510px] bg-white rounded-3xl shadow-xl border border-slate-300 overflow-hidden flex flex-col justify-between p-4 relative print:shadow-none print:border-2 print:border-slate-800">
              
              {/* হেডার */}
              <div className={`py-1.5 px-3 rounded-xl text-center text-xs font-black text-white ${
                personType === "student" ? "bg-indigo-600" : "bg-purple-700"
              }`}>
                {personType === "student" ? "যোগাযোগ ও পরিচয় তথ্য" : "শিক্ষক পরিচিতি ও যোগাযোগের তথ্য"}
              </div>

              {/* সাহাদাত ভাইয়ের নির্দেশিত: সেন্ট্রাল হাই-কোয়ালিটি কিউআর কোড ফ্রেম */}
              <div className="flex flex-col items-center justify-center p-2.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <QRCodeSVG
                    value={personType === "student" ? studentQrData : teacherQrData}
                    size={105}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-600 mt-1.5 tracking-tight flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-indigo-600" />
                  <span>স্ক্যান করে পূর্ণাঙ্গ অফিশিয়াল তথ্য দেখুন</span>
                </span>
              </div>

              {/* জরুরি বিবরণী বক্স (এডিটেবল) */}
              <div className="space-y-1.5 text-[11px] font-medium text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80">
                {personType === "student" ? (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-bold text-[10px]">অভিভাবকের নাম:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableStudent?.guardianName || ""}
                          onChange={(e) => setEditableStudent(prev => ({ ...prev, guardianName: e.target.value }))}
                          className="text-right font-bold text-slate-900 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="font-bold text-slate-900 truncate max-w-[170px]">
                          {editableStudent?.guardianName || currentStudent?.guardianName || "মাওলানা ফরিদ আহমেদ"}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-bold text-[10px]">মোবাইল নং:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableStudent?.guardianPhone || ""}
                          onChange={(e) => setEditableStudent(prev => ({ ...prev, guardianPhone: e.target.value }))}
                          className="text-right font-mono font-bold text-indigo-700 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="font-mono font-bold text-indigo-700">
                          {editableStudent?.guardianPhone || currentStudent?.guardianPhone || "০১৭১১-২৩৪৫০১"}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold">বর্তমান ঠিকানা:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableStudent?.address || ""}
                          onChange={(e) => setEditableStudent(prev => ({ ...prev, address: e.target.value }))}
                          className="text-right text-[10px] text-slate-800 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="text-slate-800 text-right truncate max-w-[170px]" title={editableStudent?.address || currentStudent?.address}>
                          {editableStudent?.address || currentStudent?.address || "মাদরাসা কমপ্লেক্স"}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-bold text-[10px]">মোবাইল নম্বর:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableTeacher?.phone || ""}
                          onChange={(e) => setEditableTeacher(prev => ({ ...prev, phone: e.target.value }))}
                          className="text-right font-mono font-bold text-purple-800 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="font-mono font-bold text-purple-800">
                          {editableTeacher?.phone || currentTeacher?.phone || "০১৭০০-০০০০০০"}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                      <span className="text-slate-400 font-bold text-[10px]">শিক্ষাগত যোগ্যতা:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableTeacher?.qualification || ""}
                          onChange={(e) => setEditableTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                          className="text-right text-[10px] font-bold text-slate-900 bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="font-bold text-slate-900 truncate max-w-[170px]" title={editableTeacher?.qualification || currentTeacher?.qualification}>
                          {editableTeacher?.qualification || currentTeacher?.qualification || "দাওরায়ে হাদিস ফারেগ"}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold">যোগদানের তারিখ:</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editableTeacher?.joiningDate || ""}
                          onChange={(e) => setEditableTeacher(prev => ({ ...prev, joiningDate: e.target.value }))}
                          className="text-right font-bold text-slate-800 font-mono bg-amber-50/80 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none flex-1 ml-2 print:bg-transparent print:border-none print:p-0"
                        />
                      ) : (
                        <span className="font-bold text-slate-800 font-mono">
                          {editableTeacher?.joiningDate || currentTeacher?.joiningDate || "২০১৮-০১-০১"}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* জরুরি নির্দেশনা বক্স */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[9px] text-amber-900 space-y-0.5">
                <span className="font-black flex items-center gap-1 text-amber-950">
                  ⚠️ জরুরি নির্দেশনা:
                </span>
                <p className="leading-tight">• এই কার্ডটি পাওয়া গেলে অবিলম্বে নিচে উল্লেখিত নম্বরে যোগাযোগ করুন।</p>
                <p className="leading-tight">• কার্ডটি হারিয়ে গেলে সাথে সাথে মাদ্রাসার অফিসে জানান।</p>
              </div>

              {/* সাহাদাত ভাইয়ের নির্দেশিত: নিচে মাদ্রাসার অফিসের যে নাম্বার এড করা হবে, ওই নাম্বার */}
              <div className="text-center pt-2 border-t-2 border-dashed border-slate-200 text-[10px] text-slate-600">
                <span className="font-black text-slate-900 block leading-tight">মাদ্রাসা অফিস যোগাযোগ:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={officePhone}
                    onChange={(e) => setOfficePhone(e.target.value)}
                    className="text-center font-mono font-bold text-indigo-900 text-xs bg-amber-50/80 border border-amber-300 rounded px-2 py-0.5 focus:outline-none print:bg-transparent print:border-none print:p-0"
                  />
                ) : (
                  <span className="font-mono font-bold text-indigo-900 text-xs">
                    {officePhone}
                  </span>
                )}
                <span className="text-[9px] text-slate-500 block truncate mt-0.5">
                  {madrasa.address}
                </span>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
