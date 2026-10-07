"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UserPlus, 
  Users, 
  Search, 
  Printer, 
  CheckCircle2, 
  Phone, 
  ArrowLeft,
  X,
  CreditCard,
  Building,
  Keyboard,
  Camera,
  Eye,
  MessageSquare,
  Trash2,
  Edit3,
  Send,
  Upload,
  AlertTriangle,
  Clock,
  Sparkles,
  Plus,
  ChevronDown,
  GraduationCap,
  Copy,
  ExternalLink
} from "lucide-react";
import { Student, MadrasaClass, MadrasaInfo } from "@/types";
import { formatDateToDMY } from "@/lib/dateUtils";

interface ExtendedStudent extends Student {
  birthDate?: string;
  fatherOccupation?: string;
  motherName?: string;
  fatherName?: string;
  email?: string;
  guardianRelation?: string;
  presentAddress?: string;
  permanentAddress?: string;
  formNumber?: string;
  quotaFee?: string;
  residentialType?: string;
  khorakiType?: string;
  isBoardingMeal?: string;
  khanaFeeText?: string;
  isOrphan?: string;
  studentType?: string;
  batchType?: string;
  classTime?: string;
  khanaFee?: number;
  photoUrl?: string;
  remarks?: string;
  statusBadge?: string;
}

// ব্র্যাকেট বা অতিরিক্ত লেখা ছাড়া কেবল জামাত/ক্লাসের নাম পাওয়ার হেল্পার
const cleanClassName = (name: string): string => {
  return (name || "").replace(/\s*\([^)]*\)/g, '').trim();
};

interface AdmissionsViewProps {
  students: Student[];
  classes: MadrasaClass[];
  madrasa: MadrasaInfo;
  onAddNewStudent: (student: Student) => void;
  onOpenStudentProfile: (student: Student) => void;
  onBack?: () => void;
  initialTab?: "form" | "list" | "by_jamat" | "edit";
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({
  students,
  classes,
  madrasa,
  onAddNewStudent,
  onOpenStudentProfile,
  onBack,
  initialTab = "form"
}) => {
  const [activeTab, setActiveTab] = useState<"form" | "list" | "by_jamat" | "edit">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [successMessage, setSuccessMessage] = useState("");

  // জামাত অনুসারে ছাত্র কার্ড ভিউ স্টেট (স্ক্রিনশট media_1790432893896.png অনুযায়ী)
  const [selectedJamatForCards, setSelectedJamatForCards] = useState<string>("সকল জামাত");
  const [selectedJamatForList, setSelectedJamatForList] = useState<string>("সকল জামাত");
  const [jamatToastMsg, setJamatToastMsg] = useState<string>("");

  // বাহ্যিক কল (যেমন ড্যাশবোর্ড শর্টকাট বা সাইডবার) অনুযায়ী ট্যাব সিঙ্ক করা
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setEditingStudent(null);
    }
  }, [initialTab]);

  // লাইভ ছাত্র তালিকা (প্রপ্স হিসেবে আসা ২০ জন ছাত্রের তালিকা)
  const [studentList, setStudentList] = useState<ExtendedStudent[]>(() => students as ExtendedStudent[]);

  // students প্রপ্স পরিবর্তিত হলে তালিকা আপডেট করা
  useEffect(() => {
    setStudentList(students as ExtendedStudent[]);
  }, [students]);

  // ফটো আপলোড রেফারেন্স
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStudentForPhoto, setSelectedStudentForPhoto] = useState<string | null>(null);

  // মোডাল স্টেটস
  const [viewingStudent, setViewingStudent] = useState<ExtendedStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<ExtendedStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<ExtendedStudent | null>(null);
  const [smsStudent, setSmsStudent] = useState<ExtendedStudent | null>(null);
  const [smsMessage, setSmsMessage] = useState<string>("আসসালামু আলাইকুম, মাদরাসা অফিস থেকে বিশেষ তথ্য...");
  const [smsSending, setSmsSending] = useState<boolean>(false);

  // =========================================================================
  // ভর্তি ফরম স্টেট (স্ক্রিনশট ১ ও ২ অনুযায়ী হুবহু)
  // =========================================================================
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  // ডান কলাম
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNumber, setFormNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [admissionFeeAmount, setAdmissionFeeAmount] = useState<string>("");
  const [salaryAmount, setSalaryAmount] = useState<string>("");

  // ডিফল্ট জামাত তালিকা এবং কাস্টম জামাত যোগের অপশন
  // ডিফল্ট জামাত তালিকা (ব্যবহারকারীর নির্দেশনা অনুযায়ী নূরানী ও কিতাব জামাতসমূহ)
  const DEFAULT_JAMATS = [
    // নূরানী বিভাগ
    "শিশু শ্রেণি",
    "নার্সারি",
    "প্রথম শ্রেণি",
    "দ্বিতীয় শ্রেণি",
    "তৃতীয় শ্রেণি",
    "চতুর্থ শ্রেণি",
    "পঞ্চম শ্রেণি",
    // হিফজ ও নাজেরা বিভাগ
    "নাজেরা বিভাগ",
    "হিফজুল কুরআন",
    // কওমি কিতাব বিভাগ (সুনির্দিষ্ট ৮টি জামাত)
    "মিজান",
    "নাহবেমির",
    "হেদায়াতুন্নাহু",
    "কাফিয়া",
    "শরহে বেকায়া",
    "জালালাইন",
    "মেশকাত",
    "দাওরা",
  ];

  const [jamatOptions, setJamatOptions] = useState<string[]>(() => {
    const list = [...DEFAULT_JAMATS];
    // Filter out old/redundant names if any
    const banned = ["নাজেরা বিভাগ", "শিশু শ্রেণি", "মিজান", "মক্তব বিভাগ", "কিতাব বিভাগ"];
    classes.forEach(c => {
      if (!list.includes(c.name) && !banned.includes(c.name)) {
        list.push(c.name);
      }
    });
    return list;
  });
  const [jamatName, setJamatName] = useState<string>("হিফজুল কুরআন");
  const [showAddJamatModal, setShowAddJamatModal] = useState<boolean>(false);
  const [newJamatInput, setNewJamatInput] = useState<string>("");

  const [khorakiType, setKhorakiType] = useState<"নিজ খোরাকী" | "হাফ ফ্রি" | "ফুল ফ্রি">("নিজ খোরাকী");
  const [residentialType, setResidentialType] = useState<"আবাসিক" | "অনাবাসিক">("আবাসিক");
  const [studentStatus, setStudentStatus] = useState<"নতুন" | "পুরাতন">("নতুন");
  const [isOrphan, setIsOrphan] = useState<"না" | "এতিম">("না");
  const [eatingAtBoarding, setEatingAtBoarding] = useState<"না" | "হ্যাঁ">("হ্যাঁ");
  const [khanaFeeAmount, setKhanaFeeAmount] = useState<string>("");
  const [batchType, setBatchType] = useState<"মর্নিং" | "ডে" | "নাইট">("মর্নিং");
  const [classStartTime, setClassStartTime] = useState("");
  const [classEndTime, setClassEndTime] = useState("");
  const [remarks, setRemarks] = useState("");
  
  // নতুন ৫টি প্রয়োজনীয় অপশন স্টেট (সাহাদাত ভাইয়ের নির্দেশনা অনুযায়ী)
  const [birthCertificateNo, setBirthCertificateNo] = useState("");
  const [guardianNid, setGuardianNid] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [studentCategory, setStudentCategory] = useState<string>("সাধারণ শিক্ষার্থী");
  const [previousMadrasa, setPreviousMadrasa] = useState("");
  const [previousTcInfo, setPreviousTcInfo] = useState("");
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string>("");
  const newStudentPhotoInputRef = useRef<HTMLInputElement>(null);

  // বর্তমান ও স্থায়ী ঠিকানা এক হলে অটো কপি করা
  const handleSameAddressToggle = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      setPermanentAddress(presentAddress);
    }
  };

  const handlePresentAddressChange = (val: string) => {
    setPresentAddress(val);
    if (sameAddress) {
      setPermanentAddress(val);
    }
  };

  // ছবি পরিবর্তন হ্যান্ডলার
  const handlePhotoClick = (studentId: string) => {
    setSelectedStudentForPhoto(studentId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStudentForPhoto) {
      const imageUrl = URL.createObjectURL(file);
      setStudentList(prev => prev.map(s => s.id === selectedStudentForPhoto ? { ...s, photoUrl: imageUrl } : s));
      setSuccessMessage("ছবি সফলভাবে আপলোড এবং প্রোফাইলে সংযুক্ত হয়েছে!");
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  // ছাত্র মুছে ফেলা
  const confirmDelete = () => {
    if (deletingStudent) {
      setStudentList(prev => prev.filter(s => s.id !== deletingStudent.id));
      setSuccessMessage(`${deletingStudent.name}-এর রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!`);
      setDeletingStudent(null);
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  // হোয়াটসঅ্যাপ ফোন নম্বর ফরম্যাট (বাংলাদেশি নম্বরে 88 যুক্ত করা)
  const formatWhatsAppPhone = (phoneStr: string): string => {
    let digits = (phoneStr || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("0")) {
      digits = `88${digits}`;
    } else if (!digits.startsWith("88") && digits.length === 10) {
      digits = `880${digits}`;
    }
    return digits;
  };

  // হোয়াটসঅ্যাপে ফ্রি মেসেজ ওপেন করা
  const openWhatsAppMessage = (phoneStr: string, text: string) => {
    const cleanPhone = formatWhatsAppPhone(phoneStr);
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
  };

  // এসএমএস ও হোয়াটসঅ্যাপ মডাল ওপেন
  const handleOpenSmsModal = (student: ExtendedStudent) => {
    setSmsStudent(student);
    setSmsMessage(`আসসালামু আলাইকুম, সম্মানিত অভিভাবক, জামিয়া ইসলামিয়া আরাবিয়া মাদরাসা থেকে আপনার সন্তান ${student.name}-এর ব্যাপারে যোগাযোগ করা হচ্ছে।`);
  };

  // সাধারণ এসএমএস পাঠানো
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsStudent || !smsMessage.trim()) return;
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      setSuccessMessage(`অভিভাবকের মোবাইল (${smsStudent.guardianPhone})-এ সফলভাবে এসএমএস পাঠানো হয়েছে!`);
      setSmsStudent(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    }, 1000);
  };

  // নতুন ছাত্র সংরক্ষণ
  const handleSubmitAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("অনুগ্রহ করে ছাত্রের নাম লিখুন!");
      return;
    }

    const matchedClass = classes.find((c) => c.name.includes(jamatName)) || classes[0];
    const generatedRoll = admissionNumber.trim() || `${studentList.length + 1}`.padStart(2, "0");
    const newStudentId = `${studentList.length + 1}`;

    const newStudent: ExtendedStudent = {
      id: newStudentId,
      roll: generatedRoll,
      name,
      englishName: name,
      birthDate: birthDate || "2017-05-15",
      bloodGroup: bloodGroup || "O+",
      classId: matchedClass?.id || "cls_1",
      className: jamatName,
      section: matchedClass?.sections[0] || "শাখা ক",
      status: residentialType === "আবাসিক" ? "residential" : "non_residential",
      admissionDate: admissionDate || "13 Dec 2025",
      guardianName: guardianName || fatherName || "অভিভাবক",
      email: guardianEmail || "N/A",
      guardianPhone: guardianPhone || "০১৭১১০০০০০০",
      guardianPin: `${Math.floor(1000 + Math.random() * 9000)}`,
      emergencyPhone: emergencyPhone || guardianPhone,
      emergencyContactName: emergencyContactName || guardianName,
      emergencyContactRelation: emergencyContactRelation || "অভিভাবক",
      birthCertificateNo,
      guardianNid,
      studentCategory,
      previousMadrasa,
      previousTcInfo,
      fatherName,
      motherName,
      fatherOccupation,
      guardianRelation,
      presentAddress,
      permanentAddress,
      address: presentAddress || "ঢাকা, বাংলাদেশ",
      monthlyFee: Number(salaryAmount) || 500,
      khanaFee: Number(khanaFeeAmount) || 0,
      dueAmount: 0,
      batchType,
      classTime: classStartTime && classEndTime ? `${classStartTime} - ${classEndTime}` : "9:01 AM - 12:30 PM",
      barcode: newStudentId,
      photoUrl: studentPhotoUrl || ""
    };

    setStudentList([newStudent, ...studentList]);
    onAddNewStudent(newStudent);
    setSuccessMessage(`আলহামদুলিল্লাহ! ${name}-এর ভর্তি সফলভাবে সম্পন্ন হয়েছে।`);
    setActiveTab("list");
    setTimeout(() => setSuccessMessage(""), 5000);

    // ফরম ক্লিয়ার
    setName("");
    setBirthDate("");
    setBloodGroup("");
    setFatherName("");
    setMotherName("");
    setFatherOccupation("");
    setGuardianName("");
    setGuardianPhone("");
    setGuardianRelation("");
    setGuardianEmail("");
    setPresentAddress("");
    setPermanentAddress("");
    setSameAddress(false);
    setFormNumber("");
    setAdmissionNumber("");
    setAdmissionFeeAmount("");
    setSalaryAmount("");
    setKhanaFeeAmount("");
    setClassStartTime("");
    setClassEndTime("");
    setRemarks("");
    setBirthCertificateNo("");
    setGuardianNid("");
    setEmergencyPhone("");
    setEmergencyContactName("");
    setEmergencyContactRelation("");
    setStudentCategory("সাধারণ শিক্ষার্থী");
    setPreviousMadrasa("");
    setPreviousTcInfo("");
    setStudentPhotoUrl("");
  };

  // বাংলা ও ইংরেজি সংখ্যার স্বাভাবিকীকরণ (যাতে ১২ বা 12 যাই লিখুক সার্চ কাজ করে)
  const normalizeDigits = (str: string) => {
    return (str || "")
      .replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString())
      .toLowerCase();
  };

  // ফিল্টার করা তালিকা (ছাত্রের নাম, ইংরেজি নাম, রোল, ফোন, জামাত, অভিভাবকের নাম ইত্যাদি দিয়ে ইনস্ট্যান্ট সার্চ)
  const filteredStudents = studentList.filter((s) => {
    if (selectedJamatForList && selectedJamatForList !== "সকল জামাত") {
      const jMatch = (s.className && s.className.toLowerCase().includes(selectedJamatForList.toLowerCase())) ||
                     (selectedJamatForList.toLowerCase().includes(s.className?.toLowerCase() || ""));
      if (!jMatch) return false;
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const qNorm = normalizeDigits(q);

    const nameMatch = (s.name && s.name.toLowerCase().includes(q)) || 
                      (s.englishName && s.englishName.toLowerCase().includes(q));
    const rollMatch = (s.roll && (s.roll.toLowerCase().includes(q) || normalizeDigits(s.roll).includes(qNorm))) ||
                      (s.id && (s.id.toLowerCase().includes(q) || normalizeDigits(s.id).includes(qNorm)));
    const phoneMatch = s.guardianPhone && (s.guardianPhone.includes(q) || normalizeDigits(s.guardianPhone).includes(qNorm));
    const classMatch = s.className && s.className.toLowerCase().includes(q);
    const guardianMatch = (s.guardianName && s.guardianName.toLowerCase().includes(q)) ||
                          (s.fatherName && s.fatherName.toLowerCase().includes(q));
    const emailMatch = s.email && s.email.toLowerCase().includes(q);

    return nameMatch || rollMatch || phoneMatch || classMatch || guardianMatch || emailMatch;
  });

  // জামাত অনুসারে ফিল্টার করা ছাত্র তালিকা (স্ক্রিনশটের হুবহু অনুযায়ী)
  const jamatCardStudents = studentList.filter(s => {
    if (selectedJamatForCards === "সকল জামাত") return true;
    return s.className?.toLowerCase().includes(selectedJamatForCards.toLowerCase()) ||
           selectedJamatForCards.toLowerCase().includes(s.className?.toLowerCase() || "");
  });

  return (
    <div className="space-y-6">
      {/* হিডেন ফাইল ইনপুট ছবি আপলোডের জন্য */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* সাকসেস মেসেজ */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* শীর্ষ নেভিগেশন ও হেডার বার (হুবহু স্ক্রিনশটের মতো ফিরে যান, শিরোনাম ও প্রিন্ট করুন) */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "edit") {
                setActiveTab("list");
              } else if (onBack) {
                onBack();
              }
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="পেছনে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5 text-teal-700" />
            <span className="hidden sm:inline">ফিরে যান</span>
          </button>
        </div>

        {/* মাঝখানে অপশনের নাম ও সাবটাইটেল */}
        <div className="text-center flex-1 px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {activeTab === "by_jamat" ? "জামাত অনুসারে ছাত্র/ছাত্রী" :
             activeTab === "form" ? "নতুন ছাত্র/ছাত্রী ভর্তি ফরম" :
             activeTab === "edit" ? "ছাত্র/ছাত্রীর তথ্য সংশোধন ও এডিট" : "সকল ছাত্র/ছাত্রী তালিকা"}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {activeTab === "by_jamat" ? "শ্রেণিভিত্তিক শিক্ষার্থী তালিকা ও বিস্তারিত পরিসংখ্যান" :
             activeTab === "form" ? "মাদ্রাসার নতুন শিক্ষার্থী ভর্তি ও পূর্ণাঙ্গ প্রোফাইল এন্ট্রি" :
             activeTab === "edit" ? "প্রোফাইল আপডেট ও পরিবর্তন সংরক্ষণ" : (madrasa?.name || "মাদরাসা ম্যানেজমেন্ট")}
          </p>
        </div>

        {/* প্রিন্ট বোতাম */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-[#1b686e] hover:bg-[#135156] text-white text-xs font-bold transition-all shadow-md shadow-teal-900/20 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* ১. হুবহু স্ক্রিনশট অনুরূপ ২-কলাম ভর্তি ফরম (ছাত্র/ছাত্রী তৈরি) */}
      {/* ========================================================================= */}
      {activeTab === "form" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* কার্ডের শীর্ষ হেডার ব্যানার (স্ক্রিনশটের মতো ডার্ক টিল ব্যাকগ্রাউন্ড) */}
          <div className="bg-[#1b686e] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserPlus className="w-5 h-5 text-teal-200" />
              <h3 className="text-sm sm:text-base font-bold tracking-wide">
                নতুন ছাত্র/ছাত্রী যুক্ত করুন
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                ছাত্র/ছাত্রী লিস্ট দেখুন
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAdmission} className="p-5 sm:p-7 space-y-5">
            {/* ছাত্রের পাসপোর্ট সাইজ ছবি আপলোড */}
            <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-dashed border-teal-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-teal-500/30 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
                  {studentPhotoUrl ? (
                    <img src={studentPhotoUrl} alt="Student Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-600" />
                    <span>ছাত্রের পাসপোর্ট সাইজ ছবি (ঐচ্ছিক)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ছবি আপলোড করলে আইডি কার্ড, রসিদ ও অ্যাডমিট কার্ডে স্বয়ংক্রিয়ভাবে বসে যাবে
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={newStudentPhotoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setStudentPhotoUrl(url);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => newStudentPhotoInputRef.current?.click()}
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{studentPhotoUrl ? "ছবি পরিবর্তন" : "ছবি আপলোড করুন"}</span>
                </button>
                {studentPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setStudentPhotoUrl("")}
                    className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="ছবি মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              
              {/* ======================= বাম কলাম ======================= */}
              <div className="space-y-3.5">
                {/* ১. ছাত্রের নাম * */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ছাত্রের পূর্ণ নাম লিখুন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                    <Keyboard className="w-4 h-4 text-rose-500/80 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* ২. ছাত্রের জন্ম তারিখ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের জন্ম তারিখ <span className="text-slate-400 font-normal text-[11px]">(দিন/মাস/বছর)</span>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="ছাত্রের জন্ম তারিখ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ২.১ ছাত্রের জন্ম নিবন্ধন (BRN) নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের জন্ম নিবন্ধন নম্বর (BRN) <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক - ১৭ ডিজিট)</span>
                  </label>
                  <input
                    type="text"
                    value={birthCertificateNo}
                    onChange={(e) => setBirthCertificateNo(e.target.value)}
                    placeholder="যেমন: ২০০৮২৬৯২৫১০১২৩৪৫৬"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৩. রক্তের গ্রুপ (যদি জানা থাকে) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    রক্তের গ্রুপ (যদি জানা থাকে)
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* ৪. পিতার নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="ছাত্রের পিতার নাম লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৫. মাতার নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="ছাত্রের মাতার নাম লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৬. পিতার পেশা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতার পেশা
                  </label>
                  <input
                    type="text"
                    value={fatherOccupation}
                    onChange={(e) => setFatherOccupation(e.target.value)}
                    placeholder="ছাত্রের পিতার পেশা লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৬.১ পিতা/অভিভাবকের NID নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতা/অভিভাবকের NID নম্বর <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক - ১০ বা ১৭ ডিজিট)</span>
                  </label>
                  <input
                    type="text"
                    value={guardianNid}
                    onChange={(e) => setGuardianNid(e.target.value)}
                    placeholder="যেমন: ১৯৮২৫০১২৩৪৫৬৭৮৯০১"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৭. অভিভাবকের নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    অভিভাবকের নাম
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="অভিভাবকের নাম লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮. মোবাইল নম্বর (অভিভাবকের) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    মোবাইল নম্বর (অভিভাবকের)
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="অভিভাবকের মোবাইল নম্বর লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮.১ জরুরি / বিকল্প অভিভাবকের মোবাইল নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    জরুরি / বিকল্প মোবাইল নম্বর <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="যেমন: ০১৭১২-৩৪৫৬৭৮"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮.২ বিকল্প অভিভাবকের নাম ও সম্পর্ক */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      বিকল্প ব্যক্তির নাম
                    </label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="যেমন: মোঃ জসিম উদ্দিন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      সম্পর্ক
                    </label>
                    <input
                      type="text"
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                      placeholder="যেমন: চাচা / মামা / বড় ভাই"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* ৯. অভিভাবকের সাথে ছাত্রের সম্পর্ক */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    অভিভাবকের সাথে ছাত্রের সম্পর্ক
                  </label>
                  <input
                    type="text"
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    placeholder="অভিভাবকের সাথে ছাত্রের সম্পর্ক"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১০. ই-মেইল (যদি থাকে) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ই-মেইল (যদি থাকে)
                  </label>
                  <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="অভিভাবকের ই-মেইল লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১১. বর্তমান ঠিকানা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    বর্তমান ঠিকানা
                  </label>
                  <textarea
                    rows={2}
                    value={presentAddress}
                    onChange={(e) => handlePresentAddressChange(e.target.value)}
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১২. স্থায়ী ঠিকানা + [X] বর্তমান ঠিকানার অনুরূপ */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 font-bold">
                      স্থায়ী ঠিকানা
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium ml-2">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={(e) => handleSameAddressToggle(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                      />
                      <span>বর্তমান ঠিকানার অনুরূপ</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* ======================= ডান কলাম ======================= */}
              <div className="space-y-3.5">
                {/* ১. ভর্তি তারিখ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ভর্তি তারিখ <span className="text-slate-400 font-normal text-[11px]">(দিন/মাস/বছর)</span>
                  </label>
                  <input
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    placeholder="ছাত্রের জন্ম তারিখ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ২. ফরম নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ফরম নম্বর
                  </label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="ভর্তি ফরম নম্বর লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৩. ভর্তি নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ভর্তি নম্বর
                  </label>
                  <input
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="ভর্তি নম্বর লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৪. ভর্তি ফি / এককালীন ফি */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ভর্তি ফি / এককালীন ফি
                  </label>
                  <input
                    type="text"
                    value={admissionFeeAmount}
                    onChange={(e) => setAdmissionFeeAmount(e.target.value)}
                    placeholder="ভর্তি ফির পরিমাণ লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৫. জামাতের নাম (তীর অপশনসহ ড্রপডাউন ও [+] নতুন জামাত যোগ করার বাটন) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-800 font-bold">
                      জামাতের নাম <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddJamatModal(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded transition-all"
                      title="নতুন জামাত তৈরি করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন জামাত</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={jamatName}
                        onChange={(e) => setJamatName(e.target.value)}
                        className="w-full appearance-none px-3 py-2 pr-9 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 cursor-pointer shadow-xs"
                      >
                        <option value="" disabled>জামাত নির্বাচন করুন</option>
                        {jamatOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {/* তীর অপশন (ChevronDown) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {/* [+] অ্যাড বাটন (স্যাররা চাইলে নতুন জামাত যুক্ত করতে পারবে) */}
                    <button
                      type="button"
                      onClick={() => setShowAddJamatModal(true)}
                      title="নতুন জামাত যোগ করুন"
                      className="w-9 h-9 shrink-0 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-md flex items-center justify-center transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ৬. টাইপ নির্ধারণ করুন (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    টাইপ নির্ধারণ করুন
                  </label>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="khorakiType"
                        value="নিজ খোরাকী"
                        checked={khorakiType === "নিজ খোরাকী"}
                        onChange={() => setKhorakiType("নিজ খোরাকী")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>নিজ খোরাকী</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="khorakiType"
                        value="হাফ ফ্রি"
                        checked={khorakiType === "হাফ ফ্রি"}
                        onChange={() => setKhorakiType("হাফ ফ্রি")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>হাফ ফ্রি</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="khorakiType"
                        value="ফুল ফ্রি"
                        checked={khorakiType === "ফুল ফ্রি"}
                        onChange={() => setKhorakiType("ফুল ফ্রি")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>ফুল ফ্রি</span>
                    </label>
                  </div>
                </div>

                {/* ৭. আবাসিক / অনাবাসিক (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    আবাসিক / অনাবাসিক
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="residentialType"
                        value="আবাসিক"
                        checked={residentialType === "আবাসিক"}
                        onChange={() => setResidentialType("আবাসিক")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>আবাসিক</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="residentialType"
                        value="অনাবাসিক"
                        checked={residentialType === "অনাবাসিক"}
                        onChange={() => setResidentialType("অনাবাসিক")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>অনাবাসিক</span>
                    </label>
                  </div>
                </div>

                {/* ৮. নতুন / পুরাতন (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    নতুন / পুরাতন
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="studentStatus"
                        value="নতুন"
                        checked={studentStatus === "নতুন"}
                        onChange={() => setStudentStatus("নতুন")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>নতুন</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="studentStatus"
                        value="পুরাতন"
                        checked={studentStatus === "পুরাতন"}
                        onChange={() => setStudentStatus("পুরাতন")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>পুরাতন</span>
                    </label>
                  </div>
                </div>

                {/* ৯. ছাত্র / ছাত্রী টি কি এতিম ? (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    ছাত্র / ছাত্রী টি কি এতিম ?
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="isOrphan"
                        value="না"
                        checked={isOrphan === "না"}
                        onChange={() => setIsOrphan("না")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>না</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="isOrphan"
                        value="এতিম"
                        checked={isOrphan === "এতিম"}
                        onChange={() => setIsOrphan("এতিম")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>এতিম</span>
                    </label>
                  </div>
                </div>

                {/* ১০. বোর্ডিং এ খানা খায়? (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    বোর্ডিং এ খানা খায়?
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="eatingAtBoarding"
                        value="না"
                        checked={eatingAtBoarding === "না"}
                        onChange={() => setEatingAtBoarding("না")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>না</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="eatingAtBoarding"
                        value="হ্যাঁ"
                        checked={eatingAtBoarding === "হ্যাঁ"}
                        onChange={() => setEatingAtBoarding("হ্যাঁ")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>হ্যাঁ</span>
                    </label>
                  </div>
                </div>

                {/* ১০.১ শিক্ষার্থীর ক্যাটাগরি / বিশেষ সুবিধা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    শিক্ষার্থীর ক্যাটাগরি / বিশেষ সুবিধা
                  </label>
                  <select
                    value={studentCategory}
                    onChange={(e) => setStudentCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 cursor-pointer"
                  >
                    <option value="সাধারণ শিক্ষার্থী">সাধারণ শিক্ষার্থী</option>
                    <option value="এতিম শিক্ষার্থী (লিল্লাহ ফান্ড)">এতিম শিক্ষার্থী (লিল্লাহ ফান্ড)</option>
                    <option value="দরিদ্র / বিশেষ ছাড়">দরিদ্র / বিশেষ ছাড়</option>
                    <option value="মেধা বৃত্তিপ্রাপ্ত">মেধা বৃত্তিপ্রাপ্ত</option>
                    <option value="হাফেজ / বিশেষ শিক্ষার্থী">হাফেজ / বিশেষ শিক্ষার্থী</option>
                  </select>
                </div>

                {/* ১১. মাসিক বেতন ও মাসিক খানার টাকার পরিমাণ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* মাসিক বেতন / টিউশন ফি */}
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      মাসিক বেতন <span className="text-teal-700 text-xs font-normal">(অনাবাসিক ও আবাসিক)</span>
                    </label>
                    <input
                      type="text"
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(e.target.value)}
                      placeholder="মাসিক বেতনের পরিমাণ লিখুন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>

                  {/* মাসিক খানার টাকার পরিমাণ */}
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      মাসিক খানার টাকার পরিমাণ <span className="text-slate-500 text-xs font-normal">({eatingAtBoarding === "হ্যাঁ" ? "বোর্ডিং খানা ফি" : "অনাবাসিক (ঐচ্ছিক)"})</span>
                    </label>
                    <input
                      type="text"
                      value={khanaFeeAmount}
                      onChange={(e) => setKhanaFeeAmount(e.target.value)}
                      placeholder={eatingAtBoarding === "হ্যাঁ" ? "মাসিক খানার টাকার পরিমাণ লিখুন" : "অনাবাসিক (০ টাকা)"}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* ১২. ব্যাচ টাইপ (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    ব্যাচ টাইপ
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="batchType"
                        value="মর্নিং"
                        checked={batchType === "মর্নিং"}
                        onChange={() => setBatchType("মর্নিং")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>মর্নিং</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="batchType"
                        value="ডে"
                        checked={batchType === "ডে"}
                        onChange={() => setBatchType("ডে")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>ডে</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="batchType"
                        value="নাইট"
                        checked={batchType === "নাইট"}
                        onChange={() => setBatchType("নাইট")}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>নাইট</span>
                    </label>
                  </div>
                </div>

                {/* ১৩. ক্লাস শুরুর সময় */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ক্লাস শুরুর সময়
                  </label>
                  <input
                    type="time"
                    value={classStartTime}
                    onChange={(e) => setClassStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১৪. ক্লাস শেষের সময় */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ক্লাস শেষের সময়
                  </label>
                  <input
                    type="time"
                    value={classEndTime}
                    onChange={(e) => setClassEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১৪.১ পূর্ববর্তী শিক্ষা প্রতিষ্ঠান ও ছাড়পত্র (TC) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      বিগত মাদরাসা / স্কুল <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      value={previousMadrasa}
                      onChange={(e) => setPreviousMadrasa(e.target.value)}
                      placeholder="যেমন: দারুল উলুম মাদরাসা"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      ছাড়পত্র (TC) নম্বর / তথ্য <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      value={previousTcInfo}
                      onChange={(e) => setPreviousTcInfo(e.target.value)}
                      placeholder="যেমন: টিসি নং-১২৩৪"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* ১৫. নোট/মন্তব্য */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    নোট/মন্তব্য
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="ছাত্র সম্পর্কে মন্তব্য লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* সাবমিট বাটন বার */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setName("");
                  setGuardianPhone("");
                  setPresentAddress("");
                  setPermanentAddress("");
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
              >
                রিসেট
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#1b686e] hover:bg-[#135156] text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-teal-900/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ২. হুবহু স্ক্রিনশট অনুরূপ ছাত্র/ছাত্রী লিস্ট */}
      {/* ========================================================================= */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* কার্ড হেডার (স্ক্রিনশটের হুবহু অনুযায়ী) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                ছাত্র/ছাত্রী লিস্ট
              </h2>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setActiveTab("form")}
                className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ নতুন ছাত্র/ছাত্রী যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* টেবিল কন্ট্রোল বার (Show entries, জামাত লিস্ট ও Search ফিল্ড) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* জামাত ড্রপডাউন ফিল্টার */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-bold whitespace-nowrap">জামাত লিস্ট:</span>
                <select
                  value={selectedJamatForList}
                  onChange={(e) => setSelectedJamatForList(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map((j) => (
                    <option key={j} value={j}>{cleanClassName(j)}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-600 font-medium">Search:</span>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ছাত্রের নাম বা আইডি লিখুন..."
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
                    <th className="py-3 px-4 font-bold">ব্যাচ নং, বিষয়, সময়</th>
                    <th className="py-3 px-4 font-bold">একাউন্ট সংক্ষিপ্তসার</th>
                    <th className="py-3 px-4 font-bold text-center w-28">বিস্তারিত</th>
                    <th className="py-3 px-4 font-bold text-center w-24">মুছুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="w-9 h-9 text-slate-300" />
                          <p className="text-sm font-bold text-slate-700">
                            "{searchQuery}" দিয়ে কোনো ছাত্র/ছাত্রী খুঁজে পাওয়া যায়নি!
                          </p>
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-teal-700 font-bold underline"
                          >
                            সব ছাত্রের তালিকা দেখুন
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.slice(0, entriesPerPage).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* ১. ছবি কলাম */}
                      <td className="py-4 px-4 text-center align-top">
                        <div className="flex flex-col items-center">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                              <Users className="w-7 h-7" />
                            </div>
                          )}

                          {/* ছবি আপলোড হলুদ বাটন (স্ক্রিনশটের অনুরূপ) */}
                          <button
                            type="button"
                            onClick={() => handlePhotoClick(student.id)}
                            className="mt-2 px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-[11px] rounded shadow-xs flex items-center gap-1 transition-colors"
                          >
                            <Camera className="w-3 h-3 text-slate-900" />
                            <span>ছবি</span>
                          </button>
                        </div>
                      </td>

                      {/* ২. বিবরণ কলাম */}
                      <td className="py-4 px-4 align-top space-y-0.5 leading-relaxed">
                        <div className="font-bold text-slate-950 flex items-center justify-between">
                          <span><span className="text-slate-600 font-medium">নাম: </span>{student.name}</span>
                          {student.studentCategory && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              {student.studentCategory}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">জন্ম তারিখ: </span>{formatDateToDMY(student.birthDate) || "20/04/2017"}
                        </div>
                        {student.birthCertificateNo && (
                          <div className="text-[11px] text-slate-700">
                            <span className="text-slate-500">জন্ম নিবন্ধন: </span>
                            <span className="font-mono text-slate-900">{student.birthCertificateNo}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">রক্তের গ্রুপ: </span>
                          <span className="font-bold text-slate-900">{student.bloodGroup || "O+"}</span>
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">আইডি: </span>
                          <span className="font-mono font-bold text-slate-900">{student.roll || student.id}</span>
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">ভর্তি তারিখ: </span>{formatDateToDMY(student.admissionDate) || "13/12/2025"}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">অভিভাবকের নাম: </span>{student.guardianName || "পলাশ মিয়া"}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">ই-মেইল: </span>{student.email || "N/A"}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="text-slate-500">অভিভাবকের ফোন: </span>
                          <span className="font-mono font-semibold text-slate-900">{student.guardianPhone}</span>
                        </div>
                        {student.emergencyPhone && student.emergencyPhone !== student.guardianPhone && (
                          <div className="text-[11px] text-slate-700">
                            <span className="text-slate-500">জরুরি ফোন: </span>
                            <span className="font-mono font-semibold text-slate-900">{student.emergencyPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* ৩. ব্যাচ নং, বিষয়, সময় কলাম */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="text-slate-800">
                          <span className="text-slate-500 font-medium">জামাত: </span>
                          <span className="font-bold text-slate-900">{student.className}</span>
                        </div>
                        <div className="text-slate-800 text-[11px]">
                          <span className="text-slate-500 font-medium">ব্যাচ টাইপ: </span>
                          <span>{student.batchType || "মর্নিং"}</span>
                        </div>
                        <div className="text-slate-800 text-[11px]">
                          <span className="text-slate-500 font-medium">সময়: </span>
                          <span className="font-mono">{student.classTime || "9:01 AM - 12:30 PM"}</span>
                        </div>
                      </td>

                      {/* ৪. একাউন্ট সংক্ষিপ্তসার কলাম */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="text-slate-800">
                          <span className="text-slate-500 font-medium">বেতন: </span>
                          <span className="font-mono font-bold text-slate-900">৳ {student.monthlyFee.toLocaleString("bn-BD")}</span>
                        </div>
                        <div className="text-slate-800 text-[11px]">
                          <span className="text-slate-500 font-medium">খানা খরচ: </span>
                          <span className="font-mono font-bold text-slate-900">৳ {(student.khanaFee || 0).toLocaleString("bn-BD")}</span>
                        </div>
                      </td>

                      {/* ৫. বিস্তারিত ও এসএমএস কলাম (স্ট্যাকড বাটন) */}
                      <td className="py-4 px-4 align-top text-center">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingStudent(student)}
                            className="w-full px-3 py-1.5 bg-[#1b686e] hover:bg-[#135156] text-white rounded font-bold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>বিস্তারিত</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenSmsModal(student)}
                            className="w-full px-2 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded font-bold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="অভিভাবককে ফ্রি WhatsApp মেসেজ পাঠান"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>

                      {/* ৬. মুছুন কলাম */}
                      <td className="py-4 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => setDeletingStudent(student)}
                          className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded font-bold text-[11px] shadow-xs flex items-center justify-center gap-1 transition-colors mx-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
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

      {/* ========================================================================= */}
      {/* ৩. জামাত অনুসারে ছাত্র/ছাত্রী লিস্ট (কার্ড গ্রিড - স্ক্রিনশট media_1790432893896.png অনুযায়ী) */}
      {/* ========================================================================= */}
      {activeTab === "by_jamat" && (
        <div className="space-y-4">
          {/* ফিল্টার কন্ট্রোল বার (জামাত লিস্ট ড্রপডাউন ও নতুন ছাত্র যুক্ত বাটন) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            {/* বামে জামাত ড্রপডাউন */}
            <div className="w-full sm:w-80">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                জামাত লিস্ট
              </label>
              <div className="relative">
                <select
                  value={selectedJamatForCards}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedJamatForCards(val);
                    const count = val === "সকল জামাত" 
                      ? studentList.length 
                      : studentList.filter(s => s.className?.toLowerCase().includes(val.toLowerCase())).length;
                    setJamatToastMsg(`সফল! ${count} জন ছাত্র/ছাত্রী পাওয়া গেছে`);
                    setTimeout(() => setJamatToastMsg(""), 3500);
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map(j => (
                    <option key={j} value={j}>{cleanClassName(j)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* ডানে নতুন ছাত্র যুক্ত বাটন ও ছাত্র কাউন্ট */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ নতুন ছাত্র/ছাত্রী যুক্ত করুন</span>
              </button>
              <span className="text-xs font-bold text-slate-700">
                ছাত্র/ছাত্রী: {jamatCardStudents.length} জন
              </span>
            </div>

            {/* টপ রাইট নোটিফিকেশন টোস্ট (স্ক্রিনশটের হুবহু অনুযায়ী) */}
            {jamatToastMsg && (
              <div className="absolute -top-12 right-0 sm:right-4 bg-white border border-emerald-300 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2 z-20 animate-in fade-in slide-in-from-top-2">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <div>
                  <span className="text-xs font-bold text-emerald-700 block leading-tight">সফল!</span>
                  <span className="text-[11px] text-slate-600 font-medium leading-tight">{jamatToastMsg}</span>
                </div>
              </div>
            )}
          </div>

          {/* স্টুডেন্ট কার্ড গ্রিড (স্ক্রিনশটের হুবহু অনুযায়ী) */}
          {jamatCardStudents.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                এই জামাতে কোনো ছাত্র/ছাত্রী খুঁজে পাওয়া যায়নি!
              </p>
              <button
                type="button"
                onClick={() => setSelectedJamatForCards("সকল জামাত")}
                className="text-xs font-bold text-teal-700 underline"
              >
                সকল জামাতের ছাত্র দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {jamatCardStudents.map((student, idx) => {
                // স্ক্রিনশটের মতো আকর্ষণীয় টপ বর্ডার কালার রোটেশন
                const borderColors = [
                  "border-t-emerald-600",
                  "border-t-slate-700",
                  "border-t-emerald-500",
                  "border-t-sky-500",
                  "border-t-amber-500",
                  "border-t-rose-500",
                  "border-t-indigo-600",
                  "border-t-teal-600"
                ];
                const topBorderColor = borderColors[idx % borderColors.length];

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl border border-slate-200/90 border-t-4 ${topBorderColor} shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between text-center space-y-3`}
                  >
                    {/* প্রোফাইল অবতার */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-slate-200 overflow-hidden flex items-center justify-center bg-slate-100 shadow-xs">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1" title={student.name}>
                        {student.name}
                      </h4>
                    </div>

                    {/* বিবরণী: নাম, জামাতের নাম, ফোন নাম্বার (উপরে) এবং ঠিকানা (নিচে) */}
                    <div className="text-[11px] space-y-1 text-slate-600 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="truncate">
                        <span className="font-semibold text-slate-700">জামাত:</span> {student.className || "মক্তব"}
                      </p>
                      <p className="truncate">
                        <span className="font-semibold text-slate-700">ফোন:</span> {student.guardianPhone || student.phone || "০১৭১১০০০০০০"}{" "}
                        <span className="text-slate-400">({student.guardianRelation || "অভিভাবক"})</span>
                      </p>
                      <p className="truncate" title={student.presentAddress || student.address || student.permanentAddress || "ঠিকানা দেওয়া হয়নি"}>
                        <span className="font-semibold text-slate-700">ঠিকানা:</span> {student.presentAddress || student.address || student.permanentAddress || "ঠিকানা দেওয়া হয়নি"}
                      </p>
                    </div>

                    {/* নিচের দুটি বাটন: [ View ] এবং [ Delete ] */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setViewingStudent(student)}
                        className="py-1.5 px-3 bg-[#1b686e] hover:bg-[#135156] text-white rounded text-xs font-bold transition-colors shadow-xs"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingStudent(student)}
                        className="py-1.5 px-3 bg-[#e11d48] hover:bg-[#be123c] text-white rounded text-xs font-bold transition-colors shadow-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৪. হুবহু স্ক্রিনশট অনুরূপ ২-কলাম ছাত্র/ছাত্রী তথ্য সম্পাদনা (media_1790432896448.png) */}
      {/* ========================================================================= */}
      {activeTab === "edit" && editingStudent && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
          {/* কার্ডের শীর্ষ হেডার ব্যানার (স্ক্রিনশটের মতো ডার্ক টিল ব্যাকগ্রাউন্ড) */}
          <div className="bg-[#1b686e] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Edit3 className="w-5 h-5 text-teal-200" />
              <h3 className="text-sm sm:text-base font-bold tracking-wide">
                ছাত্র/ছাত্রী তথ্য সম্পাদনা
              </h3>
            </div>
            <button
              type="button"
              onClick={() => { setEditingStudent(null); setActiveTab("list"); }}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>ফিরে যান / বাতিল</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStudentList(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
              setSuccessMessage(`আলহামদুলিল্লাহ! ${editingStudent.name}-এর তথ্য সফলভাবে হালনাগাদ করা হয়েছে।`);
              setEditingStudent(null);
              setActiveTab("list");
              setTimeout(() => setSuccessMessage(""), 4000);
            }}
            className="p-5 sm:p-7 space-y-5"
          >
            {/* এডিট মোডে ছাত্রের ছবি আপলোড / পরিবর্তন */}
            <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-dashed border-teal-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-teal-500/30 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
                  {editingStudent.photoUrl ? (
                    <img src={editingStudent.photoUrl} alt={editingStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-600" />
                    <span>ছাত্রের পাসপোর্ট সাইজ ছবি</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ছবি পরিবর্তন বা আপলোড করতে ডানপাশের বাটনে ক্লিক করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="edit-student-photo-input"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setEditingStudent({ ...editingStudent, photoUrl: url });
                    }
                  }}
                />
                <label
                  htmlFor="edit-student-photo-input"
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingStudent.photoUrl ? "ছবি পরিবর্তন" : "ছবি যুক্ত করুন"}</span>
                </label>
                {editingStudent.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingStudent({ ...editingStudent, photoUrl: "" })}
                    className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="ছবি মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              
              {/* ======================= বাম কলাম ======================= */}
              <div className="space-y-3.5">
                {/* ১. ছাত্রের নাম * */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={editingStudent.name || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      placeholder="ছাত্রের নাম"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                    <Keyboard className="w-4 h-4 text-rose-500/80 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* ২. ছাত্রের জন্ম তারিখ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের জন্ম তারিখ <span className="text-slate-400 font-normal text-[11px]">(দিন/মাস/বছর)</span>
                  </label>
                  <input
                    type="date"
                    value={editingStudent.birthDate || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ২.১ ছাত্রের জন্ম নিবন্ধন (BRN) নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ছাত্রের জন্ম নিবন্ধন নম্বর (BRN) <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক - ১৭ ডিজিট)</span>
                  </label>
                  <input
                    type="text"
                    value={editingStudent.birthCertificateNo || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, birthCertificateNo: e.target.value })}
                    placeholder="যেমন: ২০০৮২৬৯২৫১০১২৩৪৫৬"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৩. রক্তের গ্রুপ (যদি জানা থাকে) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    রক্তের গ্রুপ (যদি জানা থাকে)
                  </label>
                  <select
                    value={editingStudent.bloodGroup || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* ৪. পিতার নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={editingStudent.fatherName || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    placeholder="পিতার নাম"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৫. মাতার নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={editingStudent.motherName || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                    placeholder="মাতার নাম"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৬. পিতার পেশা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতার পেশা
                  </label>
                  <input
                    type="text"
                    value={editingStudent.fatherOccupation || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherOccupation: e.target.value })}
                    placeholder="পিতার পেশা"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৬.১ পিতা/অভিভাবকের NID নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    পিতা/অভিভাবকের NID নম্বর <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক - ১০ বা ১৭ ডিজিট)</span>
                  </label>
                  <input
                    type="text"
                    value={editingStudent.guardianNid || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianNid: e.target.value })}
                    placeholder="যেমন: ১৯৮২৫০১২৩৪৫৬৭৮৯০১"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৭. অভিভাবকের নাম */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    অভিভাবকের নাম
                  </label>
                  <input
                    type="text"
                    value={editingStudent.guardianName || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                    placeholder="অভিভাবকের নাম"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮. মোবাইল নম্বর (অভিভাবকের) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    মোবাইল নম্বর (অভিভাবকের)
                  </label>
                  <input
                    type="tel"
                    value={editingStudent.guardianPhone || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                    placeholder="০১৭XXXXXXXX"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮.১ জরুরি / বিকল্প মোবাইল নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    জরুরি / বিকল্প মোবাইল নম্বর <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="tel"
                    value={editingStudent.emergencyPhone || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, emergencyPhone: e.target.value })}
                    placeholder="যেমন: ০১৭১২-৩৪৫৬৭৮"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৮.২ বিকল্প অভিভাবকের নাম ও সম্পর্ক */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      বিকল্প ব্যক্তির নাম
                    </label>
                    <input
                      type="text"
                      value={editingStudent.emergencyContactName || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, emergencyContactName: e.target.value })}
                      placeholder="যেমন: মোঃ জসিম উদ্দিন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      সম্পর্ক
                    </label>
                    <input
                      type="text"
                      value={editingStudent.emergencyContactRelation || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, emergencyContactRelation: e.target.value })}
                      placeholder="যেমন: চাচা / মামা / বড় ভাই"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* ৯. অভিভাবকের সাথে ছাত্রের সম্পর্ক */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    অভিভাবকের সাথে ছাত্রের সম্পর্ক
                  </label>
                  <input
                    type="text"
                    value={editingStudent.guardianRelation || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianRelation: e.target.value })}
                    placeholder="যেমন: পিতা / মাতা / ভাই"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১০. বর্তমান ঠিকানা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    বর্তমান ঠিকানা
                  </label>
                  <textarea
                    rows={2}
                    value={editingStudent.presentAddress || editingStudent.address || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, presentAddress: e.target.value, address: e.target.value })}
                    placeholder="বর্তমান ঠিকানা"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ১১. স্থায়ী ঠিকানা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    স্থায়ী ঠিকানা
                  </label>
                  <textarea
                    rows={2}
                    value={editingStudent.permanentAddress || editingStudent.address || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, permanentAddress: e.target.value })}
                    placeholder="স্থায়ী ঠিকানা"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* ======================= ডান কলাম ======================= */}
              <div className="space-y-3.5">
                {/* ১. ভর্তি তারিখ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ভর্তি তারিখ <span className="text-slate-400 font-normal text-[11px]">(দিন/মাস/বছর)</span>
                  </label>
                  <input
                    type="text"
                    value={editingStudent.admissionDate || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, admissionDate: e.target.value })}
                    placeholder="দিন/মাস/বছর (যেমন: 13/12/2025)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ২. ফরম নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ফরম নম্বর
                  </label>
                  <input
                    type="text"
                    value={editingStudent.formNumber || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, formNumber: e.target.value })}
                    placeholder="ফরম নম্বর"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৩. ভর্তি নম্বর */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    ভর্তি নম্বর / রোল
                  </label>
                  <input
                    type="text"
                    value={editingStudent.roll || editingStudent.id || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roll: e.target.value })}
                    placeholder="ভর্তি নম্বর"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৪. বেতনের পরিমাণ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    বেতনের পরিমাণ (মাসিক বেতন ৳)
                  </label>
                  <input
                    type="number"
                    value={editingStudent.monthlyFee || 0}
                    onChange={(e) => setEditingStudent({ ...editingStudent, monthlyFee: Number(e.target.value) })}
                    placeholder="500.00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৪.১ মাসিক খানার টাকার পরিমাণ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    মাসিক খানার টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    value={editingStudent.khanaFee || 0}
                    onChange={(e) => setEditingStudent({ ...editingStudent, khanaFee: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* ৫. জামাতের নাম (তীর অপশনসহ ড্রপডাউন ও [+] নতুন জামাত যোগ করার বাটন) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-800 font-bold">
                      জামাতের নাম <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddJamatModal(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded transition-all"
                      title="নতুন জামাত তৈরি করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন জামাত</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={editingStudent.className || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                        className="w-full appearance-none px-3 py-2 pr-9 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 cursor-pointer shadow-xs"
                      >
                        <option value="" disabled>জামাত নির্বাচন করুন</option>
                        {jamatOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {/* তীর অপশন (ChevronDown) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {/* [+] অ্যাড বাটন (স্যাররা চাইলে নতুন জামাত যুক্ত করতে পারবে) */}
                    <button
                      type="button"
                      onClick={() => setShowAddJamatModal(true)}
                      title="নতুন জামাত যোগ করুন"
                      className="w-9 h-9 shrink-0 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-md flex items-center justify-center transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ৬. টাইপ নির্ধারণ করুন (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    টাইপ নির্ধারণ করুন
                  </label>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-800">
                    {["নিজ খোরাকী", "হাফ ফ্রি", "ফুল ফ্রি"].map(kType => (
                      <label key={kType} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="editKhorakiType"
                          value={kType}
                          checked={(editingStudent.khorakiType || "নিজ খোরাকী") === kType}
                          onChange={() => setEditingStudent({ ...editingStudent, khorakiType: kType })}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>{kType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ৭. আবাসিক / অনাবাসিক (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    আবাসিক / অনাবাসিক
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editResidentialType"
                        value="আবাসিক"
                        checked={editingStudent.residentialType === "আবাসিক" || editingStudent.status === "residential"}
                        onChange={() => setEditingStudent({ ...editingStudent, residentialType: "আবাসিক", status: "residential" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>আবাসিক</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editResidentialType"
                        value="অনাবাসিক"
                        checked={editingStudent.residentialType === "অনাবাসিক" || editingStudent.status === "non_residential"}
                        onChange={() => setEditingStudent({ ...editingStudent, residentialType: "অনাবাসিক", status: "non_residential" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>অনাবাসিক</span>
                    </label>
                  </div>
                </div>

                {/* ৮. নতুন / পুরাতন (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    নতুন / পুরাতন
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editStudentType"
                        value="নতুন"
                        checked={(editingStudent.studentType || "পুরাতন") === "নতুন"}
                        onChange={() => setEditingStudent({ ...editingStudent, studentType: "নতুন" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>নতুন</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editStudentType"
                        value="পুরাতন"
                        checked={(editingStudent.studentType || "পুরাতন") === "পুরাতন"}
                        onChange={() => setEditingStudent({ ...editingStudent, studentType: "পুরাতন" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>পুরাতন</span>
                    </label>
                  </div>
                </div>

                {/* ৯. ছাত্র / ছাত্রী টি কি এতিম ? (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    ছাত্র / ছাত্রী টি কি এতিম ?
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editIsOrphan"
                        value="না"
                        checked={(editingStudent.isOrphan || "না") === "না"}
                        onChange={() => setEditingStudent({ ...editingStudent, isOrphan: "না" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>না</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editIsOrphan"
                        value="এতিম"
                        checked={editingStudent.isOrphan === "এতিম"}
                        onChange={() => setEditingStudent({ ...editingStudent, isOrphan: "এতিম" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>এতিম</span>
                    </label>
                  </div>
                </div>

                {/* ১০. বোর্ডিং এ খানা খায়? (রেডিও বাটন) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    বোর্ডিং এ খানা খায়?
                  </label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editIsBoardingMeal"
                        value="না"
                        checked={(editingStudent.isBoardingMeal || "না") === "না"}
                        onChange={() => setEditingStudent({ ...editingStudent, isBoardingMeal: "না" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>না</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editIsBoardingMeal"
                        value="হ্যাঁ"
                        checked={editingStudent.isBoardingMeal === "হ্যাঁ"}
                        onChange={() => setEditingStudent({ ...editingStudent, isBoardingMeal: "হ্যাঁ" })}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>হ্যাঁ</span>
                    </label>
                  </div>
                </div>

                {/* ১০.১ শিক্ষার্থীর ক্যাটাগরি / বিশেষ সুবিধা */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    শিক্ষার্থীর ক্যাটাগরি / বিশেষ সুবিধা
                  </label>
                  <select
                    value={editingStudent.studentCategory || "সাধারণ শিক্ষার্থী"}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 cursor-pointer"
                  >
                    <option value="সাধারণ শিক্ষার্থী">সাধারণ শিক্ষার্থী</option>
                    <option value="এতিম শিক্ষার্থী (লিল্লাহ ফান্ড)">এতিম শিক্ষার্থী (লিল্লাহ ফান্ড)</option>
                    <option value="দরিদ্র / বিশেষ ছাড়">দরিদ্র / বিশেষ ছাড়</option>
                    <option value="মেধা বৃত্তিপ্রাপ্ত">মেধা বৃত্তিপ্রাপ্ত</option>
                    <option value="হাফেজ / বিশেষ শিক্ষার্থী">হাফেজ / বিশেষ শিক্ষার্থী</option>
                  </select>
                </div>

                {/* ১০.২ পূর্ববর্তী শিক্ষা প্রতিষ্ঠান ও ছাড়পত্র (TC) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      বিগত মাদরাসা / স্কুল <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudent.previousMadrasa || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, previousMadrasa: e.target.value })}
                      placeholder="যেমন: দারুল উলুম মাদরাসা"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      ছাড়পত্র (TC) নম্বর / তথ্য <span className="text-slate-400 font-normal text-[11px]">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudent.previousTcInfo || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, previousTcInfo: e.target.value })}
                      placeholder="যেমন: টিসি নং-১২৩৪"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* ১১. নোট/মন্তব্য */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    নোট/মন্তব্য
                  </label>
                  <input
                    type="text"
                    value={editingStudent.remarks || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, remarks: e.target.value })}
                    placeholder="মন্তব্য লিখুন"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* ফুটার বাটন বার */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setEditingStudent(null); setActiveTab("list"); }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#1b686e] hover:bg-[#135156] text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-teal-900/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>হালনাগাদ সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* বিস্তারিত মডাল (View Details Modal) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* বিস্তারিত তথ্য মডাল (View Details Modal - স্ক্রিনশটের হুবহু অনুরূপ) */}
      {/* ========================================================================= */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] flex flex-col">
            
            {/* স্ক্রলএবল কন্টেইনার */}
            <div className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* শীর্ষ গোল প্রোফাইল ছবি ও ব্লু বর্ডার */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="w-24 h-24 rounded-full border-4 border-[#0284c7] overflow-hidden flex items-center justify-center bg-slate-100 shadow-sm">
                  {viewingStudent.photoUrl ? (
                    <img
                      src={viewingStudent.photoUrl}
                      alt={viewingStudent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <h3 className="text-xl font-black text-[#1b686e] text-center mt-2 tracking-wide">
                  {viewingStudent.name}
                </h3>
              </div>

              {/* পূর্ণাঙ্গ ২৬টি ফিল্ডের তথ্য টেবিল (স্ক্রিনশট ১ ও ২ এর হুবহু) */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">জন্ম তারিখ</td>
                      <td className="py-2 px-4 text-slate-700">{formatDateToDMY(viewingStudent.birthDate) || "20/04/2017"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">জন্ম নিবন্ধন নম্বর (BRN)</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">{viewingStudent.birthCertificateNo || "প্রযোজ্য নয় / দেওয়া হয়নি"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">রক্তের গ্রুপ</td>
                      <td className="py-2 px-4 text-slate-700 font-bold">{viewingStudent.bloodGroup || "O+"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">Email</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.email || "N/A"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">পিতার নাম</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.fatherName || "পলাশ মিয়া"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">মাতার নাম</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.motherName || "তামান্না বেগম"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">পিতার পেশা</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.fatherOccupation || "ব্যবসা"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">অভিভাবকের NID</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">{viewingStudent.guardianNid || "প্রযোজ্য নয় / দেওয়া হয়নি"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">অভিভাবকের নাম</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.guardianName || "তামান্না বেগম"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ফোন নম্বর</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">{viewingStudent.guardianPhone}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">জরুরি / বিকল্প ফোন</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">
                        {viewingStudent.emergencyPhone || "দেওয়া হয়নি"}
                        {viewingStudent.emergencyContactRelation && (
                          <span className="text-slate-500 font-normal ml-2">({viewingStudent.emergencyContactName ? `${viewingStudent.emergencyContactName} - ` : ""}{viewingStudent.emergencyContactRelation})</span>
                        )}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">সম্পর্ক</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.guardianRelation || "মা"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">বর্তমান ঠিকানা</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.presentAddress || viewingStudent.address || "আলমনগর নবীনগর বি বাড়ীয়া"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">স্থায়ী ঠিকানা</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.permanentAddress || viewingStudent.address || "আলমনগর নবীনগর বি বাড়ীয়া"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">জামাত</td>
                      <td className="py-2 px-4 text-slate-700 font-bold">{viewingStudent.className}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ভর্তি তারিখ</td>
                      <td className="py-2 px-4 text-slate-700">{formatDateToDMY(viewingStudent.admissionDate) || "13/12/2025"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ফর্ম নম্বর</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">{viewingStudent.formNumber || "25"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ভর্তি নম্বর</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">{viewingStudent.roll || "25"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">কোটা ফি</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-bold">
                        {viewingStudent.quotaFee || `${viewingStudent.monthlyFee.toFixed(2)} টাকা`}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">আবাসিক/অনাবাসিক</td>
                      <td className="py-2 px-4 text-slate-700">
                        {viewingStudent.residentialType || (viewingStudent.status === "residential" ? "আবাসিক" : "অনাবাসিক")}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">খাবারের ধরন</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.khorakiType || "N/A"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">বোর্ডিং ভুক্ত</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.isBoardingMeal || "না"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">খাবার ফি</td>
                      <td className="py-2 px-4 text-slate-700 font-mono font-medium">
                        {viewingStudent.khanaFeeText || (viewingStudent.khanaFee ? `${viewingStudent.khanaFee.toFixed(2)} টাকা` : "N/A টাকা")}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ইটিম</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.isOrphan || "না"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ক্যাটাগরি / সুবিধা</td>
                      <td className="py-2 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[11px]">
                          {viewingStudent.studentCategory || "সাধারণ শিক্ষার্থী"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ছাত্র/ছাত্রীর ধরন</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.studentType || "পুরাতন"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ব্যাচ টাইপ</td>
                      <td className="py-2.5 px-4 text-slate-700">{viewingStudent.batchType || "মর্নিং"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">সময়</td>
                      <td className="py-2 px-4 text-slate-700 font-mono">{viewingStudent.classTime || "9:01 AM - 12:30 PM"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">বিগত মাদরাসা / স্কুল</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.previousMadrasa || "প্রযোজ্য নয়"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">ছাড়পত্র (TC) তথ্য</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.previousTcInfo || "প্রযোজ্য নয়"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">স্ট্যাটাস</td>
                      <td className="py-2 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                          {viewingStudent.statusBadge || "সক্রিয়"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-800 w-1/3 border-r border-slate-200">নোট</td>
                      <td className="py-2 px-4 text-slate-700">{viewingStudent.remarks || "সুশৃঙ্খল মেধাবী"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* স্ক্রিনশট অনুরূপ দুটি ফুটার বাটন */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-[#475569] hover:bg-[#334155] text-white text-xs font-bold rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>✕ বন্ধ করুন</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(viewingStudent);
                  setActiveTab("edit");
                  setViewingStudent(null);
                }}
                className="px-4 py-2 bg-[#1b686e] hover:bg-[#135156] text-white text-xs font-bold rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>✎ সম্পাদনা করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* মুছুন কনফার্মেশন মোডাল (Delete Confirmation Modal) */}
      {/* ========================================================================= */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">মুছে ফেলার নিশ্চিতকরণ</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনি কি নিশ্চিত যে <span className="font-bold text-slate-800">{deletingStudent.name}</span>-কে ছাত্র তালিকা থেকে মুছে ফেলতে চান?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ফ্রি হোয়াটসঅ্যাপ ও এসএমএস মোডাল (WhatsApp & SMS Modal) */}
      {/* ========================================================================= */}
      {smsStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>অভিভাবককে WhatsApp-এ পাঠান</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">১০০% ফ্রি</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">{smsStudent.name} ({smsStudent.className})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmsStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">অভিভাবকের নাম:</span>
                  <span className="font-bold text-slate-900">{smsStudent.guardianName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">মূল মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-emerald-800">{smsStudent.guardianPhone}</span>
                </div>
                {smsStudent.emergencyPhone && smsStudent.emergencyPhone !== smsStudent.guardianPhone && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">জরুরি মোবাইল:</span>
                    <span className="font-mono text-slate-700">{smsStudent.emergencyPhone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">মেসেজ বার্তা লিখুন:</label>
                <textarea
                  rows={4}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="বার্তা লিখুন..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-sans text-xs"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>কোনো খরচ নেই, সম্পূর্ণ ফ্রি</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(smsMessage);
                      setSuccessMessage("মেসেজ সফলভাবে কপি হয়েছে!");
                      setTimeout(() => setSuccessMessage(""), 2500);
                    }}
                    className="text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>মেসেজ কপি</span>
                  </button>
                </div>
              </div>

              {/* রেডিমেড মেসেজ টেমপ্লেট */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600">রেডিমেড টেমপ্লেট:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSmsMessage(`আসসালামু আলাইকুম, সম্মানিত অভিভাবক, আপনার সন্তান ${smsStudent.name} আজকে মাদরাসায় অনুপস্থিত রয়েছে। জরুরি কারণ জানাতে অনুরোধ করা হলো।`)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-all"
                  >
                    অনুপস্থিতি নোটিশ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsMessage(`আসসালামু আলাইকুম, সম্মানিত অভিভাবক, আপনার সন্তান ${smsStudent.name}-এর চলতি মাসের মাদরাসা ফি বাবদ ৳${smsStudent.monthlyFee} পরিশোধের জন্য অনুরোধ করা যাচ্ছে। ধন্যবাদ।`)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-all"
                  >
                    ফি বকেয়া তাগাদা
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsMessage(`আসসালামু আলাইকুম, সম্মানিত অভিভাবক, আগামী কাল থেকে মাদরাসা সাময়িক বন্ধ থাকবে। বিস্তারিত নোটিশ বোর্ডে দেখুন।`)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-all"
                  >
                    ছুটির নোটিশ
                  </button>
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    openWhatsAppMessage(smsStudent.guardianPhone, smsMessage);
                    setSuccessMessage(`আলহামদুলিল্লাহ! ${smsStudent.guardianName}-এর হোয়াটসঅ্যাপে বার্তা পাঠানো হচ্ছে...`);
                    setSmsStudent(null);
                    setTimeout(() => setSuccessMessage(""), 4000);
                  }}
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp-এ সরাসরি পাঠান (১০০% ফ্রি)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                {smsStudent.emergencyPhone && smsStudent.emergencyPhone !== smsStudent.guardianPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      openWhatsAppMessage(smsStudent.emergencyPhone!, smsMessage);
                      setSuccessMessage(`আলহামদুলিল্লাহ! জরুরি নম্বরে (${smsStudent.emergencyPhone}) হোয়াটসঅ্যাপে বার্তা পাঠানো হচ্ছে...`);
                      setSmsStudent(null);
                      setTimeout(() => setSuccessMessage(""), 4000);
                    }}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>জরুরি নম্বরে WhatsApp-এ পাঠান</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </button>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setSmsStudent(null)}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={smsSending}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-medium text-xs underline cursor-pointer"
                    title="যদি কোনো SMS গেটওয়ে যুক্ত থাকে"
                  >
                    {smsSending ? "পাঠানো হচ্ছে..." : "সাধারণ মোবাইল SMS পাঠান"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* নতুন জামাত যোগ করার মোডাল (Add Jamat Modal) */}
      {/* ========================================================================= */}
      {showAddJamatModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">নতুন জামাত বা শ্রেণি যুক্ত করুন</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddJamatModal(false);
                  setNewJamatInput("");
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  জামাত বা শ্রেণির নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newJamatInput}
                  onChange={(e) => setNewJamatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = newJamatInput.trim();
                      if (trimmed) {
                        if (!jamatOptions.includes(trimmed)) {
                          setJamatOptions(prev => [...prev, trimmed]);
                        }
                        setJamatName(trimmed);
                        setEditingStudent(prev => prev ? ({ ...prev, className: trimmed }) : null);
                        setNewJamatInput("");
                        setShowAddJamatModal(false);
                      }
                    }
                  }}
                  placeholder="যেমন: ইফতা, আদব, হিফজ দাওর..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  নাম লিখে 'যোগ করুন' বাটনে চাপ দিন অথবা নিচের কোনো বিশেষ জামাত এক ক্লিকে সিলেক্ট করুন:
                </p>

                {/* বিশেষায়িত জামাতের কুইক সিলেকশন বাটনসমূহ */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>বিশেষায়িত জামাতসমূহ (সিলেক্ট করে যুক্ত করুন):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "ইফতা (তাখাসসুস ফিল ফিকহ)",
                      "আদব (তাখাসসুস ফিল আদব)",
                      "উলুমুল হাদিস",
                      "হিফজ রিভিশন ও দাওর",
                      "আমপারা ও কায়দা বিভাগ",
                      "কিরাত ও তাজবীদ"
                    ].map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => {
                          if (!jamatOptions.includes(sp)) {
                            setJamatOptions(prev => [...prev, sp]);
                          }
                          setJamatName(sp);
                          setEditingStudent(prev => prev ? ({ ...prev, className: sp }) : null);
                          setNewJamatInput("");
                          setShowAddJamatModal(false);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
                      >
                        <Plus className="w-2.5 h-2.5 text-amber-700" />
                        <span>{sp}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddJamatModal(false);
                    setNewJamatInput("");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = newJamatInput.trim();
                    if (trimmed) {
                      if (!jamatOptions.includes(trimmed)) {
                        setJamatOptions(prev => [...prev, trimmed]);
                      }
                      setJamatName(trimmed);
                      setEditingStudent(prev => prev ? ({ ...prev, className: trimmed }) : null);
                      setNewJamatInput("");
                      setShowAddJamatModal(false);
                    }
                  }}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
