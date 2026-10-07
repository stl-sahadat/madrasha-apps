"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Phone, 
  MessageSquare, 
  UserCheck, 
  GraduationCap, 
  Calendar,
  Wallet,
  Printer,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  X,
  Check,
  Receipt,
  Users,
  Camera,
  UserPlus,
  Send,
  AlertTriangle
} from "lucide-react";
import { TeacherStaff, MadrasaInfo } from "@/types";

interface ExtendedTeacher extends TeacherStaff {
  photoUrl?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
}

interface TeacherDirectoryProps {
  teachers: TeacherStaff[];
  onBack: () => void;
  onAddTeacher: (teacher: Omit<TeacherStaff, "id">) => void;
  madrasa?: MadrasaInfo;
  initialTab?: "list" | "add" | "phones" | "salary_list" | "salary_pay";
  onTabChange?: (tab: "list" | "add" | "phones" | "salary_list" | "salary_pay") => void;
}

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  onBack,
  onAddTeacher,
  madrasa,
  initialTab = "list",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "phones" | "salary_list" | "salary_pay">(initialTab);
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "list" | "add" | "phones" | "salary_list" | "salary_pay") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  
  // শিক্ষক তালিকা লোকাল স্টেট
  const [teacherList, setTeacherList] = useState<ExtendedTeacher[]>(teachers);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTeacherForPhoto, setSelectedTeacherForPhoto] = useState<string | null>(null);

  // মোডাল স্টেটস
  const [deletingTeacher, setDeletingTeacher] = useState<ExtendedTeacher | null>(null);
  const [smsTeacher, setSmsTeacher] = useState<ExtendedTeacher | null>(null);
  const [smsMessage, setSmsMessage] = useState<string>("");
  const [smsSending, setSmsSending] = useState<boolean>(false);

  // ফর্ম স্টেট
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("সিনিয়র শিক্ষক");
  const [phone, setPhone] = useState("");
  const [nid, setNid] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [classAssigned, setClassAssigned] = useState("মিজান জামাত");
  const [qualification, setQualification] = useState("দাওরায়ে হাদিস ও ইফতা ফারেগ");
  const [salary, setSalary] = useState<number>(20000);
  const [address, setAddress] = useState("");
  const [hasPreviousExperience, setHasPreviousExperience] = useState<string>("না");
  const [previousInstitution, setPreviousInstitution] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<string>("০");
  const [experienceMonths, setExperienceMonths] = useState<string>("০");

  // আজকের তারিখ দিন/মাস/বছর (DD/MM/YYYY) ফরম্যাটে পাওয়ার ফাংশন
  const getTodayDMY = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // যেকোনো তারিখ স্ট্রিংকে দিন/মাস/বছর (DD/MM/YYYY) ফরম্যাটে রূপান্তরের ফাংশন
  const formatDateToDMY = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    const clean = dateStr.trim();
    if (clean.includes("/")) {
      return clean;
    }
    const parts = clean.split(/[-/]/);
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return clean;
  };

  const [joiningDate, setJoiningDate] = useState<string>(getTodayDMY());
  
  // ফিল্টার ও সার্চ স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || "");
  const [successMsg, setSuccessMsg] = useState("");

  // বিস্তারিত মডাল স্টেট
  const [viewingTeacher, setViewingTeacher] = useState<ExtendedTeacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<ExtendedTeacher | null>(null);

  // বেতন প্রদান স্টেট
  const [payDate, setPayDate] = useState<string>(getTodayDMY());
  const [payMonth, setPayMonth] = useState("মার্চ");
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState("ক্যাশ");
  const [payVoucherNo, setPayVoucherNo] = useState("TS-2026-035");
  const [payRemarks, setPayRemarks] = useState("মার্চ ২০২৬ শিক্ষাবর্ষের নিয়মিত বেতন পরিশোধ");

  // শিক্ষকগণের বেতন ফিল্টার স্টেট (সাল ও মাস)
  const [salaryYears, setSalaryYears] = useState<string[]>(["২০২৫", "২০২৬", "২০২৭"]);
  const [selectedSalaryYear, setSelectedSalaryYear] = useState<string>("all");
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState<string>("all");
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState<boolean>(false);
  const [newYearInput, setNewYearInput] = useState<string>("");

  const handleAddSalaryYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    const formatted = newYearInput.trim();
    if (!salaryYears.includes(formatted)) {
      setSalaryYears(prev => [...prev, formatted]);
    }
    setSelectedSalaryYear(formatted);
    setNewYearInput("");
    setIsAddYearModalOpen(false);
  };

  // মক বেতন পরিশোধ তালিকা (দিন/মাস/বছর - DD/MM/YYYY ফরম্যাট)
  const [salaryDisbursements, setSalaryDisbursements] = useState([
    { id: "sd-1", voucherNo: "TS-2026-034", teacherName: "মুফতি আব্দুর রহমান কাসেমী", designation: "মুহতামিম ও শায়খুল হাদিস", month: "মার্চ", amount: 35000, method: "ব্যাংক জমা", date: "২৪/০৩/২০২৬", status: "পরিশোধিত" },
    { id: "sd-2", voucherNo: "TS-2026-033", teacherName: "মাওলানা হাফেজ মুসা বিন ত্বহা", designation: "নাজেমে তালিমাত", month: "মার্চ", amount: 28000, method: "ক্যাশ", date: "২৩/০৩/২০২৬", status: "পরিশোধিত" },
    { id: "sd-3", voucherNo: "TS-2026-032", teacherName: "কারী আব্দুল হক ফারুকী", designation: "প্রধান ক্বারী ও হিফজ শিক্ষক", month: "মার্চ", amount: 25000, method: "বিকাশ", date: "২২/০৩/২০২৬", status: "পরিশোধিত" },
    { id: "sd-4", voucherNo: "TS-2026-031", teacherName: "মাওলানা মাহমুদুল হাসান", designation: "সহকারী শিক্ষক", month: "ফেব্রুয়ারি", amount: 20000, method: "ক্যাশ", date: "২৮/০২/২০২৬", status: "পরিশোধিত" },
    { id: "sd-5", voucherNo: "TS-2026-030", teacherName: "মাওলানা হাফেজ মুসা বিন ত্বহা", designation: "নাজেমে তালিমাত", month: "ফেব্রুয়ারি", amount: 28000, method: "ক্যাশ", date: "২৭/০২/২০২৬", status: "পরিশোধিত" },
    { id: "sd-6", voucherNo: "TS-2026-029", teacherName: "মুফতি আব্দুর রহমান কাসেমী", designation: "মুহতামিম ও শায়খুল হাদিস", month: "জানুয়ারি", amount: 35000, method: "ব্যাংক জমা", date: "৩১/০১/২০২৬", status: "পরিশোধিত" },
    { id: "sd-7", voucherNo: "TS-2025-028", teacherName: "কারী আব্দুল হক ফারুকী", designation: "প্রধান ক্বারী ও হিফজ শিক্ষক", month: "ডিসেম্বর", amount: 25000, method: "বিকাশ", date: "২৮/১২/২০২৫", status: "পরিশোধিত" },
    { id: "sd-8", voucherNo: "TS-2025-027", teacherName: "মাওলানা মাহমুদুল হাসান", designation: "সহকারী শিক্ষক", month: "নভেম্বর", amount: 20000, method: "ক্যাশ", date: "২৭/১১/২০২৫", status: "পরিশোধিত" },
  ]);

  // প্রিন্টযোগ্য ভাউচার পপআপ
  const [activeVoucher, setActiveVoucher] = useState<{
    voucherNo: string;
    teacherName: string;
    designation: string;
    month: string;
    amount: number;
    method: string;
    date: string;
    remarks: string;
  } | null>(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setTeacherList(teachers);
  }, [teachers]);

  // বাংলা ও ইংরেজি সংখ্যার স্বাভাবিকীকরণ (যাতে ১২ বা 12 যাই লিখুক সার্চ কাজ করে)
  const normalizeDigits = (str: string) => {
    return (str || "")
      .replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
      .toLowerCase();
  };

  // ফিল্টার করা বেতন তালিকা (সাল ও মাস অনুযায়ী)
  const filteredSalaryDisbursements = salaryDisbursements.filter((sd) => {
    let matchesYear = true;
    if (selectedSalaryYear !== "all") {
      const normalizedDate = normalizeDigits(sd.date || "");
      const normalizedYear = normalizeDigits(selectedSalaryYear);
      matchesYear = normalizedDate.includes(normalizedYear) || (sd.date || "").includes(selectedSalaryYear);
    }

    let matchesMonth = true;
    if (selectedSalaryMonth !== "all") {
      matchesMonth = sd.month === selectedSalaryMonth;
    }

    return matchesYear && matchesMonth;
  });

  const totalFilteredSalary = filteredSalaryDisbursements.reduce((sum, sd) => sum + (sd.amount || 0), 0);

  // শিক্ষক ফিল্টার (ওস্তাদের নাম, পদবি, ফোন, বিষয়, যোগ্যতা ও আইডি দিয়ে ইনস্ট্যান্ট সার্চ)
  const filteredTeachers = teacherList.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const qNorm = normalizeDigits(q);

    const nameMatch = t.name && (t.name.toLowerCase().includes(q) || normalizeDigits(t.name).includes(qNorm));
    const desigMatch = t.designation && t.designation.toLowerCase().includes(q);
    const phoneMatch = t.phone && (t.phone.includes(q) || normalizeDigits(t.phone).includes(qNorm));
    const classMatch = t.classAssigned && t.classAssigned.toLowerCase().includes(q);
    const qualMatch = t.qualification && t.qualification.toLowerCase().includes(q);
    const idMatch = (t.id && (t.id.toLowerCase().includes(q) || normalizeDigits(t.id).includes(qNorm))) ||
                    (t.nid && (t.nid.includes(q) || normalizeDigits(t.nid).includes(qNorm)));

    return Boolean(nameMatch || desigMatch || phoneMatch || classMatch || qualMatch || idMatch);
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedTeacherForPhoto) {
      const imageUrl = URL.createObjectURL(file);
      setTeacherList((prev) =>
        prev.map((t) =>
          t.id === selectedTeacherForPhoto ? { ...t, photoUrl: imageUrl } : t
        )
      );
      setSuccessMsg("উস্তাদের ছবি সফলভাবে হালনাগাদ করা হয়েছে!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteTeacher = (id: string) => {
    setTeacherList(prev => prev.filter(t => t.id !== id));
    setDeletingTeacher(null);
    setSuccessMsg("উস্তাদকে তালিকা থেকে অপসারণ করা হয়েছে।");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSendSms = () => {
    if (!smsTeacher) return;
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      setSuccessMsg(`আলহামদুলিল্লাহ! ${smsTeacher.name} উস্তাদের ফোনে (${smsTeacher.phone}) সফলভাবে বার্তা পাঠানো হয়েছে।`);
      setSmsTeacher(null);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    let expDurationText = "নতুন শিক্ষক (পূর্ব অভিজ্ঞতা নেই)";
    if (hasPreviousExperience === "হ্যাঁ") {
      const parts = [];
      if (experienceYears && experienceYears !== "০" && experienceYears !== "0") parts.push(`${experienceYears} বছর`);
      if (experienceMonths && experienceMonths !== "০" && experienceMonths !== "0") parts.push(`${experienceMonths} মাস`);
      expDurationText = parts.length > 0 ? parts.join(" ") : "অভিজ্ঞ শিক্ষক";
    }

    const newTeacher: ExtendedTeacher = {
      id: `tch_${Date.now()}`,
      name,
      designation,
      phone,
      classAssigned,
      qualification,
      salary,
      address,
      fatherName,
      motherName,
      nid: nid.trim() || undefined,
      hasPreviousExperience,
      previousInstitution: hasPreviousExperience === "হ্যাঁ" ? (previousInstitution || "মাদরাসা") : "",
      experienceYears,
      experienceMonths,
      experienceDuration: expDurationText,
      joiningDate: joiningDate.trim() || getTodayDMY(),
    };

    setTeacherList((prev) => [newTeacher, ...prev]);
    onAddTeacher(newTeacher);

    setSuccessMsg(`সফল! ${name}-কে শিক্ষক তালিকায় যুক্ত করা হয়েছে।`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setName("");
    setPhone("");
    setNid("");
    setFatherName("");
    setMotherName("");
    setAddress("");
    setHasPreviousExperience("না");
    setPreviousInstitution("");
    setExperienceYears("০");
    setExperienceMonths("০");
    setJoiningDate(getTodayDMY());
    setActiveTab("list");
  };

  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault();
    const tch = teacherList.find(t => t.id === selectedTeacherId) || teachers.find(t => t.id === selectedTeacherId) || teachers[0];
    const newVoucher = {
      id: `sd-${Date.now()}`,
      voucherNo: payVoucherNo,
      teacherName: tch.name,
      designation: tch.designation,
      month: payMonth,
      amount: payAmount,
      method: payMethod,
      date: payDate.trim() || getTodayDMY(),
      status: "পরিশোধিত"
    };
    setSalaryDisbursements([newVoucher, ...salaryDisbursements]);
    setSuccessMsg(`সফল! ${tch.name}-এর ${payMonth} মাসের বেতন বাবদ ৳${payAmount.toLocaleString("bn-BD")} পরিশোধ করা হয়েছে।`);
    setTimeout(() => setSuccessMsg(""), 4000);
    // সরাসরি প্রিন্ট ভাউচার ভিউয়ার চালু
    setActiveVoucher({
      ...newVoucher,
      remarks: payRemarks
    });
    setPayVoucherNo(`TS-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs no-print">
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
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <span>শিক্ষক ও স্টাফ ম্যানেজমেন্ট</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মুহতামিম, শিক্ষক ডিরেক্টরি, মোবাইল নম্বর খাতা ও শিক্ষক বেতন রেজিস্টার
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট করুন</span>
        </button>
      </div>

      {/* সাব-ট্যাব ন্যাভিগেশন বার (সাইডবার মেনুর সিরিয়াল অনুযায়ী হুবহু ৫টি অপশন) */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 no-print overflow-x-auto">
        <button
          onClick={() => handleTabChange("add")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "add" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          শিক্ষক তৈরি
        </button>
        <button
          onClick={() => handleTabChange("list")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "list" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          শিক্ষক তালিকা
        </button>
        <button
          onClick={() => handleTabChange("phones")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "phones" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          শিক্ষকগণের মোবাইল নাম্বার
        </button>
        <button
          onClick={() => handleTabChange("salary_pay")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "salary_pay" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          শিক্ষক বেতন প্রদান
        </button>
        <button
          onClick={() => handleTabChange("salary_list")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "salary_list" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          শিক্ষকগণের বেতন তালিকা
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ১. শিক্ষক তালিকা ভিউ (ছাত্র/ছাত্রী লিস্টের হুবহু ৬-কলাম টেবিল ডিজাইন) */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* কার্ড হেডার (স্ক্রিনশটের হুবহু অনুযায়ী) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  শিক্ষক ও কর্মকর্তা লিস্ট
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  মোট শিক্ষক ও কর্মকর্তা: {teacherList.length} জন
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setActiveTab("add")}
                className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ নতুন শিক্ষক তৈরি করুন</span>
              </button>
            </div>
          </div>

          {/* টেবিল কন্ট্রোল বার (Show entries ও Search ফিল্ড) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-600 font-medium">Search:</span>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ওস্তাদ বা শিক্ষকের নাম লিখুন..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 shadow-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title="ক্লিয়ার করুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* মূল টেবিল (স্ক্রিনশটের হুবহু ৬টি কলাম) */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1b686e] text-white border-b border-teal-800">
                    <th className="py-3 px-4 font-bold text-center w-28">ছবি</th>
                    <th className="py-3 px-4 font-bold">বিবরণ</th>
                    <th className="py-3 px-4 font-bold">বিভাগ, বিষয় ও জামাত</th>
                    <th className="py-3 px-4 font-bold">একাউন্ট ও বেতন সংক্ষিপ্তসার</th>
                    <th className="py-3 px-4 font-bold text-center w-28">বিস্তারিত</th>
                    <th className="py-3 px-4 font-bold text-center w-24">মুছুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="w-9 h-9 text-slate-300" />
                          <p className="text-sm font-bold text-slate-700">
                            "{searchQuery}" দিয়ে কোনো শিক্ষক বা কর্মকর্তা খুঁজে পাওয়া যায়নি!
                          </p>
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-teal-700 font-bold underline"
                          >
                            সব শিক্ষকের তালিকা দেখুন
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTeachers.slice(0, entriesPerPage).map((tch) => (
                      <tr key={tch.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ১. ছবি */}
                        <td className="py-4 px-4 text-center align-top">
                          <div className="flex flex-col items-center">
                            {tch.photoUrl ? (
                              <img
                                src={tch.photoUrl}
                                alt={tch.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400 font-bold text-base">
                                {tch.name.slice(0, 1)}
                              </div>
                            )}

                            {/* ছবি আপলোড হলুদ বাটন (স্ক্রিনশটের অনুরূপ) */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTeacherForPhoto(tch.id);
                                fileInputRef.current?.click();
                              }}
                              className="mt-2 px-2.5 py-1 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              <span>⤊ ছবি</span>
                            </button>
                          </div>
                        </td>

                        {/* ২. বিবরণ */}
                        <td className="py-4 px-4 align-top space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{tch.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              {tch.designation}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <p><span className="font-semibold text-slate-700">উস্তাদ আইডি:</span> <span className="font-mono font-bold text-teal-700">{tch.id}</span></p>
                            {tch.fatherName && (
                              <p><span className="font-semibold text-slate-700">পিতার নাম:</span> {tch.fatherName}</p>
                            )}
                            <p className="flex items-center gap-1">
                              <span className="font-semibold text-slate-700">মোবাইল:</span>
                              <span className="font-mono font-bold text-slate-800">{tch.phone}</span>
                              <a href={`tel:${tch.phone}`} className="text-teal-600 hover:text-teal-800 ml-1">
                                <Phone className="w-3 h-3 inline" />
                              </a>
                            </p>
                            {tch.nid && (
                              <p><span className="font-semibold text-slate-700">NID:</span> <span className="font-mono">{tch.nid}</span></p>
                            )}
                          </div>
                        </td>

                        {/* ৩. বিভাগ, বিষয় ও জামাত */}
                        <td className="py-4 px-4 align-top space-y-1">
                          <div className="text-xs space-y-1">
                            <p>
                              <span className="font-semibold text-slate-700">দায়িত্বপ্রাপ্ত জামাত:</span>{" "}
                              <span className="font-bold text-slate-900">{tch.classAssigned || "সকল বিভাগ"}</span>
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">শিক্ষাগত যোগ্যতা:</span>{" "}
                              <span className="text-slate-800">{tch.qualification}</span>
                            </p>
                            {tch.hasPreviousExperience === "হ্যাঁ" ? (
                              <p className="text-[11px] text-indigo-700 font-semibold">
                                <span className="text-slate-700 font-normal">পূর্ব অভিজ্ঞতা:</span> {tch.experienceDuration || `${tch.experienceYears || 0} বছর ${tch.experienceMonths || 0} মাস`}{tch.previousInstitution ? ` (${tch.previousInstitution})` : ""}
                              </p>
                            ) : tch.hasPreviousExperience === "না" ? (
                              <p className="text-[11px] text-slate-500 font-medium">
                                <span className="text-slate-700 font-normal">পূর্ব অভিজ্ঞতা:</span> নতুন শিক্ষক
                              </p>
                            ) : null}
                            <p>
                              <span className="font-semibold text-slate-700">যোগদানের তারিখ:</span>{" "}
                              <span className="font-mono text-slate-600">{formatDateToDMY(tch.joiningDate) || "০১/০১/২০২৬"}</span>
                            </p>
                          </div>
                        </td>

                        {/* ৪. একাউন্ট ও বেতন সংক্ষিপ্তসার */}
                        <td className="py-4 px-4 align-top space-y-1">
                          <div className="text-xs space-y-1">
                            <p>
                              <span className="font-semibold text-slate-700">নির্ধারিত মাসিক বেতন:</span>{" "}
                              <span className="font-mono font-bold text-emerald-700">৳{tch.salary?.toLocaleString("bn-BD") || "২০,০০০"}</span>
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">স্ট্যাটাস:</span>{" "}
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                নিয়মিত ও সক্রিয়
                              </span>
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">পরিশোধ মাধ্যম:</span>{" "}
                              <span className="text-slate-600">ক্যাশ / ব্যাংক ট্রান্সফার</span>
                            </p>
                          </div>
                        </td>

                        {/* ৫. বিস্তারিত */}
                        <td className="py-4 px-4 text-center align-top">
                          <button
                            type="button"
                            onClick={() => setViewingTeacher(tch)}
                            className="py-1.5 px-3.5 bg-[#1b686e] hover:bg-[#135156] text-white rounded-lg text-xs font-bold shadow-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>বিস্তারিত</span>
                          </button>
                        </td>

                        {/* ৬. মুছুন */}
                        <td className="py-4 px-4 text-center align-top">
                          <button
                            type="button"
                            onClick={() => setDeletingTeacher(tch)}
                            className="p-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white rounded shadow-xs transition-colors"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ২. শিক্ষক তৈরি ভিউ */}
      {activeTab === "add" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>নতুন শিক্ষক / স্টাফ তৈরি ও প্রোফাইল এন্ট্রি</span>
            </h3>
            <p className="text-xs text-slate-500">মাদরাসার সকল উস্তাদ, নাজেমে তালিমাত ও স্টাফদের তথ্য ডাটাবেজে সংরক্ষণ</p>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">উস্তাদ / কর্মকর্তার নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মাওলানা হাফেজ আব্দুল্লাহ..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">পদবি *</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="মুহতামিম">মুহতামিম</option>
                <option value="শায়খুল হাদিস">শায়খুল হাদিস</option>
                <option value="নাজেমে তালিমাত">নাজেমে তালিমাত</option>
                <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক</option>
                <option value="হিফজ শিক্ষক ও ক্বারী">হিফজ শিক্ষক ও ক্বারী</option>
                <option value="হিসাবরক্ষক">হিসাবরক্ষক</option>
                <option value="বাবুর্চি ও খাদেম">বাবুর্চি ও খাদেম</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">পিতার নাম</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="পিতার নাম..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">মাতার নাম</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="মাতার নাম..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="০১৭১১XXXXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* জাতীয় পরিচয়পত্র (NID) নম্বর */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                জাতীয় পরিচয়পত্র (NID) নম্বর <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="যেমন: 19852691234567890 (যদি থাকে)..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">দায়িত্বপ্রাপ্ত জামাত / বিভাগ</label>
              <input
                type="text"
                value={classAssigned}
                onChange={(e) => setClassAssigned(e.target.value)}
                placeholder="যেমন: মিজান জামাত বা হেফজখানা"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">শিক্ষাগত যোগ্যতা</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="যেমন: দাওরায়ে হাদিস ও ইফতা ফারেগ..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">মাসিক নির্ধারিত বেতন (৳) *</label>
              <input
                type="number"
                min="0"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">স্থায়ী ঠিকানা</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="গ্রাম, ডাকঘর, থানা, জেলা..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* পূর্বে শিক্ষকতার অভিজ্ঞতা আছে কি না */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">পূর্বে কোথাও পড়িয়েছেন কি?</label>
              <select
                value={hasPreviousExperience}
                onChange={(e) => {
                  const val = e.target.value;
                  setHasPreviousExperience(val);
                  if (val === "না") {
                    setPreviousInstitution("");
                    setExperienceYears("০");
                    setExperienceMonths("০");
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="না">না</option>
                <option value="হ্যাঁ">হ্যাঁ</option>
              </select>
            </div>

            {/* পূর্বের মাদরাসা বা প্রতিষ্ঠানের নাম */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                পূর্বের প্রতিষ্ঠানের নাম
              </label>
              <input
                type="text"
                value={previousInstitution}
                onChange={(e) => {
                  setPreviousInstitution(e.target.value);
                  if (e.target.value.trim() && hasPreviousExperience === "না") {
                    setHasPreviousExperience("হ্যাঁ");
                  }
                }}
                placeholder="যেমন: জামিয়া ইসলামিয়া দারুল উলুম..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* পড়িয়ে থাকলে কত বছর / মাস পড়িয়েছেন (শুধুমাত্র হ্যাঁ সিলেক্ট করলে অথবা প্রতিষ্ঠানের নাম লিখলে শো করবে) */}
            {(hasPreviousExperience === "হ্যাঁ" || previousInstitution.trim().length > 0) && (
              <div className="animate-in fade-in duration-200">
                <label className="font-bold text-slate-700 block mb-1">কত বছর / মাস পড়িয়েছেন?</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={experienceYears}
                      onChange={(e) => {
                        setExperienceYears(e.target.value);
                        if (e.target.value && e.target.value !== "০" && e.target.value !== "0" && hasPreviousExperience === "না") {
                          setHasPreviousExperience("হ্যাঁ");
                        }
                      }}
                      placeholder="০"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500 pointer-events-none">
                      বছর
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={experienceMonths}
                      onChange={(e) => {
                        setExperienceMonths(e.target.value);
                        if (e.target.value && e.target.value !== "০" && e.target.value !== "0" && hasPreviousExperience === "না") {
                          setHasPreviousExperience("হ্যাঁ");
                        }
                      }}
                      placeholder="০"
                      className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500 pointer-events-none">
                      মাস
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* যোগদানের তারিখ (দিন/মাস/বছর) */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                যোগদানের তারিখ <span className="text-slate-400 font-normal">(দিন/মাস/বছর)</span> *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  placeholder="দিন/মাস/বছর (যেমন: 01/10/2026)"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split("-");
                      setJoiningDate(`${d}/${m}/${y}`);
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-10 opacity-0 cursor-pointer"
                  title="ক্যালেন্ডার থেকে তারিখ বেছে নিন"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">ফরম্যাট: DD/MM/YYYY (দিন/মাস/বছর)</p>
            </div>

            <div className="md:col-span-2 lg:col-span-3 pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>শিক্ষক তথ্য সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ৩. শিক্ষকগণের মোবাইল নাম্বার তালিকা ভিউ */}
      {activeTab === "phones" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">শিক্ষক ও কর্মকর্তা ফোন ডিরেক্টরি</h2>
            <p className="text-xs text-slate-500">মাদ্রাসার সকল শিক্ষক ও কর্মকর্তার দাপ্তরিক মোবাইল নাম্বার তালিকা</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 w-12 text-center border">ক্রমিক</th>
                  <th className="py-2.5 px-4 border">উস্তাদ / কর্মকর্তার নাম</th>
                  <th className="py-2.5 px-3 border">পদবি</th>
                  <th className="py-2.5 px-4 border font-mono">মোবাইল নাম্বার</th>
                  <th className="py-2.5 px-3 border">দায়িত্বপ্রাপ্ত জামাত</th>
                  <th className="py-2.5 px-3 border text-center no-print">যোগাযোগ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teachers.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 border text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-4 border font-black text-slate-900">{t.name}</td>
                    <td className="py-2.5 px-3 border text-indigo-700 font-bold">{t.designation}</td>
                    <td className="py-2.5 px-4 border font-mono font-bold text-slate-800">{t.phone}</td>
                    <td className="py-2.5 px-3 border text-slate-600">{t.classAssigned || "-"}</td>
                    <td className="py-2.5 px-3 border text-center no-print">
                      <div className="flex items-center justify-center gap-2">
                        <a href={`tel:${t.phone}`} className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">কল</a>
                        <a href={`https://wa.me/88${t.phone}`} target="_blank" rel="noreferrer" className="p-1 px-2 rounded-lg bg-teal-50 text-teal-700 text-[10px] font-bold">হোয়াটসঅ্যাপ</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৪. শিক্ষকগণের বেতন তালিকা ভিউ */}
      {activeTab === "salary_list" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <span>শিক্ষকদের মাসিক বেতন তালিকা</span>
              </h3>
              <p className="text-xs text-slate-500">সকল শিক্ষকের বেতন পরিশোধের রসিদ ও হিস্ট্রি</p>
            </div>
            <button
              onClick={() => setActiveTab("salary_pay")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বেতন পরিশোধ</span>
            </button>
          </div>

          {/* ফিল্টার কন্ট্রোল বার: সাল ও মাস নির্বাচন */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
            <div className="flex flex-wrap items-center gap-3">
              {/* সাল নির্বাচন */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>সাল:</span>
                </span>
                <div className="flex items-center gap-1">
                  <select
                    value={selectedSalaryYear}
                    onChange={(e) => setSelectedSalaryYear(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">সকল সাল</option>
                    {salaryYears.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddYearModalOpen(true)}
                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 shadow-xs transition-colors"
                    title="নতুন সাল যোগ করুন"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* মাস নির্বাচন */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">মাস:</span>
                <select
                  value={selectedSalaryMonth}
                  onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">সকল মাস</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* ফিল্টার রিসেট বাটন */}
              {(selectedSalaryYear !== "all" || selectedSalaryMonth !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSalaryYear("all");
                    setSelectedSalaryMonth("all");
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-colors"
                >
                  রিসেট
                </button>
              )}
            </div>

            {/* সারসংক্ষেপ ব্যাজ */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                মোট উস্তাদ: <strong className="text-slate-900 font-mono">{filteredSalaryDisbursements.length}</strong> জন
              </span>
              <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl shadow-xs">
                মোট বেতন: <strong className="font-mono text-emerald-900">৳{totalFilteredSalary.toLocaleString("bn-BD")}</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 border font-mono">ভাউচার নং</th>
                  <th className="py-2.5 px-4 border">উস্তাদের নাম</th>
                  <th className="py-2.5 px-3 border">পদবি</th>
                  <th className="py-2.5 px-3 border">মাস</th>
                  <th className="py-2.5 px-3 border text-right">পরিশোধিত বেতন</th>
                  <th className="py-2.5 px-3 border text-center">মাধ্যম</th>
                  <th className="py-2.5 px-3 border text-center">তারিখ</th>
                  <th className="py-2.5 px-3 border text-center">অবস্থা</th>
                  <th className="py-2.5 px-3 border text-center no-print">রসিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSalaryDisbursements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Receipt className="w-8 h-8 text-slate-300" />
                        <p className="font-bold text-sm text-slate-700">
                          {selectedSalaryMonth !== "all" || selectedSalaryYear !== "all"
                            ? `${selectedSalaryMonth !== "all" ? selectedSalaryMonth : ""} ${selectedSalaryYear !== "all" ? selectedSalaryYear : ""} এর কোনো বেতন পরিশোধ রেকর্ড পাওয়া যায়নি`
                            : "কোনো বেতন পরিশোধ রেকর্ড নেই"}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSalaryYear("all");
                            setSelectedSalaryMonth("all");
                          }}
                          className="mt-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          সকল রেকর্ড দেখুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSalaryDisbursements.map((sd) => (
                    <tr key={sd.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 border font-mono font-bold text-indigo-700">{sd.voucherNo}</td>
                      <td className="py-2.5 px-4 border font-black text-slate-900">{sd.teacherName}</td>
                      <td className="py-2.5 px-3 border text-slate-600 font-bold">{sd.designation}</td>
                      <td className="py-2.5 px-3 border text-indigo-900 font-bold">{sd.month}</td>
                      <td className="py-2.5 px-3 border text-right font-mono font-bold text-emerald-700">৳{sd.amount.toLocaleString("bn-BD")}</td>
                      <td className="py-2.5 px-3 border text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {sd.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border text-center font-mono text-slate-500">{formatDateToDMY(sd.date)}</td>
                      <td className="py-2.5 px-3 border text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {sd.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border text-center no-print">
                        <button
                          onClick={() => setActiveVoucher({
                            ...sd,
                            remarks: `${sd.month} ২০২৬ শিক্ষাবর্ষের নিয়মিত বেতন পরিশোধ`
                          })}
                          className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors"
                        >
                          প্রিন্ট ভাউচার
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৫. শিক্ষক বেতন প্রদান ভিউ */}
      {activeTab === "salary_pay" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <span>শিক্ষক বেতন পরিশোধ ভাউচার তৈরি</span>
            </h3>
            <p className="text-xs text-slate-500">মাদ্রাসার শিক্ষক ও স্টাফদের বেতন পরিশোধ এবং ডেবিট ভাউচার তৈরি</p>
          </div>

          <form onSubmit={handlePaySalary} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">শিক্ষক নির্বাচন করুন *</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => {
                  setSelectedTeacherId(e.target.value);
                  const tch = teacherList.find(t => t.id === e.target.value) || teachers.find(t => t.id === e.target.value);
                  if (tch && tch.salary) setPayAmount(tch.salary);
                }}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              >
                {teacherList.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">বেতনের মাস *</label>
              <select
                value={payMonth}
                onChange={(e) => setPayMonth(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">টাকার পরিমাণ (৳) *</label>
              <input
                type="number"
                min="500"
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">পরিশোধ মাধ্যম *</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ক্যাশ">ক্যাশ</option>
                <option value="ব্যাংক জমা">ব্যাংক একাউন্ট ট্রান্সফার</option>
                <option value="বিকাশ">বিকাশ</option>
                <option value="নগদ">নগদ</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ভাউচার নম্বর</label>
              <input
                type="text"
                readOnly
                value={payVoucherNo}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-indigo-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                পরিশোধের তারিখ <span className="text-slate-400 font-normal">(দিন/মাস/বছর)</span> *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  placeholder="দিন/মাস/বছর (যেমন: 01/10/2026)"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split("-");
                      setPayDate(`${d}/${m}/${y}`);
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-10 opacity-0 cursor-pointer"
                  title="ক্যালেন্ডার থেকে তারিখ বেছে নিন"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">ফরম্যাট: DD/MM/YYYY (দিন/মাস/বছর)</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ভাউচার মন্তব্য / নোট</label>
              <input
                type="text"
                value={payRemarks}
                onChange={(e) => setPayRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>বেতন পরিশোধ ও ডেবিট ভাউচার তৈরি করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* বিস্তারিত শিক্ষক মডাল */}
      {viewingTeacher && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">শিক্ষক বিস্তারিত প্রোফাইল</h3>
              <button onClick={() => setViewingTeacher(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-2xl text-indigo-700">
                  {viewingTeacher.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">{viewingTeacher.name}</h4>
                  <p className="text-xs font-bold text-indigo-700">{viewingTeacher.designation}</p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-b border-slate-100 py-3">
                <div className="flex justify-between"><span className="text-slate-500">মোবাইল:</span><span className="font-mono font-bold">{viewingTeacher.phone}</span></div>
                {viewingTeacher.nid && (
                  <div className="flex justify-between"><span className="text-slate-500">জাতীয় পরিচয়পত্র (NID):</span><span className="font-mono font-bold text-slate-800">{viewingTeacher.nid}</span></div>
                )}
                <div className="flex justify-between"><span className="text-slate-500">দায়িত্বপ্রাপ্ত জামাত:</span><span className="font-bold">{viewingTeacher.classAssigned || "-"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">শিক্ষাগত যোগ্যতা:</span><span className="font-bold">{viewingTeacher.qualification}</span></div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পূর্বে পড়িয়েছেন কি:</span>
                  <span className="font-bold text-indigo-700">{viewingTeacher.hasPreviousExperience || "না"}</span>
                </div>
                {viewingTeacher.hasPreviousExperience === "হ্যাঁ" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">পূর্বের প্রতিষ্ঠান:</span>
                      <span className="font-bold text-slate-800">{viewingTeacher.previousInstitution || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">পড়ানোর মেয়াদ:</span>
                      <span className="font-bold text-emerald-700">
                        {viewingTeacher.experienceDuration || `${viewingTeacher.experienceYears || 0} বছর ${viewingTeacher.experienceMonths || 0} মাস`}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between"><span className="text-slate-500">নির্ধারিত মাসিক বেতন:</span><span className="font-mono font-bold text-indigo-700">৳{viewingTeacher.salary?.toLocaleString("bn-BD") || "২০,০০০"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">যোগদানের তারিখ:</span><span className="font-mono font-bold text-slate-800">{formatDateToDMY(viewingTeacher.joiningDate) || "০১/০১/২০২৬"}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingTeacher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* বেতন ভাউচার পপআপ প্রিন্ট মডাল */}
      {activeVoucher && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">শিক্ষক বেতন ডেবিট ভাউচার</span>
              <button onClick={() => setActiveVoucher(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 p-5 rounded-2xl space-y-4 bg-slate-50/50 relative overflow-hidden">
              {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
                style={{ opacity: ((madrasa?.watermarkOpacity ?? 10) / 100) }}
              >
                <img src={madrasa?.logoUrl || "/logo.png"} alt="watermark" className="w-44 h-44 object-contain" />
              </div>

              <div className="text-center space-y-1 relative z-10">
                <div className="w-10 h-10 mx-auto">
                  <img src={madrasa?.logoUrl || "/logo.png"} alt="লোগো" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-slate-900">শিক্ষক ও স্টাফ বেতন ভাউচার</h3>
                <div className="pt-1">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold">
                    ডেবিট ক্যাশ ভাউচার
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 border-t border-b border-slate-200 py-3">
                <div className="flex justify-between"><span className="text-slate-500">ভাউচার নং:</span><span className="font-mono font-bold text-indigo-700">{activeVoucher.voucherNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">তারিখ:</span><span className="font-mono font-bold">{formatDateToDMY(activeVoucher.date)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">উস্তাদের নাম:</span><span className="font-black text-slate-900">{activeVoucher.teacherName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">পদবি:</span><span className="font-bold text-slate-800">{activeVoucher.designation}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">বেতনের মাস:</span><span className="font-bold text-indigo-900">{activeVoucher.month}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">পরিশোধ মাধ্যম:</span><span className="font-bold text-slate-700">{activeVoucher.method}</span></div>
              </div>

              <div className="flex justify-between items-center text-sm font-black p-2.5 bg-emerald-50 rounded-xl text-emerald-950">
                <span>পরিশোধিত মোট বেতন:</span>
                <span className="font-mono text-base text-emerald-700">৳{activeVoucher.amount.toLocaleString("bn-BD")}</span>
              </div>

              <div className="pt-6 flex justify-between text-[10px] font-bold text-slate-600">
                <div className="border-t border-slate-400 pt-1 text-center w-24">গ্রহণকারীর দস্তখত</div>
                <div className="border-t border-slate-400 pt-1 text-center w-24">মুহতামিমের সীল</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 no-print">
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট ভাউচার</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* হিডেন ফাইল ইনপুট শিক্ষক ছবি আপলোডের জন্য */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        className="hidden"
      />

      {/* উস্তাদকে এসএমএস প্রেরণের মোডাল */}
      {smsTeacher && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-800">
                  উস্তাদকে এসএমএস পাঠান
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSmsTeacher(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">প্রাপক:</span>
                <span className="font-bold text-slate-900">{smsTeacher.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">পদবি:</span>
                <span className="font-bold text-teal-700">{smsTeacher.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-slate-800">{smsTeacher.phone}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                এসএমএস বার্তা
              </label>
              <textarea
                rows={4}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="এখানে বার্তা লিখুন..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500 font-medium">
                <span>অক্ষর সংখ্যা: {smsMessage.length}</span>
                <span>(বাংলা ১টি এসএমএস = ৭০ অক্ষর)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSmsTeacher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={smsSending || !smsMessage.trim()}
                onClick={handleSendSms}
                className="px-5 py-2 bg-[#1b686e] hover:bg-[#135156] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                {smsSending ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>মেসেজ পাঠান</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* উস্তাদকে মোছার নিশ্চিতকরণ মোডাল */}
      {deletingTeacher && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  উস্তাদের তথ্য মুছতে চান?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-900 font-medium">
              <p><span className="font-bold">নাম:</span> {deletingTeacher.name}</p>
              <p><span className="font-bold">পদবি:</span> {deletingTeacher.designation}</p>
              <p><span className="font-bold">আইডি:</span> {deletingTeacher.id}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTeacher(deletingTeacher.id)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                হ্যাঁ, নিশ্চিত মুছুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* নতুন সাল যোগ করার মডাল */}
      {isAddYearModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">নতুন শিক্ষাবর্ষ / সাল যোগ করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddYearModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalaryYear} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">সালের নাম লিখুন *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ২০২৮ অথবা 2028"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1">যুক্ত করার পর এটি স্বয়ংক্রিয়ভাবে ড্রপডাউনে সেভ হয়ে যাবে।</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
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
