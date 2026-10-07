"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Wallet, 
  Type, 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  UserPlus, 
  LayoutDashboard, 
  Search, 
  LogOut, 
  Phone, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Receipt, 
  QrCode, 
  Send, 
  CalendarCheck2, 
  BookMarked, 
  Utensils, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Bell,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  DollarSign,
  Calendar,
  CalendarDays,
  BarChart3,
  ArrowDownRight,
  Zap,
  ScrollText,
  FileCheck,
  ChevronDown,
  MessageSquare,
  ClipboardList,
  CreditCard,
  BookOpen,
  Banknote,
  Layers,
  Clock,
  Briefcase,
  CirclePlus,
  History,
  ShoppingCart,
  PenLine,
  Hash,
  FileText,
  Globe,
  HelpCircle,
  LayoutGrid,
  School,
  Settings,
  Users2,
  Home,
  Mail,
  Landmark,
  CalendarCheck,
  Printer,
  CircleMinus
} from "lucide-react";
import { 
  MadrasaInfo, 
  MadrasaClass, 
  Student, 
  TeacherStaff, 
  CashTransaction, 
  HifzRecord, 
  BoardingMealRecord, 
  DailyBazarItem, 
  DonationRecord 
} from "@/types";
import { AccountsView } from "@/components/accounts/AccountsView";
import { TeacherDirectory } from "@/components/teachers/TeacherDirectory";
import { ZakatDonationsView } from "@/components/donations/ZakatDonationsView";
import { AdmissionsView } from "@/components/admissions/AdmissionsView";
import { StudentsActivitiesHub } from "@/components/students/StudentsActivitiesHub";
import { AttendanceHubView } from "@/components/attendance/AttendanceHubView";
import { MonthlyContributorsView } from "@/components/donations/MonthlyContributorsView";
import { CommitteeMembersView } from "@/components/committee/CommitteeMembersView";
import { IdCardGeneratorView } from "@/components/idcard/IdCardGeneratorView";
import { ExamsHubView } from "@/components/exams/ExamsHubView";
import { DailyAuditReportView } from "@/components/reports/DailyAuditReportView";
import { SettingsView } from "@/components/settings/SettingsView";
import { SmsPortalView } from "@/components/sms/SmsPortalView";
import { StudentRegistersView } from "@/components/students/StudentRegistersView";
import { BazarManagementView } from "@/components/bazar/BazarManagementView";

import { Language, translations } from "@/lib/translations";
import { Navbar } from "@/components/layout/Navbar";

interface MainDashboardProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  madrasa: MadrasaInfo;
  classes: MadrasaClass[];
  students: Student[];
  teachers: TeacherStaff[];
  transactions: CashTransaction[];
  donations: DonationRecord[];
  hifzRecords: HifzRecord[];
  meals: BoardingMealRecord[];
  bazarItems: DailyBazarItem[];
  onOpenClass: (classItem: MadrasaClass) => void;
  onOpenScanner: () => void;
  onOpenStudentProfile: (student: Student) => void;
  onAddNewStudent: (student: Student) => void;
  onAddTransaction: (tx: Omit<CashTransaction, "id">) => void;
  onAddTeacher: (teacher: Omit<TeacherStaff, "id">) => void;
  onAddDonation: (donation: Omit<DonationRecord, "id">) => void;
  onAddHifzRecord: (record: Omit<HifzRecord, "id">) => void;
  onUpdateMeal: (recordId: string, type: "breakfast" | "lunch" | "dinner", val: boolean) => void;
  onAddBazarItem: (item: Omit<DailyBazarItem, "id">) => void;
  onAddStudentActivity?: (studentId: string, activity: any) => void;
  onUpdateMadrasa?: (updated: Partial<MadrasaInfo>) => void;
  onLogout: () => void;
}

export type DashboardPillar = 
  | "overview" 
  // ছাত্র/ছাত্রী (১৬টি হুবহু মেনু)
  | "student_admission"
  | "student_create"
  | "student_list"
  | "student_by_jamat"
  | "student_admission_report"
  | "student_summary"
  | "student_admission_register"
  | "student_register"
  | "student_blood_group"
  | "student_guardian_phones"
  | "student_phones"
  | "khana_entry"
  | "khana_list"
  | "khana_register"
  | "tuition_entry"
  | "tuition_list"
  | "tuition_register"
  | "admission_form_print"
  | "testimonial_print"
  | "certificate_print"
  // শিক্ষক (ভিডিও অনুযায়ী ৫টি অপশন)
  | "teacher_add"
  | "teacher_list"
  | "teacher_phones"
  | "teacher_salary_list"
  | "teacher_salary"
  | "teacher_attendance"
  // মাসিক চাঁদাদাতা
  | "monthly_donor_add"
  | "monthly_donor_list"
  | "monthly_donor_collect"
  | "monthly_donor_single"
  | "monthly_donor_matrix"
  // দানকারী
  | "donation_general_add"
  | "donation_general_list"
  | "donation_receipts"
  // যাকাত দাতা
  | "zakat_collect"
  | "zakat_donors_list"
  | "zakat_distribution"
  // বাজার (ভিডিও টিউটোরিয়াল অনুযায়ী ৬টি অপশন)
  | "bazar_entry"
  | "bazar_monthly_entry"
  | "bazar_list"
  | "bazar_monthly_list"
  | "bazar_report"
  | "bazar_monthly_report"
  // কমিটির সদস্যগণ
  | "committee_add"
  | "committee_list"
  | "committee_print"
  // হাজিরা
  | "att_students"
  | "att_students_report"
  | "att_teachers"
  | "att_teachers_report"
  // রেজাল্ট
  | "result_marks_entry"
  | "result_tabulation"
  | "result_marksheet"
  // জমা/খরচ হিসাব সমূহ
  | "acc_income_add"
  | "acc_expense_add"
  | "acc_income_list"
  | "acc_expense_list"
  | "acc_vouchers"
  | "acc_categories"
  // আইডি কার্ড
  | "idcard_student"
  | "idcard_teacher"
  // এসএমএস
  | "sms_guardian"
  | "sms_teacher"
  | "sms_templates"
  // একাউন্ট
  | "account_list"
  | "account_add"
  | "account_transfer"
  // ব্যাংক একাউন্ট
  | "bank_add"
  | "bank_list"
  // রিপোর্ট
  | "report_financial"
  | "report_student"
  | "report_collection"
  // সরাসরি প্রতিবেদনসমূহ
  | "report_daily_audit"
  | "report_yearly_audit"
  | "report_bank_audit"
  // সেটিং
  | "settings_profile"
  | "settings_personal"
  | "settings_expense_cat"
  | "settings_income_cat"
  | "settings_payment_methods"
  // লিগ্যাসি / অতিরিক্ত
  | "accounts" 
  | "students" 
  | "teachers" 
  | "donations" 
  | "admissions"
  | "classes"
  | "sections"
  | "subjects"
  | "sessions"
  | "id_cards"
  | "att_dashboard"
  | "att_employees"
  | "att_sessions"
  | "fee_structures"
  | "collect_payments"
  | "add_fees"
  | "salary_structures"
  | "process_salaries"
  | "salary_history"
  | "analytics"
  | "transactions"
  | "sales"
  | "exams_dashboard"
  | "manage_exams"
  | "exam_schedules"
  | "enter_results"
  | "view_results"
  | "combined_results"
  | "admit_cards"
  | "seat_tokens"
  | "grading_systems"
  | "exam_types"
  | "sms"
  | "notices"
  | "website"
  | "testimonials"
  | "help"
  | "committee"
  | "monthly_donors"
  | "audit_reports"
  | "settings";

export const MainDashboard: React.FC<MainDashboardProps> = ({
  language = "bn",
  onLanguageChange,
  madrasa,
  onUpdateMadrasa,
  classes,
  students,
  teachers,
  transactions,
  donations,
  hifzRecords,
  meals,
  bazarItems,
  onOpenClass,
  onOpenScanner,
  onOpenStudentProfile,
  onAddNewStudent,
  onAddTransaction,
  onAddTeacher,
  onAddDonation,
  onAddHifzRecord,
  onUpdateMeal,
  onAddBazarItem,
  onAddStudentActivity,
  onLogout,
}) => {
  const t = translations[language] || translations.bn;
  const [activePillar, setActivePillarState] = useState<DashboardPillar>("overview");
  const [pillarHistory, setPillarHistory] = useState<DashboardPillar[]>(["overview"]);

  const setActivePillar = (pillar: DashboardPillar) => {
    setActivePillarState((curr) => {
      if (curr !== pillar) {
        setPillarHistory((hist) => [...hist, pillar]);
      }
      return pillar;
    });
  };

  const handleBackNavigation = () => {
    setPillarHistory((prev) => {
      if (prev.length <= 1) {
        setActivePillarState("overview");
        return ["overview"];
      }
      const newHistory = [...prev];
      newHistory.pop();
      const prevPillar = newHistory[newHistory.length - 1] || "overview";
      setActivePillarState(prevPillar);
      return newHistory;
    });
  };
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [quickSmsSuccess, setQuickSmsSuccess] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["dashboard"]);

  // ১. ড্যাশবোর্ড ক্যালেন্ডার ও সময়কাল ফিল্টার (আজকের দিন, গত ১ সপ্তাহ, যে কোনো তারিখ/মাস)
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "last_month" | "custom">("month");
  const [customStartDate, setCustomStartDate] = useState("2026-03-01");
  const [customEndDate, setCustomEndDate] = useState("2026-03-22");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // ২. মাস থেকে মাসের তুলনামূলক অগ্রগতি রেঞ্জ (এত মাস থেকে এত মাস)
  const [compBaseMonth, setCompBaseMonth] = useState("২০২৬-০২"); // ফেব্রুয়ারি ২০২৬ (গত মাস)
  const [compTargetMonth, setCompTargetMonth] = useState("২০২৬-০৩"); // মার্চ ২০২৬ (চলতি মাস)

  // দ্রুত খরচ এন্ট্রি ফর্ম স্টেট (অন্যান্য মডিউলের জন্য)
  const [expCategory, setExpCategory] = useState("মেস ও কাঁচাবাজার");
  const [expAmount, setExpAmount] = useState<number>(1500);
  const [expDesc, setExpDesc] = useState("");

  // বাংলা ও ইংরেজি সংখ্যার তারিখ স্বাভাবিকীকরণ (YYYY-MM-DD)
  const normalizeDateStr = (str: string) => {
    if (!str) return "";
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, (c) => bnToEn[c] || c).trim();
  };

  // নির্বাচিত সময়কাল অনুযায়ী ট্রানজ্যাকশন ফিল্টার লজিক
  const isDateInPeriod = (rawDate: string, period: typeof selectedPeriod) => {
    const d = normalizeDateStr(rawDate);
    if (!d) return false;
    if (period === "today") {
      return d === "2026-03-22";
    }
    if (period === "week") {
      return d >= "2026-03-16" && d <= "2026-03-22";
    }
    if (period === "month") {
      return d >= "2026-03-01" && d <= "2026-03-31";
    }
    if (period === "last_month") {
      return d >= "2026-02-01" && d <= "2026-02-28";
    }
    if (period === "custom") {
      const s = normalizeDateStr(customStartDate);
      const e = normalizeDateStr(customEndDate);
      return (!s || d >= s) && (!e || d <= e);
    }
    return true;
  };

  // ১. বর্তমান নির্বাচিত সময়কালের ট্রানজ্যাকশন ও হিসাব
  const currentFilteredTransactions = transactions.filter((t) => isDateInPeriod(t.date, selectedPeriod));

  const totalIncome = currentFilteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentFilteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashInHand = totalIncome - totalExpense;

  // স্ক্রিনশটের ড্যাশবোর্ড কার্ডের জন্য আজকের ও মাসিক হিসাব
  const todayDateStr = "2026-03-22";
  const todayIncome = transactions.filter(t => t.type === "income" && normalizeDateStr(t.date) === todayDateStr).reduce((s, t) => s + t.amount, 0);
  const todayExpense = transactions.filter(t => t.type === "expense" && normalizeDateStr(t.date) === todayDateStr).reduce((s, t) => s + t.amount, 0);
  const thisMonthIncome = transactions.filter(t => t.type === "income" && (normalizeDateStr(t.date) || "").startsWith("2026-03")).reduce((s, t) => s + t.amount, 0);
  const thisMonthExpense = transactions.filter(t => t.type === "expense" && (normalizeDateStr(t.date) || "").startsWith("2026-03")).reduce((s, t) => s + t.amount, 0);

  // খরচের খাতভিত্তিক তালিকা ও হিসাব (ভাউচার টেবিলের জন্য)
  const expensesList = currentFilteredTransactions.filter((t) => t.type === "expense");

  // ২০ জন ছাত্রের হিসাব ও নির্বাচিত সময়কালের লাইভ হাজিরা
  const totalStudentsCount = students.length;

  // নির্বাচিত সময়কাল অনুযায়ী গতিশীল মেট্রিক্স ও পার্সেন্টেজ
  const periodMetrics = {
    today: {
      cashTitle: "আজকের নিট ক্যাশ প্রবাহ",
      growthText: "+১২.৪% দৈনিক ক্যাশ বৃদ্ধি",
      growthSub: "(গতকাল থেকে)",
      admissionText: "আজকে ১ জন ভর্তি ভাইভা",
      admissionSub: "(নতুন আবেদন)",
      teacherText: "সকল শিক্ষক কর্মব্যস্ত",
      teacherSub: "(আজকে শতভাগ উপস্থিতি)",
      attendanceRate: 95.0,
      present: Math.round(totalStudentsCount * 0.95),
      absent: Math.max(0, totalStudentsCount - Math.round(totalStudentsCount * 0.95)),
      attendanceLabel: "+২.৫% উপস্থিতি বৃদ্ধি",
      attendanceSub: "(আজকের লাইভ)"
    },
    week: {
      cashTitle: "সাপ্তাহিক নিট ক্যাশ প্রবাহ",
      growthText: "+১৮.৬% সাপ্তাহিক প্রবৃদ্ধি",
      growthSub: "(গত সপ্তাহের চেয়ে)",
      admissionText: "+৩ জন নতুন ভর্তি",
      admissionSub: "(এই সপ্তাহে সম্পন্ন)",
      teacherText: "সাপ্তাহিক ক্লাস ১০০% সম্পন্ন",
      teacherSub: "(পূর্ণ সিলেবাস অগ্রগতি)",
      attendanceRate: 95.0,
      present: Math.round(totalStudentsCount * 0.95),
      absent: Math.max(0, totalStudentsCount - Math.round(totalStudentsCount * 0.95)),
      attendanceLabel: "+৩.০% সাপ্তাহিক নিয়মিততা",
      attendanceSub: "(সাপ্তাহিক গড়)"
    },
    month: {
      cashTitle: "চলতি মাসের মোট ক্যাশ স্থিতি",
      growthText: "+১৪.৮% উন্নতি",
      growthSub: "(গত সময়ের চেয়ে)",
      admissionText: "+৮ জন ভর্তি",
      admissionSub: "(মার্চ নতুন সেমিস্টার)",
      teacherText: "১০০% কার্যকর",
      teacherSub: "(মার্চ বেতন পরিশোধিত)",
      attendanceRate: 95.0,
      present: Math.round(totalStudentsCount * 0.95),
      absent: Math.max(0, totalStudentsCount - Math.round(totalStudentsCount * 0.95)),
      attendanceLabel: "+২.৫% উপস্থিতি বৃদ্ধি",
      attendanceSub: "(মার্চের সামগ্রিক গড়)"
    },
    last_month: {
      cashTitle: "গত মাসের (ফেব্রুয়ারি) ক্যাশ স্থিতি",
      growthText: "+৬.২% স্থিতিশীল প্রবৃদ্ধি",
      growthSub: "(জানুয়ারির চেয়ে)",
      admissionText: "+৫ জন ভর্তি",
      admissionSub: "(ফেব্রুয়ারি সেশন)",
      teacherText: "১০০% কার্যকর",
      teacherSub: "(ফেব্রুয়ারি বেতন পরিশোধিত)",
      attendanceRate: 90.0,
      present: Math.round(totalStudentsCount * 0.90),
      absent: Math.max(0, totalStudentsCount - Math.round(totalStudentsCount * 0.90)),
      attendanceLabel: "৯০.০% সন্তোষজনক",
      attendanceSub: "(ফেব্রুয়ারি মাসের গড়)"
    },
    custom: {
      cashTitle: "নির্বাচিত সময়কালের ক্যাশ স্থিতি",
      growthText: "+১০.৫% অগ্রগতি",
      growthSub: "(নির্বাচিত সময়সীমায়)",
      admissionText: "+৮ জন ভর্তি",
      admissionSub: "(নির্বাচিত সময়সীমায়)",
      teacherText: "১০০% কার্যকর",
      teacherSub: "(পূর্ণ জনবল)",
      attendanceRate: 95.0,
      present: Math.round(totalStudentsCount * 0.95),
      absent: Math.max(0, totalStudentsCount - Math.round(totalStudentsCount * 0.95)),
      attendanceLabel: "+২.০% উপস্থিতি হার",
      attendanceSub: "(নির্বাচিত সময়সীমায়)"
    }
  }[selectedPeriod];

  const presentCount = periodMetrics.present;
  const absentCount = periodMetrics.absent;
  const attendanceRate = periodMetrics.attendanceRate;

  const messExpense = expensesList
    .filter((t) => t.category.includes("মেস") || t.category.includes("বাজার") || t.category.includes("খাবার"))
    .reduce((sum, t) => sum + t.amount, 0) || 45000;

  const salaryExpense = expensesList
    .filter((t) => t.category.includes("বেতন") || t.category.includes("সম্মানী"))
    .reduce((sum, t) => sum + t.amount, 0) || 185000;

  const utilityExpense = expensesList
    .filter((t) => t.category.includes("বিদ্যুৎ") || t.category.includes("গ্যাস") || t.category.includes("বিল"))
    .reduce((sum, t) => sum + t.amount, 0) || 18500;

  const otherExpense = Math.max(0, totalExpense - (messExpense + salaryExpense + utilityExpense));

  const totalZakatFund = donations
    .filter((d) => d.type === "zakat")
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDueFees = students.reduce((sum, s) => sum + s.dueAmount, 0);

  // ================================================================
  // তুলনামূলক বিশ্লেষণ: আসল ট্রানজ্যাকশন থেকে ডায়নামিক গণনা
  // ================================================================
  const getMonthTransactions = (monthKey: string) => {
    // monthKey format: "২০২৬-০৩" (Bengali) or "2026-03" (ASCII)
    const normalized = normalizeDateStr(monthKey); // e.g. "2026-03"
    return transactions.filter((t) => {
      const d = normalizeDateStr(t.date); // e.g. "2026-03-22"
      return d.startsWith(normalized);
    });
  };

  const baseTxs = getMonthTransactions(compBaseMonth);
  const targetTxs = getMonthTransactions(compTargetMonth);

  // আয় হিসাব (income)
  const baseIncome = baseTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const targetIncome = targetTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  // মোট খরচ (expense)
  const baseExpense = baseTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const targetExpense = targetTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  // বেতন আদায় (ছাত্রদের বেতন - income ক্যাটাগরিতে "বেতন" বা "টিউশন")
  const baseFeeIncome = baseTxs.filter((t) => t.type === "income" && (t.category.includes("বেতন") || t.category.includes("টিউশন") || t.category.includes("ফি"))).reduce((s, t) => s + t.amount, 0);
  const targetFeeIncome = targetTxs.filter((t) => t.type === "income" && (t.category.includes("বেতন") || t.category.includes("টিউশন") || t.category.includes("ফি"))).reduce((s, t) => s + t.amount, 0);

  // দান ও যাকাত আয়
  const baseDonationIncome = baseTxs.filter((t) => t.type === "income" && (t.category.includes("দান") || t.category.includes("যাকাত") || t.category.includes("লিল্লাহ") || t.category.includes("অনুদান"))).reduce((s, t) => s + t.amount, 0);
  const targetDonationIncome = targetTxs.filter((t) => t.type === "income" && (t.category.includes("দান") || t.category.includes("যাকাত") || t.category.includes("লিল্লাহ") || t.category.includes("অনুদান"))).reduce((s, t) => s + t.amount, 0);

  // মেস ও বাজার খরচ
  const baseMess = baseTxs.filter((t) => t.type === "expense" && (t.category.includes("মেস") || t.category.includes("বাজার") || t.category.includes("খাবার"))).reduce((s, t) => s + t.amount, 0);
  const targetMess = targetTxs.filter((t) => t.type === "expense" && (t.category.includes("মেস") || t.category.includes("বাজার") || t.category.includes("খাবার"))).reduce((s, t) => s + t.amount, 0);

  // বেতন ও সম্মানী খরচ
  const baseSalary = baseTxs.filter((t) => t.type === "expense" && (t.category.includes("বেতন") || t.category.includes("সম্মানী"))).reduce((s, t) => s + t.amount, 0);
  const targetSalary = targetTxs.filter((t) => t.type === "expense" && (t.category.includes("বেতন") || t.category.includes("সম্মানী"))).reduce((s, t) => s + t.amount, 0);

  // বিদ্যুৎ বিল খরচ
  const baseElectricity = baseTxs.filter((t) => t.type === "expense" && (t.category.includes("বিদ্যুৎ") || t.category.includes("কারেন্ট"))).reduce((s, t) => s + t.amount, 0);
  const targetElectricity = targetTxs.filter((t) => t.type === "expense" && (t.category.includes("বিদ্যুৎ") || t.category.includes("কারেন্ট"))).reduce((s, t) => s + t.amount, 0);

  // গ্যাস বিল খরচ
  const baseGas = baseTxs.filter((t) => t.type === "expense" && (t.category.includes("গ্যাস") || t.category.includes("সিলিন্ডার"))).reduce((s, t) => s + t.amount, 0);
  const targetGas = targetTxs.filter((t) => t.type === "expense" && (t.category.includes("গ্যাস") || t.category.includes("সিলিন্ডার"))).reduce((s, t) => s + t.amount, 0);

  // পার্সেন্টেজ পরিবর্তন হিসাব (নিরাপদ, শূন্য দিয়ে ভাগ হয় না)
  const calcPct = (base: number, target: number) => {
    if (base === 0 && target === 0) return 0;
    if (base === 0) return 100;
    return Math.round(((target - base) / base) * 100 * 10) / 10;
  };

  const feePct = calcPct(baseFeeIncome, targetFeeIncome);
  const donationPct = calcPct(baseDonationIncome, targetDonationIncome);
  const messPct = calcPct(baseMess, targetMess);
  const salaryPct = calcPct(baseSalary, targetSalary);
  const electricityPct = calcPct(baseElectricity, targetElectricity);
  const gasPct = calcPct(baseGas, targetGas);
  const netBaseCash = baseIncome - baseExpense;
  const netTargetCash = targetIncome - targetExpense;
  const overallPct = calcPct(netBaseCash, netTargetCash);

  // প্রোগ্রেস বার (০–১০০ %) - সর্বোচ্চ ভ্যালুর তুলনায় অনুপাত
  const feeMax = Math.max(baseFeeIncome, targetFeeIncome, 1);
  const donationMax = Math.max(baseDonationIncome, targetDonationIncome, 1);
  const messMax = Math.max(baseMess, targetMess, 1);
  const salaryMax = Math.max(baseSalary, targetSalary, 1);
  const electricityMax = Math.max(baseElectricity, targetElectricity, 1);
  const gasMax = Math.max(baseGas, targetGas, 1);

  // টাকা ফরম্যাট (বাংলা লোকেল)
  const fmtTk = (n: number) => {
    if (n >= 100000) return `৳ ${(n / 100000).toFixed(1)} লক্ষ`;
    if (n >= 1000) return `৳ ${n.toLocaleString("bn-BD")}`;
    return `৳ ${n}`;
  };

  // মাসের নাম (সিলেক্ট মেনুর জন্য)
  const monthNames: Record<string, string> = {
    "২০২৬-০১": "জানুয়ারি ২০২৬",
    "২০২৬-০২": "ফেব্রুয়ারি ২০২৬",
    "২০২৬-০৩": "মার্চ ২০২৬",
    "২০২৬-০৪": "এপ্রিল ২০২৬",
    "২০২৬-০৫": "মে ২০২৬",
    "২০২৬-০৬": "জুন ২০২৬",
    "২০২৬-০৭": "জুলাই ২০২৬",
    "২০২৬-০৮": "আগস্ট ২০২৬",
    "২০২৬-০৯": "সেপ্টেম্বর ২০২৬",
    "২০২৬-১০": "অক্টোবর ২০২৬",
    "২০২৬-১১": "নভেম্বর ২০২৬",
    "২০২৬-১২": "ডিসেম্বর ২০২৬",
  };


  const handleQuickSms = () => {
    setQuickSmsSuccess(true);
    setTimeout(() => setQuickSmsSuccess(false), 4000);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0) return;

    onAddTransaction({
      type: "expense",
      category: expCategory,
      fundType: "general",
      amount: Number(expAmount),
      date: new Date().toISOString().split("T")[0],
      description: expDesc || `${expCategory} খরচ`,
      receiptNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setExpDesc("");
    setShowAddExpenseModal(false);
  };

  // সাইডবার মেনু আইটেমসমূহ
  const menuItems = [
    {
      id: "overview" as DashboardPillar,
      label: t.overview,
      badge: "LIVE",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
      icon: LayoutDashboard,
      color: "text-indigo-400",
    },
    {
      id: "accounts" as DashboardPillar,
      label: t.accounts,
      badge: `৳${Math.round(totalExpense / 1000)}k`,
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
      icon: Wallet,
      color: "text-emerald-400",
    },
    {
      id: "students" as DashboardPillar,
      label: t.students,
      badge: `${students.length}`,
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      icon: Users,
      color: "text-blue-400",
    },
    {
      id: "teachers" as DashboardPillar,
      label: t.teachers,
      badge: `${teachers.length}`,
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
      icon: GraduationCap,
      color: "text-purple-400",
    },
    {
      id: "donations" as DashboardPillar,
      label: t.donations,
      badge: "★",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
      icon: HeartHandshake,
      color: "text-amber-400",
    },
    {
      id: "admissions" as DashboardPillar,
      label: t.admissions,
      badge: "NEW",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30",
      icon: UserPlus,
      color: "text-teal-400",
    },
  ];

  return (
    <div className="h-screen bg-[#F1F5F9] text-slate-900 flex overflow-hidden">
      {/* ========================================================================= */}
      {/* ১. বামপাশের রেসপনসিভ ড্যাশবোর্ড সাইডবার (Modern SaaS Sidebar) */}
      {/* ========================================================================= */}
      {/* মোবাইল ব্যাকড্রপ */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="no-print fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* সাইডবার কন্টেইনার */}
      <aside
        className={`no-print fixed lg:sticky top-0 h-screen z-50 flex flex-col bg-[#0B0F19] text-white border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "lg:w-20" : "w-72"}`}
      >
        {/* সাইডবার ব্র্যান্ড হেডার */}
        <div className="h-16 px-4 border-b border-slate-800/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              title="মাদরাসা ম্যানেজমেন্ট"
              className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-500/30"
            >
              <img 
                src="/logo.png" 
                alt="মাদরাসা ম্যানেজমেন্ট" 
                className="w-full h-full object-contain"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h2 className="text-sm font-black text-white truncate tracking-tight">
                  {t.madrasaManagement}
                </h2>
                <p className="text-[11px] text-indigo-300 truncate font-medium">
                  {t.smartEducation}
                </p>
              </div>
            )}
          </div>

          {/* মোবাইল ক্লোজ বাটন / ডেস্কটপ কলাপ্স */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* মুহতামিম ব্যক্তিগত প্রোফাইল স্ট্যাটাস স্ট্রিপ (ক্লিক করলে পার্সোনাল প্রোফাইল সেটিংস খুলবে) */}
        {!sidebarCollapsed ? (
          <div 
            onClick={() => setActivePillar("settings_personal")}
            className="px-4 py-3 bg-gradient-to-r from-indigo-950/70 to-purple-950/50 border-b border-slate-800/80 cursor-pointer hover:bg-slate-800/60 transition-colors group"
            title="মুহতামিম সাহেবের পার্সোনাল প্রোফাইল খুলতে ক্লিক করুন"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-indigo-400/40 overflow-hidden flex items-center justify-center group-hover:ring-2 group-hover:ring-indigo-400 transition-all shadow-sm">
                  {madrasa.muhtamimPhotoUrl ? (
                    <img 
                      src={madrasa.muhtamimPhotoUrl} 
                      alt={madrasa.muhtamimName || "মুহতামিম"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                      {madrasa.muhtamimName ? madrasa.muhtamimName.slice(0, 1) : "মু"}
                    </div>
                  )}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19] absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-white block truncate group-hover:text-indigo-200 transition-colors">
                  {madrasa.muhtamimName || "মাওলানা মো. সাহাদাত হোসেন"}
                </span>
                <span className="text-[10px] text-indigo-300 block font-medium truncate">
                  মুহতামিম • {madrasa.name || "মাদরাসা"}
                </span>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 transition-colors shrink-0" />
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setActivePillar("settings_personal")}
            className="p-3 flex justify-center border-b border-slate-800/80 cursor-pointer hover:bg-slate-800/60 transition-colors"
            title={madrasa.muhtamimName || "মুহতামিম পার্সোনাল প্রোফাইল"}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-400/40 overflow-hidden flex items-center justify-center shadow-sm">
              {madrasa.muhtamimPhotoUrl ? (
                <img 
                  src={madrasa.muhtamimPhotoUrl} 
                  alt={madrasa.muhtamimName || "মুহতামিম"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {madrasa.muhtamimName ? madrasa.muhtamimName.slice(0, 1) : "মু"}
                </div>
              )}
            </div>
          </div>
        )}


        {/* সাইডবার মেনু অপশনসমূহ (স্ক্রিনশট ১ ও ২ অনুযায়ী ২০টি মডিউল) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar">
          {(() => {
            const toggleMenu = (menuId: string) => {
              setExpandedGroups((prev) =>
                prev.includes(menuId)
                  ? prev.filter((id) => id !== menuId)
                  : [...prev, menuId]
              );
            };

            const sidebarMenus: Array<{
              id: string;
              label: string;
              icon: React.ElementType;
              pillar?: DashboardPillar;
              action?: "scanner" | "logout";
              subItems?: Array<{ id: string; label: string; pillar: DashboardPillar }>;
            }> = [
              {
                id: "dashboard",
                label: "ড্যাশবোর্ড",
                icon: Home,
                pillar: "overview",
              },
              {
                id: "students",
                label: "ছাত্র/ছাত্রী",
                icon: Users,
                subItems: [
                  { id: "stu_create", label: "ছাত্র/ছাত্রী তৈরি", pillar: "student_create" },
                  { id: "stu_list", label: "ছাত্র/ছাত্রী লিস্ট", pillar: "student_list" },
                  { id: "stu_by_jamat", label: "জামাত অনুসারে ছাত্র/ছাত্রী", pillar: "student_by_jamat" },
                  { id: "stu_adm_rep", label: "জামাত অনুসারে ভর্তি প্রতিবেদন", pillar: "student_admission_report" },
                  { id: "stu_adm_reg", label: "জামাত অনুসারে ভর্তি রেজিস্টার", pillar: "student_admission_register" },
                  { id: "stu_bld", label: "রক্তের গ্রুপ অনুসারে ছাত্র/ছাত্রী", pillar: "student_blood_group" },
                  { id: "stu_phn", label: "জামাত অনুযায়ী অভিভাবকের মোবাইল নাম্বার", pillar: "student_guardian_phones" },
                  { id: "stu_khn_ent", label: "খানার টাকা জমার এন্ট্রি সিস্টেম", pillar: "khana_entry" },
                  { id: "stu_khn_lst", label: "খানার টাকা জমার তালিকা", pillar: "khana_list" },
                  { id: "stu_khn_reg", label: "খোরাকীর টাকা আদায়ের রেজিস্টার", pillar: "khana_register" },
                  { id: "stu_tut_ent", label: "বেতন জমার এন্ট্রি সিস্টেম", pillar: "tuition_entry" },
                  { id: "stu_tut_lst", label: "বেতনের টাকা জমার তালিকা", pillar: "tuition_list" },
                  { id: "stu_tut_reg", label: "বেতনের টাকা আদায়ের রেজিস্টার", pillar: "tuition_register" },
                  { id: "stu_frm", label: "ভর্তি ফর্ম", pillar: "admission_form_print" },
                  { id: "stu_tst", label: "প্রত্যয়ন পত্র", pillar: "testimonial_print" },
                  { id: "stu_crt", label: "সার্টিফিকেট", pillar: "certificate_print" },
                ],
              },
              {
                id: "teachers",
                label: "শিক্ষক",
                icon: GraduationCap,
                subItems: [
                  { id: "tea_add", label: "শিক্ষক তৈরি", pillar: "teacher_add" },
                  { id: "tea_lst", label: "শিক্ষক তালিকা", pillar: "teacher_list" },
                  { id: "tea_phn", label: "শিক্ষকগণের মোবাইল নাম্বার", pillar: "teacher_phones" },
                  { id: "tea_sal_pay", label: "শিক্ষক বেতন প্রদান", pillar: "teacher_salary" },
                  { id: "tea_sal_lst", label: "শিক্ষকগণের বেতন তালিকা", pillar: "teacher_salary_list" },
                ],
              },
              {
                id: "monthly_donors",
                label: "মাসিক চাঁদাদাতা",
                icon: CalendarCheck2,
                subItems: [
                  { id: "md_add", label: "নতুন চাঁদাদাতা যুক্ত", pillar: "monthly_donor_add" },
                  { id: "md_lst", label: "চাঁদাদাতা তালিকা", pillar: "monthly_donor_list" },
                  { id: "md_col", label: "মাসিক চাঁদা গ্রহণ", pillar: "monthly_donor_collect" },
                  { id: "md_sng", label: "একক দাতার বিবরণী", pillar: "monthly_donor_single" },
                  { id: "md_mat", label: "বাৎসরিক চাঁদা তালিকা", pillar: "monthly_donor_matrix" },
                ],
              },
              {
                id: "donors",
                label: "দানকারী",
                icon: HeartHandshake,
                subItems: [
                  { id: "don_add", label: "এককালীন দান গ্রহণ", pillar: "donation_general_add" },
                  { id: "don_lst", label: "সাধারণ দানকারী তালিকা", pillar: "donation_general_list" },
                  { id: "don_rcp", label: "দানের রসিদ বই", pillar: "donation_receipts" },
                ],
              },
              {
                id: "zakat",
                label: "যাকাত দাতা",
                icon: Coins,
                subItems: [
                  { id: "zak_col", label: "যাকাত গ্রহণ", pillar: "zakat_collect" },
                  { id: "zak_lst", label: "যাকাত দাতা তালিকা", pillar: "zakat_donors_list" },
                  { id: "zak_dst", label: "লিল্লাহ ফান্ড ও যাকাত বিবরণী", pillar: "zakat_distribution" },
                ],
              },
              {
                id: "bazar",
                label: "বাজার",
                icon: ShoppingCart,
                subItems: [
                  { id: "baz_ent", label: "সাপ্তাহিক বাজার এন্ট্রি", pillar: "bazar_entry" },
                  { id: "baz_ment", label: "মাসিক বাজার এন্ট্রি", pillar: "bazar_monthly_entry" },
                  { id: "baz_lst", label: "সাপ্তাহিক বাজারের তালিকা", pillar: "bazar_list" },
                  { id: "baz_mlst", label: "মাসিক বাজারের তালিকা", pillar: "bazar_monthly_list" },
                  { id: "baz_rep", label: "সাপ্তাহিক বাজারের রিপোর্ট", pillar: "bazar_report" },
                  { id: "baz_mrep", label: "মাসিক বাজারের রিপোর্ট", pillar: "bazar_monthly_report" },
                ],
              },
              {
                id: "committee",
                label: "কমিটির সদস্যগণ",
                icon: Users2,
                subItems: [
                  { id: "com_add", label: "নতুন সদস্য যুক্ত করুন", pillar: "committee_add" },
                  { id: "com_lst", label: "কমিটির সদস্য তালিকা", pillar: "committee_list" },
                  { id: "com_prt", label: "কমিটি তালিকা প্রিন্ট", pillar: "committee_print" },
                ],
              },
              {
                id: "attendance",
                label: "হাজিরা",
                icon: CalendarCheck,
                subItems: [
                  { id: "att_stu", label: "ছাত্র হাজিরা", pillar: "att_students" },
                  { id: "att_str", label: "ছাত্র হাজিরা রিপোর্ট", pillar: "att_students_report" },
                  { id: "att_tea", label: "শিক্ষক হাজিরা", pillar: "att_teachers" },
                  { id: "att_ttr", label: "শিক্ষক হাজিরা রিপোর্ট", pillar: "att_teachers_report" },
                ],
              },
              {
                id: "results",
                label: "রেজাল্ট",
                icon: TrendingUp,
                subItems: [
                  { id: "res_ent", label: "নম্বর এন্ট্রি", pillar: "result_marks_entry" },
                  { id: "res_tab", label: "রেজাল্ট সীট / ট্যাবুলেশন", pillar: "result_tabulation" },
                  { id: "res_mks", label: "ছাত্র মার্কশীট / রিপোর্ট", pillar: "result_marksheet" },
                ],
              },
              {
                id: "accounts_menu",
                label: "জমা/খরচ হিসাব সমূহ",
                icon: Wallet,
                subItems: [
                  { id: "acc_inc", label: "নতুন অর্থ জমা করুন", pillar: "acc_income_add" },
                  { id: "acc_inl", label: "জমার লিস্ট", pillar: "acc_income_list" },
                  { id: "acc_exp", label: "নতুন খরচ", pillar: "acc_expense_add" },
                  { id: "acc_exl", label: "খরচের লিস্ট", pillar: "acc_expense_list" },
                  { id: "acc_vch", label: "ভাউচার", pillar: "acc_vouchers" },
                ],
              },
              {
                id: "id_cards",
                label: "আইডি কার্ড",
                icon: CreditCard,
                subItems: [
                  { id: "idc_stu", label: "ছাত্র আইডি কার্ড", pillar: "idcard_student" },
                  { id: "idc_tea", label: "শিক্ষক আইডি কার্ড", pillar: "idcard_teacher" },
                ],
              },
              {
                id: "sms",
                label: "এসএমএস",
                icon: Mail,
                subItems: [
                  { id: "sms_grd", label: "অভিভাবক এসএমএস", pillar: "sms_guardian" },
                  { id: "sms_tch", label: "শিক্ষক এসএমএস", pillar: "sms_teacher" },
                  { id: "sms_tmp", label: "এসএমএস টেমপ্লেট ও হিস্ট্রি", pillar: "sms_templates" },
                ],
              },
              {
                id: "account_wallet",
                label: "একাউন্ট",
                icon: Briefcase,
                subItems: [
                  { id: "acw_lst", label: "একাউন্ট তালিকা", pillar: "account_list" },
                  { id: "acw_new", label: "নতুন একাউন্ট তৈরি", pillar: "account_add" },
                  { id: "acw_trf", label: "একাউন্ট ব্যালেন্স ও ট্রান্সফার", pillar: "account_transfer" },
                ],
              },
              {
                id: "bank_account",
                label: "ব্যাংক একাউন্ট",
                icon: Building2,
                subItems: [
                  { id: "bnk_new", label: "নতুন ব্যাংক একাউন্ট", pillar: "bank_add" },
                  { id: "bnk_lst", label: "ব্যাংক একাউন্ট তালিকা", pillar: "bank_list" },
                ],
              },
              {
                id: "reports",
                label: "রিপোর্ট",
                icon: FileText,
                subItems: [
                  { id: "rep_fin", label: "আর্থিক সারাংশ রিপোর্ট", pillar: "report_financial" },
                  { id: "rep_stu", label: "ছাত্র পরিসংখ্যান রিপোর্ট", pillar: "report_student" },
                  { id: "rep_col", label: "বিভাগীয় কালেকশন রিপোর্ট", pillar: "report_collection" },
                ],
              },
              {
                id: "daily_audit",
                label: "দৈনিক আয়-ব্যয়ের প্রতিবেদন",
                icon: Calendar,
                pillar: "report_daily_audit",
              },
              {
                id: "yearly_audit",
                label: "বার্ষিক আয়-ব্যয়ের প্রতিবেদন",
                icon: CalendarDays,
                pillar: "report_yearly_audit",
              },
              {
                id: "bank_report",
                label: "ব্যাংক প্রতিবেদন",
                icon: Landmark,
                pillar: "report_bank_audit",
              },
              {
                id: "settings",
                label: "সেটিং",
                icon: Settings,
                subItems: [
                  { id: "set_prf", label: "মাদরাসা প্রাতিষ্ঠানিক প্রোফাইল", pillar: "settings_profile" },
                  { id: "set_prs", label: "মুহতামিম / পার্সোনাল প্রোফাইল", pillar: "settings_personal" },
                  { id: "set_exp", label: "খরচের খাত সেটিংস", pillar: "settings_expense_cat" },
                  { id: "set_inc", label: "আয়ের খাত সেটিংস", pillar: "settings_income_cat" },
                  { id: "set_pay", label: "পেমেন্ট মাধ্যম সেটিংস", pillar: "settings_payment_methods" },
                ],
              },
              {
                id: "scanner_opt",
                label: "বারকোড স্ক্যানার",
                icon: QrCode,
                action: "scanner",
              },
              {
                id: "website_opt",
                label: "ওয়েবসাইট",
                icon: Globe,
                pillar: "website",
              },
              {
                id: "logout_opt",
                label: "লগআউট",
                icon: LogOut,
                action: "logout",
              },
            ];

            return sidebarMenus.map((menu) => {
              const hasSub = Boolean(menu.subItems && menu.subItems.length > 0);
              const isExpanded = expandedGroups.includes(menu.id);
              const isChildActive = hasSub && menu.subItems!.some((sub) => sub.pillar === activePillar);
              const isSelfActive = !hasSub && menu.pillar && activePillar === menu.pillar;
              const Icon = menu.icon;

              return (
                <div key={menu.id} className="mb-0.5">
                  {/* প্যারেন্ট বা সরাসরি মেনু বাটন */}
                  <button
                    onClick={() => {
                      if (menu.action === "logout") {
                        onLogout();
                        return;
                      }
                      if (menu.action === "scanner") {
                        onOpenScanner();
                        setSidebarOpen(false);
                        return;
                      }
                      if (hasSub) {
                        toggleMenu(menu.id);
                      } else if (menu.pillar) {
                        setActivePillar(menu.pillar);
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      menu.action === "logout"
                        ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 mt-2 border border-rose-900/30"
                        : isSelfActive || isChildActive
                        ? "bg-[#0E4D52] text-teal-100 font-bold shadow-md border border-teal-500/40"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                    title={sidebarCollapsed ? menu.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelfActive || isChildActive ? "text-teal-300" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span className="truncate">{menu.label}</span>}
                    </div>

                    {!sidebarCollapsed && hasSub && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-90 text-teal-300" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* সাব-মেনু আইটেমসমূহ (স্ক্রিনশট ২ অনুযায়ী কলাপ্সিবল) */}
                  {!sidebarCollapsed && hasSub && isExpanded && (
                    <div className="mt-1 ml-4 pl-2.5 border-l border-slate-700/60 space-y-1 animate-fadeIn">
                      {menu.subItems!.map((sub) => {
                        const isSubActive = activePillar === sub.pillar;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActivePillar(sub.pillar);
                              setSidebarOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-2 ${
                              isSubActive
                                ? "bg-teal-500/20 text-teal-300 font-bold border-l-2 border-teal-400 pl-2 shadow-xs"
                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 ${isSubActive ? "bg-teal-400 ring-2 ring-teal-400/40" : "bg-slate-500"}`} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ২. মূল কন্টেন্ট উইন্ডো ও টপ কন্ট্রোল বার */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* ডার্ক টপ নেভবার (স্ক্রিনের ওপরে সম্পূর্ণ লক করা) */}
        <Navbar
          currentView="dashboard"
          madrasaName={madrasa.name}
          madrasaLogo={madrasa.logoUrl}
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* প্রধান বডি কন্টেন্ট (স্ক্রোল করলে শুধুমাত্র এই অংশটি ওপর-নিচ হবে, ওপরের বার ও সাইডবার লক থাকবে) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#F1F5F9] via-[#F8FAFC] to-[#EEF2F6]">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* দ্রুত এসএমএস সফলতার বার্তা */}
          {quickSmsSuccess && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>সফল! সকল অভিভাবকের মোবাইলে জরুরি নোটিশ SMS পাঠানো হয়েছে।</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ভিউ ০: মূল ড্যাশবোর্ড / প্রথম পেজ (সাহাদাত ভাইয়ের নির্দেশিত প্রিমিয়াম পেজ) */}
          {/* ========================================================================= */}
          {activePillar === "overview" && (
            <div className="space-y-6">
              {/* ========================================================================= */}
              {/* ১. শীর্ষ ১২টি অ্যাকশন ও স্ট্যাট কার্ড (স্ক্রিনশটের হুবহু ডিজাইন ও ব্র্যান্ড কালার) */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {/* কার্ড ১: ছাত্র/ছাত্রী যুক্ত */}
                <div 
                  onClick={() => setActivePillar("student_create")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-indigo-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">ছাত্র/ছাত্রী যুক্ত</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">নতুন শিক্ষার্থী নিবন্ধন</p>
                      <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {totalStudentsCount} মোট শিক্ষার্থী
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      title="নতুন ছাত্র যুক্ত করুন"
                      onClick={() => setActivePillar("student_create")}
                      className="w-8 h-8 rounded-full border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-600 hover:text-white text-indigo-600 flex items-center justify-center transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="সকল ছাত্রের ফিল্টার ও তালিকা"
                      onClick={() => setActivePillar("student_list")}
                      className="w-8 h-8 rounded-full border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-600 hover:text-white text-indigo-600 flex items-center justify-center transition-all shadow-xs"
                    >
                      <Filter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* কার্ড ২: নতুন জমা যুক্ত */}
                <div 
                  onClick={() => setActivePillar("acc_income_add")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-emerald-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                      <CirclePlus className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">নতুন জমা যুক্ত</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">অর্থ জমা করুন</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 font-mono">
                          আজ: ৳ {todayIncome.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                          মাসিক: ৳ {thisMonthIncome.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৩: নতুন খরচ যুক্ত */}
                <div 
                  onClick={() => setActivePillar("acc_expense_add")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-sky-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
                      <CircleMinus className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">নতুন খরচ যুক্ত</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">ব্যয় রেকর্ড করুন</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                          আজ: ৳ {todayExpense.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 font-mono">
                          মাসিক: ৳ {thisMonthExpense.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-sky-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৪: এস এম এস */}
                <div 
                  onClick={() => setActivePillar("sms_guardian")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-rose-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">এস এম এস</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">বার্তা পাঠান</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-rose-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৫: একাউন্ট যুক্ত */}
                <div 
                  onClick={() => setActivePillar("bank_add")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-amber-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">একাউন্ট যুক্ত</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">নতুন হিসাব খুলুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-amber-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৬: একাউন্ট বিবরণ */}
                <div 
                  onClick={() => setActivePillar("report_daily_audit")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-orange-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">একাউন্ট বিবরণ</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">হিসাব দেখুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-orange-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৭: হাজিরা */}
                <div 
                  onClick={() => setActivePillar("att_students")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-blue-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                      <CalendarCheck2 className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">হাজিরা</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">উপস্থিতি দিন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৮: রেজাল্ট সীট */}
                <div 
                  onClick={() => setActivePillar("result_tabulation")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-teal-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">রেজাল্ট সীট</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">ফলাফল দেখুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-teal-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ৯: আইডি কার্ড */}
                <div 
                  onClick={() => setActivePillar("idcard_student")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-purple-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">আইডি কার্ড</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">পরিচয়পত্র তৈরি করুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-purple-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ১০: শিক্ষক তৈরি */}
                <div 
                  onClick={() => setActivePillar("teacher_add")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-amber-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">শিক্ষক তৈরি</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">নতুন শিক্ষক যোগ করুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-amber-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ১১: যাকাত গ্রহণ */}
                <div 
                  onClick={() => setActivePillar("zakat_collect")}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer hover:border-pink-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25 group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">যাকাত গ্রহণ</h4>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">যাকাত জমা করুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 group-hover:bg-pink-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* কার্ড ১২: মাসিক চাঁদা গ্রহণ */}
                <div 
                  onClick={() => setActivePillar("monthly_donor_collect")}
                  className="bg-cyan-50/25 rounded-2xl p-4 sm:p-5 border-2 border-cyan-400/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">মাসিক চাঁদা গ্রহণ</h4>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">মাসিক চাঁদা জমা করুন</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full border border-cyan-300 bg-white group-hover:bg-cyan-600 group-hover:text-white text-cyan-600 flex items-center justify-center transition-all shadow-xs">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* ২. চার্ট সেকশন: Nested Donut Chart, Basic Area Chart & Line & Column Chart */}
              {/* ========================================================================= */}
              <div className="space-y-6">
                {/* ১ম সারি: Nested Donut Chart এবং Basic Area Chart (২ কলাম গ্রিড) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ১. Nested Donut Chart */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900">Nested Donut Chart</h3>
                        <p className="text-xs text-slate-400 font-medium">বিভাগ ও ক্যাটাগরি বণ্টন অনুপাত</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60 font-mono">
                        মোট: {totalStudentsCount}
                      </span>
                    </div>

                    {/* কনসেন্ট্রিক ডোন্ট চার্ট SVG */}
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                          {/* ব্যাকগ্রাউন্ড ট্র্যাক আউটার */}
                          <circle cx="100" cy="100" r="74" fill="none" stroke="#f1f5f9" strokeWidth="15" />
                          {/* ব্যাকগ্রাউন্ড ট্র্যাক ইনার */}
                          <circle cx="100" cy="100" r="54" fill="none" stroke="#f8fafc" strokeWidth="13" />

                          {/* আউটার রিং সেগমেন্টস (মোট পরিধি 2 * π * 74 ≈ 464.95) */}
                          {/* Drama: 32% (148.78) */}
                          <circle
                            cx="100" cy="100" r="74" fill="none"
                            stroke="#334155" strokeWidth="15"
                            strokeDasharray="148.78 316.17"
                            strokeDashoffset="0"
                            className="transition-all duration-700"
                          />
                          {/* Action: 25.6% (119.03) */}
                          <circle
                            cx="100" cy="100" r="74" fill="none"
                            stroke="#0d9488" strokeWidth="15"
                            strokeDasharray="119.03 345.92"
                            strokeDashoffset="-148.78"
                            className="transition-all duration-700"
                          />
                          {/* SciFi: 23.8% (110.66) */}
                          <circle
                            cx="100" cy="100" r="74" fill="none"
                            stroke="#10b981" strokeWidth="15"
                            strokeDasharray="110.66 354.29"
                            strokeDashoffset="-267.81"
                            className="transition-all duration-700"
                          />
                          {/* Comedy: 9.9% (46.03) */}
                          <circle
                            cx="100" cy="100" r="74" fill="none"
                            stroke="#f43f5e" strokeWidth="15"
                            strokeDasharray="46.03 418.92"
                            strokeDashoffset="-378.47"
                            className="transition-all duration-700"
                          />
                          {/* Horror: 8.7% (40.45) */}
                          <circle
                            cx="100" cy="100" r="74" fill="none"
                            stroke="#f59e0b" strokeWidth="15"
                            strokeDasharray="40.45 424.50"
                            strokeDashoffset="-424.50"
                            className="transition-all duration-700"
                          />

                          {/* ইনার রিং সেগমেন্টস (মোট পরিধি 2 * π * 54 ≈ 339.29) */}
                          {/* Drama: 32% (108.57) */}
                          <circle
                            cx="100" cy="100" r="54" fill="none"
                            stroke="#475569" strokeWidth="12"
                            strokeDasharray="108.57 230.72"
                            strokeDashoffset="0"
                          />
                          {/* Action: 25.6% (86.86) */}
                          <circle
                            cx="100" cy="100" r="54" fill="none"
                            stroke="#14b8a6" strokeWidth="12"
                            strokeDasharray="86.86 252.43"
                            strokeDashoffset="-108.57"
                          />
                          {/* SciFi: 23.8% (80.75) */}
                          <circle
                            cx="100" cy="100" r="54" fill="none"
                            stroke="#34d399" strokeWidth="12"
                            strokeDasharray="80.75 258.54"
                            strokeDashoffset="-195.43"
                          />
                          {/* Comedy: 9.9% (33.59) */}
                          <circle
                            cx="100" cy="100" r="54" fill="none"
                            stroke="#fb7185" strokeWidth="12"
                            strokeDasharray="33.59 305.70"
                            strokeDashoffset="-276.18"
                          />
                          {/* Horror: 8.7% (29.52) */}
                          <circle
                            cx="100" cy="100" r="54" fill="none"
                            stroke="#fbbf24" strokeWidth="12"
                            strokeDasharray="29.52 309.77"
                            strokeDashoffset="-309.77"
                          />
                        </svg>

                        {/* মধ্যবর্তী টোটাল লেবেল */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                            {totalStudentsCount}
                          </span>
                        </div>
                      </div>

                      {/* লেজেন্ড তালিকা */}
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Comedy (9.9%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" /> Action (25.6%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" /> Drama (32.0%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> SciFi (23.8%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Horror (8.7%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ২. Basic Area Chart */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900">Basic Area Chart</h3>
                        <p className="text-xs text-slate-400 font-medium">মাসিক প্রবৃদ্ধি ও এনরোলমেন্ট ট্রেন্ড</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60 font-mono">
                        Jan - Sep
                      </span>
                    </div>

                    {/* এরিয়া চার্ট SVG */}
                    <div className="py-2 w-full">
                      <svg className="w-full h-56" viewBox="0 0 520 220" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGradientBrand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.45" />
                            <stop offset="90%" stopColor="#0d9488" stopOpacity="0.03" />
                            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* হরিজন্টাল গ্রিড লাইন ও Y-অক্ষ লেবেল */}
                        {[
                          { val: 120, y: 30 },
                          { val: 90, y: 70 },
                          { val: 60, y: 110 },
                          { val: 30, y: 150 },
                          { val: 0, y: 190 },
                        ].map((grid, i) => (
                          <g key={i}>
                            <line x1="38" y1={grid.y} x2="510" y2={grid.y} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
                            <text x="28" y={grid.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                              {grid.val}
                            </text>
                          </g>
                        ))}

                        {/* এরিয়া গ্রাফ এর স্মুথ কার্ভ ও ফিল */}
                        <path
                          d="M 50,150 C 78,143 85,137 105,137 C 130,137 140,143 160,143 C 185,143 195,123 215,123 C 240,123 250,126 270,126 C 295,126 305,110 325,110 C 350,110 360,97 380,97 C 405,97 415,70 435,70 C 460,70 470,30 490,30 L 490,190 L 50,190 Z"
                          fill="url(#areaGradientBrand)"
                        />
                        <path
                          d="M 50,150 C 78,143 85,137 105,137 C 130,137 140,143 160,143 C 185,143 195,123 215,123 C 240,123 250,126 270,126 C 295,126 305,110 325,110 C 350,110 360,97 380,97 C 405,97 415,70 435,70 C 460,70 470,30 490,30"
                          fill="none"
                          stroke="#0d9488"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* ডেটা পয়েন্ট সার্কেল */}
                        {[
                          { x: 50, y: 150, m: "Jan" },
                          { x: 105, y: 137, m: "Feb" },
                          { x: 160, y: 143, m: "Mar" },
                          { x: 215, y: 123, m: "Apr" },
                          { x: 270, y: 126, m: "May" },
                          { x: 325, y: 110, m: "Jun" },
                          { x: 380, y: 97, m: "Jul" },
                          { x: 435, y: 70, m: "Aug" },
                          { x: 490, y: 30, m: "Sep" },
                        ].map((pt, i) => (
                          <g key={i} className="group/pt cursor-pointer">
                            <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" className="transition-transform group-hover/pt:scale-150" />
                            <text x={pt.x} y="208" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">
                              {pt.m}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ২য় সারি: Line & Column Chart (পূর্ণ প্রস্থ) */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900">Line &amp; Column Chart</h3>
                      <p className="text-xs text-slate-400 font-medium">দৈনিক আয়-ব্যয় ও লেনদেন অনুপাত (০১ - ১২ তারিখ)</p>
                    </div>
                    {/* লেজেন্ড */}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-[#1b686e]" /> Website Blog
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" /> Social Media
                      </span>
                    </div>
                  </div>

                  {/* বার ও লাইন চার্ট SVG */}
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[680px]">
                      <svg className="w-full h-64" viewBox="0 0 760 250" preserveAspectRatio="none">
                        {/* হরিজন্টাল গ্রিড লাইন এবং বাম-ডান অক্ষ লেবেল */}
                        {[
                          { lVal: 800, rVal: 50, y: 35 },
                          { lVal: 600, rVal: 40, y: 75 },
                          { lVal: 400, rVal: 30, y: 115 },
                          { lVal: 200, rVal: 20, y: 155 },
                          { lVal: 0, rVal: 0, y: 195 },
                        ].map((grid, i) => (
                          <g key={i}>
                            <line x1="45" y1={grid.y} x2="715" y2={grid.y} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
                            {/* বাম অক্ষ */}
                            <text x="35" y={grid.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono font-bold">
                              {grid.lVal}
                            </text>
                            {/* ডান অক্ষ */}
                            <text x="725" y={grid.y + 4} textAnchor="start" className="text-[10px] fill-slate-400 font-mono font-bold">
                              {grid.rVal}
                            </text>
                          </g>
                        ))}

                        {/* ১২টি কলাম বার (#1b686e আমাদের ব্র্যান্ড কালার) */}
                        {[
                          { day: "01 Jan", val: 440, x: 65, h: 88, y: 107 },
                          { day: "02 Jan", val: 505, x: 118, h: 101, y: 94 },
                          { day: "03 Jan", val: 414, x: 171, h: 83, y: 112 },
                          { day: "04 Jan", val: 671, x: 224, h: 134, y: 61 },
                          { day: "05 Jan", val: 227, x: 277, h: 45, y: 150 },
                          { day: "06 Jan", val: 413, x: 330, h: 83, y: 112 },
                          { day: "07 Jan", val: 201, x: 383, h: 40, y: 155 },
                          { day: "08 Jan", val: 352, x: 436, h: 70, y: 125 },
                          { day: "09 Jan", val: 752, x: 489, h: 150, y: 45 },
                          { day: "10 Jan", val: 320, x: 542, h: 64, y: 131 },
                          { day: "11 Jan", val: 257, x: 595, h: 51, y: 144 },
                          { day: "12 Jan", val: 160, x: 648, h: 32, y: 163 },
                        ].map((bar, i) => (
                          <g key={i} className="group/bar cursor-pointer">
                            <rect
                              x={bar.x}
                              y={bar.y}
                              width="22"
                              height={bar.h}
                              rx="4"
                              fill="#1b686e"
                              className="transition-opacity group-hover/bar:opacity-85"
                            />
                            <text x={bar.x + 11} y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">
                              {bar.day}
                            </text>
                          </g>
                        ))}

                        {/* ওভারলে লাইন কার্ভ ও ব্যাজ (ভ্যালুসহ) */}
                        <path
                          d="M 76,121 L 129,61 L 182,83 L 235,109 L 288,57 L 341,125 L 394,141 L 447,96 L 500,125 L 553,125 L 606,157 L 659,144"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* ডেটা ব্যাজ ও পয়েন্ট */}
                        {[
                          { x: 76, y: 121, val: 23 },
                          { x: 129, y: 61, val: 42 },
                          { x: 182, y: 83, val: 35 },
                          { x: 235, y: 109, val: 27 },
                          { x: 288, y: 57, val: 43 },
                          { x: 341, y: 125, val: 22 },
                          { x: 394, y: 141, val: 17 },
                          { x: 447, y: 96, val: 31 },
                          { x: 500, y: 125, val: 22 },
                          { x: 553, y: 125, val: 22 },
                          { x: 606, y: 157, val: 12 },
                          { x: 659, y: 144, val: 16 },
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="3.5" fill="#334155" stroke="#ffffff" strokeWidth="2" />
                            {/* ডেটা ব্যাজ বক্স */}
                            <rect x={pt.x - 12} y={pt.y - 23} width="24" height="16" rx="4" fill="#1e293b" />
                            <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              {pt.val}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* ২. সাহাদাত ভাইয়ের নির্দেশিত: মাস থেকে মাসের তুলনামূলক উন্নতি-অবনতি বিশ্লেষণ */}
              {/* ========================================================================= */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                {/* সেকশন হেডার ও মাস ফিল্টার ড্রপডাউন */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        মাসভিত্তিক তুলনামূলক অগ্রগতি ও হ্রাস-বৃদ্ধি বিশ্লেষণ
                      </h3>
                      <p className="text-xs text-slate-500">
                        আগের অবস্থা থেকে বর্তমান কেমন উন্নতি বা কেমন অবনতি হয়েছে তার গভীর অ্যানালাইসিস
                      </p>
                    </div>
                  </div>

                  {/* মাস থেকে মাস নির্বাচন অপশন (এত মাস থেকে এত মাস) */}
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 pl-1">তুলনার রেঞ্জ:</span>
                    
                    {/* পূর্ববর্তী মাস */}
                    <select
                      value={compBaseMonth}
                      onChange={(e) => setCompBaseMonth(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="২০২৬-০১">জানুয়ারি ২০২৬</option>
                      <option value="২০২৬-০২">ফেব্রুয়ারি ২০২৬ (গত মাস)</option>
                    </select>

                    <span className="text-xs font-bold text-indigo-600">বনাম</span>

                    {/* বর্তমান মাস */}
                    <select
                      value={compTargetMonth}
                      onChange={(e) => setCompTargetMonth(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="২০২৬-০৩">মার্চ ২০২৬ (চলতি মাস)</option>
                    </select>
                  </div>
                </div>

                {/* খাতভিত্তিক তুলনামূলক গ্রিড (৫টি প্রধান খাত: উন্নতি/অবনতি সহ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* ১. কিতাবি ছাত্রদের বেতন আদায় */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">ছাত্রদের বেতন আদায়</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${feePct >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {feePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {feePct >= 0 ? "+" : ""}{feePct}% {feePct >= 0 ? "উন্নতি" : "হ্রাস"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseFeeIncome > 0 ? fmtTk(baseFeeIncome) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className={`text-[10px] block font-bold ${feePct >= 0 ? "text-indigo-600" : "text-rose-600"}`}>{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetFeeIncome > 0 ? fmtTk(targetFeeIncome) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${feePct >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.round((targetFeeIncome / feeMax) * 100)}%` }} />
                    </div>
                    <p className={`text-[11px] font-medium ${feePct >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {feePct >= 0 ? `✓ বেতন আদায় ${feePct}% বৃদ্ধি পেয়েছে।` : `⚠ বেতন আদায় ${Math.abs(feePct)}% কমেছে। মনোযোগ প্রয়োজন।`}
                    </p>
                  </div>

                  {/* ২. দান ও যাকাত ফান্ড */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">যাকাত ও লিল্লাহ দান</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${donationPct >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {donationPct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {donationPct >= 0 ? "+" : ""}{donationPct}% {donationPct >= 0 ? "উন্নতি" : "হ্রাস"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseDonationIncome > 0 ? fmtTk(baseDonationIncome) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className={`text-[10px] block font-bold ${donationPct >= 0 ? "text-indigo-600" : "text-rose-600"}`}>{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetDonationIncome > 0 ? fmtTk(targetDonationIncome) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${donationPct >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.round((targetDonationIncome / donationMax) * 100)}%` }} />
                    </div>
                    <p className={`text-[11px] font-medium ${donationPct >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {donationPct >= 0 ? `✓ দান-অনুদান ${donationPct}% বৃদ্ধি পেয়েছে।` : `⚠ দান-অনুদান ${Math.abs(donationPct)}% কমেছে।`}
                    </p>
                  </div>

                  {/* ৩. বোর্ডিং মেস ও খাবার খরচ */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">বোর্ডিং বাজার খরচ</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${messPct > 0 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {messPct > 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {messPct > 0 ? "+" : ""}{messPct}% {messPct > 0 ? "বৃদ্ধি" : "সাশ্রয়"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseMess > 0 ? fmtTk(baseMess) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className={`text-[10px] block font-bold ${messPct > 0 ? "text-rose-600" : "text-emerald-600"}`}>{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetMess > 0 ? fmtTk(targetMess) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${messPct > 0 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${Math.round((targetMess / messMax) * 100)}%` }} />
                    </div>
                    <p className={`text-[11px] font-medium ${messPct > 0 ? "text-slate-600" : "text-emerald-700"}`}>
                      {messPct > 0 ? `ℹ বাজার খরচ ${messPct}% বেড়েছে।` : messPct < 0 ? `✓ বাজার খরচ ${Math.abs(messPct)}% কমেছে।` : `ℹ বাজার খরচ অপরিবর্তিত।`}
                    </p>
                  </div>

                  {/* ৪. উস্তাদ ও স্টাফ বেতন */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">উস্তাদ ও স্টাফ বেতন</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${salaryPct === 0 ? "bg-slate-200 text-slate-800" : salaryPct > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {salaryPct === 0 ? "০.০% অপরিবর্তিত" : salaryPct > 0 ? `+${salaryPct}% বৃদ্ধি` : `${salaryPct}% হ্রাস`}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseSalary > 0 ? fmtTk(baseSalary) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className="text-[10px] text-indigo-600 block font-bold">{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetSalary > 0 ? fmtTk(targetSalary) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.round((targetSalary / salaryMax) * 100)}%` }} />
                    </div>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      {targetSalary > 0 ? "✓ সকল মুহাদ্দিস ও খাদেমদের নিয়মিত সম্মানী পরিশোধ করা হয়েছে।" : "⚠ এই মাসে বেতন ট্রানজ্যাকশন পাওয়া যায়নি।"}
                    </p>
                  </div>

                  {/* ৫. বিদ্যুৎ বিল */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">বিদ্যুৎ বিল</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${electricityPct <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {electricityPct <= 0 ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {electricityPct > 0 ? "+" : ""}{electricityPct}% {electricityPct <= 0 ? "সাশ্রয়" : "বৃদ্ধি"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseElectricity > 0 ? fmtTk(baseElectricity) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className={`text-[10px] block font-bold ${electricityPct <= 0 ? "text-emerald-600" : "text-rose-600"}`}>{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetElectricity > 0 ? fmtTk(targetElectricity) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${electricityPct <= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.round((targetElectricity / electricityMax) * 100)}%` }} />
                    </div>
                    <p className={`text-[11px] font-medium ${electricityPct <= 0 ? "text-emerald-700" : "text-slate-600"}`}>
                      {electricityPct < 0 ? `✓ বিদ্যুৎ বিলে ${fmtTk(baseElectricity - targetElectricity)} সাশ্রয় হয়েছে।` : electricityPct > 0 ? `ℹ বিদ্যুৎ বিল ${electricityPct}% বেড়েছে।` : `ℹ বিদ্যুৎ বিল অপরিবর্তিত।`}
                    </p>
                  </div>

                  {/* ৬. গ্যাস বিল */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">গ্যাস বিল ও সিলিন্ডার</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${gasPct <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {gasPct <= 0 ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {gasPct > 0 ? "+" : ""}{gasPct}% {gasPct <= 0 ? "সাশ্রয়" : "বৃদ্ধি"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">{monthNames[compBaseMonth] || compBaseMonth}</span>
                        <span className="text-sm font-bold text-slate-600">{baseGas > 0 ? fmtTk(baseGas) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-right">
                        <span className={`text-[10px] block font-bold ${gasPct <= 0 ? "text-emerald-600" : "text-rose-600"}`}>{monthNames[compTargetMonth] || compTargetMonth}</span>
                        <span className="text-base font-black text-slate-900">{targetGas > 0 ? fmtTk(targetGas) : "কোনো রেকর্ড নেই"}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${gasPct <= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.round((targetGas / gasMax) * 100)}%` }} />
                    </div>
                    <p className={`text-[11px] font-medium ${gasPct <= 0 ? "text-emerald-700" : "text-slate-600"}`}>
                      {gasPct < 0 ? `✓ গ্যাস বিলে ${fmtTk(baseGas - targetGas)} সাশ্রয় হয়েছে।` : gasPct > 0 ? `ℹ গ্যাস বিল ${gasPct}% বেড়েছে।` : `ℹ গ্যাস বিল অপরিবর্তিত।`}
                    </p>
                  </div>

                  {/* ৬. সামগ্রিক এক্সিকিউটিভ অগ্রগতি স্কোর */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-950 text-white space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-200">সার্বিক অগ্রগতি স্কোর</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${overallPct >= 10 ? "bg-amber-400 text-slate-950" : overallPct >= 0 ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-white"}`}>
                        {overallPct >= 10 ? "উচ্চ সন্তোষজনক" : overallPct >= 0 ? "সন্তোষজনক" : "উন্নতি প্রয়োজন"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-3xl font-black ${overallPct >= 0 ? "text-amber-300" : "text-rose-300"}`}>
                        {overallPct >= 0 ? "+" : ""}{overallPct}%
                      </span>
                      <span className="text-xs text-indigo-200">নিট ক্যাশ তুলনা: {fmtTk(netBaseCash)} → {fmtTk(netTargetCash)}</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${overallPct >= 0 ? "bg-gradient-to-r from-amber-300 to-yellow-400" : "bg-gradient-to-r from-rose-400 to-pink-400"}`}
                        style={{ width: `${Math.min(100, Math.max(5, Math.abs(overallPct)))}%` }} />
                    </div>
                    <p className="text-[11px] text-indigo-100 font-medium leading-relaxed">
                      {overallPct >= 0
                        ? `✓ ${monthNames[compTargetMonth] || "চলতি মাসে"} নিট ক্যাশ ${overallPct}% বৃদ্ধি পেয়েছে। আয় ও ব্যয় নিয়ন্ত্রণ সন্তোষজনক।`
                        : `⚠ ${monthNames[compTargetMonth] || "চলতি মাসে"} নিট ক্যাশ ${Math.abs(overallPct)}% কমেছে। আয় বাড়ানো বা খরচ নিয়ন্ত্রণ প্রয়োজন।`}
                    </p>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* ৩. নিরীক্ষিত সাম্প্রতিক খরচের ভাউচার অডিট হিস্ট্রি (নিরাপদ রিড-অনলি বিশ্লেষণ) */}
              {/* ========================================================================= */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-2 ring-indigo-100 shrink-0">
                      <FileCheck className="w-5 h-5 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>নিরীক্ষিত সাম্প্রতিক খরচের ভাউচার বিশ্লেষণ</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {expensesList.length}টি ভাউচার ফিল্টারকৃত
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedPeriod === "today" && "আজকের দিনের হিসাব অনুযায়ী প্রস্তুতকৃত ক্যাশ ভাউচারসমূহ"}
                        {selectedPeriod === "week" && "গত এক সপ্তাহের হিসাব অনুযায়ী প্রস্তুতকৃত ক্যাশ ভাউচারসমূহ"}
                        {selectedPeriod === "month" && "চলতি মাসের হিসাব অনুযায়ী প্রস্তুতকৃত ক্যাশ ভাউচারসমূহ"}
                        {selectedPeriod === "last_month" && "গত মাসের (ফেব্রুয়ারি) হিসাব অনুযায়ী প্রস্তুতকৃত ক্যাশ ভাউচারসমূহ"}
                        {selectedPeriod === "custom" && `কাস্টম সময়কালের (${customStartDate} থেকে ${customEndDate}) ক্যাশ ভাউচারসমূহ`}
                      </p>
                    </div>
                  </div>
                  <div 
                    title="শুধুমাত্র নিরীক্ষার উদ্দেশ্যে সংরক্ষিত রিড-অনলি অডিট রেকর্ড"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-600 text-xs font-bold shadow-xs select-none cursor-default self-start sm:self-auto"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>রিড-অনলি অডিট লগ</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-100">
                      <tr>
                        <th className="p-3">ভাউচার নং</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3">খরচের খাত</th>
                        <th className="p-3">বিবরণ</th>
                        <th className="p-3 text-right">পরিমাণ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {expensesList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                            এই নির্বাচিত সময়কালে কোনো খরচের ভাউচার পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        expensesList.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              {tx.receiptNumber || `#EXP-10${tx.id.slice(-2)}`}
                            </td>
                            <td className="p-3 text-slate-500 font-mono">{tx.date}</td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                {tx.category}
                              </span>
                            </td>
                            <td className="p-3 text-slate-800">{tx.description}</td>
                            <td className="p-3 text-right font-black text-rose-600 font-mono">
                              - ৳ {tx.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>



              {/* ছাত্রদের সাম্প্রতিক অ্যাক্টিভিটি ও নোটিশ রেজিস্টার */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0">
                      <ScrollText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        মুহতামিম সাহেবের নোটিশ ও শিক্ষার্থী অ্যাক্টিভিটি রেকর্ড
                      </h3>
                      <p className="text-xs text-slate-500">
                        ছাত্রদের ভালো কাজ, সতর্কতা ও প্রাতিষ্ঠানিক নোটিশ
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePillar("students")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>সকল রেকর্ড দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {students.flatMap((s) => (s.activities || []).map((a) => ({ ...a, studentName: s.name, studentRoll: s.roll }))).slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        act.type === "praise"
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                          : act.type === "warning"
                          ? "bg-red-50/70 border-red-200 text-red-950"
                          : "bg-amber-50/70 border-amber-200 text-amber-950"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {act.studentName} (রোল {act.studentRoll})
                        </span>
                        <span className="text-[10px] opacity-75 font-mono">{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        {act.type === "praise" && <Award className="w-3.5 h-3.5 text-emerald-700" />}
                        {act.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                        {act.type === "notice" && <Bell className="w-3.5 h-3.5 text-amber-700" />}
                        <span>{act.title}</span>
                      </div>
                      <p className="text-[11px] opacity-80 line-clamp-2">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ভিউ ১: ছাত্র/ছাত্রী তৈরি, ছাত্র/ছাত্রী লিস্ট ও জামাত ভিত্তিক ছাত্র (স্ক্রিনশটের হুবহু অনুযায়ী) */}
          {["student_create", "student_admission", "admissions", "student_list", "student_by_jamat"].includes(activePillar) && (
            <AdmissionsView
              classes={classes}
              students={students}
              madrasa={madrasa}
              onAddNewStudent={onAddNewStudent}
              onOpenStudentProfile={onOpenStudentProfile}
              initialTab={
                activePillar === "student_list" ? "list" : 
                activePillar === "student_by_jamat" ? "by_jamat" : "form"
              }
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ২: ছাত্র ও অ্যাক্টিভিটিস (অন্যান্য অপশন) */}
          {["students"].includes(activePillar) && (
            <StudentsActivitiesHub
              students={students}
              classes={classes}
              madrasa={madrasa}
              hifzRecords={hifzRecords}
              meals={meals}
              bazarItems={bazarItems}
              initialSubTab="roster"
              onOpenStudentProfile={onOpenStudentProfile}
              onOpenScanner={onOpenScanner}
              onAddNewStudent={() => setActivePillar("student_create")}
              onAddHifzRecord={onAddHifzRecord}
              onUpdateMeal={onUpdateMeal}
              onAddBazarItem={onAddBazarItem}
              onAddStudentActivity={onAddStudentActivity}
            />
          )}

          {/* ভিউ ২.১: বাজার ব্যবস্থাপনা (সাপ্তাহিক ও মাসিক বাজার এন্ট্রি, তালিকা ও অডিট রিপোর্ট) */}
          {[
            "bazar_entry", "bazar_monthly_entry", "bazar_list", "bazar_monthly_list", "bazar_report", "bazar_monthly_report"
          ].includes(activePillar) && (
            <BazarManagementView
              madrasa={madrasa}
              bazarItems={bazarItems}
              onAddBazarItem={onAddBazarItem}
              initialTab={
                activePillar === "bazar_monthly_entry" ? "monthly_entry" :
                activePillar === "bazar_list" ? "weekly_list" :
                activePillar === "bazar_monthly_list" ? "monthly_list" :
                activePillar === "bazar_report" ? "weekly_report" :
                activePillar === "bazar_monthly_report" ? "monthly_report" : "weekly_entry"
              }
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৩: ছাত্র রেজিস্টার, খোরাকী, বেতন খাতা, সনদপত্র ও প্রশংসাপত্র */}
          {[
            "student_admission_report", "student_summary",
            "student_admission_register", "student_register", "student_blood_group",
            "student_guardian_phones", "student_phones",
            "khana_entry", "khana_list", "khana_register",
            "tuition_entry", "tuition_list", "tuition_register",
            "admission_form_print", "testimonial_print", "certificate_print",
            "testimonials", "fee_structures", "collect_payments", "add_fees",
            "salary_structures", "process_salaries", "salary_history", "classes", "sections", "subjects", "sessions"
          ].includes(activePillar) && (
            <StudentRegistersView
              students={students}
              classes={classes}
              madrasa={madrasa}
              onAddNewStudent={() => setActivePillar("student_create")}
              onNavigate={(p) => setActivePillar(p as DashboardPillar)}
              initialRegisterType={
                activePillar === "student_by_jamat" ? "jamat_students" :
                activePillar === "student_admission_report" || activePillar === "student_summary" ? "admission_report" :
                activePillar === "student_admission_register" || activePillar === "student_register" ? "admission_register" :
                activePillar === "student_blood_group" ? "blood_group" :
                activePillar === "student_guardian_phones" || activePillar === "student_phones" ? "guardian_phones" :
                activePillar === "khana_entry" ? "khana_entry" :
                activePillar === "khana_list" ? "khana_list" :
                activePillar === "khana_register" ? "khana_register" :
                activePillar === "tuition_entry" ? "salary_entry" :
                activePillar === "tuition_list" ? "salary_list" :
                activePillar === "tuition_register" ? "salary_register" :
                activePillar === "admission_form_print" ? "admission_form" :
                activePillar === "testimonial_print" || activePillar === "testimonials" ? "testimonial" :
                activePillar === "certificate_print" ? "certificate" : "admission_report"
              }
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৪: শিক্ষক ও কর্মকর্তা (ভিডিও টিউটোরিয়াল অনুযায়ী ৫টি ফিচার) */}
          {["teacher_add", "teacher_list", "teacher_phones", "teacher_salary_list", "teacher_salary", "teachers"].includes(activePillar) && (
            <TeacherDirectory
              teachers={teachers}
              madrasa={madrasa}
              onBack={handleBackNavigation}
              onAddTeacher={onAddTeacher}
              initialTab={
                activePillar === "teacher_add" ? "add" :
                activePillar === "teacher_phones" ? "phones" :
                activePillar === "teacher_salary_list" ? "salary_list" :
                activePillar === "teacher_salary" ? "salary_pay" : "list"
              }
              onTabChange={(tab) => {
                if (tab === "add") setActivePillar("teacher_add");
                else if (tab === "phones") setActivePillar("teacher_phones");
                else if (tab === "salary_list") setActivePillar("teacher_salary_list");
                else if (tab === "salary_pay") setActivePillar("teacher_salary");
                else setActivePillar("teacher_list");
              }}
            />
          )}

          {/* ভিউ ৫: হাজিরা পোর্টাল (ছাত্র ও শিক্ষক) */}
          {[
            "att_students", "att_students_report", "att_teachers", "att_teachers_report",
            "teacher_attendance", "att_dashboard", "att_employees", "att_sessions"
          ].includes(activePillar) && (
            <AttendanceHubView
              students={students}
              teachers={teachers}
              classes={classes}
              madrasa={madrasa}
              initialTab={
                activePillar === "att_teachers" || activePillar === "teacher_attendance" || activePillar === "att_employees" ? "teacher_att" :
                activePillar === "att_teachers_report" || activePillar === "att_sessions" ? "teacher_report" :
                activePillar === "att_students_report" || activePillar === "att_dashboard" ? "student_report" : "student_att"
              }
              onTabChange={(tab) => {
                if (tab === "teacher_att") setActivePillar("att_teachers");
                else if (tab === "teacher_report") setActivePillar("att_teachers_report");
                else if (tab === "student_report") setActivePillar("att_students_report");
                else setActivePillar("att_students");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৬: মাসিক চাঁদাদাতা ও চাঁদা গ্রহণ */}
          {[
            "monthly_donor_add", "monthly_donor_list", "monthly_donor_collect",
            "monthly_donor_single", "monthly_donor_matrix", "monthly_donors"
          ].includes(activePillar) && (
            <MonthlyContributorsView
              madrasa={madrasa}
              initialTab={
                activePillar === "monthly_donor_add" ? "add_donor" :
                activePillar === "monthly_donor_collect" ? "collect_fee" :
                activePillar === "monthly_donor_single" ? "single_statement" :
                activePillar === "monthly_donor_matrix" ? "all_matrix" : "donor_list"
              }
              onTabChange={(tab) => {
                if (tab === "add_donor") setActivePillar("monthly_donor_add");
                else if (tab === "collect_fee") setActivePillar("monthly_donor_collect");
                else if (tab === "single_statement") setActivePillar("monthly_donor_single");
                else if (tab === "all_matrix") setActivePillar("monthly_donor_matrix");
                else setActivePillar("monthly_donor_list");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৭: দানকারী ও যাকাত দাতা */}
          {[
            "donation_general_add", "donation_general_list", "donation_receipts",
            "zakat_collect", "zakat_donors_list", "zakat_distribution", "donations"
          ].includes(activePillar) && (
            <ZakatDonationsView
              donations={donations}
              madrasa={madrasa}
              onAddDonation={onAddDonation}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৮: কমিটি সদস্যবৃন্দ */}
          {["committee_add", "committee_list", "committee_print", "committee"].includes(activePillar) && (
            <CommitteeMembersView
              madrasa={madrasa}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ৯: পরীক্ষা ও রেজাল্ট হাব */}
          {[
            "result_marks_entry", "result_tabulation", "result_marksheet",
            "exams_dashboard", "manage_exams", "exam_schedules", "enter_results", "view_results",
            "combined_results", "admit_cards", "seat_tokens", "grading_systems", "exam_types"
          ].includes(activePillar) && (
            <ExamsHubView
              students={students}
              classes={classes}
              madrasa={madrasa}
              initialTab={
                activePillar === "result_tabulation" || activePillar === "view_results" || activePillar === "combined_results" ? "result_sheet" :
                activePillar === "result_marksheet" || activePillar === "exams_dashboard" ? "student_report" : "enter_marks"
              }
              onTabChange={(tab) => {
                if (tab === "result_sheet") setActivePillar("result_tabulation");
                else if (tab === "student_report") setActivePillar("result_marksheet");
                else setActivePillar("result_marks_entry");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ১০: জমা/খরচ হিসাব সমূহ ও একাউন্ট */}
          {[
            "acc_income_add", "acc_expense_add", "acc_income_list", "acc_expense_list",
            "acc_vouchers",
            "account_list", "account_add", "account_transfer", "accounts", "transactions"
          ].includes(activePillar) && (
            <AccountsView
              transactions={transactions}
              donations={donations}
              students={students}
              teachers={teachers}
              classes={classes}
              bazarItems={bazarItems}
              initialTab={
                activePillar === "acc_income_add" ? "income_add" :
                activePillar === "acc_income_list" ? "income_list" :
                activePillar === "acc_expense_add" ? "expense_add" :
                activePillar === "acc_expense_list" ? "expense_list" :
                activePillar === "acc_vouchers" ? "vouchers" : "overview"
              }
              onTabChange={(tab) => {
                if (tab === "income_add") setActivePillar("acc_income_add");
                else if (tab === "income_list") setActivePillar("acc_income_list");
                else if (tab === "expense_add") setActivePillar("acc_expense_add");
                else if (tab === "expense_list") setActivePillar("acc_expense_list");
                else if (tab === "vouchers") setActivePillar("acc_vouchers");
                else if (tab === "overview") setActivePillar("accounts");
              }}
              onBack={handleBackNavigation}
              onAddTransaction={onAddTransaction}
            />
          )}

          {/* ভিউ ১১: আইডি কার্ড জেনারেটর (ছাত্র ও শিক্ষক) */}
          {["idcard_student", "idcard_teacher", "id_cards"].includes(activePillar) && (
            <IdCardGeneratorView
              students={students}
              teachers={teachers}
              madrasa={madrasa}
              initialType={activePillar === "idcard_teacher" ? "teacher" : "student"}
              onTypeChange={(type) => {
                setActivePillar(type === "teacher" ? "idcard_teacher" : "idcard_student");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ১২: বাল্ক এসএমএস পোর্টাল */}
          {["sms_guardian", "sms_teacher", "sms_templates", "sms"].includes(activePillar) && (
            <SmsPortalView
              students={students}
              teachers={teachers}
              madrasa={madrasa}
              initialTarget={activePillar === "sms_teacher" ? "teachers" : "students"}
              onTargetChange={(target) => {
                setActivePillar(target === "teachers" ? "sms_teacher" : "sms_guardian");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ১৩: ব্যাংক একাউন্ট ও প্রতিবেদনসমূহ */}
          {[
            "bank_add", "bank_list", "report_financial", "report_student", "report_collection",
            "report_daily_audit", "report_yearly_audit", "report_bank_audit", "audit_reports", "analytics"
          ].includes(activePillar) && (
            <DailyAuditReportView
              transactions={transactions}
              madrasa={madrasa}
              initialTab={
                ["bank_add", "bank_list", "report_bank_audit"].includes(activePillar) ? "bank" :
                ["report_yearly_audit", "report_financial", "analytics"].includes(activePillar) ? "yearly" : "daily"
              }
              onTabChange={(tab) => {
                if (tab === "bank") setActivePillar("report_bank_audit");
                else if (tab === "yearly") setActivePillar("report_yearly_audit");
                else setActivePillar("report_daily_audit");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ১৪: মাদরাসা সেটিংস ও ক্যাটাগরি কনফিগারেশন */}
          {[
            "settings_profile", "settings_personal", "settings_expense_cat", "settings_income_cat",
            "settings_payment_methods", "acc_categories", "settings"
          ].includes(activePillar) && (
            <SettingsView
              madrasa={madrasa}
              classes={classes}
              onUpdateMadrasa={onUpdateMadrasa}
              initialTab={
                activePillar === "settings_profile" ? "info" :
                activePillar === "settings_personal" ? "personal_profile" :
                activePillar === "settings_income_cat" ? "income_cats" :
                activePillar === "settings_payment_methods" ? "payment_methods" : "expense_cats"
              }
              onTabChange={(tab) => {
                if (tab === "info") setActivePillar("settings_profile");
                else if (tab === "personal_profile") setActivePillar("settings_personal");
                else if (tab === "income_cats") setActivePillar("settings_income_cat");
                else if (tab === "payment_methods") setActivePillar("settings_payment_methods");
                else setActivePillar("settings_expense_cat");
              }}
              onBack={handleBackNavigation}
            />
          )}

          {/* ভিউ ১৫: অবশিষ্ট অন্যান্য অপশনের জন্য সাধারণ স্ক্রিন */}
          {!([
            "overview", "accounts", "students", "teachers", "donations", "admissions",
            "att_dashboard", "att_students", "att_employees", "att_sessions",
            "id_cards", "monthly_donors", "committee",
            "exams_dashboard", "manage_exams", "exam_schedules", "enter_results", "view_results", "combined_results", "admit_cards", "seat_tokens", "grading_systems", "exam_types",
            "audit_reports", "transactions", "analytics",
            "settings", "sms",
            "testimonials", "fee_structures", "collect_payments", "add_fees", "salary_structures", "process_salaries", "salary_history", "classes", "sections", "subjects", "sessions"
          ].includes(activePillar)) && (() => {
            const pillarLabels: Record<string, { label: string; icon: React.ElementType; color: string; desc: string }> = {
              sales: { label: "বিক্রয়", icon: ShoppingCart, color: "from-orange-500 to-orange-700", desc: "পণ্য ও সেবা বিক্রয় রেকর্ড" },
              notices: { label: "নোটিশ বোর্ড", icon: Bell, color: "from-amber-500 to-amber-700", desc: "প্রাতিষ্ঠানিক নোটিশ ও ঘোষণা" },
              website: { label: "হোমপেজ", icon: Globe, color: "from-blue-500 to-blue-700", desc: "মাদ্রাসার ওয়েবসাইট ব্যবস্থাপনা" },
              help: { label: "হেল্প ও টিউটোরিয়াল", icon: HelpCircle, color: "from-sky-500 to-sky-700", desc: "ব্যবহার নির্দেশিকা ও সাহায্য" },
            };
            const info = pillarLabels[activePillar];
            if (!info) return null;
            const PillarIcon = info.icon;
            return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-2xl`}>
                  <PillarIcon className="w-10 h-10 text-white" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">{info.label}</h2>
                  <p className="text-sm text-slate-500 max-w-md">{info.desc}</p>
                </div>
                <button
                  onClick={handleBackNavigation}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
                >
                  ← ফিরে যান
                </button>
              </div>
            );
          })()}
        </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ৩. দ্রুত নতুন খরচ ভাউচার এন্ট্রি মডাল */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  নতুন খরচের ভাউচার তৈরি
                </h3>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  খরচের খাত নির্বাচন করুন
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="মেস ও কাঁচাবাজার">মেস ও কাঁচাবাজার (চাল, ডাল, মাছ, মাংস)</option>
                  <option value="শিক্ষক ও স্টাফ বেতন">শিক্ষক ও স্টাফ বেতন বিল</option>
                  <option value="বিদ্যুৎ বিল">বিদ্যুৎ বিল (ডেসকো/পল্লী বিদ্যুৎ)</option>
                  <option value="গ্যাস বিল">গ্যাস বিল ও সিলিন্ডার</option>
                  <option value="লিল্লাহ বোর্ডিং ও চিকিৎসা">লিল্লাহ বোর্ডিং ও এতিম খরচ</option>
                  <option value="মেরামত ও সংস্কার">মাদরাসা মেরামত ও নির্মাণ</option>
                  <option value="অফিস ও স্টেশনারি">অফিস ও পরীক্ষা স্টেশনারি</option>
                  <option value="অন্যান্য সাধারণ খরচ">অন্যান্য বিবিধ খরচ</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  placeholder="যেমন: ১৫০০"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  খরচের বিবরণ বা ভাউচার নোট
                </label>
                <textarea
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="বাজারের তালিকা বা খরচের কারণ লিখুন..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/30"
                >
                  ভাউচার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
