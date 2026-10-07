"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Printer, 
  Search, 
  ArrowLeft,
  Users,
  Award,
  ScrollText,
  Phone,
  CheckCircle2,
  Calendar,
  Wallet,
  DollarSign,
  Plus,
  Receipt,
  UserCheck,
  Check,
  X,
  ChevronDown,
  History,
  Filter,
  MessageSquare,
  Send,
  Copy,
  ExternalLink,
  Edit3,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Student, MadrasaClass, MadrasaInfo } from "@/types";

interface StudentRegistersViewProps {
  students: Student[];
  classes: MadrasaClass[];
  madrasa: MadrasaInfo;
  onBack: () => void;
  onAddNewStudent?: () => void;
  onNavigate?: (pillar: string) => void;
  initialRegisterType?: 
    | "jamat_students"
    | "admission_report" 
    | "admission_register" 
    | "blood_group" 
    | "guardian_phones" 
    | "khana_entry" 
    | "khana_list"
    | "khana_register" 
    | "salary_entry" 
    | "salary_list"
    | "salary_register" 
    | "admission_form" 
    | "testimonial" 
    | "certificate";
}

// ব্র্যাকেট বা অতিরিক্ত লেখা ছাড়া কেবল জামাত/ক্লাসের নাম পাওয়ার হেল্পার
const cleanClassName = (name: string): string => {
  return (name || "").replace(/\s*\([^)]*\)/g, '').trim();
};

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

// কথায় টাকা রূপান্তরকারী ফাংশন (রসিদের জন্য)
const numberToBengaliWords = (n: number): string => {
  if (!n || n <= 0) return "শূন্য";
  const ones = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
    "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "ঊনিশ", "বিশ",
    "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আঠাশ", "ঊনত্রিশ", "ত্রিশ",
    "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ",
    "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ",
    "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট",
    "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর",
    "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি",
    "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই", "নব্বই",
    "একানব্বই", "বানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"];

  let words = "";
  let num = Math.floor(n);

  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    words += `${numberToBengaliWords(crore)} কোটি `;
    num %= 10000000;
  }
  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    words += `${ones[lakh] || lakh} লাখ `;
    num %= 100000;
  }
  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    words += `${ones[thousand] || thousand} হাজার `;
    num %= 1000;
  }
  if (num >= 100) {
    const hundred = Math.floor(num / 100);
    words += `${ones[hundred] || hundred} শত `;
    num %= 100;
  }
  if (num > 0) {
    words += `${ones[num] || num} `;
  }
  return words.trim();
};

const REGISTER_META: Record<string, { title: string; subtitle: string }> = {
  jamat_students: {
    title: "জামাত অনুসারে ছাত্র/ছাত্রী",
    subtitle: "শ্রেণিভিত্তিক শিক্ষার্থী তালিকা ও পরিসংখ্যান"
  },
  admission_report: {
    title: "ভর্তি প্রতিবেদন",
    subtitle: "জামাত অনুসারে ভর্তির পরিসংখ্যান ও পূর্ণ বিবরণী"
  },
  admission_register: {
    title: "ভর্তি রেজিস্টার",
    subtitle: "মাদরাসার অফিসিয়াল ভর্তি লেজার খাতা"
  },
  blood_group: {
    title: "রক্তের গ্রুপ অনুসারে ছাত্র/ছাত্রী",
    subtitle: "শিক্ষার্থীদের ব্লাড গ্রুপ তালিকা ও ডিরেক্টরি"
  },
  guardian_phones: {
    title: "অভিভাবকের মোবাইল নাম্বার",
    subtitle: "জামাত অনুসারে অভিভাবকদের ফোন নম্বর ও যোগাযোগ তালিকা"
  },
  khana_entry: {
    title: "খানার টাকা জমার এন্ট্রি",
    subtitle: "মাসিক মেস ও খোরাকী ফি আদায় রসিদ"
  },
  khana_list: {
    title: "খানার টাকা জমার তালিকা",
    subtitle: "পরিশোধিত খানা ফির বিস্তারিত খতিয়ান"
  },
  khana_register: {
    title: "খোরাকী বার্ষিক রেজিস্টার",
    subtitle: "১২ মাসের পূর্ণাঙ্গ খোরাকী আদায় ম্যাট্রিক্স"
  },
  salary_entry: {
    title: "বেতন জমার এন্ট্রি",
    subtitle: "মাসিক বেতন এন্ট্রি ও আদায় রসিদ"
  },
  salary_list: {
    title: "বেতন জমার তালিকা",
    subtitle: "বেতন আদায়ের ধারাবাহিক হিসাব বিবরণী"
  },
  salary_register: {
    title: "বেতন বার্ষিক রেজিস্টার",
    subtitle: "১২ মাসের পূর্ণাঙ্গ বেতন লেজার খাতা"
  },
  admission_form: {
    title: "ভর্তি ফর্ম প্রিন্ট",
    subtitle: "অঙ্গীকারনামা সংবলিত অফিশিয়াল ভর্তি ফরম"
  },
  testimonial: {
    title: "প্রত্যয়ন পত্র প্রিন্ট",
    subtitle: "ছাত্রের চারিত্রিক ও প্রাতিষ্ঠানিক প্রশংসাপত্র"
  },
  certificate: {
    title: "অফিসিয়াল সনদপত্র / সার্টিফিকেট",
    subtitle: "হিফজ ও কিতাব সমাপনী সনদপত্র"
  }
};

export const StudentRegistersView: React.FC<StudentRegistersViewProps> = ({
  students,
  classes,
  madrasa,
  onBack,
  onAddNewStudent,
  onNavigate,
  initialRegisterType = "admission_report"
}) => {
  const [activeType, setActiveType] = useState(initialRegisterType);
  const activeLogo = madrasa.logoUrl || "/logo.png";
  const watermarkOpacityValue = (madrasa.watermarkOpacity ?? 10) / 100;

  useEffect(() => {
    if (initialRegisterType) {
      setActiveType(initialRegisterType);
    }
  }, [initialRegisterType]);

  const handleSwitchType = (type: typeof activeType) => {
    setActiveType(type);
    if (onNavigate) {
      const typeToPillar: Record<string, string> = {
        jamat_students: "student_by_jamat",
        admission_report: "student_admission_report",
        admission_register: "student_admission_register",
        blood_group: "student_blood_group",
        guardian_phones: "student_guardian_phones",
        khana_entry: "khana_entry",
        khana_list: "khana_list",
        khana_register: "khana_register",
        salary_entry: "tuition_entry",
        salary_list: "tuition_list",
        salary_register: "tuition_register",
        admission_form: "admission_form_print",
        testimonial: "testimonial_print",
        certificate: "certificate_print"
      };
      if (typeToPillar[type]) {
        onNavigate(typeToPillar[type]);
      }
    }
  };

  const [selectedJamat, setSelectedJamat] = useState<string>("সকল জামাত");
  const [entryJamatFilter, setEntryJamatFilter] = useState<string>("সকল জামাত");
  const [selectedBlood, setSelectedBlood] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  // শিক্ষাবর্ষ / বছর স্টেট (সাহাদাত ভাইয়ের নির্দেশনা: ২০২৬-২৭, ২০২৫-২৬ ও ভবিষ্যতে ২৭, ২৮, ২৯ ইত্যাদি অ্যাড করার অপশন)
  const [availableYears, setAvailableYears] = useState<string[]>([
    "২০২৬-২৭",
    "২০২৫-২৬",
    "২০২৪-২৫"
  ]);
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState<boolean>(false);
  const [newYearInput, setNewYearInput] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("২০২৬-২৭");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("সফল! তথ্য সংরক্ষণ করা হয়েছে।");

  // এসএমএস মডাল স্টেটসমূহ
  const [smsModalStudent, setSmsModalStudent] = useState<Student | null>(null);
  const [bulkSmsModal, setBulkSmsModal] = useState<boolean>(false);
  const [smsText, setSmsText] = useState<string>("আসসালামু আলাইকুম, সম্মানিত অভিভাবক, আপনার সন্তানের নিয়মিত উপস্থিতি ও অগ্রগতির দিকে লক্ষ্য রাখার জন্য বিনীত অনুরোধ করা যাচ্ছে। ধন্যবাদ।");
  const [smsSentNotice, setSmsSentNotice] = useState<string>("");

  // ১০০% ফ্রি WhatsApp বার্তা পাঠানোর ফাংশন
  const formatWhatsAppPhone = (rawPhone: string) => {
    let cleaned = (rawPhone || "").replace(/\D/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("0")) {
      cleaned = "88" + cleaned;
    } else if (!cleaned.startsWith("88") && cleaned.length === 10) {
      cleaned = "880" + cleaned;
    }
    return cleaned;
  };

  const openWhatsAppMessage = (phone: string, text: string) => {
    const cleanPhone = formatWhatsAppPhone(phone);
    if (!cleanPhone) {
      alert("মোবাইল নম্বর পাওয়া যায়নি!");
      return;
    }
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
  };

  // মাদরাসার সকল সক্রিয় জামাতের তালিকা (ক্লাস ও শিক্ষার্থী থেকে ডায়নামিক)
  const jamatOptions = Array.from(
    new Set([
      ...classes.map((c) => c.name),
      ...students.map((s) => s.className).filter(Boolean),
    ])
  );

  // জামাত অনুসারে ভর্তি প্রতিবেদন ডেটা (৪ টি জামাত ও ২০ জন শিক্ষার্থীর তথ্যের ভিত্তিতে ডায়নামিক)
  const reportRows = classes.map((cls, idx) => {
    const classStudents = students.filter(s => s.classId === cls.id || s.className === cls.name);
    const nijKhoraki = classStudents.filter(s => s.khorakiType === "নিজ খোরাকী").length;
    const halfFree = classStudents.filter(s => s.khorakiType === "হাফ ফ্রি").length;
    const fullFree = classStudents.filter(s => s.khorakiType === "ফুল ফ্রি").length;
    const abasik = classStudents.filter(s => s.status === "residential" || s.residentialType === "আবাসিক").length;
    const onabasik = classStudents.filter(s => s.status === "non_residential" || s.residentialType === "অনাবাসিক").length;
    return {
      no: idx + 1,
      jamatName: cls.name,
      nijKhoraki,
      halfFree,
      fullFree,
      abasik,
      onabasik,
      total: classStudents.length
    };
  });

  const displayReportRows = (!selectedJamat || selectedJamat === "সকল জামাত")
    ? reportRows
    : reportRows.filter(r => r.jamatName.toLowerCase().includes(selectedJamat.toLowerCase()) || selectedJamat.toLowerCase().includes(r.jamatName.toLowerCase()));

  const reportTotalNij = displayReportRows.reduce((acc, r) => acc + r.nijKhoraki, 0);
  const reportTotalHalf = displayReportRows.reduce((acc, r) => acc + r.halfFree, 0);
  const reportTotalFull = displayReportRows.reduce((acc, r) => acc + r.fullFree, 0);
  const reportTotalAbasik = displayReportRows.reduce((acc, r) => acc + r.abasik, 0);
  const reportTotalOnabasik = displayReportRows.reduce((acc, r) => acc + r.onabasik, 0);
  const reportTotalStudents = displayReportRows.reduce((acc, r) => acc + r.total, 0);

  // ভর্তি রেজিস্টার শিক্ষার্থী তালিকা (সকল শিক্ষার্থীর পূর্ণাঙ্গ বিবরণ)
  const registerStudents = students.map((st, idx) => ({
    id: st.id,
    name: st.name,
    admissionNo: st.barcode || st.id,
    formNo: st.formNumber || `${101 + idx}`,
    jamat: st.className,
    birthCertificateNo: st.birthCertificateNo || "—",
    guardianNid: st.guardianNid || "—",
    emergencyPhone: st.emergencyPhone || st.guardianPhone,
    studentCategory: st.studentCategory || "সাধারণ",
    isNijKhoraki: st.khorakiType === "নিজ খোরাকী",
    isHalfFree: st.khorakiType === "হাফ ফ্রি",
    isFullFree: st.khorakiType === "ফুল ফ্রি",
    isAbasik: st.status === "residential" || st.residentialType === "আবাসিক",
    isOnabasik: st.status === "non_residential" || st.residentialType === "অনাবাসিক"
  }));

  const filteredRegisterStudents = registerStudents.filter((st) => {
    if (!selectedJamat || selectedJamat === "সকল জামাত") return true;
    return st.jamat.toLowerCase().includes(selectedJamat.toLowerCase()) || selectedJamat.toLowerCase().includes(st.jamat.toLowerCase());
  });

  // খানা এন্ট্রি ফর্ম স্টেট
  const [khanaStudentId, setKhanaStudentId] = useState<string>(students[0]?.id || "");
  const [khanaMonth, setKhanaMonth] = useState<string>("মার্চ");
  const [khanaAmount, setKhanaAmount] = useState<number>(3000);
  const [khanaMethod, setKhanaMethod] = useState<string>("ক্যাশ");
  const [khanaReceiptNo, setKhanaReceiptNo] = useState<string>("K-2026-042");

  // বেতন এন্ট্রি ফর্ম স্টেট
  const [tuitionStudentId, setTuitionStudentId] = useState<string>(students[0]?.id || "");
  const [tuitionMonth, setTuitionMonth] = useState<string>("মার্চ");
  const [tuitionFee, setTuitionFee] = useState<number>(1500);
  const [tuitionDiscount, setTuitionDiscount] = useState<number>(0);
  const [tuitionMethod, setTuitionMethod] = useState<string>("ক্যাশ");
  const [tuitionReceiptNo, setTuitionReceiptNo] = useState<string>("T-2026-108");

  // হিস্ট্রি ও তারিখ ফিল্টার স্টেট (সকল মাস, চলতি মাস, গত মাস এবং বছর ফিল্টার)
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState<string>("সকল মাস");
  const [selectedHistoryYear, setSelectedHistoryYear] = useState<string>("সকল বছর");

  // বছর ও শিক্ষাবর্ষ ম্যাচ করার হেল্পার
  const checkYearMatch = (recordDate: string, filterYear: string) => {
    if (!filterYear || filterYear === "সকল বছর") return true;
    if (recordDate.includes(filterYear)) return true;

    const bnToEnMap: Record<string, string> = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };
    const enRecordDate = recordDate.replace(/[০-৯]/g, d => bnToEnMap[d] || d);
    const enFilterYear = filterYear.replace(/[০-৯]/g, d => bnToEnMap[d] || d);

    if (enFilterYear.includes("2026") && enRecordDate.includes("2026")) return true;
    if (enFilterYear.includes("2025") && enRecordDate.includes("2025")) return true;
    if (enFilterYear.includes("2024") && enRecordDate.includes("2024")) return true;
    if (enFilterYear.includes("2027") && enRecordDate.includes("2027")) return true;
    if (enFilterYear.includes("2028") && enRecordDate.includes("2028")) return true;
    if (enFilterYear.includes("2029") && enRecordDate.includes("2029")) return true;

    const matchYears = enFilterYear.match(/\d{4}|\d{2}/g) || [];
    return matchYears.some(yr => {
      const fullYr = yr.length === 2 ? `20${yr}` : yr;
      return enRecordDate.includes(fullYr) || enRecordDate.includes(yr);
    });
  };

  // মক খানা জমার তালিকা (চলতি মাস, গত মাস ও পূর্ববর্তী বছরের হিস্ট্রি সহ)
  const [khanaCollections, setKhanaCollections] = useState([
    // চলতি মাস (মার্চ ২০২৬)
    { id: "kc-1", receiptNo: "K-2026-041", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "মার্চ", amount: 3000, method: "ক্যাশ", date: "২০২৬-০৩-২৪" },
    { id: "kc-2", receiptNo: "K-2026-040", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "মার্চ", amount: 3000, method: "বিকাশ", date: "২০২৬-০৩-২৩" },
    { id: "kc-3", receiptNo: "K-2026-039", studentName: "আবু বকর সিদ্দিক", roll: "১০৩", jamat: "হেফজখানা", month: "মার্চ", amount: 2500, method: "ক্যাশ", date: "২০২৬-০৩-২২" },
    { id: "kc-4", receiptNo: "K-2026-037", studentName: "মুহাম্মদ বিন নূর", roll: "০৬", jamat: "নাজেরা বিভাগ", month: "মার্চ", amount: 3000, method: "ক্যাশ", date: "২০২৬-০৩-২০" },

    // গত মাস (ফেব্রুয়ারি ২০২৬ - হিস্ট্রি)
    { id: "kc-5", receiptNo: "K-2026-036", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "ফেব্রুয়ারি", amount: 3000, method: "ক্যাশ", date: "২০২৬-০২-২৬" },
    { id: "kc-6", receiptNo: "K-2026-035", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "ফেব্রুয়ারি", amount: 3000, method: "বিকাশ", date: "২০২৬-০২-২৪" },
    { id: "kc-7", receiptNo: "K-2026-034", studentName: "ওমর ফারুক", roll: "১০৪", jamat: "মিজান", month: "ফেব্রুয়ারি", amount: 3000, method: "ব্যাংক", date: "২০২৬-০২-২২" },
    { id: "kc-8", receiptNo: "K-2026-033", studentName: "মুহাম্মদ বিন নূর", roll: "০৬", jamat: "নাজেরা বিভাগ", month: "ফেব্রুয়ারি", amount: 3000, method: "ক্যাশ", date: "২০২৬-০২-২০" },

    // পূর্ববর্তী মাস (জানুয়ারি ২০২৬ - হিস্ট্রি)
    { id: "kc-9", receiptNo: "K-2026-020", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "জানুয়ারি", amount: 3000, method: "ক্যাশ", date: "২০২৬-০১-২৫" },
    { id: "kc-10", receiptNo: "K-2026-019", studentName: "আবু বকর সিদ্দিক", roll: "১০৩", jamat: "হেফজখানা", month: "জানুয়ারি", amount: 2500, method: "নগদ", date: "২০২৬-০১-২২" },
    { id: "kc-11", receiptNo: "K-2026-018", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "জানুয়ারি", amount: 3000, method: "বিকাশ", date: "২০২৬-০১-২০" },

    // গত বছর (ডিসেম্বর ২০২৫ - হিস্ট্রি)
    { id: "kc-12", receiptNo: "K-2025-099", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "ডিসেম্বর", amount: 2800, method: "ক্যাশ", date: "২০২৫-১২-২৮" },
    { id: "kc-13", receiptNo: "K-2025-098", studentName: "ওমর ফারুক", roll: "১০৪", jamat: "মিজান", month: "ডিসেম্বর", amount: 2800, method: "ক্যাশ", date: "২০২৫-১২-২৫" },
  ]);

  // মক বেতনের টাকা জমার তালিকা (চলতি মাস, গত মাস ও পূর্ববর্তী বছরের হিস্ট্রি সহ)
  const [tuitionCollections, setTuitionCollections] = useState([
    // চলতি মাস (মার্চ ২০২৬)
    { id: "tc-1", receiptNo: "T-2026-107", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "মার্চ", fee: 1500, discount: 0, paid: 1500, method: "ক্যাশ", date: "২০২৬-০৩-২৪" },
    { id: "tc-2", receiptNo: "T-2026-106", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "মার্চ", fee: 1500, discount: 300, paid: 1200, method: "নগদ", date: "২০২৬-০৩-২৩" },
    { id: "tc-3", receiptNo: "T-2026-105", studentName: "আবু বকর সিদ্দিক", roll: "১০৩", jamat: "হেফজখানা", month: "মার্চ", fee: 1800, discount: 0, paid: 1800, method: "ক্যাশ", date: "২০২৬-০৩-২২" },
    { id: "tc-4", receiptNo: "T-2026-104", studentName: "সালমান ফারসি", roll: "১০৫", jamat: "হেফজখানা", month: "মার্চ", fee: 1500, discount: 500, paid: 1000, method: "বিকাশ", date: "২০২৬-০৩-২১" },

    // গত মাস (ফেব্রুয়ারি ২০২৬ - হিস্ট্রি)
    { id: "tc-5", receiptNo: "T-2026-095", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "ফেব্রুয়ারি", fee: 1500, discount: 0, paid: 1500, method: "ক্যাশ", date: "২০২৬-০২-২৫" },
    { id: "tc-6", receiptNo: "T-2026-094", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "ফেব্রুয়ারি", fee: 1500, discount: 300, paid: 1200, method: "নগদ", date: "২০২৬-০২-২৩" },
    { id: "tc-7", receiptNo: "T-2026-093", studentName: "ওমর ফারুক", roll: "১০৪", jamat: "মিজান", month: "ফেব্রুয়ারি", fee: 1500, discount: 0, paid: 1500, method: "ব্যাংক", date: "২০২৬-০২-২০" },

    // পূর্ববর্তী মাস (জানুয়ারি ২০২৬ - হিস্ট্রি)
    { id: "tc-8", receiptNo: "T-2026-080", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "জানুয়ারি", fee: 1500, discount: 0, paid: 1500, method: "ক্যাশ", date: "২০২৬-০১-২৬" },
    { id: "tc-9", receiptNo: "T-2026-079", studentName: "আবু বকর সিদ্দিক", roll: "১০৩", jamat: "হেফজখানা", month: "জানুয়ারি", fee: 1800, discount: 0, paid: 1800, method: "ক্যাশ", date: "২০২৬-০১-২৩" },

    // গত বছর (ডিসেম্বর ২০২৫ - হিস্ট্রি)
    { id: "tc-10", receiptNo: "T-2025-150", studentName: "আব্দুল্লাহ আল মারুফ", roll: "১০১", jamat: "মিজান", month: "ডিসেম্বর", fee: 1400, discount: 0, paid: 1400, method: "ক্যাশ", date: "২০২৫-১২-২৮" },
    { id: "tc-11", receiptNo: "T-2025-149", studentName: "মুহাম্মাদ হাসিব", roll: "১০২", jamat: "নাহবেমীর", month: "ডিসেম্বর", fee: 1400, discount: 200, paid: 1200, method: "বিকাশ", date: "২০২৫-১২-২৫" },
  ]);

  // ফিল্টার করা খানা জমার তালিকা (জামাত, মাস, গত মাস ও বছর হিস্ট্রি ফিল্টার সহ)
  const filteredKhanaCollections = khanaCollections.filter((k) => {
    const matchesJamat = !selectedJamat || selectedJamat === "সকল জামাত" || 
      k.jamat.toLowerCase().includes(selectedJamat.toLowerCase()) || 
      selectedJamat.toLowerCase().includes(k.jamat.toLowerCase());

    const matchesMonth = !selectedHistoryMonth || selectedHistoryMonth === "সকল মাস" ||
      (selectedHistoryMonth === "চলতি মাস" && k.month === "মার্চ") ||
      (selectedHistoryMonth === "গত মাস" && k.month === "ফেব্রুয়ারি") ||
      k.month === selectedHistoryMonth;

    const matchesYear = checkYearMatch(k.date, selectedHistoryYear);

    return matchesJamat && matchesMonth && matchesYear;
  });

  // ফিল্টার করা বেতন জমার তালিকা (জামাত, মাস, গত মাস ও বছর হিস্ট্রি ফিল্টার সহ)
  const filteredTuitionCollections = tuitionCollections.filter((t) => {
    const matchesJamat = !selectedJamat || selectedJamat === "সকল জামাত" || 
      t.jamat.toLowerCase().includes(selectedJamat.toLowerCase()) || 
      selectedJamat.toLowerCase().includes(t.jamat.toLowerCase());

    const matchesMonth = !selectedHistoryMonth || selectedHistoryMonth === "সকল মাস" ||
      (selectedHistoryMonth === "চলতি মাস" && (t.month === "মার্চ" || t.date.includes("-০৩-") || t.date.includes("-03-"))) ||
      (selectedHistoryMonth === "গত মাস" && (t.month === "ফেব্রুয়ারি" || t.date.includes("-০২-") || t.date.includes("-02-"))) ||
      t.month === selectedHistoryMonth;

    const matchesYear = checkYearMatch(t.date, selectedHistoryYear);

    return matchesJamat && matchesMonth && matchesYear;
  });

  // ফিল্টার অনুযায়ী মোট টাকার হিসাব
  const totalKhanaAmount = filteredKhanaCollections.reduce((acc, k) => acc + k.amount, 0);
  const totalTuitionAmount = filteredTuitionCollections.reduce((acc, t) => acc + t.paid, 0);

  // রসিদ পপআপ ভিউয়ার
  const [activeReceipt, setActiveReceipt] = useState<{
    type: "khana" | "tuition";
    receiptNo: string;
    studentName: string;
    roll: string;
    jamat: string;
    month: string;
    amount: number;
    method: string;
    date: string;
    fee?: number;
    discount?: number;
    guardianName?: string;
    guardianPhone?: string;
  } | null>(null);

  // ট্যাব পরিবর্তন হ্যান্ডলার
  useEffect(() => {
    if (initialRegisterType) {
      setActiveType(initialRegisterType);
    }
  }, [initialRegisterType]);

  const filteredStudents = students.filter((s) => {
    const matchesJamat = !selectedJamat || selectedJamat === "সকল জামাত" || 
      (s.className && (s.className.toLowerCase().includes(selectedJamat.toLowerCase()) || selectedJamat.toLowerCase().includes(s.className.toLowerCase())));
    const matchesBlood = selectedBlood === "all" || (s.bloodGroup || "O+") === selectedBlood;
    return matchesJamat && matchesBlood;
  });

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // প্রত্যয়ন পত্র এডিট স্টেট (সাহাদাত ভাইয়ের চাহিদা অনুযায়ী যে কোনো লেখা ইচ্ছামতো পরিবর্তনের অপশন)
  const [isTestimonialEditing, setIsTestimonialEditing] = useState<boolean>(false);
  const [useCustomFullParagraph, setUseCustomFullParagraph] = useState<boolean>(false);
  const [testimonialData, setTestimonialData] = useState({
    institutionName: "",
    institutionAddress: "",
    institutionPhone: "",
    title: "প্রত্যয়ন পত্র",
    studentName: "",
    fatherName: "",
    motherName: "আমেনা বেগম",
    academicYear: "",
    className: "",
    roll: "",
    regNo: "",
    conductText: "অধ্যয়নকালীন সময়ে তার আচার-আচরণ ও চরিত্র অত্যন্ত ভালো ছিল। মাদ্রাসার কোনো শৃঙ্খলা পরিপন্থী কাজে সে জড়িত ছিল না।",
    wishesText: "আমি তার ভবিষ্যৎ জীবনের সর্বাঙ্গীন মঙ্গল, উন্নতি ও উজ্জ্বল সাফল্য কামনা করি।",
    customFullParagraph: "",
    signLeft: "শ্রেণী শিক্ষকের স্বাক্ষর",
    signRight: "প্রধান শিক্ষক / মুহতামিমের সীল"
  });

  // শিক্ষার্থী বা বছর পরিবর্তন হলে টেস্টমোনিয়াল ডেটা সিঙ্ক করা
  useEffect(() => {
    if (currentStudent) {
      setTestimonialData((prev) => ({
        ...prev,
        institutionName: prev.institutionName || madrasa.name,
        institutionAddress: prev.institutionAddress || madrasa.address,
        institutionPhone: prev.institutionPhone || madrasa.phone,
        title: prev.title || "প্রত্যয়ন পত্র",
        studentName: currentStudent.name || "",
        fatherName: currentStudent.guardianName || "",
        motherName: (currentStudent as any).motherName || "আমেনা বেগম",
        academicYear: selectedYear || "২০২৬-২৭",
        className: currentStudent.className || "",
        roll: String(currentStudent.roll || ""),
        regNo: String(currentStudent.id || ""),
      }));
    }
  }, [currentStudent?.id, selectedYear, madrasa.name]);

  const handleResetTestimonial = () => {
    if (currentStudent) {
      setTestimonialData({
        institutionName: madrasa.name,
        institutionAddress: madrasa.address,
        institutionPhone: madrasa.phone,
        title: "প্রত্যয়ন পত্র",
        studentName: currentStudent.name || "",
        fatherName: currentStudent.guardianName || "",
        motherName: (currentStudent as any).motherName || "আমেনা বেগম",
        academicYear: selectedYear || "২০২৬-২৭",
        className: currentStudent.className || "",
        roll: String(currentStudent.roll || ""),
        regNo: String(currentStudent.id || ""),
        conductText: "অধ্যয়নকালীন সময়ে তার আচার-আচরণ ও চরিত্র অত্যন্ত ভালো ছিল। মাদ্রাসার কোনো শৃঙ্খলা পরিপন্থী কাজে সে জড়িত ছিল না।",
        wishesText: "আমি তার ভবিষ্যৎ জীবনের সর্বাঙ্গীন মঙ্গল, উন্নতি ও উজ্জ্বল সাফল্য কামনা করি।",
        customFullParagraph: "",
        signLeft: "শ্রেণী শিক্ষকের স্বাক্ষর",
        signRight: "প্রধান শিক্ষক / মুহতামিমের সীল"
      });
      setUseCustomFullParagraph(false);
    }
  };

  const applyPresetTemplate = (preset: "general" | "character" | "hifz" | "tc") => {
    if (preset === "general") {
      setTestimonialData((prev) => ({
        ...prev,
        title: "প্রত্যয়ন পত্র",
        conductText: "অধ্যয়নকালীন সময়ে তার আচার-আচরণ ও চরিত্র অত্যন্ত ভালো ছিল। মাদ্রাসার কোনো শৃঙ্খলা পরিপন্থী কাজে সে জড়িত ছিল না।",
        wishesText: "আমি তার ভবিষ্যৎ জীবনের সর্বাঙ্গীন মঙ্গল, উন্নতি ও উজ্জ্বল সাফল্য কামনা করি।",
        signLeft: "শ্রেণী শিক্ষকের স্বাক্ষর",
        signRight: "প্রধান শিক্ষক / মুহতামিমের সীল"
      }));
      setUseCustomFullParagraph(false);
    } else if (preset === "character") {
      setTestimonialData((prev) => ({
        ...prev,
        title: "চারিত্রিক সনদপত্র",
        conductText: "অধ্যয়নকালীন সময়ে সে অত্যন্ত সৎ, বিনয়ী, নামাজি ও আদর্শ চরিত্রের অধিকারী ছিল। কোনো অনৈতিক বা শৃঙ্খলাবিরোধী কাজে লিপ্ত ছিল না।",
        wishesText: "আমরা তার উজ্জ্বল ভবিষ্যৎ, নেক হায়াত ও দুনিয়া-আখেরাতের কামিয়াবী কামনা করি।",
        signLeft: "নাজেমে দারুল ইকামা",
        signRight: "মুহতামিমের সীল ও স্বাক্ষর"
      }));
      setUseCustomFullParagraph(false);
    } else if (preset === "hifz") {
      setTestimonialData((prev) => ({
        ...prev,
        title: "হিফজুল কুরআন সমাপন প্রত্যয়ন",
        conductText: "আলহামদুলিল্লাহ, শিক্ষার্থী অত্র মাদরাসার হিফজ বিভাগ হতে অত্যন্ত দক্ষতা ও তাজবিদ সহকারে পবিত্র কুরআনুল কারীম সম্পূর্ণ হিফজ সম্পন্ন করেছে।",
        wishesText: "আল্লাহ তাআলা তাকে কুরআনের হাফেজ হিসেবে দ্বীনের একজন একনিষ্ঠ খাদেম ও মুখলিস আলেম হিসেবে কবুল করুন। আমিন।",
        signLeft: "উস্তাযুল হিফজ (হিফজ শিক্ষক)",
        signRight: "মুহতামিম / প্রধান শিক্ষক"
      }));
      setUseCustomFullParagraph(false);
    } else if (preset === "tc") {
      setTestimonialData((prev) => ({
        ...prev,
        title: "ছাড়পত্র ও প্রশংসাপত্র (টি.সি)",
        conductText: "অভিভাবকের ব্যক্তিগত আবেদনের প্রেক্ষিতে তাকে অত্র মাদরাসা হতে ছাড়পত্র প্রদান করা হলো। অত্র প্রতিষ্ঠানে তার যাবতীয় পাওনা পরিশোধিত রয়েছে।",
        wishesText: "ভবিষ্যতে নতুন শিক্ষাঙ্গনে তার পড়াশোনা ও অগ্রযাত্রার সাফল্য কামনা করা হলো।",
        signLeft: "শ্রেণী শিক্ষক",
        signRight: "প্রধান শিক্ষক / মুহতামিম"
      }));
      setUseCustomFullParagraph(false);
    }
  };

  // সার্টিফিকেট এডিট স্টেটসমূহ (প্রকৃত প্রাতিষ্ঠানিক সনদপত্রের বিশুদ্ধ কাঠামো)
  const [isCertificateEditing, setIsCertificateEditing] = useState<boolean>(false);
  const [useCustomCertBody, setUseCustomCertBody] = useState<boolean>(false);
  const [certData, setCertData] = useState({
    bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
    institutionName: "",
    institutionAddress: "",
    boardInfo: "বাংলাদেশ কওমী মাদরাসা শিক্ষা বোর্ড অনুমোদিত • কোড নং: BQ-8492",
    certNo: "SANAD-2026/0481",
    issueDate: "০২ অক্টোবর ২০২৬ খ্রি. / ১২ সফর ১৪৪৮ হিজরি",
    title: "সনদপত্র",
    subTitle: "Academic Certificate of Achievement",
    studentName: "",
    fatherName: "",
    motherName: "আমেনা বেগম",
    academicYear: "",
    className: "",
    examName: "বার্ষিক চূড়ান্ত পরীক্ষা",
    roll: "",
    regNo: "",
    meritPosition: "১ম স্থান (মেধা তালিকায় শীর্ষ)",
    obtainedGpa: "৫.০০",
    obtainedGrade: "মুমতাজ (A+)",
    totalMarks: "৯৫০ / ১০০০",
    confermentLead: "প্রমাণ করা যাইতেছে যে,",
    certStatement: "অত্র মাদরাসার নির্ধারিত পাঠ্যক্রম সমাপ্ত করিয়া বার্ষিক চূড়ান্ত পরীক্ষায় নিয়মিত শিক্ষার্থী হিসেবে অংশগ্রহণ করতঃ কৃতিত্বের সহিত উত্তীর্ণ হইয়াছেন।",
    confermentConclusion: "এতদুপলক্ষে তাহাকে অত্র শিক্ষাগত যোগ্যতার সনদপত্র প্রদান করা হইল।",
    customBodyText: "",
    sign1: "পরীক্ষা নিয়ন্ত্রক",
    sign2: "নাজেমে তালিমাত (শিক্ষা সচিব)",
    sign3: "মুহতামিম / মহাপরিচালক"
  });

  // শিক্ষার্থী বা বছর পরিবর্তন হলে সার্টিফিকেট ডেটা সিঙ্ক করা
  useEffect(() => {
    if (currentStudent) {
      setCertData((prev) => ({
        ...prev,
        institutionName: prev.institutionName || madrasa.name,
        institutionAddress: prev.institutionAddress || madrasa.address,
        studentName: currentStudent.name || "",
        fatherName: currentStudent.guardianName || "",
        motherName: (currentStudent as any).motherName || "আমেনা বেগম",
        academicYear: selectedYear || "২০২৬-২৭",
        className: currentStudent.className || "",
        roll: String(currentStudent.roll || "০১"),
        regNo: String(currentStudent.id || "STD-01"),
        certNo: `SANAD-${selectedYear.replace(/\D/g, "").slice(0, 4) || "2026"}/0${currentStudent.roll || "481"}`,
      }));
    }
  }, [currentStudent?.id, selectedYear, madrasa.name]);

  const handleResetCertificate = () => {
    if (currentStudent) {
      setCertData({
        bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
        institutionName: madrasa.name,
        institutionAddress: madrasa.address,
        boardInfo: "বাংলাদেশ কওমী মাদরাসা শিক্ষা বোর্ড অনুমোদিত • কোড নং: BQ-8492",
        certNo: `SANAD-${selectedYear.replace(/\D/g, "").slice(0, 4) || "2026"}/0${currentStudent.roll || "481"}`,
        issueDate: "০২ অক্টোবর ২০২৬ খ্রি. / ১২ সফর ১৪৪৮ হিজরি",
        title: "সনদপত্র",
        subTitle: "Academic Certificate of Achievement",
        studentName: currentStudent.name || "",
        fatherName: currentStudent.guardianName || "",
        motherName: (currentStudent as any).motherName || "আমেনা বেগম",
        academicYear: selectedYear || "২০২৬-২৭",
        className: currentStudent.className || "",
        examName: "বার্ষিক চূড়ান্ত পরীক্ষা",
        roll: String(currentStudent.roll || "০১"),
        regNo: String(currentStudent.id || "STD-01"),
        meritPosition: "১ম স্থান (মেধা তালিকায় শীর্ষ)",
        obtainedGpa: "৫.০০",
        obtainedGrade: "মুমতাজ (A+)",
        totalMarks: "৯৫০ / ১০০০",
        confermentLead: "প্রমাণ করা যাইতেছে যে,",
        certStatement: "অত্র মাদরাসার নির্ধারিত পাঠ্যক্রম সমাপ্ত করিয়া বার্ষিক চূড়ান্ত পরীক্ষায় নিয়মিত শিক্ষার্থী হিসেবে অংশগ্রহণ করতঃ কৃতিত্বের সহিত উত্তীর্ণ হইয়াছেন।",
        confermentConclusion: "এতদুপলক্ষে তাহাকে অত্র শিক্ষাগত যোগ্যতার সনদপত্র প্রদান করা হইল।",
        customBodyText: "",
        sign1: "পরীক্ষা নিয়ন্ত্রক",
        sign2: "নাজেমে তালিমাত (শিক্ষা সচিব)",
        sign3: "মুহতামিম / মহাপরিচালক"
      });
      setUseCustomCertBody(false);
    }
  };

  const applyCertPreset = (preset: "academic" | "hifz" | "dawra" | "merit") => {
    if (preset === "academic") {
      setCertData((prev) => ({
        ...prev,
        title: "সনদপত্র",
        subTitle: "Certificate of Academic Achievement",
        examName: "বার্ষিক চূড়ান্ত কেন্দ্রীয় পরীক্ষা",
        meritPosition: "১ম স্থান (মেধা তালিকায় শীর্ষ)",
        obtainedGrade: "মুমতাজ (A+)",
        obtainedGpa: "৫.০০",
        totalMarks: "৯৫০ / ১০০০",
        certStatement: "অত্র মাদরাসার নির্ধারিত পাঠ্যক্রম সমাপ্ত করিয়া বার্ষিক চূড়ান্ত কেন্দ্রীয় পরীক্ষায় নিয়মিত শিক্ষার্থী হিসেবে অংশগ্রহণ করতঃ কৃতিত্বের সহিত উত্তীর্ণ হইয়াছেন।",
        confermentConclusion: "এতদুপলক্ষে তাহাকে অত্র শিক্ষাগত যোগ্যতার সনদপত্র প্রদান করা হইল।",
        sign1: "পরীক্ষা নিয়ন্ত্রক",
        sign2: "নাজেমে তালিমাত",
        sign3: "মুহতামিম / অধ্যক্ষ"
      }));
      setUseCustomCertBody(false);
    } else if (preset === "hifz") {
      setCertData((prev) => ({
        ...prev,
        title: "হিফজুল কুরআন সমাপন সনদপত্র",
        subTitle: "Sanad of Holy Quran Memorization (Dastar-e-Fazilat)",
        examName: "হিফজুল কুরআন সমাপনী পরীক্ষা",
        meritPosition: "হাফেজে কুরআন (মুমতাজুল মুমতাজীন)",
        obtainedGrade: "মুত্তাক্বীন (A+)",
        obtainedGpa: "১০০% সহীহ তাজবীদ",
        totalMarks: "৩০ পারা পূর্ণাঙ্গ হিফজ",
        certStatement: "অত্র মাদরাসার হিফজুল কুরআন বিভাগ হইতে সহীহ মাখরাজ ও তাজবীদের সহিত পবিত্র কুরআনুল কারীমের সম্পূর্ণ ৩০ পারা হিফজ সফলভাবে সমাপন করিয়াছেন।",
        confermentConclusion: "এতদুপলক্ষে তাহাকে 'হাফেজে কুরআন' উপাধিতে অত্র ফযীলত সনদপত্র প্রদান করা হইল।",
        sign1: "উস্তাযুল হিফজ",
        sign2: "প্রধান ক্বারী ও নাজেমে তালিমাত",
        sign3: "মুহতামিম (সীল ও স্বাক্ষর)"
      }));
      setUseCustomCertBody(false);
    } else if (preset === "dawra") {
      setCertData((prev) => ({
        ...prev,
        title: "দাওরায়ে হাদীস সমাপনী সনদপত্র",
        subTitle: "Sanad of Takmeel-e-Hadith (Masters Equivalent)",
        examName: "দাওরায়ে হাদীস কেন্দ্রীয় পরীক্ষা",
        meritPosition: "মেধা তালিকায় ১ম স্থান",
        obtainedGrade: "মুমতাজ (A+)",
        obtainedGpa: "৫.০০",
        totalMarks: "৯৬০ / ১০০০",
        certStatement: "অত্র মাদরাসার দাওরায়ে হাদীস জামাতে সিহাহ সিত্তাহসহ হাদীসের যাবতীয় মূল কিতাব পাঠ সমাপন করতঃ বোর্ড পরীক্ষায় কৃতিত্বের সহিত উত্তীর্ণ হইয়াছেন।",
        confermentConclusion: "এতদুপলক্ষে তাহাকে মাওলানা / আলিম হিসেবে অত্র সমাপনী সনদপত্র প্রদান করা হইল।",
        sign1: "পরীক্ষা নিয়ন্ত্রক",
        sign2: "শায়খুল হাদীস",
        sign3: "মুহতামিম ও মহাপরিচালক"
      }));
      setUseCustomCertBody(false);
    } else if (preset === "merit") {
      setCertData((prev) => ({
        ...prev,
        title: "মেধাবৃত্তি ও বিশেষ সম্মাননা সনদপত্র",
        subTitle: "Certificate of Academic Merit & Award",
        examName: "বার্ষিক কেন্দ্রীয় মেধা বৃত্তি পরীক্ষা",
        meritPosition: "১ম স্থান (মেধা তালিকায় শীর্ষ)",
        obtainedGrade: "মুমতাজ (A+)",
        obtainedGpa: "৫.০০",
        totalMarks: "মেধা বৃত্তি প্রাপ্ত",
        certStatement: "অত্র প্রতিষ্ঠানে শিক্ষাবর্ষের বার্ষিক মেধা তালিকায় স্বীয় জামাতে সর্বোচ্চ নম্বর অর্জন করিয়া শীর্ষ স্থান অধিকার করিয়াছেন।",
        confermentConclusion: "তাহার অসামান্য মেধা ও প্রতিভার স্বীকৃতিস্বরূপ অত্র মেধা সনদপত্র ও সম্মাননা প্রদান করা হইল।",
        sign1: "পরীক্ষা কমিটি",
        sign2: "নাজেমে তালিমাত",
        sign3: "মুহতামিম ও সভাপতি"
      }));
      setUseCustomCertBody(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleKhanaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === khanaStudentId) || students[0];
    const newEntry = {
      id: `kc-${Date.now()}`,
      receiptNo: khanaReceiptNo,
      studentName: st.name,
      roll: st.roll,
      jamat: st.className,
      month: khanaMonth,
      amount: khanaAmount,
      method: khanaMethod,
      date: new Date().toISOString().split("T")[0]
    };
    setKhanaCollections([newEntry, ...khanaCollections]);
    setSuccessMsg(`সফল! ${st.name}-এর ${khanaMonth} মাসের খানা ফি বাবদ ৳${khanaAmount} গ্রহণ করা হয়েছে।`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
    // রসিদ প্রিভিউ সেট
    setActiveReceipt({
      type: "khana",
      receiptNo: newEntry.receiptNo,
      studentName: st.name,
      roll: String(st.roll),
      jamat: st.className,
      month: khanaMonth,
      amount: khanaAmount,
      method: khanaMethod,
      date: newEntry.date,
      guardianName: st.guardianName,
      guardianPhone: st.guardianPhone,
    });
    // রসিদ নম্বর ইনক্রিমেন্ট
    setKhanaReceiptNo(`K-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleTuitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === tuitionStudentId) || students[0];
    const netPaid = Math.max(0, tuitionFee - tuitionDiscount);
    const newEntry = {
      id: `tc-${Date.now()}`,
      receiptNo: tuitionReceiptNo,
      studentName: st.name,
      roll: st.roll,
      jamat: st.className,
      month: tuitionMonth,
      fee: tuitionFee,
      discount: tuitionDiscount,
      paid: netPaid,
      method: tuitionMethod,
      date: new Date().toISOString().split("T")[0]
    };
    setTuitionCollections([newEntry, ...tuitionCollections]);
    setSuccessMsg(`সফল! ${st.name}-এর ${tuitionMonth} মাসের বেতন বাবদ ৳${netPaid} আদায় হয়েছে।`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
    // রসিদ প্রিভিউ সেট
    setActiveReceipt({
      type: "tuition",
      receiptNo: tuitionReceiptNo,
      studentName: st.name,
      roll: String(st.roll),
      jamat: st.className,
      month: tuitionMonth,
      amount: netPaid,
      method: tuitionMethod,
      date: newEntry.date,
      fee: tuitionFee,
      discount: tuitionDiscount,
      guardianName: st.guardianName,
      guardianPhone: st.guardianPhone,
    });
    // রসিদ নম্বর ইনক্রিমেন্ট
    setTuitionReceiptNo(`T-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="w-full">
      {/* মূল রেজিস্টার ও পেপার কন্টেন্ট (রসিদ খোলা থাকলে প্রিন্ট থেকে এটি সম্পূর্ণ লুকানো থাকবে) */}
      <div className={`space-y-6 ${activeReceipt ? "print:hidden" : ""}`}>
        {/* হেডার (মাঝখানে সক্রিয় অপশনের নাম ও ডানপাশে প্রিন্ট বোতাম) - সকল রেজিস্টারের জন্য */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="পেছনে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700" />
              <span className="hidden sm:inline">ফিরে যান</span>
            </button>
          </div>

          {/* মাঝখানে অপশনের নাম */}
          <div className="text-center flex-1 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {REGISTER_META[activeType]?.title || "ছাত্র রেজিস্টার ও প্রতিবেদন"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {REGISTER_META[activeType]?.subtitle || madrasa.name}
            </p>
          </div>

          {/* প্রিন্ট বোতাম */}
          <div className="flex items-center">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#1b686e] hover:bg-[#135156] text-white text-xs font-bold transition-all shadow-md shadow-teal-900/20 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ০. জামাত অনুসারে ছাত্র/ছাত্রী (স্ক্রিনশট অনুরূপ) */}
      {activeType === "jamat_students" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
              <div className="relative">
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-56 sm:w-64 appearance-none px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map(c => (
                    <option key={c} value={c}>{cleanClassName(c)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                মোট শিক্ষার্থী: {filteredStudents.length} জন
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                আবাসিক: {filteredStudents.filter(s => s.status === "residential" || s.residentialType === "আবাসিক").length} জন
              </span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
            <div className="text-xs font-bold text-indigo-700 uppercase">জামাত অনুসারে ছাত্র/ছাত্রী তালিকা - {selectedJamat || "সকল জামাত"}</div>
            <p className="text-xs text-slate-500 font-medium">শিক্ষাবর্ষ: ২০২৬ ইং</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 w-12 text-center border">রোল</th>
                  <th className="py-2.5 px-4 border">ছাত্রের নাম</th>
                  <th className="py-2.5 px-3 border">জামাত</th>
                  <th className="py-2.5 px-4 border">পিতার নাম</th>
                  <th className="py-2.5 px-3 border">মোবাইল নম্বর</th>
                  <th className="py-2.5 px-3 border text-center">রক্তের গ্রুপ</th>
                  <th className="py-2.5 px-3 border text-center">অবস্থা</th>
                  <th className="py-2.5 px-3 border text-right">মাসিক বেতন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border text-center font-mono font-bold text-slate-700">{s.roll}</td>
                    <td className="py-2 px-4 border font-black text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {s.name.slice(0, 1)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-2 px-3 border text-indigo-700 font-bold">{s.className}</td>
                    <td className="py-2 px-4 border text-slate-600">{s.guardianName}</td>
                    <td className="py-2 px-3 border font-mono font-bold text-slate-700">{s.guardianPhone}</td>
                    <td className="py-2 px-3 border text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                        {s.bloodGroup || "O+"}
                      </span>
                    </td>
                    <td className="py-2 px-3 border text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === "residential" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {s.status === "residential" ? "আবাসিক" : "অনাবাসিক"}
                      </span>
                    </td>
                    <td className="py-2 px-3 border text-right font-mono font-bold text-indigo-700">
                      ৳{s.monthlyFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ১. জামাত অনুসারে ভর্তি প্রতিবেদন (স্ক্রিনশট media_1790435471738.png অনুযায়ী হুবহু) */}
      {activeType === "admission_report" && (
        <div className="space-y-4">
          {/* ফিল্টার কন্ট্রোল বার (জামাত লিস্ট ড্রপডাউন ও নতুন ছাত্র বাটন) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
              <div className="relative">
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-56 sm:w-64 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map((c) => (
                    <option key={c} value={c}>{cleanClassName(c)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                মোট শিক্ষার্থী: {reportTotalStudents} জন
              </span>
              <button
                type="button"
                onClick={onAddNewStudent}
                className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ছাত্র/ছাত্রী যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* মূল রিপোর্ট কাগজ / কার্ড */}
          <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200/90 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0 relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
              <img src={activeLogo} alt="watermark" className="w-80 h-80 object-contain" />
            </div>

            {/* প্রতিষ্ঠানের হেডার সেকশন (লেটারহেড) */}
            <div className="flex items-start justify-between relative z-10">
              {/* বামে প্রতিষ্ঠানের লোগো */}
              <div className="w-16 h-16 shrink-0">
                <img
                  src={activeLogo}
                  alt="Madrasa Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* মাঝখানে মাদ্রাসার নাম ও প্রতিবেদন শিরোনাম */}
              <div className="text-center flex-1 px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1b686e]">
                  {madrasa.name || "আল-হিদায়াহ মাদ্রাসা"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {madrasa.address || "৫৬/এ, জামেয়া রোড, ঢাকা, বাংলাদেশ"}, মোবাইলঃ {madrasa.phone || "01712345678"}
                </p>
                <h3 className="text-sm font-bold text-slate-800 mt-2">
                  এক নজরে ছাত্র ভর্তি প্রতিবেদন
                </h3>
              </div>

              {/* ডানে শিক্ষাবর্ষ */}
              <div className="text-right shrink-0 pt-1">
                <span className="text-xs font-bold text-slate-700">সন ২০২৫ ইং</span>
              </div>
            </div>

            {/* প্রতিবেদন টেবিল */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs text-center">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold">
                    <th className="py-2.5 px-3 w-12 border border-slate-300">নং</th>
                    <th className="py-2.5 px-6 border border-slate-300">জামাতের নাম</th>
                    <th className="py-2.5 px-4 border border-slate-300">নিজ খোরাকি</th>
                    <th className="py-2.5 px-4 border border-slate-300">হাফ ফ্রি</th>
                    <th className="py-2.5 px-4 border border-slate-300">ফুল ফ্রি</th>
                    <th className="py-2.5 px-4 border border-slate-300">আবাসিক</th>
                    <th className="py-2.5 px-4 border border-slate-300">অনাবাসিক</th>
                    <th className="py-2.5 px-4 border border-slate-300">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {displayReportRows.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 border border-slate-300 text-slate-600 font-bold">{row.no}</td>
                      <td className="py-2.5 px-6 border border-slate-300 font-bold text-slate-900">{row.jamatName}</td>
                      <td className="py-2.5 px-4 border border-slate-300">{row.nijKhoraki}</td>
                      <td className="py-2.5 px-4 border border-slate-300">{row.halfFree}</td>
                      <td className="py-2.5 px-4 border border-slate-300">{row.fullFree}</td>
                      <td className="py-2.5 px-4 border border-slate-300">{row.abasik}</td>
                      <td className="py-2.5 px-4 border border-slate-300">{row.onabasik}</td>
                      <td className="py-2.5 px-4 border border-slate-300 font-bold">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#d1e7dd] text-slate-900 font-bold">
                    <td colSpan={2} className="py-2.5 px-4 border border-slate-300 text-center font-bold">
                      সর্বমোট
                    </td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalNij}</td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalHalf}</td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalFull}</td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalAbasik}</td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalOnabasik}</td>
                    <td className="py-2.5 px-4 border border-slate-300 font-bold">{reportTotalStudents}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ২. জামাত অনুসারে ভর্তি রেজিস্টার (স্ক্রিনশট media_1790435474102.png অনুযায়ী হুবহু) */}
      {activeType === "admission_register" && (
        <div className="space-y-4">
          {/* শীর্ষ ডার্ক টিল হেডার ব্যানার */}
          <div className="bg-[#1b686e] text-white px-5 py-3.5 rounded-t-xl flex items-center gap-2.5 shadow-xs">
            <Users className="w-5 h-5 text-teal-200" />
            <h3 className="text-sm sm:text-base font-bold tracking-wide">
              জামাত অনুসারে ভর্তি রেজিস্টার
            </h3>
          </div>

          {/* ফিল্টার কন্ট্রোল বার */}
          <div className="bg-white p-4 rounded-b-xl border-x border-b border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print -mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">জামাত লিস্ট</label>
              <div className="relative">
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-56 sm:w-64 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map((c) => (
                    <option key={c} value={c}>{cleanClassName(c)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={onAddNewStudent}
                className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ছাত্র/ছাত্রী যুক্ত করুন</span>
              </button>
              <span className="text-xs font-bold text-slate-800">
                ছাত্র/ছাত্রী: {filteredRegisterStudents.length} জন
              </span>
            </div>
          </div>

          {/* রেজিস্টার পেপার কার্ড */}
          <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200/90 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0 relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
              <img src={activeLogo} alt="watermark" className="w-80 h-80 object-contain" />
            </div>

            {/* প্রতিষ্ঠানের হেডার সেকশন */}
            <div className="flex items-start justify-between relative z-10">
              {/* বামে প্রতিষ্ঠানের লোগো */}
              <div className="w-16 h-16 shrink-0">
                <img
                  src={activeLogo}
                  alt="Madrasa Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* মাঝখানে মাদ্রাসার নাম ও রেজিস্টার শিরোনাম */}
              <div className="text-center flex-1 px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1b686e]">
                  {madrasa.name || "আল-হিদায়াহ মাদ্রাসা"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {madrasa.address || "৫৬/এ, জামেয়া রোড, ঢাকা, বাংলাদেশ"}, মোবাইলঃ {madrasa.phone || "01712345678"}
                </p>
                <h3 className="text-sm font-bold text-slate-800 mt-2">
                  ছাত্র ভর্তি রেজিস্টার
                </h3>
              </div>

              {/* ডানে শিক্ষাবর্ষ */}
              <div className="text-right shrink-0 pt-1">
                <span className="text-xs font-bold text-slate-700">সন ২০২৫ ইং</span>
              </div>
            </div>

            {/* রেজিস্টার টেবিল */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs text-center">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold">
                    <th className="py-2.5 px-3 w-12 border border-slate-300">নং</th>
                    <th className="py-2.5 px-5 text-left border border-slate-300">ছাত্রের নাম</th>
                    <th className="py-2.5 px-3 border border-slate-300">ভর্তি নং</th>
                    <th className="py-2.5 px-3 border border-slate-300">ফরম নং</th>
                    <th className="py-2.5 px-3 border border-slate-300">জন্ম নিবন্ধন (BRN)</th>
                    <th className="py-2.5 px-3 border border-slate-300">অভিভাবক NID</th>
                    <th className="py-2.5 px-3 border border-slate-300">ক্যাটাগরি</th>
                    <th className="py-2.5 px-2 border border-slate-300">খোরাকি</th>
                    <th className="py-2.5 px-2 border border-slate-300">আবাসিক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {filteredRegisterStudents.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 border border-slate-300 text-slate-600 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-5 border border-slate-300 text-left font-bold text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-3 border border-slate-300 font-mono">{st.admissionNo}</td>
                      <td className="py-2.5 px-3 border border-slate-300 font-mono">{st.formNo}</td>
                      <td className="py-2.5 px-3 border border-slate-300 font-mono text-[11px]">{st.birthCertificateNo}</td>
                      <td className="py-2.5 px-3 border border-slate-300 font-mono text-[11px]">{st.guardianNid}</td>
                      <td className="py-2.5 px-3 border border-slate-300 text-[11px] font-semibold text-teal-800">{st.studentCategory}</td>
                      <td className="py-2.5 px-2 border border-slate-300">{st.isNijKhoraki ? "নিজ" : st.isHalfFree ? "হাফ" : st.isFullFree ? "ফ্রি" : "—"}</td>
                      <td className="py-2.5 px-2 border border-slate-300">{st.isAbasik ? "আবাসিক" : "অনাবাসিক"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ৩. ব্লাড ব্যাংক রেজিস্টার (রক্তের গ্রুপ অনুসারে ছাত্র/ছাত্রী) */}
      {activeType === "blood_group" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 no-print">
            <div className="flex flex-wrap items-center gap-4">
              {/* জামাত লিস্ট ড্রপডাউন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={selectedJamat}
                    onChange={(e) => setSelectedJamat(e.target.value)}
                    className="w-56 sm:w-64 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map((c) => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* রক্তের গ্রুপ ড্রপডাউন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">রক্তের গ্রুপ:</label>
                <div className="relative">
                  <select
                    value={selectedBlood}
                    onChange={(e) => setSelectedBlood(e.target.value)}
                    className="w-44 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="all">সকল রক্তের গ্রুপ</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <span className="text-xs text-slate-700 font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              ছাত্র/ছাত্রী: {filteredStudents.length} জন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                    {s.name.slice(0, 1)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                    🩸 {s.bloodGroup || "O+"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{s.name}</h4>
                  <p className="text-[11px] text-slate-500">জামাত: {s.className} • রোল: {s.roll}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{s.guardianPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ৪. অভিভাবকদের ফোন ডিরেক্টরি (জামাত অনুযায়ী অভিভাবকের মোবাইল নাম্বার) */}
      {activeType === "guardian_phones" && (
        <div className="space-y-4">
          {/* ফিল্টার কন্ট্রোল বার */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
              <div className="relative">
                <select
                  value={selectedJamat}
                  onChange={(e) => setSelectedJamat(e.target.value)}
                  className="w-56 sm:w-64 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map((c) => (
                    <option key={c} value={c}>{cleanClassName(c)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-700 font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                মোট অভিভাবক: {filteredStudents.length} জন
              </span>
              <button
                type="button"
                onClick={() => setBulkSmsModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>সকল অভিভাবককে SMS পাঠান</span>
              </button>
            </div>
          </div>

          {smsSentNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{smsSentNotice}</span>
            </div>
          )}

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <div className="text-xs font-bold text-indigo-700 uppercase">জামাত অনুযায়ী অভিভাবকদের মোবাইল নম্বর তালিকা - {selectedJamat || "সকল জামাত"}</div>
            </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 w-12 text-center">ক্রমিক</th>
                  <th className="py-2.5 px-4">ছাত্রের নাম</th>
                  <th className="py-2.5 px-3">জামাত</th>
                  <th className="py-2.5 px-4">অভিভাবকের নাম</th>
                  <th className="py-2.5 px-3">মোবাইল নম্বর</th>
                  <th className="py-2.5 px-3">জরুরি / বিকল্প মোবাইল</th>
                  <th className="py-2.5 px-3">সম্পর্ক</th>
                  <th className="py-2.5 px-3 text-center no-print">এস এম এস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-black text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">{s.className}</td>
                    <td className="py-2.5 px-4 text-slate-700 font-bold">{s.guardianName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{s.guardianPhone}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {s.emergencyPhone || s.guardianPhone}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{s.guardianRelation || "পিতা/মাতা"}</td>
                    <td className="py-2.5 px-3 text-center no-print">
                      <button
                        type="button"
                        onClick={() => setSmsModalStudent(s)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                        title="এই অভিভাবককে সরাসরি SMS পাঠান"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>SMS</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* একক শিক্ষার্থী SMS মডাল */}
        {smsModalStudent && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">অভিভাবককে SMS পাঠান</h3>
                    <p className="text-[11px] text-slate-500">{smsModalStudent.name} • {smsModalStudent.className}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsModalStudent(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-700 border border-slate-100">
                  <p><span className="font-semibold text-slate-900">অভিভাবক:</span> {smsModalStudent.guardianName}</p>
                  <p><span className="font-semibold text-slate-900">মূল মোবাইল:</span> <span className="font-mono font-bold text-indigo-700">{smsModalStudent.guardianPhone}</span></p>
                  {smsModalStudent.emergencyPhone && smsModalStudent.emergencyPhone !== smsModalStudent.guardianPhone && (
                    <p><span className="font-semibold text-slate-900">জরুরি মোবাইল:</span> <span className="font-mono text-slate-600">{smsModalStudent.emergencyPhone}</span></p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">এসএমএস বার্তা লিখুন</label>
                  <textarea
                    rows={4}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed font-sans"
                    placeholder="এসএমএস টেক্সট লিখুন..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>ক্যারেক্টার সংখ্যা: {smsText.length}</span>
                    <span>বাংলা ১ SMS = ৭০ অক্ষর</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSmsModalStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const phone = smsModalStudent.guardianPhone;
                    setSmsSentNotice(`আলহামদুলিল্লাহ! ${smsModalStudent.guardianName}-এর নম্বরে (${phone}) বার্তা পাঠানো হয়েছে।`);
                    setSmsModalStudent(null);
                    setTimeout(() => setSmsSentNotice(""), 4500);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>এখনই পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* বাল্ক / জামাতের সবাইকে SMS মডাল */}
        {bulkSmsModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">জামাতের সকল অভিভাবককে বাল্ক SMS পাঠান</h3>
                    <p className="text-[11px] text-slate-500">জামাত: {selectedJamat} • মোট {filteredStudents.length} জন অভিভাবক</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkSmsModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-indigo-50/60 rounded-xl space-y-1 text-indigo-900 border border-indigo-100">
                  <p className="font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>নির্বাচিত {filteredStudents.length} জন অভিভাবকের মোবাইলে একই সাথে SMS পাঠানো হবে।</span>
                  </p>
                  <p className="text-[11px] text-indigo-700">উপস্থিতি নোটিশ, ছুটির ঘোষণা বা জরুরি সংবাদ সহজেই পৌঁছান।</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">এসএমএস বার্তা লিখুন</label>
                  <textarea
                    rows={4}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
                    placeholder="সকলের জন্য নোটিশ লিখুন..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>ক্যারেক্টার সংখ্যা: {smsText.length}</span>
                    <span>বাংলা ১ SMS = ৭০ অক্ষর</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setBulkSmsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSmsSentNotice(`আলহামদুলিল্লাহ! ${selectedJamat} জামাতের মোট ${filteredStudents.length} জন অভিভাবককে SMS সফলভাবে পাঠানো হয়েছে।`);
                    setBulkSmsModal(false);
                    setTimeout(() => setSmsSentNotice(""), 5000);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>সকলকে একসাথে পাঠান ({filteredStudents.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* ৪.১ খানা টাকা জমার এন্ট্রি সিস্টেম (স্ক্রিনশট অনুরূপ) */}
      {activeType === "khana_entry" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-600" />
                <span>খানার টাকা জমার এন্ট্রি সিস্টেম (মেস ও খোরাকী ফি)</span>
              </h3>
              <p className="text-xs text-slate-500">শিক্ষার্থীর খানা ও মেস বাবদ টাকা গ্রহণ ও ডিজিটাল রসিদ ইস্যু</p>
            </div>
            <button
              onClick={() => handleSwitchType("khana_list")}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              জমার তালিকা দেখুন →
            </button>
          </div>

          <form onSubmit={handleKhanaSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">জামাত নির্বাচন (ফিল্টার)</label>
              <div className="relative">
                <select
                  value={entryJamatFilter}
                  onChange={(e) => {
                    const j = e.target.value;
                    setEntryJamatFilter(j);
                    const matching = students.filter(s => !j || j === "সকল জামাত" || s.className?.toLowerCase().includes(j.toLowerCase()));
                    if (matching.length > 0) setKhanaStudentId(matching[0].id);
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map(j => (
                    <option key={j} value={j}>{cleanClassName(j)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
              <select
                value={khanaStudentId}
                onChange={(e) => setKhanaStudentId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {students
                  .filter(s => !entryJamatFilter || entryJamatFilter === "সকল জামাত" || s.className?.toLowerCase().includes(entryJamatFilter.toLowerCase()))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">মাসের নাম *</label>
              <select
                value={khanaMonth}
                onChange={(e) => setKhanaMonth(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">খানার ফি পরিমাণ (৳) *</label>
              <input
                type="number"
                min="100"
                value={khanaAmount}
                onChange={(e) => setKhanaAmount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">পরিশোধ মাধ্যম *</label>
              <select
                value={khanaMethod}
                onChange={(e) => setKhanaMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ক্যাশ">ক্যাশ (নগদ)</option>
                <option value="বিকাশ">বিকাশ (bKash)</option>
                <option value="নগদ">নগদ (Nagad)</option>
                <option value="রকেট">রকেট (Rocket)</option>
                <option value="ব্যাংক">ব্যাংক জমা</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">রসিদ নম্বর (অটো-জেনারেটেড)</label>
              <input
                type="text"
                readOnly
                value={khanaReceiptNo}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 cursor-not-allowed"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>টাকা জমা গ্রহণ ও রসিদ তৈরি করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ৪.২ খানা জমার তালিকা (স্ক্রিনশট অনুরূপ) */}
      {activeType === "khana_list" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <span>খানার টাকা জমার তালিকা ও হিস্ট্রি</span>
              </h3>
              <p className="text-xs text-slate-500">সকল আদায়কৃত খানা ফির খতিয়ান ও রসিদ রি-প্রিন্ট</p>
            </div>
            <button
              onClick={() => handleSwitchType("khana_entry")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খানা এন্ট্রি</span>
            </button>
          </div>

          {/* ফিল্টার কন্ট্রোল বার (হিস্ট্রি, মাস, গত মাস, বছর ও জামাত) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* জামাত সিলেক্টর */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত:</label>
                <div className="relative">
                  <select
                    value={selectedJamat}
                    onChange={(e) => setSelectedJamat(e.target.value)}
                    className="w-44 sm:w-52 appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map((c) => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* বছর সিলেক্টর */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">বছর:</label>
                <div className="relative">
                  <select
                    value={selectedHistoryYear}
                    onChange={(e) => setSelectedHistoryYear(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল বছর">সকল বছর</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(true)}
                  title="নতুন বছর যোগ করুন"
                  className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>অ্যাড</span>
                </button>
              </div>

              {/* মাস / তারিখ হিস্ট্রি ড্রপডাউন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">মাস:</label>
                <div className="relative">
                  <select
                    value={selectedHistoryMonth}
                    onChange={(e) => setSelectedHistoryMonth(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল মাস">সকল মাস</option>
                    <option value="চলতি মাস">চলতি মাস</option>
                    <option value="গত মাস">গত মাস</option>
                    <option disabled>──────────</option>
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* কুইক ফিল্টার বাটন ও পরিসংখ্যান ব্যাজ */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-indigo-600" />
                  হিস্ট্রি ফিল্টার:
                </span>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("সকল মাস"); setSelectedHistoryYear("সকল বছর"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "সকল মাস" && selectedHistoryYear === "সকল বছর"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  সব হিস্ট্রি
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("চলতি মাস"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "চলতি মাস"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  চলতি মাস
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("গত মাস"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "গত মাস"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  গত মাস
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("সকল মাস"); setSelectedHistoryYear("২০২৫-২৬"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryYear === "২০২৫-২৬" && selectedHistoryMonth === "সকল মাস"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  গত বছর
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-xs">
                  মোট এন্ট্রি: <span className="text-indigo-600 font-black">{filteredKhanaCollections.length}</span> টি
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg shadow-xs">
                  মোট আদায়: <span className="font-mono font-black">৳{totalKhanaAmount.toLocaleString("bn-BD")}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 border">রসিদ নং</th>
                  <th className="py-2.5 px-4 border">ছাত্রের নাম</th>
                  <th className="py-2.5 px-3 border text-center">রোল</th>
                  <th className="py-2.5 px-3 border">জামাত</th>
                  <th className="py-2.5 px-3 border">মাস</th>
                  <th className="py-2.5 px-3 border text-right">টাকার পরিমাণ</th>
                  <th className="py-2.5 px-3 border text-center">মাধ্যম</th>
                  <th className="py-2.5 px-3 border text-center">তারিখ</th>
                  <th className="py-2.5 px-3 border text-center no-print">রসিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredKhanaCollections.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 border font-mono font-bold text-indigo-700">{k.receiptNo}</td>
                    <td className="py-2.5 px-4 border font-black text-slate-900">{k.studentName}</td>
                    <td className="py-2.5 px-3 border font-mono text-center">{k.roll}</td>
                    <td className="py-2.5 px-3 border text-slate-600 font-bold">{k.jamat}</td>
                    <td className="py-2.5 px-3 border text-slate-700 font-bold">{k.month}</td>
                    <td className="py-2.5 px-3 border text-right font-mono font-bold text-emerald-700">৳{k.amount.toLocaleString("bn-BD")}</td>
                    <td className="py-2.5 px-3 border text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {k.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border text-center font-mono text-slate-500">{k.date}</td>
                    <td className="py-2.5 px-3 border text-center no-print">
                      <button
                        onClick={() => {
                          const st = students.find(s => s.name === k.studentName || String(s.roll) === String(k.roll));
                          setActiveReceipt({
                            type: "khana",
                            receiptNo: k.receiptNo,
                            studentName: k.studentName,
                            roll: k.roll,
                            jamat: k.jamat,
                            month: k.month,
                            amount: k.amount,
                            method: k.method,
                            date: k.date,
                            guardianName: st?.guardianName,
                            guardianPhone: st?.guardianPhone
                          });
                        }}
                        className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors"
                      >
                        প্রিন্ট রসিদ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৫. ছাত্রদের খোরাকীর বার্ষিক রেজিস্টার (স্ক্রিনশট ১৩ অনুরূপ) */}
      {activeType === "khana_register" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* ফিল্টার কন্ট্রোল বার */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={selectedJamat}
                    onChange={(e) => setSelectedJamat(e.target.value)}
                    className="w-48 sm:w-56 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map((c) => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* শিক্ষাবর্ষ / সন নির্বাচন */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষাবর্ষ / সন:</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(true)}
                  title="নতুন বছর যোগ করুন"
                  className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>অ্যাড</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                ছাত্র/ছাত্রী: {filteredStudents.length} জন
              </span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
            <div className="text-xs font-bold text-indigo-700 uppercase">ছাত্রদের খোরাকীর টাকা আদায়ের বার্ষিক রেজিস্টার - {selectedJamat || "সকল জামাত"} ({selectedYear})</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-800 text-white font-black text-center">
                  <th className="py-2 px-2 text-left">ক্রমিক</th>
                  <th className="py-2 px-3 text-left">ছাত্রের নাম</th>
                  <th className="py-2 px-2">ভর্তি নং</th>
                  <th className="py-2 px-2">খোরাকী</th>
                  {MONTHS.map(m => (
                    <th key={m} className="py-2 px-1 text-[10px]">{m.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-center">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-left font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 text-left font-black text-slate-900">{s.name}</td>
                    <td className="py-2 px-2 font-mono text-slate-500">{s.roll}</td>
                    <td className="py-2 px-2 font-bold text-indigo-700">৳৩,০০০</td>
                    {MONTHS.map(m => (
                      <td key={m} className="py-2 px-1 text-slate-300">
                        {idx % 2 === 0 ? "✓" : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৫.১ বেতন জমার এন্ট্রি সিস্টেম (স্ক্রিনশট অনুরূপ) */}
      {activeType === "salary_entry" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <span>বেতন জমার এন্ট্রি সিস্টেম (মাসিক টিউশন ফি)</span>
              </h3>
              <p className="text-xs text-slate-500">শিক্ষার্থীর মাসিক বেতন আদায়, ছাড়/মওকুফ হিসাব ও ডিজিটাল রসিদ ইস্যু</p>
            </div>
            <button
              onClick={() => handleSwitchType("salary_list")}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              বেতন জমার তালিকা দেখুন →
            </button>
          </div>

          <form onSubmit={handleTuitionSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">জামাত নির্বাচন (ফিল্টার)</label>
              <div className="relative">
                <select
                  value={entryJamatFilter}
                  onChange={(e) => {
                    const j = e.target.value;
                    setEntryJamatFilter(j);
                    const matching = students.filter(s => !j || j === "সকল জামাত" || s.className?.toLowerCase().includes(j.toLowerCase()));
                    if (matching.length > 0) {
                      setTuitionStudentId(matching[0].id);
                      setTuitionFee(matching[0].monthlyFee);
                    }
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="সকল জামাত">সকল জামাত</option>
                  {jamatOptions.map(j => (
                    <option key={j} value={j}>{cleanClassName(j)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
              <select
                value={tuitionStudentId}
                onChange={(e) => {
                  setTuitionStudentId(e.target.value);
                  const st = students.find(s => s.id === e.target.value);
                  if (st) setTuitionFee(st.monthlyFee);
                }}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {students
                  .filter(s => !entryJamatFilter || entryJamatFilter === "সকল জামাত" || s.className?.toLowerCase().includes(entryJamatFilter.toLowerCase()))
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">মাসের নাম *</label>
              <select
                value={tuitionMonth}
                onChange={(e) => setTuitionMonth(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ধার্য মাসিক বেতন (৳) *</label>
              <input
                type="number"
                min="0"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ছাড় / মওকুফ (৳)</label>
              <input
                type="number"
                min="0"
                value={tuitionDiscount}
                onChange={(e) => setTuitionDiscount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">নিট প্রদেয় বেতন (৳)</label>
              <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-black text-indigo-700">
                ৳{Math.max(0, tuitionFee - tuitionDiscount).toLocaleString("bn-BD")}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">পরিশোধ মাধ্যম *</label>
              <select
                value={tuitionMethod}
                onChange={(e) => setTuitionMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ক্যাশ">ক্যাশ (নগদ)</option>
                <option value="বিকাশ">বিকাশ (bKash)</option>
                <option value="নগদ">নগদ (Nagad)</option>
                <option value="রকেট">রকেট (Rocket)</option>
                <option value="ব্যাংক">ব্যাংক জমা</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">রসিদ নম্বর</label>
              <input
                type="text"
                readOnly
                value={tuitionReceiptNo}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 cursor-not-allowed"
              />
            </div>

            <div className="flex items-end md:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>বেতন গ্রহণ ও ডিজিটাল রসিদ ইস্যু করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ৫.২ বেতনের টাকা জমার তালিকা (স্ক্রিনশট অনুরূপ) */}
      {activeType === "salary_list" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <span>বেতনের টাকা জমার তালিকা ও খতিয়ান</span>
              </h3>
              <p className="text-xs text-slate-500">সকল আদায়কৃত ছাত্র বেতনের খতিয়ান ও রসিদ রি-প্রিন্ট</p>
            </div>
            <button
              onClick={() => handleSwitchType("salary_entry")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বেতন এন্ট্রি</span>
            </button>
          </div>

          {/* ফিল্টার কন্ট্রোল বার (হিস্ট্রি, মাস, গত মাস, বছর ও জামাত) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* জামাত সিলেক্টর */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত:</label>
                <div className="relative">
                  <select
                    value={selectedJamat}
                    onChange={(e) => setSelectedJamat(e.target.value)}
                    className="w-44 sm:w-52 appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map((c) => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* বছর সিলেক্টর */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">বছর:</label>
                <div className="relative">
                  <select
                    value={selectedHistoryYear}
                    onChange={(e) => setSelectedHistoryYear(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল বছর">সকল বছর</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(true)}
                  title="নতুন বছর যোগ করুন"
                  className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>অ্যাড</span>
                </button>
              </div>

              {/* মাস / তারিখ হিস্ট্রি ড্রপডাউন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">মাস:</label>
                <div className="relative">
                  <select
                    value={selectedHistoryMonth}
                    onChange={(e) => setSelectedHistoryMonth(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল মাস">সকল মাস</option>
                    <option value="চলতি মাস">চলতি মাস</option>
                    <option value="গত মাস">গত মাস</option>
                    <option disabled>──────────</option>
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* কুইক ফিল্টার বাটন ও পরিসংখ্যান ব্যাজ */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-indigo-600" />
                  হিস্ট্রি ফিল্টার:
                </span>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("সকল মাস"); setSelectedHistoryYear("সকল বছর"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "সকল মাস" && selectedHistoryYear === "সকল বছর"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  সব হিস্ট্রি
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("চলতি মাস"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "চলতি মাস"
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  চলতি মাস
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("গত মাস"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryMonth === "গত মাস"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  গত মাস
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedHistoryMonth("সকল মাস"); setSelectedHistoryYear("২০২৫-২৬"); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHistoryYear === "২০২৫-২৬" && selectedHistoryMonth === "সকল মাস"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  গত বছর
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-xs">
                  মোট এন্ট্রি: <span className="text-indigo-600 font-black">{filteredTuitionCollections.length}</span> টি
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg shadow-xs">
                  মোট আদায়: <span className="font-mono font-black">৳{totalTuitionAmount.toLocaleString("bn-BD")}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-3 border">রসিদ নং</th>
                  <th className="py-2.5 px-4 border">ছাত্রের নাম</th>
                  <th className="py-2.5 px-3 border text-center">রোল</th>
                  <th className="py-2.5 px-3 border">জামাত</th>
                  <th className="py-2.5 px-3 border">মাস</th>
                  <th className="py-2.5 px-3 border text-right">ধার্য ফি</th>
                  <th className="py-2.5 px-3 border text-right">ছাড়</th>
                  <th className="py-2.5 px-3 border text-right">আদায়কৃত টাকা</th>
                  <th className="py-2.5 px-3 border text-center">মাধ্যম</th>
                  <th className="py-2.5 px-3 border text-center">তারিখ</th>
                  <th className="py-2.5 px-3 border text-center no-print">রসিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTuitionCollections.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 border font-mono font-bold text-indigo-700">{t.receiptNo}</td>
                    <td className="py-2.5 px-4 border font-black text-slate-900">{t.studentName}</td>
                    <td className="py-2.5 px-3 border font-mono text-center">{t.roll}</td>
                    <td className="py-2.5 px-3 border text-slate-600 font-bold">{t.jamat}</td>
                    <td className="py-2.5 px-3 border text-slate-700 font-bold">{t.month}</td>
                    <td className="py-2.5 px-3 border text-right font-mono text-slate-500">৳{t.fee}</td>
                    <td className="py-2.5 px-3 border text-right font-mono text-rose-600">৳{t.discount}</td>
                    <td className="py-2.5 px-3 border text-right font-mono font-bold text-emerald-700">৳{t.paid.toLocaleString("bn-BD")}</td>
                    <td className="py-2.5 px-3 border text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {t.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 border text-center font-mono text-slate-500">{t.date}</td>
                    <td className="py-2.5 px-3 border text-center no-print">
                      <button
                        onClick={() => {
                          const st = students.find(s => s.name === t.studentName || String(s.roll) === String(t.roll));
                          setActiveReceipt({
                            type: "tuition",
                            receiptNo: t.receiptNo,
                            studentName: t.studentName,
                            roll: t.roll,
                            jamat: t.jamat,
                            month: t.month,
                            amount: t.paid,
                            method: t.method,
                            date: t.date,
                            fee: t.fee,
                            discount: t.discount,
                            guardianName: st?.guardianName,
                            guardianPhone: st?.guardianPhone
                          });
                        }}
                        className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors"
                      >
                        প্রিন্ট রসিদ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৬. বেতনের বার্ষিক রেজিস্টার (স্ক্রিনশট ১৬ অনুরূপ) */}
      {activeType === "salary_register" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* ফিল্টার কন্ট্রোল বার */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={selectedJamat}
                    onChange={(e) => setSelectedJamat(e.target.value)}
                    className="w-48 sm:w-56 appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map((c) => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* শিক্ষাবর্ষ / সন নির্বাচন */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষাবর্ষ / সন:</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddYearModalOpen(true)}
                  title="নতুন বছর যোগ করুন"
                  className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>অ্যাড</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                ছাত্র/ছাত্রী: {filteredStudents.length} জন
              </span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
            <div className="text-xs font-bold text-indigo-700 uppercase">ছাত্রদের মাসিক বেতন আদায়ের বার্ষিক রেজিস্টার - {selectedJamat || "সকল জামাত"} ({selectedYear})</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-800 text-white font-black text-center">
                  <th className="py-2 px-2 text-left">ক্রমিক</th>
                  <th className="py-2 px-3 text-left">ছাত্রের নাম</th>
                  <th className="py-2 px-2">রোল</th>
                  <th className="py-2 px-2">ধার্য বেতন</th>
                  {MONTHS.map(m => (
                    <th key={m} className="py-2 px-1 text-[10px]">{m.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-center">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-left font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 text-left font-black text-slate-900">{s.name}</td>
                    <td className="py-2 px-2 font-mono text-slate-500">{s.roll}</td>
                    <td className="py-2 px-2 font-bold text-indigo-700">৳{s.monthlyFee}</td>
                    {MONTHS.map(m => (
                      <td key={m} className="py-2 px-1 text-slate-300">
                        {idx % 3 === 0 ? "✓" : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ৭. অফিসিয়াল ভর্তি ফরম (স্ক্রিনশট ১৭ ও ১৮ অনুরূপ) */}
      {activeType === "admission_form" && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b pb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* জামাত অনুযায়ী ফিল্টার */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={entryJamatFilter}
                    onChange={(e) => {
                      const j = e.target.value;
                      setEntryJamatFilter(j);
                      const matching = students.filter(s => !j || j === "সকল জামাত" || s.className?.toLowerCase().includes(j.toLowerCase()));
                      if (matching.length > 0) setSelectedStudentId(matching[0].id);
                    }}
                    className="w-48 appearance-none px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map(c => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* শিক্ষার্থী নির্বাচন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষার্থী:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {students
                    .filter(s => !entryJamatFilter || entryJamatFilter === "সকল জামাত" || s.className?.toLowerCase().includes(entryJamatFilter.toLowerCase()))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
              </div>
            </div>

          </div>

          <div className="border-2 border-slate-800 p-8 rounded-2xl space-y-6 relative overflow-hidden bg-white">
            {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
              <img src={activeLogo} alt="watermark" className="w-72 h-72 object-contain" />
            </div>

            <div className="text-center space-y-1 border-b border-slate-300 pb-4 relative z-10">
              <div className="w-14 h-14 mx-auto mb-1">
                <img src={activeLogo} alt="লোগো" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
              <div className="pt-2">
                <span className="inline-block px-5 py-1 rounded-full bg-slate-800 text-white text-xs font-black uppercase tracking-wider">
                  ভর্তি ফরম
                </span>
              </div>
            </div>

            {/* অঙ্গিকারনামা */}
            <div className="text-xs text-slate-700 leading-relaxed text-justify space-y-1">
              <p className="font-bold">বরাবর,</p>
              <p>
                মুহতারাম মুহতামিম সাহেব, যথাবিহিত সম্মানপূর্বক বিনীত নিবেদন এই যে, আমি এই মাদরাসার অঙ্গীকার নামায় বর্ণিত সকল আইন-কানুন ও শর্ত মানিয়া চলিবার অঙ্গীকার করিয়া এখানে ভর্তি হইবার আবেদন করিতেছি।
              </p>
            </div>

            {/* ফিল্ড গ্রিড */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-800 border-t border-b border-slate-200 py-4">
              <div><span className="font-bold text-slate-500">ছাত্রের নাম:</span> {currentStudent.name}</div>
              <div><span className="font-bold text-slate-500">ভর্তির তারিখ:</span> {currentStudent.admissionDate}</div>
              <div><span className="font-bold text-slate-500">পিতার নাম:</span> {currentStudent.guardianName}</div>
              <div><span className="font-bold text-slate-500">মোবাইল নম্বর:</span> {currentStudent.guardianPhone}</div>
              <div><span className="font-bold text-slate-500">জন্ম নিবন্ধন (BRN):</span> {currentStudent.birthCertificateNo || "—"}</div>
              <div><span className="font-bold text-slate-500">পিতা/অভিভাবকের NID:</span> {currentStudent.guardianNid || "—"}</div>
              <div><span className="font-bold text-slate-500">জরুরি / বিকল্প মোবাইল:</span> {currentStudent.emergencyPhone || currentStudent.guardianPhone}</div>
              <div><span className="font-bold text-slate-500">কাঙ্ক্ষিত জামাত:</span> {currentStudent.className}</div>
              <div><span className="font-bold text-slate-500">শিক্ষার্থী ক্যাটাগরি:</span> {currentStudent.studentCategory || "সাধারণ শিক্ষার্থী"}</div>
              <div><span className="font-bold text-slate-500">বর্তমান ঠিকানা:</span> {currentStudent.address}</div>
            </div>

            {/* দপ্তরের কাজ (স্ক্রিনশট ১৮ অনুরূপ) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3 text-xs">
              <div className="font-black text-slate-900 text-center uppercase underline">দপ্তরের কাজ</div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="font-bold">মুহতামিমের আদেশ:</span> পরীক্ষা নিয়ে নাম্বার দিন।
                </div>
                <div className="text-right">
                  <span className="font-bold">ভর্তি ফি বাবদ:</span> ৳ ১,৫০০ গ্রহণ করা হইল।
                </div>
              </div>
            </div>

            {/* সিগনেচার */}
            <div className="pt-10 flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="text-center border-t border-slate-400 pt-2 w-44">ছাত্র/অভিভাবকের দস্তখত</div>
              <div className="text-center border-t border-slate-400 pt-2 w-44">মুহতামিমের অনুমোদন ও সীল</div>
            </div>
          </div>
        </div>
      )}

      {/* ৮. প্রত্যয়ন পত্র (স্ক্রিনশট ১৯ অনুরূপ - সম্পুর্ণ এডিটেবল কাস্টমাইজেশন সহ) */}
      {activeType === "testimonial" && (
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* জামাত অনুযায়ী ফিল্টার */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={entryJamatFilter}
                    onChange={(e) => {
                      const j = e.target.value;
                      setEntryJamatFilter(j);
                      const matching = students.filter(s => !j || j === "সকল জামাত" || s.className?.toLowerCase().includes(j.toLowerCase()));
                      if (matching.length > 0) setSelectedStudentId(matching[0].id);
                    }}
                    className="w-44 sm:w-48 appearance-none px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map(c => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* শিক্ষার্থী নির্বাচন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষার্থী:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {students
                    .filter(s => !entryJamatFilter || entryJamatFilter === "সকল জামাত" || s.className?.toLowerCase().includes(entryJamatFilter.toLowerCase()))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.roll || "-"})</option>
                    ))}
                </select>
              </div>

              {/* শিক্ষাবর্ষ নির্বাচন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষাবর্ষ:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setTestimonialData(prev => ({ ...prev, academicYear: e.target.value }));
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* এডিট বাটন ও টুলস */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsTestimonialEditing(!isTestimonialEditing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isTestimonialEditing
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
                }`}
                title="প্রত্যয়ন পত্রের যে কোনো লেখা পরিবর্তন করুন"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isTestimonialEditing ? "✓ এডিট সম্পন্ন (প্রিভিউ)" : "✏️ লেখা এডিট করুন"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTestimonial}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                title="মূল ডেটা ফিরিয়ে আনুন"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          {/* এডিট মোড খোলা থাকলে দ্রুত কাস্টমাইজেশন টুলবার */}
          {isTestimonialEditing && (
            <div className="no-print p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>রেডিমেড টেমপ্লেট:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate("general")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      সাধারণ প্রত্যয়ন
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate("character")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      চারিত্রিক সনদ
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate("hifz")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      হিফজ সমাপ্তি
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetTemplate("tc")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      ছাড়পত্র (টিসি)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-amber-950 cursor-pointer flex items-center gap-1.5 select-none">
                    <input
                      type="checkbox"
                      checked={useCustomFullParagraph}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseCustomFullParagraph(checked);
                        if (checked && !testimonialData.customFullParagraph) {
                          setTestimonialData(prev => ({
                            ...prev,
                            customFullParagraph: `এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${prev.studentName || currentStudent.name}, পিতা: ${prev.fatherName || currentStudent.guardianName}, মাতা: ${prev.motherName || "আমেনা বেগম"}, অত্র প্রতিষ্ঠানে ${prev.academicYear || selectedYear} সনে ${prev.className || currentStudent.className} শ্রেণীতে অধ্যয়নরত ছিল/ছিলেন। তার রোল নং: ${prev.roll || currentStudent.roll}, রেজিস্ট্রেশন নং: ${prev.regNo || currentStudent.id}।\n\n${prev.conductText}\n\n${prev.wishesText}`
                          }));
                        }
                      }}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>সম্পূর্ণ নিজস্ব প্যারাগ্রাফ লিখুন</span>
                  </label>
                </div>
              </div>

              <p className="text-[11px] text-amber-800">
                💡 <strong>নির্দেশনা:</strong> নিচে হলুদ বর্ডারযুক্ত প্রতিটি বাক্সে সরাসরি লিখে যে কোনো শব্দ, নাম, ঠিকানা বা প্যারাগ্রাফ পরিবর্তন করতে পারবেন। পরিবর্তন শেষে <strong>&quot;এডিট সম্পন্ন&quot;</strong> চাপুন অথবা সরাসরি <strong>&quot;প্রিন্ট করুন&quot;</strong> চাপুন (প্রিন্টে কোনো বর্ডার বা হলুদ দাগ আসবে না)।
              </p>
            </div>
          )}

          {/* প্রত্যয়ন পত্র প্রিন্ট এলাকা */}
          <div className="border-4 border-double border-slate-800 p-8 sm:p-14 rounded-2xl space-y-7 bg-white relative overflow-hidden">
            {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো (Watermark Logo) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
              <img src={activeLogo} alt="watermark" className="w-72 h-72 object-contain" />
            </div>

            {/* হেডার / মাদরাসা নাম ও ঠিকানা */}
            <div className="text-center space-y-1 relative z-10">
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl p-1 bg-white border border-slate-200 shadow-xs">
                <img src={activeLogo} alt="মাদরাসা লোগো" className="w-full h-full object-contain" />
              </div>
              {isTestimonialEditing ? (
                <div className="space-y-2 max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={testimonialData.institutionName}
                    onChange={(e) => setTestimonialData({ ...testimonialData, institutionName: e.target.value })}
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center w-full bg-amber-50/70 border border-dashed border-amber-400 rounded-xl p-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600 print:border-none print:bg-transparent"
                    placeholder="মাদরাসার নাম"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <input
                      type="text"
                      value={testimonialData.institutionAddress}
                      onChange={(e) => setTestimonialData({ ...testimonialData, institutionAddress: e.target.value })}
                      className="text-xs text-slate-700 font-medium text-center bg-amber-50/70 border border-dashed border-amber-400 rounded-lg p-1 w-full sm:flex-1 focus:outline-none print:border-none print:bg-transparent"
                      placeholder="মাদরাসার ঠিকানা"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">• ফোন:</span>
                      <input
                        type="text"
                        value={testimonialData.institutionPhone}
                        onChange={(e) => setTestimonialData({ ...testimonialData, institutionPhone: e.target.value })}
                        className="text-xs font-mono text-slate-700 text-center bg-amber-50/70 border border-dashed border-amber-400 rounded-lg p-1 w-36 focus:outline-none print:border-none print:bg-transparent"
                        placeholder="ফোন নম্বর"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {testimonialData.institutionName || madrasa.name}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {testimonialData.institutionAddress || madrasa.address} • ফোন: {testimonialData.institutionPhone || madrasa.phone}
                  </p>
                </>
              )}

              {/* প্রত্যয়ন পত্র ব্যাজ / টাইটেল */}
              <div className="pt-3">
                {isTestimonialEditing ? (
                  <div className="flex justify-center">
                    <input
                      type="text"
                      value={testimonialData.title}
                      onChange={(e) => setTestimonialData({ ...testimonialData, title: e.target.value })}
                      className="px-6 py-1.5 rounded-full bg-slate-800 text-white text-sm font-black uppercase tracking-widest text-center border-2 border-dashed border-amber-300 focus:outline-none print:border-none shadow-xs"
                      placeholder="শিরোনাম (যেমন: প্রত্যয়ন পত্র)"
                    />
                  </div>
                ) : (
                  <span className="inline-block px-6 py-1.5 rounded-full bg-slate-800 text-white text-sm font-black uppercase tracking-widest">
                    {testimonialData.title || "প্রত্যয়ন পত্র"}
                  </span>
                )}
              </div>
            </div>

            {/* মূল বক্তব্য / তথ্য এলাকা */}
            {useCustomFullParagraph ? (
              // সম্পূর্ণ কাস্টম প্যারাগ্রাফ মোড
              <div className="pt-4">
                {isTestimonialEditing ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-900 block">সম্পূর্ণ প্রত্যয়ন বার্তা (ইচ্ছামতো লিখুন):</label>
                    <textarea
                      rows={6}
                      value={testimonialData.customFullParagraph}
                      onChange={(e) => setTestimonialData({ ...testimonialData, customFullParagraph: e.target.value })}
                      className="w-full p-3.5 bg-amber-50/70 border border-dashed border-amber-400 rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium print:border-none print:bg-transparent"
                      placeholder="এখানে আপনার মনের মতো যে কোনো ভাষায় সম্পূর্ণ প্রত্যয়ন পত্রের বক্তব্য লিখুন..."
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-800 leading-loose text-justify font-medium whitespace-pre-line">
                    {testimonialData.customFullParagraph || "তথ্য প্রদান করা হয়নি।"}
                  </p>
                )}
              </div>
            ) : isTestimonialEditing ? (
              // ফিল্ড-বাই-ফিল্ড এডিট মোড
              <div className="text-sm text-slate-800 leading-loose text-justify font-medium pt-2 space-y-4">
                <div className="p-4 bg-amber-50/40 border border-dashed border-amber-300 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-amber-950 pb-1 border-b border-amber-200">
                    শিক্ষার্থীর মূল তথ্যাদি সম্পাদনা:
                  </div>
                  <div className="leading-loose flex flex-wrap items-center gap-1.5">
                    <span>এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,</span>
                    <input
                      type="text"
                      value={testimonialData.studentName}
                      onChange={(e) => setTestimonialData({ ...testimonialData, studentName: e.target.value })}
                      className="font-black text-slate-900 underline px-2 py-0.5 bg-white border border-amber-400 rounded focus:outline-none shadow-2xs text-sm"
                      placeholder="ছাত্রের নাম"
                      style={{ minWidth: "140px" }}
                    />
                    <span>, পিতা:</span>
                    <input
                      type="text"
                      value={testimonialData.fatherName}
                      onChange={(e) => setTestimonialData({ ...testimonialData, fatherName: e.target.value })}
                      className="underline px-2 py-0.5 bg-white border border-amber-400 rounded focus:outline-none text-slate-800 shadow-2xs text-sm"
                      placeholder="পিতার নাম"
                      style={{ minWidth: "140px" }}
                    />
                    <span>, মাতা:</span>
                    <input
                      type="text"
                      value={testimonialData.motherName}
                      onChange={(e) => setTestimonialData({ ...testimonialData, motherName: e.target.value })}
                      className="underline px-2 py-0.5 bg-white border border-amber-400 rounded focus:outline-none text-slate-800 shadow-2xs text-sm"
                      placeholder="মাতার নাম"
                      style={{ minWidth: "120px" }}
                    />
                    <span>, অত্র প্রতিষ্ঠানে</span>
                    <input
                      type="text"
                      value={testimonialData.academicYear}
                      onChange={(e) => setTestimonialData({ ...testimonialData, academicYear: e.target.value })}
                      className="font-bold px-2 py-0.5 bg-white border border-amber-400 rounded text-center focus:outline-none w-24 shadow-2xs text-sm"
                      placeholder="শিক্ষাবর্ষ"
                    />
                    <span>সনে</span>
                    <input
                      type="text"
                      value={testimonialData.className}
                      onChange={(e) => setTestimonialData({ ...testimonialData, className: e.target.value })}
                      className="font-black text-indigo-900 px-2 py-0.5 bg-white border border-amber-400 rounded focus:outline-none shadow-2xs text-sm"
                      placeholder="জামাত"
                      style={{ minWidth: "120px" }}
                    />
                    <span>শ্রেণীতে অধ্যয়নরত ছিল/ছিলেন। তার রোল নং:</span>
                    <input
                      type="text"
                      value={testimonialData.roll}
                      onChange={(e) => setTestimonialData({ ...testimonialData, roll: e.target.value })}
                      className="font-mono font-bold px-2 py-0.5 bg-white border border-amber-400 rounded text-center focus:outline-none w-16 shadow-2xs text-sm"
                      placeholder="রোল"
                    />
                    <span>, রেজিস্ট্রেশন নং:</span>
                    <input
                      type="text"
                      value={testimonialData.regNo}
                      onChange={(e) => setTestimonialData({ ...testimonialData, regNo: e.target.value })}
                      className="font-mono font-bold px-2 py-0.5 bg-white border border-amber-400 rounded text-center focus:outline-none w-28 shadow-2xs text-sm"
                      placeholder="রেজিস্ট্রেশন নং"
                    />
                    <span>।</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-950 block">চরিত্র ও আচরণ বিবরণী (সম্পাদনা করুন):</label>
                  <textarea
                    rows={2}
                    value={testimonialData.conductText}
                    onChange={(e) => setTestimonialData({ ...testimonialData, conductText: e.target.value })}
                    className="w-full p-2.5 bg-white border border-dashed border-amber-400 rounded-xl text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                    placeholder="চরিত্র ও আচরণ সম্পর্কিত বক্তব্য..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-950 block">শুভকামনা ও দোয়া (সম্পাদনা করুন):</label>
                  <textarea
                    rows={2}
                    value={testimonialData.wishesText}
                    onChange={(e) => setTestimonialData({ ...testimonialData, wishesText: e.target.value })}
                    className="w-full p-2.5 bg-white border border-dashed border-amber-400 rounded-xl text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-2xs"
                    placeholder="ভবিষ্যৎ সাফল্য ও দোয়া বাক্য..."
                  />
                </div>
              </div>
            ) : (
              // সাধারণ ভিউ / প্রিন্ট ভিউ
              <div className="text-sm text-slate-800 leading-loose text-justify font-medium pt-4 space-y-4">
                <p>
                  এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <strong className="font-black underline px-2">{testimonialData.studentName || currentStudent.name}</strong>, 
                  পিতা: <span className="underline px-2">{testimonialData.fatherName || currentStudent.guardianName}</span>, 
                  মাতা: <span className="underline px-2">{testimonialData.motherName || "আমেনা বেগম"}</span>, 
                  অত্র প্রতিষ্ঠানে <span className="font-bold">{testimonialData.academicYear || selectedYear}</span> সনে <strong className="font-black text-indigo-900">{testimonialData.className || currentStudent.className}</strong> শ্রেণীতে অধ্যয়নরত ছিল/ছিলেন। 
                  তার রোল নং: <span className="font-mono font-bold">{testimonialData.roll || currentStudent.roll}</span>, রেজিস্ট্রেশন নং: <span className="font-mono font-bold">{testimonialData.regNo || currentStudent.id}</span>।
                </p>
                <p>{testimonialData.conductText}</p>
                <p>{testimonialData.wishesText}</p>
              </div>
            )}

            {/* স্বাক্ষর ও সীল এলাকা */}
            {isTestimonialEditing ? (
              <div className="pt-8 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="text-center w-52 sm:w-60 space-y-1">
                  <div className="border-t border-slate-500 pt-1"></div>
                  <input
                    type="text"
                    value={testimonialData.signLeft}
                    onChange={(e) => setTestimonialData({ ...testimonialData, signLeft: e.target.value })}
                    className="w-full text-center text-xs font-bold bg-amber-50/70 border border-dashed border-amber-400 rounded p-1 focus:outline-none"
                    placeholder="বাম পাশের স্বাক্ষর পদবী"
                  />
                </div>
                <div className="text-center w-52 sm:w-60 space-y-1">
                  <div className="border-t border-slate-500 pt-1"></div>
                  <input
                    type="text"
                    value={testimonialData.signRight}
                    onChange={(e) => setTestimonialData({ ...testimonialData, signRight: e.target.value })}
                    className="w-full text-center text-xs font-bold bg-amber-50/70 border border-dashed border-amber-400 rounded p-1 focus:outline-none"
                    placeholder="ডান পাশের স্বাক্ষর পদবী"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-16 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="text-center border-t border-slate-500 pt-2 w-48">{testimonialData.signLeft}</div>
                <div className="text-center border-t border-slate-500 pt-2 w-48">{testimonialData.signRight}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ৯. সার্টিফিকেট / সনদপত্র (সাহাদাত ভাইয়ের নির্দেশনা অনুযায়ী বড় আকারে পূর্ণাঙ্গ বিষয়াদি ও এডিট অপশন সহ) */}
      {activeType === "certificate" && (
        <div className="bg-slate-100/60 p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none print:m-0 print:bg-transparent">
          {/* ফিল্টার ও কন্ট্রোল টুলবার */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* জামাত ফিল্টার */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">জামাত লিস্ট:</label>
                <div className="relative">
                  <select
                    value={entryJamatFilter}
                    onChange={(e) => {
                      const j = e.target.value;
                      setEntryJamatFilter(j);
                      const matching = students.filter(s => !j || j === "সকল জামাত" || s.className?.toLowerCase().includes(j.toLowerCase()));
                      if (matching.length > 0) setSelectedStudentId(matching[0].id);
                    }}
                    className="w-44 sm:w-48 appearance-none px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="সকল জামাত">সকল জামাত</option>
                    {jamatOptions.map(c => (
                      <option key={c} value={c}>{cleanClassName(c)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* শিক্ষার্থী নির্বাচন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষার্থী:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {students
                    .filter(s => !entryJamatFilter || entryJamatFilter === "সকল জামাত" || s.className?.toLowerCase().includes(entryJamatFilter.toLowerCase()))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.roll || "-"})</option>
                    ))}
                </select>
              </div>

              {/* শিক্ষাবর্ষ নির্বাচন */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষাবর্ষ:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCertData(prev => ({ ...prev, academicYear: e.target.value }));
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* এডিট ও রিসেট বোতাম */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsCertificateEditing(!isCertificateEditing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isCertificateEditing
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300"
                }`}
                title="সার্টিফিকেটের যে কোনো তথ্য পরিবর্তন করুন"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isCertificateEditing ? "✓ এডিট সম্পন্ন (প্রিভিউ)" : "✏️ সার্টিফিকেট এডিট করুন"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetCertificate}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                title="মূল ডেটায় রিসেট করুন"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          {/* এডিট মোড খোলা থাকলে দ্রুত কাস্টমাইজেশন টুলবার */}
          {isCertificateEditing && (
            <div className="no-print p-4 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-3 animate-in fade-in shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>রেডিমেড সনদ টেমপ্লেট:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => applyCertPreset("academic")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      বার্ষিক পরীক্ষা সনদ
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCertPreset("hifz")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      হিফজ সমাপন সনদ
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCertPreset("dawra")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      দাওরায়ে হাদীস সনদ
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCertPreset("merit")}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-950 cursor-pointer shadow-2xs"
                    >
                      মেধাবৃত্তি ও সম্মাননা
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-amber-950 cursor-pointer flex items-center gap-1.5 select-none">
                    <input
                      type="checkbox"
                      checked={useCustomCertBody}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseCustomCertBody(checked);
                        if (checked && !certData.customBodyText) {
                          setCertData(prev => ({
                            ...prev,
                            customBodyText: `প্রমাণ করা যাইতেছে যে,\n${prev.studentName || currentStudent.name}\nপিতা: ${prev.fatherName || currentStudent.guardianName}, মাতা: ${prev.motherName || "আমেনা বেগম"}\n\nঅত্র মাদরাসা হইতে ${prev.academicYear || selectedYear} শিক্ষাবর্ষে ${prev.className || currentStudent.className} জামাতের ${prev.examName} এ নিয়মিত শিক্ষার্থী হিসেবে অংশগ্রহণ করতঃ কৃতিত্বের সহিত ${prev.obtainedGrade} বিভাগে উত্তীর্ণ হইয়াছেন।\n\nএতদুপলক্ষে তাহাকে অত্র শিক্ষাগত যোগ্যতার সনদপত্র প্রদান করা হইল।`
                          }));
                        }
                      }}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>সম্পূর্ণ নিজস্ব বক্তব্য লিখুন</span>
                  </label>
                </div>
              </div>

              <p className="text-[11px] text-amber-800">
                💡 <strong>নির্দেশনা:</strong> সার্টিফিকেটের প্রতিটি প্রাতিষ্ঠানিক তথ্য (নাম, পিতা-মাতা, পরীক্ষার নাম, জামাত, গ্রেড, জিপিএ, মেধা স্থান ও স্বাক্ষর) সরাসরি ক্লিক করে ইচ্ছামতো এডিট করতে পারবেন। পরিবর্তন শেষে <strong>&quot;এডিট সম্পন্ন&quot;</strong> চাপুন অথবা সরাসরি <strong>&quot;প্রিন্ট করুন&quot;</strong> চাপুন।
              </p>
            </div>
          )}

          {/* রাজকীয় ও পূর্ণাঙ্গ বড় আকারের সার্টিফিকেট (Printable Certificate Area) */}
          <div className="relative max-w-4xl mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-br from-[#102a3a] via-[#0b1d28] to-[#08151e] shadow-2xl print:shadow-none print:p-0 print:m-0 print:border-none print:max-w-none print:w-full">
            {/* গোল্ডেন ও রাজকীয় ডাবল বর্ডার ফ্রেম */}
            <div className="rounded-2xl p-2.5 sm:p-4 bg-gradient-to-br from-[#FFFDF9] via-[#FAF7EE] to-[#F5EFE6] border-4 border-[#b8973b] relative overflow-hidden print:border-4 print:border-[#b8973b] print:p-4">
              
              {/* ভেতরের সূক্ষ্ম গোল্ডেন বর্ডার ও কর্নার মোটিফ */}
              <div className="border-2 border-dashed border-[#b8973b]/80 rounded-xl p-6 sm:p-12 relative overflow-hidden bg-white/60 backdrop-blur-xs space-y-6 sm:space-y-8 print:p-6 print:border-2">
                
                {/* চার কোণার নান্দনিক গোল্ডেন আর্ট ফ্রেম মোটিফ */}
                <div className="absolute top-2 left-2 w-7 h-7 border-t-4 border-l-4 border-[#b8973b] rounded-tl-lg pointer-events-none" />
                <div className="absolute top-2 right-2 w-7 h-7 border-t-4 border-r-4 border-[#b8973b] rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-7 h-7 border-b-4 border-l-4 border-[#b8973b] rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-7 h-7 border-b-4 border-r-4 border-[#b8973b] rounded-br-lg pointer-events-none" />

                {/* ব্যাকগ্রাউন্ডে জলছাপ লোগো (Watermark Logo) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
                  <img src={activeLogo} alt="watermark" className="w-80 h-80 object-contain" />
                </div>

                {/* ১. শীর্ষ বিসমিল্লাহ ক্যালিগ্রাফি হেডার */}
                <div className="text-center pt-1">
                  <div className="text-lg sm:text-xl font-serif font-bold text-[#8a6d2b] tracking-widest select-none">
                    {certData.bismillah}
                  </div>
                </div>

                {/* ২. প্রতিষ্ঠানের পূর্ণাঙ্গ হেডার ও মনোগ্রাম */}
                <div className="text-center space-y-1.5 relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-2xl p-1 bg-white border-2 border-[#b8973b] shadow-md">
                    <img src={activeLogo} alt="মাদরাসা লোগো" className="w-full h-full object-contain" />
                  </div>

                  {isCertificateEditing ? (
                    <div className="space-y-2 max-w-xl mx-auto">
                      <input
                        type="text"
                        value={certData.institutionName}
                        onChange={(e) => setCertData({ ...certData, institutionName: e.target.value })}
                        className="text-2xl sm:text-3xl font-black text-[#0c2331] tracking-tight text-center w-full bg-amber-50/70 border border-dashed border-amber-400 rounded-xl p-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600 print:border-none print:bg-transparent"
                        placeholder="মাদরাসার নাম"
                      />
                      <input
                        type="text"
                        value={certData.institutionAddress}
                        onChange={(e) => setCertData({ ...certData, institutionAddress: e.target.value })}
                        className="text-xs text-slate-700 font-medium text-center bg-amber-50/70 border border-dashed border-amber-400 rounded-lg p-1 w-full focus:outline-none print:border-none print:bg-transparent"
                        placeholder="মাদরাসার ঠিকানা ও যোগাযোগ"
                      />
                      <input
                        type="text"
                        value={certData.boardInfo}
                        onChange={(e) => setCertData({ ...certData, boardInfo: e.target.value })}
                        className="text-[11px] font-bold text-[#8a6d2b] text-center bg-amber-50/70 border border-dashed border-amber-400 rounded-lg p-1 w-full focus:outline-none print:border-none print:bg-transparent"
                        placeholder="শিক্ষা বোর্ড কোড ও অনুমোদন তথ্য"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-4xl font-black text-[#0c2331] tracking-tight">
                        {certData.institutionName || madrasa.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {certData.institutionAddress || madrasa.address} • ফোন: {madrasa.phone}
                      </p>
                      <p className="text-[11px] font-bold text-[#8a6d2b] tracking-wide">
                        {certData.boardInfo}
                      </p>
                    </>
                  )}
                </div>

                {/* ৩. সনদ নম্বর, মেডেল ও ইস্যু তারিখ স্ট্রিপ */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-b border-[#b8973b]/40 py-2.5 text-xs font-bold text-slate-700 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">সনদ নং:</span>
                    {isCertificateEditing ? (
                      <input
                        type="text"
                        value={certData.certNo}
                        onChange={(e) => setCertData({ ...certData, certNo: e.target.value })}
                        className="font-mono text-xs px-2 py-0.5 bg-amber-50 border border-amber-300 rounded focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono text-[#0c2331]">{certData.certNo}</span>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 text-[#8a6d2b] border border-[#b8973b]/40 font-bold text-[11px]">
                    <Award className="w-3.5 h-3.5 text-[#b8973b]" />
                    <span>অনার্স অব একাডেমিক এক্সিলেন্স • মুমতাজ</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">ইস্যু তারিখ:</span>
                    {isCertificateEditing ? (
                      <input
                        type="text"
                        value={certData.issueDate}
                        onChange={(e) => setCertData({ ...certData, issueDate: e.target.value })}
                        className="text-xs px-2 py-0.5 bg-amber-50 border border-amber-300 rounded focus:outline-none"
                      />
                    ) : (
                      <span className="text-[#0c2331]">{certData.issueDate}</span>
                    )}
                  </div>
                </div>

                {/* ৪. রাজকীয় সনদপত্র টাইটেল ব্যানার */}
                <div className="text-center pt-2 relative z-10">
                  {isCertificateEditing ? (
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <input
                        type="text"
                        value={certData.title}
                        onChange={(e) => setCertData({ ...certData, title: e.target.value })}
                        className="text-xl sm:text-2xl font-black text-white bg-[#0c2331] px-8 py-2 rounded-full uppercase tracking-wider text-center w-full border-2 border-[#b8973b] shadow-md focus:outline-none"
                        placeholder="সনদপত্র শিরোনাম"
                      />
                      <input
                        type="text"
                        value={certData.subTitle}
                        onChange={(e) => setCertData({ ...certData, subTitle: e.target.value })}
                        className="text-xs font-serif italic text-center w-full bg-amber-50 border border-amber-300 rounded p-1"
                        placeholder="সাব-টাইটেল (ইংরেজি)"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="inline-block px-8 py-2 rounded-full bg-gradient-to-r from-[#0c2331] via-[#10344a] to-[#0c2331] text-white text-lg sm:text-2xl font-black uppercase tracking-widest shadow-md border-2 border-[#b8973b]">
                        {certData.title}
                      </div>
                      <p className="text-xs font-serif italic text-slate-500 mt-1 tracking-wider">
                        {certData.subTitle}
                      </p>
                    </div>
                  )}
                </div>

                {/* ৫. খাঁটি প্রাতিষ্ঠানিক সনদপত্রের বয়ান (Academic Certification Statement) */}
                <div className="relative z-10 text-slate-800 text-sm leading-relaxed space-y-4">
                  {useCustomCertBody ? (
                    // সম্পূর্ণ কাস্টম বয়ান
                    <div>
                      {isCertificateEditing ? (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-amber-950 block">সম্পূর্ণ নিজস্ব সনদ বয়ান:</label>
                          <textarea
                            rows={6}
                            value={certData.customBodyText}
                            onChange={(e) => setCertData({ ...certData, customBodyText: e.target.value })}
                            className="w-full p-4 bg-amber-50/80 border border-dashed border-amber-400 rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 font-medium"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-slate-800 leading-loose text-justify font-medium whitespace-pre-line">
                          {certData.customBodyText}
                        </p>
                      )}
                    </div>
                  ) : isCertificateEditing ? (
                    // ফিল্ড বাই ফিল্ড এডিট মোড (বিশুদ্ধ শিক্ষাগত ও সনদপত্রের ফিল্ডসমূহ)
                    <div className="p-4 bg-amber-50/60 border border-dashed border-amber-300 rounded-2xl space-y-4">
                      <div className="text-xs font-bold text-amber-950 pb-1 border-b border-amber-200">
                        সনদপত্রের তথ্যাদি সম্পাদনা করুন:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">শিক্ষার্থীর নাম:</label>
                          <input
                            type="text"
                            value={certData.studentName}
                            onChange={(e) => setCertData({ ...certData, studentName: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">পিতার নাম:</label>
                          <input
                            type="text"
                            value={certData.fatherName}
                            onChange={(e) => setCertData({ ...certData, fatherName: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">মাতার নাম:</label>
                          <input
                            type="text"
                            value={certData.motherName}
                            onChange={(e) => setCertData({ ...certData, motherName: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">জামাত / বিভাগ:</label>
                          <input
                            type="text"
                            value={certData.className}
                            onChange={(e) => setCertData({ ...certData, className: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded font-bold text-indigo-900"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">শিক্ষাবর্ষ / সেশন:</label>
                          <input
                            type="text"
                            value={certData.academicYear}
                            onChange={(e) => setCertData({ ...certData, academicYear: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">রোল নম্বর:</label>
                          <input
                            type="text"
                            value={certData.roll}
                            onChange={(e) => setCertData({ ...certData, roll: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">রেজিস্ট্রেশন নম্বর:</label>
                          <input
                            type="text"
                            value={certData.regNo}
                            onChange={(e) => setCertData({ ...certData, regNo: e.target.value })}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block text-xs mb-1">পরীক্ষার নাম:</label>
                        <input
                          type="text"
                          value={certData.examName}
                          onChange={(e) => setCertData({ ...certData, examName: e.target.value })}
                          className="w-full p-2 bg-white border border-amber-300 rounded text-xs"
                          placeholder="যেমন: বার্ষিক চূড়ান্ত কেন্দ্রীয় পরীক্ষা"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 block text-xs">সনদ প্রদানের মূল প্রত্যয়ন বাক্য:</label>
                        <textarea
                          rows={2}
                          value={certData.certStatement}
                          onChange={(e) => setCertData({ ...certData, certStatement: e.target.value })}
                          className="w-full p-2 bg-white border border-amber-300 rounded text-xs leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 block text-xs">সনদপত্র সমাপনী স্বীকৃতি বাক্য:</label>
                        <input
                          type="text"
                          value={certData.confermentConclusion}
                          onChange={(e) => setCertData({ ...certData, confermentConclusion: e.target.value })}
                          className="w-full p-2 bg-white border border-amber-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    // খাঁটি প্রাতিষ্ঠানিক সনদপত্রের স্ট্যান্ডার্ড উপস্থাপনা
                    <div className="space-y-4 text-center font-medium leading-loose pt-1">
                      <p className="text-sm font-semibold text-slate-600 tracking-wide">
                        {certData.confermentLead || "প্রমাণ করা যাইতেছে যে,"}
                      </p>

                      <div className="py-1">
                        <span className="text-2xl sm:text-3xl font-black text-[#0c2331] underline decoration-[#b8973b] decoration-2 underline-offset-8">
                          {certData.studentName || currentStudent.name}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 leading-relaxed">
                        পিতা: <strong className="text-slate-900 font-bold">{certData.fatherName || currentStudent.guardianName}</strong> , 
                        মাতা: <strong className="text-slate-900 font-bold">{certData.motherName || "আমেনা বেগম"}</strong>
                      </p>

                      <p className="text-sm text-slate-800 leading-loose max-w-2xl mx-auto">
                        উক্ত শিক্ষার্থী অত্র মাদরাসা হইতে <strong className="text-slate-900 font-bold">{certData.academicYear || selectedYear}</strong> শিক্ষাবর্ষে <strong className="text-indigo-950 font-black">{certData.className || currentStudent.className}</strong> জামাতের <strong className="text-slate-900 font-bold">{certData.examName}</strong>-এ নিয়মিত শিক্ষার্থী হিসেবে অংশগ্রহণ করতঃ কৃতিত্বের সহিত <strong className="text-emerald-900 font-black">{certData.obtainedGrade}</strong> বিভাগে উত্তীর্ণ হইয়াছেন। তার রোল নং: <span className="font-mono font-bold text-slate-900">{certData.roll || currentStudent.roll}</span>, রেজিস্ট্রেশন নং: <span className="font-mono font-bold text-slate-900">{certData.regNo || currentStudent.id}</span>।
                      </p>

                      <p className="text-sm text-slate-800 leading-relaxed italic max-w-2xl mx-auto">
                        {certData.certStatement}
                      </p>

                      <p className="text-sm font-bold text-[#0c2331] pt-1">
                        {certData.confermentConclusion}
                      </p>
                    </div>
                  )}

                  {/* ৬. একাডেমিক ফলাফল ও মেধা মূল্যায়ন গ্রিড (৪-কলাম মেধা ম্যাট্রিক্স) */}
                  <div className="pt-2">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 border-2 border-[#b8973b]/50 shadow-xs">
                      {isCertificateEditing ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">মেধা স্থান:</label>
                            <input
                              type="text"
                              value={certData.meritPosition}
                              onChange={(e) => setCertData({ ...certData, meritPosition: e.target.value })}
                              className="w-full p-1 bg-white border border-amber-300 rounded font-bold text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">প্রাপ্ত গ্রেড / বিভাগ:</label>
                            <input
                              type="text"
                              value={certData.obtainedGrade}
                              onChange={(e) => setCertData({ ...certData, obtainedGrade: e.target.value })}
                              className="w-full p-1 bg-white border border-amber-300 rounded font-bold text-center text-emerald-800"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">প্রাপ্ত জিপিএ:</label>
                            <input
                              type="text"
                              value={certData.obtainedGpa}
                              onChange={(e) => setCertData({ ...certData, obtainedGpa: e.target.value })}
                              className="w-full p-1 bg-white border border-amber-300 rounded font-bold text-center text-indigo-900 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">মোট নম্বর / মূল্যায়ন:</label>
                            <input
                              type="text"
                              value={certData.totalMarks}
                              onChange={(e) => setCertData({ ...certData, totalMarks: e.target.value })}
                              className="w-full p-1 bg-white border border-amber-300 rounded font-bold text-center"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-[#b8973b]/30">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-500 block uppercase">মেধা স্থান</span>
                            <span className="text-xs sm:text-sm font-black text-[#0c2331] block">{certData.meritPosition}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-500 block uppercase">প্রাপ্ত গ্রেড / বিভাগ</span>
                            <span className="text-xs sm:text-sm font-black text-emerald-800 block">{certData.obtainedGrade}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-500 block uppercase">প্রাপ্ত জিপিএ</span>
                            <span className="text-xs sm:text-sm font-mono font-black text-indigo-950 block">{certData.obtainedGpa}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-500 block uppercase">মোট নম্বর</span>
                            <span className="text-xs sm:text-sm font-mono font-black text-[#8a6d2b] block">{certData.totalMarks}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ৭. প্রমাণীকরণ ও অফিশিয়াল ৩টি স্বাক্ষর (পরীক্ষা নিয়ন্ত্রক, নাজেমে তালিমাত, মুহতামিম) */}
                <div className="pt-8 sm:pt-12 relative z-10 border-t border-[#b8973b]/30">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-xs font-bold text-slate-800">
                    {/* স্বাক্ষর ১: পরীক্ষা নিয়ন্ত্রক */}
                    <div className="text-center w-48 sm:w-52 space-y-1">
                      <div className="border-t-2 border-slate-700/80 pt-1.5"></div>
                      {isCertificateEditing ? (
                        <input
                          type="text"
                          value={certData.sign1}
                          onChange={(e) => setCertData({ ...certData, sign1: e.target.value })}
                          className="w-full text-center text-xs font-bold bg-amber-50 border border-amber-300 rounded p-1"
                        />
                      ) : (
                        <span className="block text-slate-800">{certData.sign1}</span>
                      )}
                    </div>

                    {/* অফিশিয়াল ডিজিটাল সীলমোহর (মাঝখানে) */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-[#b8973b] p-1 flex items-center justify-center text-center select-none shadow-xs bg-white/70">
                      <div className="w-full h-full rounded-full border border-[#b8973b] flex flex-col items-center justify-center p-1 text-[8px] font-black text-[#8a6d2b] leading-tight">
                        <ScrollText className="w-3.5 h-3.5 text-[#b8973b] mb-0.5" />
                        <span>অফিশিয়াল</span>
                        <span>সিলমোহর</span>
                      </div>
                    </div>

                    {/* স্বাক্ষর ২: নাজেমে তালিমাত */}
                    <div className="text-center w-48 sm:w-52 space-y-1">
                      <div className="border-t-2 border-slate-700/80 pt-1.5"></div>
                      {isCertificateEditing ? (
                        <input
                          type="text"
                          value={certData.sign2}
                          onChange={(e) => setCertData({ ...certData, sign2: e.target.value })}
                          className="w-full text-center text-xs font-bold bg-amber-50 border border-amber-300 rounded p-1"
                        />
                      ) : (
                        <span className="block text-slate-800">{certData.sign2}</span>
                      )}
                    </div>

                    {/* স্বাক্ষর ৩: মুহতামিম ও সীল */}
                    <div className="text-center w-48 sm:w-52 space-y-1">
                      <div className="border-t-2 border-slate-700/80 pt-1.5"></div>
                      {isCertificateEditing ? (
                        <input
                          type="text"
                          value={certData.sign3}
                          onChange={(e) => setCertData({ ...certData, sign3: e.target.value })}
                          className="w-full text-center text-xs font-bold bg-amber-50 border border-amber-300 rounded p-1"
                        />
                      ) : (
                        <span className="block text-slate-800">{certData.sign3}</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ১০. রসিদ পপআপ প্রিভিউ ও সরাসরি প্রিন্ট মডাল */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:m-0 print:static print:bg-transparent print:backdrop-blur-none print:block">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full print:bg-transparent print:rounded-none">
            
            {/* স্ক্রিন প্রিভিউ কন্ট্রোল বার (প্রিন্টে অদৃশ্য) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">মানি রিসিট ভাউচার প্রিভিউ</span>
              <button
                onClick={() => setActiveReceipt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* রসিদের মূল প্রিন্টযোগ্য বডি (সাহাদাত ভাইয়ের নির্দেশ অনুযায়ী শুধুমাত্র মাঝখানের বর্ডার করা ভাউচারটিই প্রিন্ট হবে) */}
            <div 
              id="printable-receipt"
              className="border-2 border-dashed border-slate-900 p-6 rounded-2xl space-y-4 bg-white max-w-[420px] mx-auto print:max-w-[400px] print:w-[400px] print:mx-auto print:p-5 print:rounded-2xl print:border-2 print:border-dashed print:border-slate-900 print:shadow-none print:m-0 relative overflow-hidden"
            >
              {/* ব্যাকগ্রাউন্ডে রসিদ জলছাপ লোগো */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300" style={{ opacity: watermarkOpacityValue }}>
                <img src={activeLogo} alt="watermark" className="w-48 h-48 object-contain" />
              </div>

              {/* মাদ্রাসার নাম ও পরিচিতি */}
              <div className="text-center space-y-1 pb-1 relative z-10">
                <div className="w-12 h-12 mx-auto mb-1">
                  <img src={activeLogo} alt="লোগো" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-black text-slate-950 tracking-tight">{madrasa.name}</h3>
                <p className="text-[11px] text-slate-600 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
                <div className="pt-1.5">
                  <span className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black border border-slate-900 uppercase tracking-wider shadow-xs print:bg-slate-900 print:text-white">
                    {activeReceipt.type === "khana" ? "খানা / মেস ফি আদায় রসিদ" : "মাসিক বেতন আদায় রসিদ"}
                  </span>
                </div>
              </div>

              {/* পূর্ণাঙ্গ তথ্য ছক */}
              <div className="text-xs space-y-2 border-t-2 border-b-2 border-dashed border-slate-300 py-3 print:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">রসিদ নম্বর:</span>
                  <span className="font-mono font-bold text-slate-950 text-xs">#{activeReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">আদায়ের তারিখ:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{activeReceipt.date}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 print:border-slate-300">
                  <span className="text-slate-600 font-bold">শিক্ষার্থীর নাম:</span>
                  <span className="font-black text-slate-950 text-sm">{activeReceipt.studentName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">জামাত ও রোল:</span>
                  <span className="font-bold text-slate-900 text-xs">{activeReceipt.jamat} (রোল: {activeReceipt.roll})</span>
                </div>
                {activeReceipt.guardianName && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold">পিতা / অভিভাবক:</span>
                    <span className="font-bold text-slate-800 text-xs">{activeReceipt.guardianName}</span>
                  </div>
                )}
                {activeReceipt.guardianPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold">মোবাইল নম্বর:</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">{activeReceipt.guardianPhone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 print:border-slate-300">
                  <span className="text-slate-600 font-bold">পরিশোধের খাত / মাস:</span>
                  <span className="font-black text-slate-950 text-xs">{activeReceipt.month}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold">পরিশোধ মাধ্যম:</span>
                  <span className="font-bold text-slate-800 text-xs">{activeReceipt.method}</span>
                </div>
                {activeReceipt.fee !== undefined && activeReceipt.discount !== undefined && activeReceipt.discount > 0 && (
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100 print:border-slate-300">
                    <span>মূল ধার্য: ৳{activeReceipt.fee} (ছাড়: ৳{activeReceipt.discount})</span>
                    <span className="text-emerald-700 font-bold">ছাড় সমন্বিত</span>
                  </div>
                )}
              </div>

              {/* আদায়কৃত মোট টাকা হাইলাইট বক্স */}
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-1 print:bg-slate-100 print:border-slate-900">
                <div className="flex justify-between items-center text-sm font-black text-slate-950">
                  <span className="text-xs uppercase font-extrabold tracking-wide">আদায়কৃত মোট টাকা:</span>
                  <span className="font-mono text-lg text-slate-950 font-black">
                    ৳ {activeReceipt.amount.toLocaleString("bn-BD")}
                  </span>
                </div>
                <div className="text-[10px] text-slate-700 font-medium italic border-t border-slate-300 pt-1 print:border-slate-500">
                  কথায়: {numberToBengaliWords(activeReceipt.amount)} টাকা মাত্র
                </div>
              </div>

              {/* স্বাক্ষর ও সীল */}
              <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-900">
                <div className="border-t-2 border-slate-900 pt-1.5 text-center w-32">
                  <span className="block text-[10px] font-bold text-slate-700">আদায়কারীর স্বাক্ষর</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-1.5 text-center w-36">
                  <span className="block text-[10px] font-bold text-slate-900">মুহতামিমের সীল ও স্বাক্ষর</span>
                </div>
              </div>

              {/* ডিজিটাল নোট */}
              <div className="text-center text-[9px] text-slate-400 font-medium pt-1">
                * এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল রসিদ কপি।
              </div>
            </div>

            {/* স্ক্রিন অ্যাকশন বোতাম (প্রিন্টে অদৃশ্য) */}
            <div className="flex items-center justify-end gap-2 pt-2 no-print">
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-[#1b686e] hover:bg-[#135156] text-white font-bold rounded-xl text-xs shadow-md shadow-teal-900/20 flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট রসিদ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* নতুন বছর / শিক্ষাবর্ষ যোগ করার মডাল */}
      {isAddYearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <Calendar className="w-5 h-5" />
                <h3 className="font-black text-slate-900 text-base">নতুন বছর / শিক্ষাবর্ষ যোগ করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddYearModalOpen(false); setNewYearInput(""); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">বছর বা শিক্ষাবর্ষের নাম:</label>
              <input
                type="text"
                autoFocus
                placeholder="যেমন: ২০২৭-২৮ বা ২০২৭, ২০২৮, ২০২৯"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newYearInput.trim()) {
                      const trimmed = newYearInput.trim();
                      if (!availableYears.includes(trimmed)) {
                        setAvailableYears([trimmed, ...availableYears]);
                      }
                      setSelectedHistoryYear(trimmed);
                      setSelectedYear(trimmed);
                      setNewYearInput("");
                      setIsAddYearModalOpen(false);
                    }
                  }
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                সামনে যেমন ২৭ সাল আসলে ২০২৭, ২৮ সাল আসলে ২০২৮, ২৯ সাল আসলে ২০২৯ বা সেশন (যেমন: ২০২৭-২৮) সহজে যোগ করতে পারবেন।
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsAddYearModalOpen(false); setNewYearInput(""); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newYearInput.trim()) {
                    const trimmed = newYearInput.trim();
                    if (!availableYears.includes(trimmed)) {
                      setAvailableYears([trimmed, ...availableYears]);
                    }
                    setSelectedHistoryYear(trimmed);
                    setSelectedYear(trimmed);
                    setNewYearInput("");
                    setIsAddYearModalOpen(false);
                  }
                }}
                disabled={!newYearInput.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
