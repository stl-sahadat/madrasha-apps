"use client";

import React, { useState } from "react";
import { 
  Users, 
  CalendarCheck2, 
  BookMarked, 
  Utensils, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Phone, 
  CreditCard, 
  QrCode, 
  Send,
  ArrowRight,
  Filter,
  Award,
  AlertTriangle,
  Bell,
  X,
  Check,
  MapPin,
  MessageCircle,
  ExternalLink,
  GraduationCap,
  ScrollText,
  History,
  FileText,
  Share2,
  Copy,
  Printer,
  ArrowLeft,
  Eye
} from "lucide-react";
import { Student, MadrasaClass, MadrasaInfo, HifzRecord, BoardingMealRecord, DailyBazarItem } from "@/types";
import { HifzDiaryView } from "@/components/hifz/HifzDiaryView";
import { BoardingMessView } from "@/components/boarding/BoardingMessView";

interface StudentsActivitiesHubProps {
  students: Student[];
  classes: MadrasaClass[];
  madrasa: MadrasaInfo;
  hifzRecords: HifzRecord[];
  meals: BoardingMealRecord[];
  bazarItems: DailyBazarItem[];
  onOpenStudentProfile: (student: Student) => void;
  onOpenScanner: () => void;
  onAddNewStudent: () => void;
  onAddHifzRecord: (record: Omit<HifzRecord, "id">) => void;
  onUpdateMeal: (recordId: string, type: "breakfast" | "lunch" | "dinner", val: boolean) => void;
  onAddBazarItem: (item: Omit<DailyBazarItem, "id">) => void;
  onAddStudentActivity?: (studentId: string, activity: any) => void;
  initialSubTab?: "roster" | "attendance" | "hifz" | "boarding";
}

const toBnDigits = (num: number | string) => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .padStart(2, "0")
    .split("")
    .map((d) => bnDigits[parseInt(d)] || d)
    .join("");
};

export const StudentsActivitiesHub: React.FC<StudentsActivitiesHubProps> = ({
  students,
  classes,
  madrasa,
  hifzRecords,
  meals,
  bazarItems,
  onOpenStudentProfile,
  onOpenScanner,
  onAddNewStudent,
  onAddHifzRecord,
  onUpdateMeal,
  onAddBazarItem,
  onAddStudentActivity,
  initialSubTab = "roster",
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"roster" | "attendance" | "hifz" | "boarding">(initialSubTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAttendanceClassId, setSelectedAttendanceClassId] = useState<string | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [scannerSearchQuery, setScannerSearchQuery] = useState<string>("");

  // কিতাব বিভাগের জামাতসমূহকে মিজান থেকে দাওরায়ে হাদিস পর্যন্ত সিরিয়ালে সাজানো
  const jamatOrderMap: Record<string, number> = {
    cls_kitab_mizan: 1,
    cls_kitab_jami: 2,
    cls_kitab_kafia: 3,
    cls_kitab_bekaya: 4,
    cls_kitab_jalalain: 5,
    cls_kitab_mishkat: 6,
    cls_kitab_dawra: 7,
  };

  const orderedClasses = [...classes].sort((a, b) => {
    const orderA = jamatOrderMap[a.id] ?? 99;
    const orderB = jamatOrderMap[b.id] ?? 99;
    return orderA - orderB;
  });

  // ছাত্র অ্যাক্টিভিটি হিস্ট্রি ও নোটিশ প্রেরণ স্টেট
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [selectedStudentForNotice, setSelectedStudentForNotice] = useState<Student | null>(null);
  const [selectedPastNoticeForReuse, setSelectedPastNoticeForReuse] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<"praise" | "warning" | "notice">("notice");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [whatsAppSuccessToast, setWhatsAppSuccessToast] = useState<string | null>(null);

  // নোটিশ পাঠানোর মডাল খোলার ফাংশন
  const handleOpenNoticeModal = (student: Student, defaultTitle: string = "", defaultDesc: string = "") => {
    setSelectedStudentForNotice(student);
    if (defaultTitle || defaultDesc) {
      setActivityTitle(defaultTitle);
      setActivityDesc(defaultDesc);
    } else if (student.dueAmount > 0) {
      setActivityTitle(`বকেয়া বেতন ও খোরাকি ফি বাবদ ৳${student.dueAmount.toLocaleString()} পরিশোধ সংক্রান্ত`);
      setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। আপনার সন্তান ${student.name}-এর মাদরাসার বকেয়া ফি বাবদ সর্বমোট ৳${student.dueAmount.toLocaleString()} টাকা অপরিশোধিত রয়েছে। দ্রুত বকেয়া পরিশোধ করার জন্য বিনীত অনুরোধ করা হলো।`);
    } else {
      setActivityTitle("");
      setActivityDesc("");
    }
    setActivityType("notice");
    setSelectedPastNoticeForReuse(null);
  };

  // অভিভাবকের কাছে নোটিশ (WhatsApp, SMS বা শুধু সংরক্ষণ) পাঠানোর ফাংশন
  const handleSendNoticeToGuardian = (method: "whatsapp" | "sms" | "save_only") => {
    if (!selectedStudentForNotice || !activityTitle.trim()) return;
    const student = selectedStudentForNotice;
    const cleanPhone = (student.guardianPhone || "").replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("88") 
      ? cleanPhone 
      : cleanPhone.startsWith("0") 
      ? `88${cleanPhone}` 
      : `880${cleanPhone}`;

    const noticeSubject = activityTitle.trim();
    const noticeDetails = activityDesc.trim() || "মাদরাসা থেকে প্রয়োজনীয় অ্যাকাডেমিক নোটিশ প্রদান করা হলো।";

    const fullMessage = 
`আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ।
🏫 *${madrasa.name} (কিতাব বিভাগ)*
----------------------------------
👤 *শিক্ষার্থী:* ${student.name}
🔢 *রোল নং:* ${student.roll} | *জামাত:* ${student.className}
📍 *এলাকা:* ${student.address || "ঠিকানা সংরক্ষিত"}
----------------------------------
📌 *নোটিশের বিষয়:* ${noticeSubject}
📝 *মূল কাহিনী / বিবরণ:*
${noticeDetails}
----------------------------------
💰 *বকেয়া ফি:* ৳${student.dueAmount.toLocaleString()}
— *মাওলানা মো. সাহাদাত হোসেন* (মুহতামিম সাহেব)
📞 হেল্পলাইন: ${madrasa.phone}`;

    // স্টুডেন্টের অ্যাক্টিভিটি হিস্ট্রিতে রেকর্ড যোগ
    const newAct = {
      id: `act_${Date.now()}`,
      studentId: student.id,
      date: new Date().toISOString().split("T")[0],
      type: activityType,
      title: `${method === "whatsapp" ? "হোয়াটসঅ্যাপ নোটিশ" : method === "sms" ? "SMS নোটিশ" : "নোটিশ"}: ${noticeSubject}`,
      description: noticeDetails,
      recordedBy: "মুহতামিম সাহেব",
    };

    if (!student.activities) student.activities = [];
    student.activities.unshift(newAct);

    if (onAddStudentActivity) {
      onAddStudentActivity(student.id, newAct);
    }

    if (method === "whatsapp") {
      const url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(fullMessage)}`;
      window.open(url, "_blank");
      setWhatsAppSuccessToast(`${student.name}-এর অভিভাবকের হোয়াটসঅ্যাপ নম্বরে নোটিশ পাঠানোর উইন্ডো সফলভাবে ওপেন হয়েছে!`);
    } else if (method === "sms") {
      setWhatsAppSuccessToast(`সফল! ${student.name}-এর অভিভাবকের মোবাইলে (${student.guardianPhone}) SMS নোটিশ প্রেরণ করা হয়েছে।`);
    } else {
      setWhatsAppSuccessToast(`${student.name}-এর প্রোফাইলে নোটিশ সফলভাবে সংরক্ষণ করা হয়েছে।`);
    }

    setTimeout(() => setWhatsAppSuccessToast(null), 5000);
    setSelectedStudentForNotice(null);
    setActivityTitle("");
    setActivityDesc("");
  };

  // হাজিরা স্টেট (ছাত্র আইডি -> উপস্থিতি স্ট্যাটাস)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent" | "leave">>({
    "DARUL-2026-101": "present",
    "DARUL-2026-102": "absent",
    "DARUL-2026-103": "present",
    "DARUL-2026-201": "present",
  });

  // এসএমএস নোটিশ
  const [smsNotice, setSmsNotice] = useState<string | null>(null);

  // ফিল্টার করা ছাত্র
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.includes(searchQuery) ||
      s.guardianPhone.includes(searchQuery);
    const matchesClass = selectedClassId === "all" || s.classId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  // হাজিরা আপডেট
  const toggleAttendance = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // উপস্থিত/অনুপস্থিত গণনা
  const presentCount = students.filter((s) => (attendanceMap[s.id] || "present") === "present").length;
  const absentCount = students.filter((s) => attendanceMap[s.id] === "absent").length;
  const leaveCount = students.filter((s) => attendanceMap[s.id] === "leave").length;

  // অনুপস্থিতদের অভিভাবকদের কাছে SMS পাঠানো
  const handleSendAbsentSms = () => {
    const absentees = students.filter((s) => attendanceMap[s.id] === "absent");
    if (absentees.length === 0) {
      setSmsNotice("আজ কোনো শিক্ষার্থী অনুপস্থিত নেই!");
    } else {
      setSmsNotice(
        `সফল! ${absentees.length} জন অনুপস্থিত শিক্ষার্থীর অভিভাবকের মোবাইলে সতর্কীকরণ SMS পাঠানো হয়েছে।`
      );
    }
    setTimeout(() => setSmsNotice(null), 5000);
  };

  // জামাতভিত্তিক সকলকে একসাথে উপস্থিত মার্ক করা
  const markAllClassPresent = (targetClassId: string | null) => {
    const listToMark = targetClassId && targetClassId !== "all" 
      ? students.filter(s => s.classId === targetClassId)
      : students;
    
    setAttendanceMap(prev => {
      const updated = { ...prev };
      listToMark.forEach(s => {
        updated[s.id] = "present";
      });
      return updated;
    });
    setSmsNotice("উক্ত জামাতের সকল শিক্ষার্থীকে 'উপস্থিত' হিসেবে চিহ্নিত করা হয়েছে!");
    setTimeout(() => setSmsNotice(null), 3500);
  };

  // জামাতভিত্তিক অনুপস্থিতদের অভিভাবকদের কাছে SMS পাঠানো
  const handleSendClassAbsentSms = (targetClassId: string | null) => {
    const list = targetClassId && targetClassId !== "all" 
      ? students.filter(s => s.classId === targetClassId)
      : students;
    const absentees = list.filter((s) => attendanceMap[s.id] === "absent");
    if (absentees.length === 0) {
      setSmsNotice("উক্ত জামাতে আজ কোনো শিক্ষার্থী অনুপস্থিত নেই!");
    } else {
      setSmsNotice(
        `সফল! ${absentees.length} জন অনুপস্থিত শিক্ষার্থীর অভিভাবকের মোবাইলে সতর্কীকরণ SMS পাঠানো হয়েছে।`
      );
    }
    setTimeout(() => setSmsNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* হোয়াটসঅ্যাপ সফল নোটিশ টোস্ট */}
      {whatsAppSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-emerald-600/30 animate-fadeIn">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{whatsAppSuccessToast}</span>
          </div>
          <button 
            onClick={() => setWhatsAppSuccessToast(null)} 
            className="p-1 hover:bg-emerald-700 rounded-lg text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* হেডার ব্যানার (মডার্ন ইনডিগো ও ভায়োলেট থিম - ড্যাশবোর্ডের সাথে নিখুঁত মিল) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white p-6 sm:p-7 shadow-xl border border-indigo-500/30">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-indigo-300 tracking-wide uppercase">
                কিতাব বিভাগ • জামাত ও ছাত্র ব্যবস্থাপনা
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              কিতাব বিভাগের জামাতসমূহ ও শিক্ষার্থী কার্যক্রম
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              মিযান থেকে দাওরায়ে হাদিস পর্যন্ত সকল জামাত, রোল, এলাকার ঠিকানা ও সরাসরি হোয়াটসঅ্যাপ নোটিশ
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onAddNewStudent}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন ছাত্র ভর্তি</span>
            </button>
          </div>
        </div>
      </div>

      {/* সাব-ট্যাব সুইচার */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("roster")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "roster"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>ছাত্র তালিকা ও ফি ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("attendance")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "attendance"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CalendarCheck2 className="w-4 h-4 text-emerald-300" />
          <span>ডিজিটাল হাজিরা</span>
        </button>

        <button
          onClick={() => setActiveSubTab("hifz")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "hifz"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookMarked className="w-4 h-4 text-yellow-300" />
          <span>হিফজুল কুরআন ডায়েরি</span>
        </button>

        <button
          onClick={() => setActiveSubTab("boarding")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === "boarding"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Utensils className="w-4 h-4 text-orange-300" />
          <span>বোর্ডিং ও মেস ট্র্যাকার</span>
        </button>
      </div>

      {/* সাব-ভিউ ১: ছাত্র তালিকা ও ফি */}
      {activeSubTab === "roster" && (
        <div className="space-y-5">
          {/* ========================================================================= */}
          {/* ১. উপরে ১৫৩ জনের ডিটেইলস ও মোট সারসংক্ষেপ বার (সাহাদাত ভাইয়ের নির্দেশনা অনুযায়ী) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">মোট শিক্ষার্থী</span>
              <p className="text-2xl font-black text-indigo-900 mt-1">{students.length} জন</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">আবাসিক ছাত্র</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {students.filter((s) => s.status === "residential").length} জন
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">অনাবাসিক ছাত্র</span>
              <p className="text-2xl font-black text-blue-700 mt-1">
                {students.filter((s) => s.status === "non_residential").length} জন
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500">মোট বকেয়া ফি</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                ৳ {students.reduce((acc, s) => acc + s.dueAmount, 0).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQrScanner(true)}
              className="col-span-2 sm:col-span-4 lg:col-span-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white p-4 rounded-2xl border border-indigo-500/40 shadow-md transition-all flex flex-col justify-center items-center text-center group active:scale-98"
              title="ছাত্রদের কিউআর বুকলেট বা আইডি কার্ড স্ক্যান করতে ক্লিক করুন"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300">
                <QrCode className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>আইডি QR স্ক্যানার</span>
              </div>
              <span className="text-[10px] text-slate-300 mt-0.5 font-medium">বুকলেট বা কার্ড স্ক্যান ➔</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* ২. যদি কোনো জামাত সিলেক্ট করা না থাকে: জামাতসমূহের ডিরেক্টরি (২-৩ লাইনে শেষ) */}
          {/* ========================================================================= */}
          {selectedClassId === null ? (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>কিতাব বিভাগের জামাতসমূহ (সিরিয়াল অনুযায়ী ১ থেকে ৭):</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    যেকোনো জামাতের উপর চাপ দিলে ওই জামাতে যতজন ছাত্র আছে তাদের নাম, নোটিস হিস্ট্রি ও বকেয়া দেখতে পাবেন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClassId("all")}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
                >
                  <Users className="w-4 h-4 text-amber-300" />
                  <span>সকল ২০০ জন ছাত্র এক সাথে দেখুন ➔</span>
                </button>
              </div>

              {/* কিতাব বিভাগের ৭টি জামাতের কার্ড (এক লাইন, দুই লাইন, তিন লাইনের মধ্যে) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {orderedClasses.map((cls, idx) => {
                  const clsStudents = students.filter((s) => s.classId === cls.id);
                  const clsDue = clsStudents.reduce((acc, s) => acc + s.dueAmount, 0);
                  const shortName = cls.name.split(" (")[0];
                  const resCount = clsStudents.filter(s => s.status === "residential").length;
                  const nonResCount = clsStudents.filter(s => s.status === "non_residential").length;

                  return (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className="bg-white hover:bg-indigo-50/60 p-5 rounded-3xl border border-slate-200/90 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 font-black text-xs flex items-center justify-center transition-colors">
                            {toBnDigits(idx + 1)}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200/60">
                            {clsStudents.length || cls.studentCount} জন ছাত্র
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors pt-1">
                          {shortName}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          দরসের শিক্ষক: {(cls.classTeacherName || "উস্তাদ").split(" (")[0]}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold pt-1">
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {resCount} আবাসিক
                          </span>
                          <span>•</span>
                          <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {nonResCount} অনাবাসিক
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
                          {clsDue > 0 ? `৳ ${clsDue.toLocaleString()} বকেয়া` : "বকেয়া নেই"}
                        </span>
                        <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                          ছাত্র তালিকা দেখুন ➔
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* ৩. যখন কোনো জামাতে চাপ দেওয়া হবে (যেমন মিজান জামাতে): বিস্তারিত ছাত্র তালিকা */
            /* ========================================================================= */
            <div className="space-y-4 animate-fadeIn">
              {/* জামাত নেভিগেশন ও কুইক সুইচার বার */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedClassId(null)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>সকল জামাত তালিকা</span>
                    </button>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        {selectedClassId === "all" 
                          ? "সকল জামাতের ছাত্র তালিকা" 
                          : classes.find(c => c.id === selectedClassId)?.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        শিক্ষার্থীর নামের উপর চাপ দিলে ফুল ডিটেইলস পপআপ দেখতে পাবেন
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
                    মোট শিক্ষার্থী: {filteredStudents.length} জন
                  </span>
                </div>

                {/* কুইক জামাত সুইচ বাটন বার */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedClassId("all")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                      selectedClassId === "all"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                    }`}
                  >
                    সকল জামাত ({students.length})
                  </button>
                  {orderedClasses.map((cls, idx) => {
                    const isSel = selectedClassId === cls.id;
                    const count = students.filter((s) => s.classId === cls.id).length;
                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                          isSel
                            ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300"
                            : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                        }`}
                      >
                        {toBnDigits(idx + 1)}. {cls.name.split(" (")[0]} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ফিল্টার ও সার্চ বার */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ছাত্রের নাম, রোল, এলাকা বা মোবাইল দিয়ে খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="text-xs font-bold text-slate-500">
                  প্রদর্শিত শিক্ষার্থী: <span className="text-indigo-700 font-black">{filteredStudents.length}</span> জন
                </div>
              </div>

              {/* ছাত্রদের বিস্তারিত তালিকা টেবিল */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">
                      {selectedClassId === "all" ? "সকল জামাতের ছাত্র তালিকা" : classes.find(c => c.id === selectedClassId)?.name}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                      {filteredStudents.length} জন
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    নামে চাপ দিলে ফুল ডিটেইলস ও নোটিশ বাটনে চাপ দিলে এসএমএস/হোয়াটসঅ্যাপ নোটিশ পাঠানো যাবে
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 text-center w-12">ক্র.</th>
                        <th className="p-3.5">শিক্ষার্থীর নাম (ক্লিক করুন)</th>
                        <th className="p-3.5">রোল নাম্বার</th>
                        <th className="p-3.5">জামাত ও এলাকা</th>
                        <th className="p-3.5">নোটিস রেকর্ড ও হিস্ট্রি</th>
                        <th className="p-3.5 text-center">বকেয়া ফি</th>
                        <th className="p-3.5">অভিভাবকের ফোন ও নোটিস পাঠান</th>
                        <th className="p-3.5 text-center">স্টুডেন্ট আইডি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredStudents.map((s, idx) => {
                        const latestAct = s.activities && s.activities.length > 0 ? s.activities[0] : null;

                        return (
                          <tr
                            key={s.id}
                            className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                          >
                            {/* ক্র. */}
                            <td className="p-3.5 text-center">
                              <span className="font-bold text-slate-600 font-mono text-xs">
                                {toBnDigits(idx + 1)}
                              </span>
                            </td>

                            {/* ১. প্রথমে: শিক্ষার্থীর নাম (চাপ দিলে সাথে সাথে ফুল ডিটেইলস পপআপ আসবে) */}
                            <td className="p-3.5" onClick={() => onOpenStudentProfile(s)}>
                              <span className="font-bold text-slate-900 text-sm block hover:text-indigo-600 transition-colors">
                                {s.name}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                                  s.status === "residential" 
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}>
                                  {s.status === "residential" ? "আবাসিক" : "অনাবাসিক"}
                                </span>
                                <span className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
                                  <Eye className="w-3 h-3" />
                                  <span>ফুল ডিটেইলস</span>
                                </span>
                              </div>
                            </td>

                            {/* ২. এরপরে: রোল নাম্বার */}
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-indigo-900 px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-200 text-xs">
                                {s.roll}
                              </span>
                            </td>

                            {/* ৩. জামাত ও এলাকা */}
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 block">{s.className}</span>
                              <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                <span className="truncate max-w-[150px]">{s.address || "ঠিকানা সংরক্ষিত"}</span>
                              </div>
                            </td>

                            {/* ৪. এরপরে নোটিসের অপশন (ক্লিক করলে তারিখ, ভালো কাজ, আকাম ও নোটিশ হিস্ট্রি সিরিয়ালে শো করবে) */}
                            <td className="p-3.5 max-w-[220px]" onClick={(e) => e.stopPropagation()}>
                              {s.activities && s.activities.length > 0 ? (
                                <div 
                                  onClick={() => setSelectedStudentForHistory(s)}
                                  className="p-2 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
                                  title="সম্পূর্ণ নোটিস ও আচরণ হিস্ট্রি দেখতে ক্লিক করুন"
                                >
                                  <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="flex items-center gap-1 text-indigo-900">
                                      <ScrollText className="w-3 h-3 text-indigo-600" />
                                      <span>মোট {toBnDigits(s.activities.length)}টি নোটিস</span>
                                    </span>
                                    <span className="text-indigo-600 group-hover:underline">হিস্ট্রি ➔</span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-800 truncate">
                                    {latestAct?.type === "praise" && <Award className="w-3 h-3 text-emerald-600 shrink-0" />}
                                    {latestAct?.type === "warning" && <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />}
                                    {latestAct?.type === "notice" && <Bell className="w-3 h-3 text-amber-600 shrink-0" />}
                                    <span className="truncate">{latestAct?.title}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{latestAct?.description}</p>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentForHistory(s)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-[11px] font-bold border border-slate-200 hover:border-indigo-300 flex items-center gap-1.5 transition-all"
                                >
                                  <ScrollText className="w-3.5 h-3.5 text-slate-400" />
                                  <span>নোটিস হিস্ট্রি ও রেকর্ড</span>
                                </button>
                              )}
                            </td>

                            {/* ৫. বকেয়া ফি (কত টাকা বাকি আছে) */}
                            <td className="p-3.5 text-center font-black text-xs">
                              {s.dueAmount > 0 ? (
                                <span className="inline-block text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl font-bold">
                                  ৳ {s.dueAmount.toLocaleString()} বকেয়া
                                </span>
                              ) : (
                                <span className="inline-block text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold">
                                  পরিশোধিত
                                </span>
                              )}
                            </td>

                            {/* ৬. সবার লাস্টে: অভিভাবকের ফোন নম্বর ও নোটিস পাঠানোর অপশন */}
                            <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                              <div>
                                <span className="text-[11px] font-bold text-slate-800 block truncate">
                                  {s.guardianName || "অভিভাবক"}
                                </span>
                                <div className="flex items-center gap-1 font-mono text-slate-600 text-[11px] mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{s.guardianPhone}</span>
                                </div>
                                {/* নোটিস পাঠানোর ডেডিকেটেড বাটন */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenNoticeModal(s)}
                                  className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10px] font-black shadow-xs shadow-emerald-600/30 transition-all active:scale-95 border border-emerald-500/30"
                                  title="অভিভাবককে সরাসরি নোটিশ পাঠান (WhatsApp / SMS)"
                                >
                                  <MessageCircle className="w-3 h-3 text-white fill-white" />
                                  <span>✉️ নোটিশ পাঠান</span>
                                </button>
                              </div>
                            </td>

                            {/* ৭. স্টুডেন্ট আইডি প্রিন্ট অপশন */}
                            <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForIdCard(s)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold border border-indigo-200 transition-all active:scale-95"
                                title="স্টুডেন্ট আইডি কার্ড দেখুন ও প্রিন্ট করুন"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-indigo-700" />
                                <span>🪪 আইডি প্রিন্ট</span>
                              </button>
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
        </div>
      )}

      {/* সাব-ভিউ ২: ডিজিটাল হাজিরা */}
      {activeSubTab === "attendance" && (
        <div className="space-y-4">
          {smsNotice && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>{smsNotice}</span>
            </div>
          )}

          {/* হাজিরা সারসংক্ষেপ কার্ড (মোট শিক্ষার্থী + উপস্থিত + অনুপস্থিত + ছুটি) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500">মোট শিক্ষার্থী</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">
                {students.length} জন
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500">মোট উপস্থিত</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {presentCount} জন
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500">অনুপস্থিত</span>
              <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1">
                {absentCount} জন
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-500">ছুটি / দরখাস্ত</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {leaveCount} জন
              </p>
            </div>
          </div>

          {/* ১-ক্লিক অনুপস্থিত SMS বাটন */}
          <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <h4 className="font-bold text-sm">📢 অনুপস্থিত শিক্ষার্থীদের অভিভাবকদের SMS অ্যালার্ট</h4>
              <p className="text-xs text-emerald-200">
                আজকের ক্লাসে অনুপস্থিত {absentCount} জন ছাত্রের বাবার নম্বরে স্বয়ংক্রিয় SMS পাঠানো যাবে।
              </p>
            </div>
            <button
              onClick={handleSendAbsentSms}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>অনুপস্থিতদের SMS পাঠান</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* জামাত নির্বাচন ভিউ (যদি কোনো নির্দিষ্ট জামাত সিলেক্ট না করা থাকে) */}
          {/* ========================================================================= */}
          {selectedAttendanceClassId === null ? (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>কিতাব বিভাগের জামাতভিত্তিক ডিজিটাল হাজিরা (সিরিয়াল ১ থেকে ৭):</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    যেকোনো জামাতের উপর চাপ দিলে ওই জামাতে ঢুকে শিক্ষার্থীদের লাইভ হাজিরা নেওয়া যাবে
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAttendanceClassId("all")}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
                >
                  <Users className="w-4 h-4 text-amber-300" />
                  <span>সকল ২০০ জন ছাত্র এক সাথে দেখুন ➔</span>
                </button>
              </div>

              {/* কিতাব বিভাগের ৭টি জামাতের হাজিরা কার্ড */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {orderedClasses.map((cls, idx) => {
                  const clsStudents = students.filter((s) => s.classId === cls.id);
                  const shortName = cls.name.split(" (")[0];
                  const clsPresent = clsStudents.filter((s) => (attendanceMap[s.id] || "present") === "present").length;
                  const clsAbsent = clsStudents.filter((s) => attendanceMap[s.id] === "absent").length;
                  const clsLeave = clsStudents.filter((s) => attendanceMap[s.id] === "leave").length;
                  const total = clsStudents.length || 1;
                  const presentRate = Math.round((clsPresent / total) * 100);

                  return (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedAttendanceClassId(cls.id)}
                      className="bg-white hover:bg-emerald-50/50 p-5 rounded-3xl border border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 font-black text-xs flex items-center justify-center transition-colors">
                            {toBnDigits(idx + 1)}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            presentRate >= 90 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {toBnDigits(presentRate)}% উপস্থিতি
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors pt-1">
                          {shortName}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          দরসের শিক্ষক: {(cls.classTeacherName || "উস্তাদ").split(" (")[0]}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold pt-1 flex-wrap">
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            উপস্থিত: {toBnDigits(clsPresent)} জন
                          </span>
                          {clsAbsent > 0 && (
                            <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                              অনুপস্থিত: {toBnDigits(clsAbsent)} জন
                            </span>
                          )}
                          {clsLeave > 0 && (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                              ছুটি: {toBnDigits(clsLeave)} জন
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500 text-[11px]">
                          মোট ছাত্র: {toBnDigits(clsStudents.length)} জন
                        </span>
                        <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                          হাজিরা নিন ➔
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* নির্বাচিত জামাতের হেডার ও ব্যাক বাটন */}
              {(() => {
                const isAll = selectedAttendanceClassId === "all";
                const currentCls = orderedClasses.find((c) => c.id === selectedAttendanceClassId);
                const currentStudents = isAll 
                  ? students 
                  : students.filter((s) => s.classId === selectedAttendanceClassId);
                const clsPresent = currentStudents.filter((s) => (attendanceMap[s.id] || "present") === "present").length;
                const clsAbsent = currentStudents.filter((s) => attendanceMap[s.id] === "absent").length;
                const clsLeave = currentStudents.filter((s) => attendanceMap[s.id] === "leave").length;

                return (
                  <>
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedAttendanceClassId(null)}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors shrink-0"
                          title="সকল জামাত তালিকায় ফিরে যান"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {isAll ? "সকল জামাতের যৌথ উপস্থিতি রেজিস্টার" : currentCls?.name}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              {toBnDigits(currentStudents.length)} জন ছাত্র
                            </span>
                          </div>
                          {!isAll && currentCls && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              দরসের শিক্ষক: {currentCls.classTeacherName || "উস্তাদ"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* জামাতভিত্তিক কুইক অ্যাকশন বাটনসমূহ */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => markAllClassPresent(selectedAttendanceClassId)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>সকলকে একসাথে উপস্থিত করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendClassAbsentSms(selectedAttendanceClassId)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>অনুপস্থিতদের SMS ({toBnDigits(clsAbsent)})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedAttendanceClassId(null)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                        >
                          ← জামাতসমূহ
                        </button>
                      </div>
                    </div>

                    {/* ছাত্র হাজিরা তালিকা - সাহাদাত ভাইয়ের নির্দেশনা: "জাস্ট ওর নাম থাকবে" */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {isAll ? "সকল শিক্ষার্থীর উপস্থিতি রেজিস্টার" : `${currentCls?.name?.split(" (")[0]} — লাইভ উপস্থিতি তালিকা`}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="text-emerald-700">উপস্থিত: {toBnDigits(clsPresent)}</span>
                          <span className="text-red-600">অনুপস্থিত: {toBnDigits(clsAbsent)}</span>
                          <span className="text-amber-600">ছুটি: {toBnDigits(clsLeave)}</span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {currentStudents.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs font-bold">
                            এই জামাতে কোনো শিক্ষার্থী পাওয়া যায়নি।
                          </div>
                        ) : (
                          currentStudents.map((s, index) => {
                            const currentStatus = attendanceMap[s.id] || "present";
                            return (
                              <div
                                key={s.id}
                                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800 shrink-0 font-mono">
                                    {toBnDigits(index + 1)}
                                  </span>
                                  <div className="flex items-center gap-2.5">
                                    <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
                                      রোল: {s.roll}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                  <button
                                    onClick={() => toggleAttendance(s.id, "present")}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                      currentStatus === "present"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    উপস্থিত
                                  </button>
                                  <button
                                    onClick={() => toggleAttendance(s.id, "absent")}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                      currentStatus === "absent"
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    অনুপস্থিত
                                  </button>
                                  <button
                                    onClick={() => toggleAttendance(s.id, "leave")}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                      currentStatus === "leave"
                                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    ছুটি
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* সাব-ভিউ ৩: হিফজুল কুরআন ডায়েরি */}
      {activeSubTab === "hifz" && (
        <HifzDiaryView
          records={hifzRecords}
          students={students}
          onBack={() => setActiveSubTab("roster")}
          onAddRecord={onAddHifzRecord}
        />
      )}

      {/* সাব-ভিউ ৪: বোর্ডিং ও মেস */}
      {activeSubTab === "boarding" && (
        <BoardingMessView
          meals={meals}
          bazarItems={bazarItems}
          students={students}
          onBack={() => setActiveSubTab("roster")}
          onUpdateMeal={onUpdateMeal}
          onAddBazarItem={onAddBazarItem}
        />
      )}

      {/* ========================================================================= */}
      {/* ১. নোটিস হিস্ট্রি ও রেকর্ড মডাল (তারিখ ও কাহিনী অনুযায়ী পূর্বের সকল নোটিস) */}
      {/* ========================================================================= */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            {/* হেডার */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    শিক্ষার্থীর নোটিস, আচরণ ও অ্যাক্টিভিটি হিস্ট্রি
                  </h3>
                  <p className="text-xs text-slate-500">
                    কোন তারিখে কী নোটিস দেওয়া হয়েছে এবং কী আকাম বা ভালো কাজ করেছে তার রেকর্ড
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* শিক্ষার্থী তথ্য সারসংক্ষেপ কার্ড */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{selectedStudentForHistory.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    রোল: {selectedStudentForHistory.roll}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    {selectedStudentForHistory.className}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {selectedStudentForHistory.address || "ঠিকানা উল্লেখ নেই"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedStudentForHistory.guardianPhone}
                  </span>
                  <span className="font-bold text-amber-300">
                    বকেয়া: ৳{selectedStudentForHistory.dueAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* নতুন নোটিশ পাঠানোর ডিরেক্ট বাটন */}
              <button
                type="button"
                onClick={() => {
                  const stu = selectedStudentForHistory;
                  setSelectedStudentForHistory(null);
                  handleOpenNoticeModal(stu);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>নতুন নোটিশ পাঠান</span>
              </button>
            </div>

            {/* নোটিস হিস্ট্রি টাইমলাইন */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>পূর্বের সকল নোটিস ও অ্যাক্টিভিটি টাইমলাইন ({toBnDigits(selectedStudentForHistory.activities?.length || 0)}টি):</span>
                </span>
                <span className="text-[11px] text-slate-500">সিরিয়াল অনুযায়ী সাজানো</span>
              </div>

              {selectedStudentForHistory.activities && selectedStudentForHistory.activities.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {selectedStudentForHistory.activities.map((act, actIdx) => (
                    <div
                      key={act.id || actIdx}
                      className={`p-3 rounded-2xl border transition-all text-xs ${
                        act.type === "praise"
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                          : act.type === "warning"
                          ? "bg-rose-50/70 border-rose-200 text-rose-950"
                          : "bg-amber-50/70 border-amber-200 text-amber-950"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 pb-1.5 border-b border-black/5">
                        <div className="flex items-center gap-1.5 font-black">
                          <span className="font-mono text-slate-500 text-[11px]">#{toBnDigits(actIdx + 1)}</span>
                          {act.type === "praise" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-200/60 text-emerald-800 text-[10px]">
                              <Award className="w-3 h-3 text-emerald-700" />
                              ভালো কাজ / প্রশংসা
                            </span>
                          )}
                          {act.type === "warning" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-200/60 text-rose-800 text-[10px]">
                              <AlertTriangle className="w-3 h-3 text-rose-700" />
                              অনিয়ম / সতর্কবার্তা
                            </span>
                          )}
                          {act.type === "notice" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-200/60 text-amber-800 text-[10px]">
                              <Bell className="w-3 h-3 text-amber-700" />
                              দাপ্তরিক নোটিশ
                            </span>
                          )}
                          <span className="text-slate-900">{act.title}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 font-bold">
                          তারিখ: {act.date}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-800 leading-relaxed whitespace-pre-line bg-white/70 p-2.5 rounded-xl border border-black/5">
                        {act.description}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">নথিবদ্ধকারী: {act.recordedBy || "মুহতামিম সাহেব"}</span>
                        {/* এই নোটিশটি সিলেক্ট করে নতুন নোটিশ পাঠানোর বাটন */}
                        <button
                          type="button"
                          onClick={() => {
                            const stu = selectedStudentForHistory;
                            setSelectedStudentForHistory(null);
                            handleOpenNoticeModal(stu, act.title, act.description);
                          }}
                          className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
                        >
                          <span>এই কাহিনী সিলেক্ট করে নতুন নোটিশ পাঠান ➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <ScrollText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">
                    এই শিক্ষার্থীর নামে পূর্বে কোনো সতর্কবার্তা, অনিয়ম বা নোটিশ নথিবদ্ধ করা হয়নি।
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const stu = selectedStudentForHistory;
                      setSelectedStudentForHistory(null);
                      handleOpenNoticeModal(stu);
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>প্রথম নোটিশ যোগ করুন</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ২. অভিভাবককে নোটিশ ও সতর্কবার্তা প্রেরণ মডাল (WhatsApp, SMS ও রেকর্ড সেভ) */}
      {/* ========================================================================= */}
      {selectedStudentForNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            {/* হেডার */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    অভিভাবককে নোটিশ ও সতর্কবার্তা প্রেরণ
                  </h3>
                  <p className="text-xs text-slate-500">
                    WhatsApp ও SMS-এর মাধ্যমে সরাসরি অভিভাবকের মোবাইলে বার্তা প্রেরণ ও রেকর্ড সংরক্ষণ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForNotice(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* স্টুডেন্ট পরিচিতি কার্ড */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{selectedStudentForNotice.name}</span>
                  <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    রোল: {selectedStudentForNotice.roll}
                  </span>
                  <span className="font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                    {selectedStudentForNotice.className}
                  </span>
                </div>
                <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md text-[11px]">
                  বকেয়া: ৳{selectedStudentForNotice.dueAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {selectedStudentForNotice.address || "ঠিকানা উল্লেখ নেই"}
                </span>
                <span className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedStudentForNotice.guardianPhone} ({selectedStudentForNotice.guardianName || "অভিভাবক"})
                </span>
              </div>
            </div>

            {/* পূর্ববর্তী নোটিশ থেকে দ্রুত কাহিনী সিলেক্ট বা টেমপ্লেট অপশন */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>পূর্বে প্রদত্ত নোটিশ বা টেমপ্লেট সিলেক্ট করুন (ক্লিক করলে কাহিনী নিচে বসে যাবে):</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {/* যদি স্টুডেন্টের পূর্বে কোনো নোটিশ থাকে */}
                {selectedStudentForNotice.activities?.map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActivityTitle(act.title);
                      setActivityDesc(act.description);
                      setActivityType(act.type);
                      setSelectedPastNoticeForReuse(act.id);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-indigo-50 text-slate-800 border border-slate-200 hover:border-indigo-300 transition-all text-left flex items-center gap-1 shadow-2xs"
                  >
                    <span>{act.type === "praise" ? "🟢" : act.type === "warning" ? "🔴" : "🟡"}</span>
                    <span className="truncate max-w-[150px]">{act.title}</span>
                  </button>
                ))}

                {/* বকেয়া থাকলে সরাসরি বকেয়া নোটিশ বাটন */}
                {selectedStudentForNotice.dueAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivityTitle(`বকেয়া বেতন ও খোরাকি ফি বাবদ ৳${selectedStudentForNotice.dueAmount.toLocaleString()} পরিশোধ সংক্রান্ত`);
                      setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। আপনার সন্তান ${selectedStudentForNotice.name}-এর মাদরাসার বকেয়া ফি বাবদ সর্বমোট ৳${selectedStudentForNotice.dueAmount.toLocaleString()} টাকা অপরিশোধিত রয়েছে। মাদরাসার স্বাভাবিক শিক্ষা ও খোরাকি কার্যক্রম পরিচালনায় দ্রুত উক্ত বকেয়া পরিশোধ করার জন্য বিনীত অনুরোধ করা হলো।`);
                      setActivityType("notice");
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>💰</span>
                    <span>বকেয়া ৳{selectedStudentForNotice.dueAmount.toLocaleString()} আদায়ের নোটিশ</span>
                  </button>
                )}

                {/* সাধারণ জরুরি টেমপ্লেটসমূহ */}
                <button
                  type="button"
                  onClick={() => {
                    setActivityTitle("বকেয়া বেতন ও খোরাকি ফি পরিশোধ সংক্রান্ত নোটিশ");
                    setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। আপনার সন্তান ${selectedStudentForNotice.name}-এর মাদরাসার বকেয়া ফি বাবদ সর্বমোট ৳${selectedStudentForNotice.dueAmount.toLocaleString()} টাকা অপরিশোধিত রয়েছে। মাদরাসার স্বাভাবিক কার্যক্রম পরিচালনায় দ্রুত উক্ত বকেয়া পরিশোধ করার জন্য বিনীত অনুরোধ করা হলো।`);
                    setActivityType("notice");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-300 transition-all"
                >
                  💰 বকেয়া ফি পরিশোধের তাগিদ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivityTitle("বিনা অনুমতিতে মাদ্রাসায় অনুপস্থিতির কারণ দর্শানো");
                    setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। আপনার সন্তান ${selectedStudentForNotice.name} কোনো পূর্বানুমতি ছাড়াই ক্লাসে ও জামাতে অনুপস্থিত রয়েছে। তার অনুপস্থিতির কারণ লিখিতভাবে মাদরাসা কর্তৃপক্ষকে জরুরিভিত্তিতে অবগত করার জন্য অনুরোধ করা হলো।`);
                    setActivityType("warning");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 hover:border-rose-300 transition-all"
                >
                  ⚠️ ক্লাসে অনুপস্থিতি ও সতর্কতা
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivityTitle("পড়াশোনা ও উত্তম আখলাকের জন্য বিশেষ প্রশংসা");
                    setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। অত্যন্ত আনন্দের সাথে জানানো যাচ্ছে যে, আপনার সন্তান ${selectedStudentForNotice.name} ক্লাসে নিয়মিত উপস্থিতি, উত্তম আদব এবং পরীক্ষায় প্রশংসনীয় মেধার স্বাক্ষর রেখেছে। তার জন্য দোয়া ও শুভকামনা রইলো।`);
                    setActivityType("praise");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 hover:border-emerald-300 transition-all"
                >
                  🌟 মেধা ও উত্তম চরিত্রের প্রশংসা
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivityTitle("মুহতামিম সাহেবের সাথে জরুরি সাক্ষাতের অনুরোধ");
                    setActivityDesc(`সম্মানিত অভিভাবক, আসসালামু আলাইকুম। আপনার সন্তান ${selectedStudentForNotice.name}-এর বিশেষ ও জরুরি অ্যাকাডেমিক বিষয়ে আলোচনার জন্য অত্র মাদ্রাসার মুহতামিম সাহেবের দপ্তরে অতিসত্বর স্বশরীরে সাক্ষাত করার বিনীত অনুরোধ করা হলো।`);
                    setActivityType("notice");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 hover:border-indigo-300 transition-all"
                >
                  📞 মুহতামিম সাহেবের সাথে সাক্ষাত
                </button>
              </div>
            </div>

            {/* নোটিশের ধরণ */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">নোটিশের ধরণ নির্বাচন করুন:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActivityType("praise")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs text-center flex items-center justify-center gap-1.5 ${
                    activityType === "praise"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>ভালো কাজ / প্রশংসা</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType("warning")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs text-center flex items-center justify-center gap-1.5 ${
                    activityType === "warning"
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>সতর্কবার্তা / অনিয়ম</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType("notice")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs text-center flex items-center justify-center gap-1.5 ${
                    activityType === "notice"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>দাপ্তরিক নোটিশ / তলব</span>
                </button>
              </div>
            </div>

            {/* বিষয় / শিরোনাম */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                নোটিশের বিষয় / শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="যেমন: বিনা অনুমতিতে মাদ্রাসার বাইরে যাওয়া / বকেয়া বেতন পরিশোধের তাগিদ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* মূল কাহিনী / বিবরণ লেখার ফাঁকা জায়গা */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1 flex items-center justify-between">
                <span>মূল কাহিনী / বিস্তারিত বিবরণ <span className="text-red-500">*</span> (খালি ঘর - নিজের মতো লিখুন)</span>
                {activityDesc && (
                  <button
                    type="button"
                    onClick={() => setActivityDesc("")}
                    className="text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    ঘর খালি করুন
                  </button>
                )}
              </label>
              <textarea
                rows={3}
                value={activityDesc}
                onChange={(e) => setActivityDesc(e.target.value)}
                placeholder="এখানে ছাত্র কী ভালো কাজ করেছে বা কী অনিয়ম/আকাম করেছে এবং অভিভাবককে কী জানানো প্রয়োজন তার বিস্তারিত কাহিনী লিখুন..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
              />
            </div>

            {/* লাইভ মেসেজ প্রিভিউ (অভিভাবক কী মেসেজ পাবেন) */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>অভিভাবকের কাছে মেসেজ প্রিভিউ:</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                  {selectedStudentForNotice.guardianPhone}
                </span>
              </div>
              <div className="text-[11px] text-slate-800 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-xl border border-emerald-100 font-sans shadow-2xs">
                {`আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ।
🏫 ${madrasa.name} (কিতাব বিভাগ)
----------------------------------
👤 শিক্ষার্থী: ${selectedStudentForNotice.name}
🔢 রোল নং: ${selectedStudentForNotice.roll} | জামাত: ${selectedStudentForNotice.className}
📍 এলাকা: ${selectedStudentForNotice.address || "ঠিকানা সংরক্ষিত"}
----------------------------------
📌 নোটিশের বিষয়: ${activityTitle || "(বিষয় লিখুন)"}
📝 মূল কাহিনী / বিবরণ:
${activityDesc || "(এখানে বিস্তারিত কাহিনী লিখুন)"}
----------------------------------
💰 বকেয়া ফি: ৳${selectedStudentForNotice.dueAmount.toLocaleString()}
— মাওলানা মো. সাহাদাত হোসেন (মুহতামিম সাহেব)
📞 যোগাযোগ: ${madrasa.phone}`}
              </div>
            </div>

            {/* অ্যাকশন বাটনসমূহ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudentForNotice(null)}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors text-xs"
              >
                বাতিল
              </button>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  disabled={!activityTitle.trim()}
                  onClick={() => handleSendNoticeToGuardian("save_only")}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5"
                  title="বাইরে মেসেজ না পাঠিয়ে শুধু ছাত্রের হিস্ট্রিতে রেকর্ড সেভ করুন"
                >
                  <Check className="w-4 h-4 text-slate-300" />
                  <span>শুধু রেকর্ড সেভ</span>
                </button>
                <button
                  type="button"
                  disabled={!activityTitle.trim()}
                  onClick={() => handleSendNoticeToGuardian("sms")}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5"
                  title="অভিভাবকের মোবাইলে SMS অ্যালার্ট পাঠান"
                >
                  <Send className="w-4 h-4 text-indigo-200" />
                  <span>SMS পাঠান</span>
                </button>
                <button
                  type="button"
                  disabled={!activityTitle.trim()}
                  onClick={() => handleSendNoticeToGuardian("whatsapp")}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  title="সরাসরি হোয়াটসঅ্যাপ ওপেন করে মেসেজ পাঠান এবং রেকর্ড সেভ করুন"
                >
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                  <span>WhatsApp-এ পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৩. স্টুডেন্ট আইডি কার্ড প্রিন্ট ও প্রিভিউ মডাল */}
      {/* ========================================================================= */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            {/* হেডার */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">শিক্ষার্থী ডিজিটাল পরিচয়পত্র</h3>
                  <p className="text-[11px] text-slate-500">স্টুডেন্ট আইডি কার্ড (প্রিন্ট কপি)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForIdCard(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* আইডি কার্ড ভিজুয়াল প্রিভিউ */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-indigo-500/30 relative overflow-hidden text-xs">
              <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xs text-white">
                    জা
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white leading-tight">{madrasa.name}</h4>
                    <p className="text-[9px] text-indigo-200">কিতাব বিভাগ • শিক্ষাবর্ষ ২০২৬</p>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  STUDENT ID
                </span>
              </div>

              {/* ছবি ও নাম */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-indigo-400/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  👤
                </div>
                <div>
                  <h5 className="text-base font-black text-white">{selectedStudentForIdCard.name}</h5>
                  <p className="text-[11px] text-indigo-200 font-medium">{selectedStudentForIdCard.englishName || "Student"}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-mono text-[10px] font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-400/30">
                      রোল: {selectedStudentForIdCard.roll}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-400/30">
                      {selectedStudentForIdCard.status === "residential" ? "আবাসিক" : "অনাবাসিক"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ডিটেইলস গ্রিড */}
              <div className="bg-black/30 backdrop-blur-xs rounded-xl p-2.5 space-y-1 text-[11px] border border-white/5">
                <div className="flex justify-between">
                  <span className="text-indigo-300">জামাত / শ্রেণি:</span>
                  <span className="font-bold text-white">{selectedStudentForIdCard.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">শিক্ষার্থী আইডি:</span>
                  <span className="font-mono font-bold text-white">{selectedStudentForIdCard.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">রক্তের গ্রুপ:</span>
                  <span className="font-bold text-rose-300">{selectedStudentForIdCard.bloodGroup || "B+"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">অভিভাবক:</span>
                  <span className="font-bold text-white">{selectedStudentForIdCard.guardianName || "অভিভাবক"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">জরুরি মোবাইল:</span>
                  <span className="font-mono font-bold text-emerald-300">{selectedStudentForIdCard.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">স্থায়ী এলাকা:</span>
                  <span className="font-bold text-white truncate max-w-[170px]">{selectedStudentForIdCard.address || "ঠিকানা সংরক্ষিত"}</span>
                </div>
              </div>

              {/* কিউআর কোড ও স্বাক্ষর */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-indigo-500/30 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 bg-white rounded-lg shadow-xs">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                  <span className="text-[9px] text-indigo-300 font-mono">ভেরিফায়েড কার্ড</span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic text-emerald-300 text-[11px] block">মাওলানা মো. সাহাদাত হোসেন</span>
                  <span className="text-[9px] text-indigo-300 border-t border-indigo-400/40 pt-0.5 block">মুহতামিম স্বাক্ষর</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudentForIdCard(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৪. স্মার্ট আইডি কিউআর কোড স্ক্যানার মডাল (বুকলেট ও কার্ড রিডার) */}
      {/* ========================================================================= */}
      {showQrScanner && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">স্মার্ট আইডি কিউআর কোড স্ক্যানার</h3>
                  <p className="text-[11px] text-slate-500">বুকলেট বা কার্ড স্ক্যান করলে সাথে সাথে ফুল ডিটেইলস ওপেন হবে</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrScanner(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ক্যামেরা স্ক্যানার ভিউফাইন্ডার সিমুলেশন */}
            <div className="h-44 bg-slate-950 rounded-2xl border-2 border-emerald-500/80 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50"></div>
              <div className="w-28 h-28 border-2 border-dashed border-emerald-400/70 rounded-xl flex items-center justify-center">
                <QrCode className="w-12 h-12 text-emerald-400/80 animate-bounce" />
              </div>
              <span className="text-[11px] text-emerald-300 font-mono mt-3">ক্যামেরা ও বারকোড স্ক্যানার সক্রিয়...</span>
            </div>

            {/* দ্রুত রোল / আইডি দিয়ে খোঁজা */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">আইডি বা রোল লিখে দ্রুত ওপেন করুন:</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={scannerSearchQuery}
                  onChange={(e) => setScannerSearchQuery(e.target.value)}
                  placeholder="রোল বা নাম লিখুন..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* ছাত্রদের কিউআর বুকলেট তালিকা */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">
                বুকলেট থেকে সরাসরি ছাত্র সিলেক্ট করুন (যেকোনো ছাত্রে চাপ দিলেই ফুল ডিটেইলস আসবে):
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {students
                  .filter((s) => 
                    !scannerSearchQuery ||
                    s.name.toLowerCase().includes(scannerSearchQuery.toLowerCase()) ||
                    s.roll.includes(scannerSearchQuery)
                  )
                  .slice(0, 10)
                  .map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setShowQrScanner(false);
                        onOpenStudentProfile(s);
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md text-[11px]">
                          {s.roll}
                        </span>
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="text-[10px] text-slate-500">({s.className})</span>
                      </div>
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>স্ক্যান ডিটেইলস ➔</span>
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQrScanner(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
