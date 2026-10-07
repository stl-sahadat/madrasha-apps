"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Users, 
  GraduationCap, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Clock,
  Printer,
  ExternalLink,
  UserCheck,
  User,
  BookOpen,
  Info,
  Check
} from "lucide-react";
import { Student, TeacherStaff, MadrasaInfo } from "@/types";

interface SmsPortalViewProps {
  students: Student[];
  teachers: TeacherStaff[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  initialTarget?: "students" | "teachers";
  onTargetChange?: (target: "students" | "teachers") => void;
}

// ফোন নম্বরকে আন্তর্জাতিক হোয়াটসঅ্যাপ ফরম্যাটে রূপান্তর (যেমন: 01712345678 -> 8801712345678)
const formatPhoneForWhatsApp = (rawPhone: string): string => {
  let cleaned = rawPhone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "88" + cleaned;
  } else if (!cleaned.startsWith("88") && cleaned.length === 10 && cleaned.startsWith("1")) {
    cleaned = "880" + cleaned;
  } else if (!cleaned.startsWith("88") && cleaned.length === 11 && cleaned.startsWith("01")) {
    cleaned = "88" + cleaned;
  }
  return cleaned;
};

export const SmsPortalView: React.FC<SmsPortalViewProps> = ({
  students,
  teachers,
  madrasa,
  onBack,
  initialTarget = "students",
  onTargetChange,
}) => {
  const [targetGroup, setTargetGroup] = useState<"students" | "teachers">(initialTarget);

  useEffect(() => {
    if (initialTarget) {
      setTargetGroup(initialTarget);
    }
  }, [initialTarget]);

  const handleTargetChange = (target: "students" | "teachers") => {
    setTargetGroup(target);
    setSelectedStudentId("all");
    setSelectedTeacherId("all");
    onTargetChange?.(target);
  };

  // জামাত ও ছাত্র নির্বাচন স্টেট
  const [selectedJamat, setSelectedJamat] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");

  // শিক্ষক নির্বাচন স্টেট
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");

  const [smsText, setSmsText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<string>("");

  // ইউনিক জামাতের তালিকা প্রস্তুত
  const studentClasses = Array.from(
    new Set(students.map((s) => s.className).filter(Boolean))
  );
  const availableClasses = studentClasses.length > 0 
    ? studentClasses 
    : ["দাওরায়ে হাদিস (তাকমীল)", "মেশকাত জামাত", "হেফজখানা", "নূরানী ও মক্তব"];

  // জামাত ফিল্টার অনুযায়ী ছাত্রদের তালিকা
  const filteredStudents = selectedJamat === "all"
    ? students
    : students.filter((s) => s.className === selectedJamat);

  // বর্তমানে নির্বাচিত নির্দিষ্ট ছাত্র ও শিক্ষক অবজেক্ট
  const currentStudent = selectedStudentId !== "all"
    ? students.find((s) => s.id === selectedStudentId)
    : null;

  const currentTeacher = selectedTeacherId !== "all"
    ? teachers.find((t) => t.id === selectedTeacherId)
    : null;

  // যখন জামাত পরিবর্তন হবে, ছাত্র নির্বাচন রিসেট
  const handleJamatChange = (jamat: string) => {
    setSelectedJamat(jamat);
    setSelectedStudentId("all");
  };

  // প্রি-সেট রেডিমেড টেমপ্লেট
  const studentTemplates = [
    { 
      title: "অনুপস্থিতি নোটিশ", 
      text: "মুহতারাম, আপনার সন্তান অদ্য মাদরাসায় অনুপস্থিত রয়েছে। অনুগ্রহ করে মাদরাসায় যোগাযোগ করুন।" 
    },
    { 
      title: "মাসিক ফি তাগাদা", 
      text: "আসসালামু আলাইকুম, চলতি মাসের মাদরাসার মাসিক বেতন ও বোর্ডিং ফি আগামী ১০ তারিখের মধ্যে পরিশোধ করার জন্য অনুরোধ করা হলো।" 
    },
    { 
      title: "ছুটির ঘোষণা", 
      text: "পবিত্র ঈদুল ফিতর উপলক্ষে আগামী কাল হইতে মাদরাসার সকল শিক্ষা কার্যক্রম বন্ধ থাকিবে। ইনশাআল্লাহ নির্দিষ্ট তারিখে ক্লাস শুরু হবে।" 
    },
    { 
      title: "পরীক্ষার ফলাফল নোটিশ", 
      text: "আসসালামু আলাইকুম, আপনার সন্তানের সাময়িক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। মাদরাসা অফিস হইতে রিপোর্ট কার্ড সংগ্রহ করুন।" 
    },
    {
      title: "জরুরী অভিভাবক সমাবেশ",
      text: "আসসালামু আলাইকুম, আগামী শুক্রবার বাদ আছর মাদরাসা মিলনায়তনে এক জরুরী অভিভাবক সমাবেশ অনুষ্ঠিত হবে। আপনার উপস্থিতি একান্ত কাম্য।"
    }
  ];

  const teacherTemplates = [
    {
      title: "শিক্ষক সাধারণ মিটিং",
      text: "আসসালামু আলাইকুম মুহতারাম, আগামী কাল বাদ যোহর মাদরাসা শিক্ষক মিলনায়তনে এক জরুরী পরামর্শ সভা অনুষ্ঠিত হইবে। সকল উস্তাদকে উপস্থিত থাকার অনুরোধ করা হলো।"
    },
    {
      title: "ক্লাস ও পরীক্ষার দায়িত্ব",
      text: "মুহতারাম, আসন্ন সাময়িক পরীক্ষার প্রশ্নপত্র প্রস্তুত ও পরীক্ষার ডিউটি সংক্রান্ত রুটিন নোটিশ বোর্ডে প্রকাশ করা হয়েছে। অনুগ্রহ করে দেখে নিন।"
    },
    {
      title: "মাসিক বেতন বিতরণ",
      text: "আসসালামু আলাইকুম, চলতি মাসের শিক্ষক ও স্টাফদের সম্মানী/বেতন অফিসে প্রস্তুত রয়েছে। অফিস চলাকালীন সময়ে গ্রহণ করার অনুরোধ করা হলো।"
    },
    {
      title: "ছুটি ও দায়িত্ব হস্তান্তর",
      text: "আসসালামু আলাইকুম মুহতারাম, আসন্ন ছুটির পূর্বে সকল হাজিরা খাতা ও ক্লাসের অগ্রগতি রিপোর্ট অফিসে জমা দেওয়ার জন্য অনুরোধ করা হলো।"
    }
  ];

  const activeTemplates = targetGroup === "students" ? studentTemplates : teacherTemplates;

  // টেমপ্লেট ক্লিক করলে স্বয়ংক্রিয়ভাবে নির্বাচিত ব্যক্তির নাম দিয়ে কাস্টমাইজড মেসেজ তৈরি
  const handleApplyTemplate = (rawText: string) => {
    let customized = rawText;
    if (targetGroup === "students" && currentStudent) {
      const guardian = currentStudent.guardianName || currentStudent.fatherName || "অভিভাবক";
      customized = `মুহতারাম ${guardian} সাহেব (ছাত্র: ${currentStudent.name}),\n${rawText}`;
    } else if (targetGroup === "teachers" && currentTeacher) {
      customized = `মুহতারাম ${currentTeacher.name} সাহেব,\n${rawText}`;
    }
    setSmsText(customized);
  };

  // প্রাপক সংখ্যা ও তথ্য
  const recipientCount = targetGroup === "students"
    ? (selectedStudentId !== "all" ? 1 : filteredStudents.length)
    : (selectedTeacherId !== "all" ? 1 : teachers.length);

  // ১. হোয়াটসঅ্যাপে সরাসরি মেসেজ পাঠানো (WhatsApp Direct)
  const handleSendWhatsApp = () => {
    if (!smsText.trim()) {
      alert("অনুগ্রহ করে পাঠানোর জন্য একটি বার্তা লিখুন।");
      return;
    }

    let targetPhone = "";
    let recipientName = "";

    if (targetGroup === "teachers") {
      if (selectedTeacherId === "all") {
        alert("হোয়াটসঅ্যাপে সরাসরি পাঠাতে উপরের ড্রপডাউন থেকে নির্দিষ্ট একজন শিক্ষক নির্বাচন করুন। সকল শিক্ষককে একসাথে বাল্ক পাঠাতে নিচের 'এসএমএস পাঠান' বাটন ব্যবহার করুন।");
        return;
      }
      if (currentTeacher) {
        targetPhone = currentTeacher.phone;
        recipientName = currentTeacher.name;
      }
    } else {
      if (selectedStudentId === "all") {
        alert("হোয়াটসঅ্যাপে সরাসরি পাঠাতে উপরের ড্রপডাউন থেকে নির্দিষ্ট একজন ছাত্র নির্বাচন করুন। সকল অভিভাবককে একসাথে বাল্ক পাঠাতে নিচের 'এসএমএস পাঠান' বাটন ব্যবহার করুন।");
        return;
      }
      if (currentStudent) {
        targetPhone = currentStudent.guardianPhone || currentStudent.phone || currentStudent.emergencyPhone || "";
        recipientName = `${currentStudent.name} এর অভিভাবক`;
      }
    }

    if (!targetPhone) {
      alert("প্রাপকের কোনো মোবাইল নম্বর পাওয়া যায়নি।");
      return;
    }

    const formattedPhone = formatPhoneForWhatsApp(targetPhone);
    const encodedText = encodeURIComponent(smsText);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;

    // হোয়াটসঅ্যাপ ওয়েব বা অ্যাপ ওপেন করা
    window.open(whatsappUrl, "_blank");

    setSuccessInfo(`হোয়াটসঅ্যাপ সফলভাবে ওপেন হয়েছে! প্রাপক: ${recipientName} (${targetPhone})`);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 5000);
  };

  // ২. সাধারণ বাল্ক এসএমএস পাঠানো (SMS API Simulation)
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText.trim()) {
      alert("অনুগ্রহ করে একটি বার্তা লিখুন।");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSuccessInfo(`সফল! মোট ${recipientCount} টি মোবাইল নম্বরে এসএমএস বার্তা পাঠানো হয়েছে।`);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4500);
    }, 1200);
  };

  // বার্তা বক্সে ভেরিয়েবল টোকেন ইনসার্ট
  const insertToken = (tokenText: string) => {
    setSmsText(prev => prev ? `${prev} ${tokenText}` : tokenText);
  };

  return (
    <div className="space-y-6">
      {/* ১. হেডার ও ট্যাব সুইচ */}
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
              <MessageSquare className="w-6 h-6 text-sky-600" />
              <span>এসএমএস ও হোয়াটসঅ্যাপ মেসেজিং সেবা</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              অভিভাবক ও শিক্ষকদের মোবাইলে এক ক্লিকে হোয়াটসঅ্যাপ চ্যাট ও এসএমএস নোটিশ প্রেরণ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTargetChange("students")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              targetGroup === "students"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>অভিভাবকদের এসএমএস</span>
          </button>
          <button
            onClick={() => handleTargetChange("teachers")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              targetGroup === "teachers"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>শিক্ষকদের এসএমএস</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* সাকসেস নোটিফিকেশন ব্যানার */}
      {sendSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successInfo || "সফলভাবে বার্তা পাঠানো সম্পন্ন হয়েছে।"}</span>
        </div>
      )}

      {/* মূল গ্রিড: ফর্ম ও টেমপ্লেট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* বাম পাশ: মেসেজ কম্পোজ ফর্ম */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleSendSms} className="space-y-4">
            
            {/* ক. যদি অভিভাবক ট্যাব সক্রিয় থাকে */}
            {targetGroup === "students" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                {/* ১. জামাত নির্বাচন */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>কোন জামাতে পাঠাবেন? *</span>
                  </label>
                  <select
                    value={selectedJamat}
                    onChange={(e) => handleJamatChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">সকল জামাতের শিক্ষার্থী ({students.length} জন)</option>
                    {availableClasses.map((cls) => {
                      const count = students.filter(s => s.className === cls).length;
                      return (
                        <option key={cls} value={cls}>
                          {cls} ({count} জন)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* ২. নির্দিষ্ট ছাত্র ও অভিভাবক নির্বাচন */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>নির্দিষ্ট ছাত্রের অভিভাবক নির্বাচন</span>
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">
                      {selectedJamat === "all" ? "সকল শিক্ষার্থী / অভিভাবক" : `${selectedJamat}-এর সকল শিক্ষার্থী`} ({filteredStudents.length} জন)
                    </option>
                    {filteredStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (রোল: {s.roll}) - {s.guardianName || s.fatherName || "অভিভাবক"} ({s.guardianPhone || s.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* খ. যদি শিক্ষক ট্যাব সক্রিয় থাকে */}
            {targetGroup === "teachers" && (
              <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-200/80">
                <label className="block text-xs font-bold text-purple-900 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>কোন শিক্ষককে পাঠাবেন? *</span>
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">সকল শিক্ষক ({teachers.length} জন)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} • {t.designation || "শিক্ষক"} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* গ. নির্দিষ্ট ব্যক্তি নির্বাচিত হলে তার তথ্য কার্ড (হোয়াটসঅ্যাপ সংকেত সহ) */}
            {(currentStudent || currentTeacher) && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs animate-fade-in">
                <div className="space-y-0.5">
                  <div className="font-black text-emerald-950 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      প্রাপক: {currentStudent ? `${currentStudent.name} (রোল: ${currentStudent.roll})` : currentTeacher?.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                      {currentStudent ? `জামাত: ${currentStudent.className}` : currentTeacher?.designation}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    মোবাইল নম্বর: <strong className="font-mono">{currentStudent ? (currentStudent.guardianPhone || currentStudent.phone) : currentTeacher?.phone}</strong>
                    {currentStudent && currentStudent.guardianName && ` • অভিভাবক: ${currentStudent.guardianName}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>হোয়াটসঅ্যাপ রেডি</span>
                  </span>
                </div>
              </div>
            )}

            {/* বার্তা লেখার বক্স */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">এসএমএস / হোয়াটসঅ্যাপ বার্তা লিখুন *</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {smsText.length} অক্ষর • {Math.ceil(smsText.length / 70) || 1} এসএমএস
                  </span>
                </div>
              </div>

              <textarea
                required
                rows={5}
                placeholder="এখানে আপনার বার্তা লিখুন (বাংলা ইউনিকোড সাপোর্টেড)..."
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed"
              />

              {/* কুইক নাম ইনসার্ট বাটন */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>কুইক টোকেন:</span>
                </span>
                {currentStudent ? (
                  <>
                    <button
                      type="button"
                      onClick={() => insertToken(`মুহতারাম ${currentStudent.guardianName || currentStudent.fatherName || "অভিভাবক"} সাহেব,`)}
                      className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition-colors"
                    >
                      + অভিভাবকের নাম
                    </button>
                    <button
                      type="button"
                      onClick={() => insertToken(`(ছাত্র: ${currentStudent.name}, রোল: ${currentStudent.roll})`)}
                      className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition-colors"
                    >
                      + ছাত্রের বিবরণ
                    </button>
                  </>
                ) : currentTeacher ? (
                  <button
                    type="button"
                    onClick={() => insertToken(`মুহতারাম ${currentTeacher.name} সাহেব,`)}
                    className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors"
                  >
                    + শিক্ষকের নাম
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => insertToken(madrasa.name)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                >
                  + মাদ্রাসার নাম
                </button>
              </div>
            </div>

            {/* প্রাপক সংখ্যা ও মাস্কিং ইনফো */}
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs font-bold text-sky-900">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span>
                  প্রাপক সংখ্যা: <strong>{recipientCount} জন</strong>
                  {recipientCount === 1 && (
                    <span className="ml-1 text-emerald-700 font-normal">
                      (একক প্রাপক নির্বাচিত)
                    </span>
                  )}
                </span>
              </span>
              <span className="text-[11px] text-slate-500">মাস্কিং সেন্ডার: {madrasa.slug || "MADRASA"}</span>
            </div>

            {/* অ্যাকশন বাটনসমূহ: হোয়াটসঅ্যাপে সরাসরি পাঠান + এসএমএস পাঠান */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* বাটন ১: হোয়াটসঅ্যাপে পাঠান (প্রধান বাটন) */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={!smsText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                title="সরাসরি হোয়াটসঅ্যাপে চ্যাট ওপেন করুন"
              >
                {/* কাস্টম হোয়াটসঅ্যাপ আইকন */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>হোয়াটসঅ্যাপে সরাসরি পাঠান</span>
              </button>

              {/* বাটন ২: সাধারণ এসএমএস পাঠানো */}
              <button
                type="submit"
                disabled={isSending || !smsText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-black transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSending ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>বাল্ক এসএমএস বার্তা পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ডান পাশ: দ্রুত ব্যবহারের জন্য রেডিমেড টেমপ্লেট */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>রেডিমেড টেমপ্লেট</span>
            </h3>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              {targetGroup === "students" ? "অভিভাবক" : "শিক্ষক"}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            যেকোনো টেমপ্লেটে ক্লিক করলে নির্বাচিত ব্যক্তির নাম সহ স্বয়ংক্রিয়ভাবে মেসেজ বক্সে বসে যাবে:
          </p>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {activeTemplates.map((tpl, i) => (
              <div
                key={i}
                onClick={() => handleApplyTemplate(tpl.text)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-300 cursor-pointer transition-all space-y-1 group"
              >
                <div className="text-xs font-black text-slate-900 group-hover:text-sky-700 flex items-center justify-between">
                  <span>{tpl.title}</span>
                  <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>প্রয়োগ করুন</span>
                    <span>→</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {tpl.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
