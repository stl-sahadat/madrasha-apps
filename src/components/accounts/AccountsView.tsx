"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Receipt, 
  Calendar,
  Filter,
  Search,
  ChevronRight,
  X,
  Users,
  GraduationCap,
  HeartHandshake,
  ShoppingBag,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Building,
  Phone,
  Clock,
  ChevronLeft,
  Printer,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Minus,
  RefreshCw,
  Download
} from "lucide-react";
import { 
  CashTransaction, 
  DonationRecord, 
  Student, 
  TeacherStaff, 
  MadrasaClass, 
  DailyBazarItem 
} from "@/types";

interface AccountsViewProps {
  transactions: CashTransaction[];
  donations?: DonationRecord[];
  students?: Student[];
  teachers?: TeacherStaff[];
  classes?: MadrasaClass[];
  bazarItems?: DailyBazarItem[];
  onBack: () => void;
  initialTab?: "overview" | "income_add" | "income_list" | "expense_add" | "expense_list" | "vouchers";
  onTabChange?: (tab: "overview" | "income_add" | "income_list" | "expense_add" | "expense_list" | "vouchers") => void;
  onAddTransaction?: (tx: Omit<CashTransaction, "id">) => void;
}

type DetailCategory = 
  | "donation" 
  | "zakat" 
  | "student_fee" 
  | "leather" 
  | "other_income" 
  | "teacher_salary" 
  | "bazar" 
  | "electricity"
  | "gas"
  | "utility" 
  | "maintenance" 
  | "guest" 
  | "other_expense" 
  | null;

// ১২ মাসের তালিকা
const MONTHS_LIST = [
  { id: "all", nameBn: "সকল মাস", shortBn: "সকল মাস" },
  { id: "01", nameBn: "০১ - জানুয়ারি", shortBn: "জানুয়ারি" },
  { id: "02", nameBn: "০২ - ফেব্রুয়ারি", shortBn: "ফেব্রুয়ারি" },
  { id: "03", nameBn: "০৩ - মার্চ", shortBn: "মার্চ" },
  { id: "04", nameBn: "০৪ - এপ্রিল", shortBn: "এপ্রিল" },
  { id: "05", nameBn: "০৫ - মে", shortBn: "মে" },
  { id: "06", nameBn: "০৬ - জুন", shortBn: "জুন" },
  { id: "07", nameBn: "০৭ - জুলাই", shortBn: "জুলাই" },
  { id: "08", nameBn: "০৮ - আগস্ট", shortBn: "আগস্ট" },
  { id: "09", nameBn: "০৯ - সেপ্টেম্বর", shortBn: "সেপ্টেম্বর" },
  { id: "10", nameBn: "১০ - অক্টোবর", shortBn: "অক্টোবর" },
  { id: "11", nameBn: "১১ - নভেম্বর", shortBn: "নভেম্বর" },
  { id: "12", nameBn: "১২ - ডিসেম্বর", shortBn: "ডিসেম্বর" },
];

// ২০০ বছরের ধারাবাহিক তালিকা (১৯০০ থেকে ২১০০ সাল পর্যন্ত)
const YEARS_LIST: number[] = Array.from({ length: 201 }, (_, i) => 1900 + i);

export const AccountsView: React.FC<AccountsViewProps> = ({
  transactions,
  donations = [],
  students = [],
  teachers = [],
  classes = [],
  bazarItems = [],
  onBack,
  onAddTransaction,
  initialTab = "income_add",
  onTabChange,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<
    "overview" | "income_add" | "income_list" | "expense_add" | "expense_list" | "vouchers"
  >(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveMainTab(initialTab);
    }
  }, [initialTab]);

  const handleSwitchTab = (tab: "overview" | "income_add" | "income_list" | "expense_add" | "expense_list" | "vouchers") => {
    setActiveMainTab(tab);
    onTabChange?.(tab);
  };

  // টোস্ট মেসেজ
  const [toastMessage, setToastMessage] = useState<string>("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // রসিদ ও ভাউচার প্রিভিউ/প্রিন্ট
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<CashTransaction | null>(null);

  // ১. নতুন অর্থ জমা এন্ট্রি স্টেট (স্ক্রিনশটের হুবহু অনুকৃতি)
  const [incomeDate, setIncomeDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [incomeVoucherNo, setIncomeVoucherNo] = useState<string>(() => `V${transactions.filter(t => t.type === 'income').length + 1}`);
  const [incomePersonName, setIncomePersonName] = useState<string>("");
  const [incomeAccount, setIncomeAccount] = useState<string>("");
  const [incomeBankAccount, setIncomeBankAccount] = useState<string>("");
  const [incomePaymentMethod, setIncomePaymentMethod] = useState<string>("");

  interface IncomeItemRow {
    id: string;
    sector: string;
    bookNo: string;
    receiptNo: string;
    description: string;
    amount: number | string;
  }

  const [incomeRows, setIncomeRows] = useState<IncomeItemRow[]>([
    { id: "row_1", sector: "", bookNo: "", receiptNo: "", description: "", amount: 0 }
  ]);

  const totalIncomeAmount = incomeRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddIncomeRow = () => {
    setIncomeRows(prev => [
      ...prev,
      { id: `row_${Date.now()}_${Math.random()}`, sector: "", bookNo: "", receiptNo: "", description: "", amount: 0 }
    ]);
  };

  const handleRemoveIncomeRow = (id: string) => {
    if (incomeRows.length <= 1) {
      setIncomeRows([{ id: "row_1", sector: "", bookNo: "", receiptNo: "", description: "", amount: 0 }]);
      return;
    }
    setIncomeRows(prev => prev.filter(r => r.id !== id));
  };

  const handleIncomeRowChange = (id: string, field: keyof IncomeItemRow, val: any) => {
    setIncomeRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleResetIncome = () => {
    setIncomePersonName("");
    setIncomeAccount("");
    setIncomeBankAccount("");
    setIncomePaymentMethod("");
    setIncomeRows([{ id: "row_1", sector: "", bookNo: "", receiptNo: "", description: "", amount: 0 }]);
  };

  const handleSubmitIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeDate) {
      alert("তারিখ নির্বাচন করুন।");
      return;
    }
    const validRows = incomeRows.filter(r => Number(r.amount) > 0);
    if (validRows.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি জমার খাতের জন্য টাকা লিখুন।");
      return;
    }
    validRows.forEach((r, idx) => {
      onAddTransaction?.({
        type: "income",
        category: r.sector || "সাধারণ দান ও অনুদান",
        fundType: (incomeAccount.includes("লিল্লাহ") || incomeAccount.includes("যাকাত")) ? "lillah_zakat" : "general",
        amount: Number(r.amount),
        date: incomeDate,
        description: r.description || (incomePersonName ? `${incomePersonName} এর নিকট থেকে জমা` : "জমা প্রাপ্তি"),
        receiptNumber: r.receiptNo || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        voucherNo: incomeVoucherNo || `V${transactions.filter(t => t.type === 'income').length + idx + 1}`,
        personName: incomePersonName,
        account: incomeAccount || "সাধারণ একাউন্ট",
        bankAccount: incomeBankAccount,
        paymentMethod: incomePaymentMethod || "ক্যাশ (নগদ)",
        bookNo: r.bookNo
      });
    });
    showToast(`সফল! মোট ৳ ${totalIncomeAmount.toLocaleString()} টাকা জমা যুক্ত হয়েছে।`);
    handleResetIncome();
    setIncomeVoucherNo(`V${transactions.filter(t => t.type === 'income').length + 2}`);
  };

  // ২. নতুন খরচ এন্ট্রি স্টেট (স্ক্রিনশটের হুবহু অনুকৃতি)
  const [expenseDate, setExpenseDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [expenseVoucherNo, setExpenseVoucherNo] = useState<string>(() => `V${transactions.filter(t => t.type === 'expense').length + 1}`);
  const [expensePersonName, setExpensePersonName] = useState<string>("");
  const [expenseAccount, setExpenseAccount] = useState<string>("");
  const [expenseBankAccount, setExpenseBankAccount] = useState<string>("");
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<string>("");
  const [expenseSourceFund, setExpenseSourceFund] = useState<string>("সাধারণ তহবিল"); // কোন খাত থেকে খরচ হবে *
  const [expenseSector, setExpenseSector] = useState<string>("এতিমখানার"); // খরচের খাত *
  const [expenseNote, setExpenseNote] = useState<string>(""); // নোট#

  interface ExpenseItemRow {
    id: string;
    description: string;
    quantity: string;
    amount: number | string;
  }

  const [expenseRows, setExpenseRows] = useState<ExpenseItemRow[]>([
    { id: "erow_1", description: "", quantity: "", amount: "" }
  ]);

  const totalExpenseAmount = expenseRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddExpenseRow = () => {
    setExpenseRows(prev => [
      ...prev,
      { id: `erow_${Date.now()}_${Math.random()}`, description: "", quantity: "", amount: "" }
    ]);
  };

  const handleRemoveExpenseRow = (id: string) => {
    if (expenseRows.length <= 1) {
      setExpenseRows([{ id: "erow_1", description: "", quantity: "", amount: "" }]);
      return;
    }
    setExpenseRows(prev => prev.filter(r => r.id !== id));
  };

  const handleExpenseRowChange = (id: string, field: keyof ExpenseItemRow, val: any) => {
    setExpenseRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleResetExpense = () => {
    setExpensePersonName("");
    setExpenseAccount("");
    setExpenseBankAccount("");
    setExpensePaymentMethod("");
    setExpenseSourceFund("সাধারণ তহবিল");
    setExpenseSector("এতিমখানার");
    setExpenseNote("");
    setExpenseRows([{ id: "erow_1", description: "", quantity: "", amount: "" }]);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDate) {
      alert("তারিখ নির্বাচন করুন।");
      return;
    }
    if (!expenseSourceFund) {
      alert("অনুগ্রহ করে 'কোন খাত থেকে খরচ হবে' নির্বাচন করুন।");
      return;
    }
    if (!expenseSector) {
      alert("অনুগ্রহ করে 'খরচের খাত' নির্বাচন করুন।");
      return;
    }
    const validRows = expenseRows.filter(r => Number(r.amount) > 0);
    if (validRows.length === 0) {
      alert("অনুগ্রহ করে খরচের হিসাব তালিকায় অন্তত একটি আইটেমের টাকা লিখুন।");
      return;
    }

    const currentVoucherNo = expenseVoucherNo || `V${transactions.filter(t => t.type === 'expense').length + 1}`;
    const newTx: CashTransaction = {
      id: `tx_exp_${Date.now()}`,
      type: "expense",
      category: expenseSector,
      fundType: (expenseSourceFund.includes("লিল্লাহ") || expenseSourceFund.includes("যাকাত") || expenseSourceFund.includes("এতিমখানা")) ? "lillah_zakat" : "general",
      amount: totalExpenseAmount,
      date: expenseDate,
      description: expenseNote || (expensePersonName ? `${expensePersonName}-কে প্রদান` : `${expenseSector} বাবদ ব্যয়`),
      voucherNo: currentVoucherNo,
      personName: expensePersonName || "সাধারণ খরচ",
      account: expenseSourceFund || expenseAccount || "সাধারণ একাউন্ট",
      bankAccount: expenseBankAccount,
      paymentMethod: expensePaymentMethod || "ক্যাশ",
      note: expenseNote,
      items: validRows.map(r => ({
        description: r.description || expenseSector,
        quantity: r.quantity || undefined,
        amount: Number(r.amount)
      }))
    };

    onAddTransaction?.(newTx);
    setSelectedReceiptTx(newTx); // সরাসরি প্রিন্টযোগ্য ডেবিট ভাউচার মডাল ওপেন
    showToast(`সফল! মোট ৳ ${totalExpenseAmount.toLocaleString()} টাকা খরচের ভাউচার (${currentVoucherNo}) সংরক্ষণ হয়েছে।`);
    handleResetExpense();
    setExpenseVoucherNo(`V${transactions.filter(t => t.type === 'expense').length + 2}`);
  };

  // সম্প্রতি জমা ও খরচ তালিকা
  const recentIncomes = [...transactions.filter(t => t.type === "income")].reverse();
  const recentExpenses = [...transactions.filter(t => t.type === "expense")].reverse();

  // তালিকা অনুসন্ধান ও ফিল্টার
  const [listSearch, setListSearch] = useState<string>("");
  const [listYearFilter, setListYearFilter] = useState<string>("all");
  const [listMonthFilter, setListMonthFilter] = useState<string>("all");

  const [activeFundFilter, setActiveFundFilter] = useState<"all" | "general" | "lillah_zakat">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // বিস্তারিত ড্রিল-ডাউন পপআপ স্টেট (সাহাদাত ভাইয়ের নির্দেশিত)
  const [activeDetail, setActiveDetail] = useState<DetailCategory>(null);
  const [utilitySubTab, setUtilitySubTab] = useState<"electricity" | "gas">("electricity");
  const [modalSearch, setModalSearch] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // নতুন ভাউচার ফর্ম স্টেট
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("বাজার খরচ");
  const [fundType, setFundType] = useState<"general" | "lillah_zakat">("general");
  const [amount, setAmount] = useState<number>(1000);
  const [description, setDescription] = useState("");

  // ক্যাশবুক রোজনামচা তারিখ ও ভাউচার স্টেট (সাহাদাত ভাইয়ের নির্দেশিত)
  const [showDailyLedgerModal, setShowDailyLedgerModal] = useState<boolean>(false);
  const [ledgerDate, setLedgerDate] = useState<string>("");
  const [ledgerSearchText, setLedgerSearchText] = useState<string>("");
  const [selectedVoucherTx, setSelectedVoucherTx] = useState<CashTransaction | null>(null);

  // বছর ও মাস ফিল্টারিং স্টেট (সাহাদাত ভাইয়ের নির্দেশিত ২০০ বছরের স্ক্রলেবল পপআপ)
  const [filterYear, setFilterYear] = useState<string>("2026");
  const [filterMonth, setFilterMonth] = useState<string>("03");
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);
  const [yearSearch, setYearSearch] = useState<string>("");
  const yearListRef = React.useRef<HTMLDivElement>(null);

  // ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
  const toBnNumber = (n: number | string) => {
    const enToBn: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(n).replace(/[0-9]/g, (c) => enToBn[c] || c);
  };

  // পপআপ খোলার পর নির্বাচিত সালে স্ক্রল করা
  React.useEffect(() => {
    if (showYearDropdown && yearListRef.current) {
      const activeEl = yearListRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [showYearDropdown]);

  // সাল ফিল্টারিং (সার্চ ও ২০০টি সাল)
  const filteredYears = YEARS_LIST.filter((y) => {
    if (!yearSearch.trim()) return true;
    const searchNormalized = normalizeDate(yearSearch);
    return String(y).includes(searchNormalized) || toBnNumber(y).includes(yearSearch);
  });

  // বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর
  const normalizeDate = (d?: string) => {
    if (!d) return "";
    const bnToEn: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return d.replace(/[০-৯]/g, (c) => bnToEn[c] || c).trim();
  };

  // তারিখকে বাংলায় সুন্দরভাবে প্রদর্শন
  const formatBnDate = (dateStr: string) => {
    const d = normalizeDate(dateStr);
    const parts = d.split("-");
    if (parts.length !== 3) return dateStr;
    const monthsBn: Record<string, string> = {
      "01": "জানুয়ারি", "02": "ফেব্রুয়ারি", "03": "মার্চ", "04": "এপ্রিল",
      "05": "মে", "06": "জুন", "07": "জুলাই", "08": "আগস্ট",
      "09": "সেপ্টেম্বর", "10": "অক্টোবর", "11": "নভেম্বর", "12": "ডিসেম্বর"
    };
    return `${parts[2]} ${monthsBn[parts[1]] || parts[1]}, ${parts[0]}`;
  };

  // মোট আয় ও ব্যয় হিসাব
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // ফান্ডভিত্তিক আলাদা ব্যালেন্স
  const generalIncome = transactions
    .filter((t) => t.type === "income" && t.fundType === "general")
    .reduce((sum, t) => sum + t.amount, 0);
  const generalExpense = transactions
    .filter((t) => t.type === "expense" && t.fundType === "general")
    .reduce((sum, t) => sum + t.amount, 0);
  const generalBalance = generalIncome - generalExpense;

  const lillahIncome = transactions
    .filter((t) => t.type === "income" && t.fundType === "lillah_zakat")
    .reduce((sum, t) => sum + t.amount, 0);
  const lillahExpense = transactions
    .filter((t) => t.type === "expense" && t.fundType === "lillah_zakat")
    .reduce((sum, t) => sum + t.amount, 0);
  const lillahBalance = lillahIncome - lillahExpense;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) {
      alert("অনুগ্রহ করে সঠিক পরিমাণ ও খরচের বিবরণ লিখুন।");
      return;
    }
    onAddTransaction?.({
      type,
      category,
      fundType,
      amount,
      date: new Date().toISOString().split("T")[0],
      description,
      receiptNumber: type === "income" ? `REC-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    });
    setShowAddModal(false);
    setDescription("");
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeFundFilter === "all") return true;
    return t.fundType === activeFundFilter;
  });

  // আয়ের ক্যাটাগরি ডেটা
  const incomeCategories = [
    {
      id: "donation" as DetailCategory,
      label: "দান ও অনুদান",
      subLabel: "শুভাকাঙ্ক্ষী ও সাধারণ দান",
      keywords: ["দান", "অনুদান", "চাঁদা", "মাসিক"],
      icon: HeartHandshake,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textDark: "text-emerald-800",
      badgeBorder: "border-emerald-200",
    },
    {
      id: "zakat" as DetailCategory,
      label: "যাকাত ও ফিতরা",
      subLabel: "এতিম ও দরিদ্র ছাত্রদের ফান্ড",
      keywords: ["যাকাত", "লিল্লাহ", "ফিতরা"],
      icon: Coins,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textDark: "text-amber-800",
      badgeBorder: "border-amber-200",
    },
    {
      id: "student_fee" as DetailCategory,
      label: "ছাত্র বেতন ও ফি",
      subLabel: "জামাতভিত্তিক মাসিক টিউশন ও ভর্তি ফি",
      keywords: ["বেতন", "টিউশন", "ফি", "ভর্তি"],
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textDark: "text-blue-800",
      badgeBorder: "border-blue-200",
    },
    {
      id: "leather" as DetailCategory,
      label: "চামড়া বিক্রয় লব্ধ তহবিল",
      subLabel: "কোরবানির চামড়া ও কালেকশন",
      keywords: ["চামড়া"],
      icon: Receipt,
      color: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      textDark: "text-purple-800",
      badgeBorder: "border-purple-200",
    },
    {
      id: "other_income" as DetailCategory,
      label: "অন্যান্য আয়",
      subLabel: "বিবিধ প্রাপ্তি ও হাদিয়া",
      keywords: [],
      icon: Plus,
      color: "from-slate-500 to-slate-700",
      bgLight: "bg-slate-50",
      textDark: "text-slate-800",
      badgeBorder: "border-slate-200",
    }
  ];

  // ব্যয়ের ক্যাটাগরি ডেটা
  const expenseCategories = [
    {
      id: "teacher_salary" as DetailCategory,
      label: "উস্তাদ ও স্টাফ বেতন",
      subLabel: "সকল মুহাদ্দিস ও কর্মচারীর সম্মানী",
      keywords: ["বেতন", "সম্মানী"],
      icon: GraduationCap,
      color: "from-indigo-600 to-violet-600",
      bgLight: "bg-indigo-50",
      textDark: "text-indigo-800",
      badgeBorder: "border-indigo-200",
    },
    {
      id: "bazar" as DetailCategory,
      label: "মেস ও বাজার খরচ",
      subLabel: "চাল, ডাল, মাছ, মাংস ও কাঁচাবাজার",
      keywords: ["বাজার", "মেস", "খাবার", "চাল", "মাছ"],
      icon: ShoppingBag,
      color: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50",
      textDark: "text-orange-800",
      badgeBorder: "border-orange-200",
    },
    {
      id: "utility" as DetailCategory,
      label: "বিদ্যুৎ ও গ্যাস বিল",
      subLabel: "মাদরাসা ও মেসের বিদ্যুৎ এবং গ্যাস খরচ",
      keywords: ["বিদ্যুৎ", "গ্যাস", "কারেন্ট", "সিলিন্ডার", "বিল"],
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textDark: "text-amber-800",
      badgeBorder: "border-amber-200",
    },
    {
      id: "other_expense" as DetailCategory,
      label: "অন্যান্য ব্যয়",
      subLabel: "মেরামত, কিতাবখানা, চিকিৎসা ও মেহমানদারি",
      keywords: [],
      icon: Building,
      color: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
      textDark: "text-rose-800",
      badgeBorder: "border-rose-200",
    }
  ];

  // ক্যাটাগরিভিত্তিক টাকার হিসাব
  const getIncomeAmt = (cat: typeof incomeCategories[0]) => {
    const incTxs = transactions.filter(t => t.type === "income");
    if (cat.keywords.length > 0) {
      return incTxs.filter(t => cat.keywords.some(k => t.category.includes(k))).reduce((s, t) => s + t.amount, 0);
    }
    const allKnown = ["দান", "অনুদান", "চাঁদা", "মাসিক", "যাকাত", "লিল্লাহ", "ফিতরা", "বেতন", "টিউশন", "ফি", "ভর্তি", "চামড়া"];
    return incTxs.filter(t => !allKnown.some(k => t.category.includes(k))).reduce((s, t) => s + t.amount, 0);
  };

  const getExpenseAmt = (cat: typeof expenseCategories[0]) => {
    const expTxs = transactions.filter(t => t.type === "expense");
    if (cat.keywords.length > 0) {
      return expTxs.filter(t => cat.keywords.some(k => t.category.includes(k) || t.description.includes(k))).reduce((s, t) => s + t.amount, 0);
    }
    const allKnown = ["বেতন", "সম্মানী", "বাজার", "মেস", "খাবার", "চাল", "মাছ", "বিদ্যুৎ", "গ্যাস", "বিল"];
    return expTxs.filter(t => !allKnown.some(k => t.category.includes(k) || t.description.includes(k))).reduce((s, t) => s + t.amount, 0);
  };

  const maxIncomeAmt = Math.max(...incomeCategories.map(c => getIncomeAmt(c)), 1);
  const maxExpenseAmt = Math.max(...expenseCategories.map(c => getExpenseAmt(c)), 1);

  // মোডাল খোলার হ্যান্ডলার
  const openDetail = (cat: DetailCategory) => {
    setActiveDetail(cat);
    setLedgerDate("");
    setModalSearch("");
    setSelectedClassId(null);
    setShowYearDropdown(false);
    setShowMonthDropdown(false);
  };

  // ডেটা ফিল্টারিং ফাংশন (তারিখ, বছর ও মাস মিলিয়ে)
  const matchesMonth = (dateStr?: string) => {
    if (!dateStr) return true;
    const d = normalizeDate(dateStr); // e.g. "2026-03-22"

    // ১. যদি ক্যালেন্ডার থেকে নির্দিষ্ট কোনো তারিখ বাছাই করা থাকে
    if (ledgerDate) {
      const target = normalizeDate(ledgerDate);
      return d === target || d.startsWith(target);
    }

    // ২. বছর ও মাস মিলিয়ে ফিল্টার
    const parts = d.split("-");
    if (parts.length >= 2) {
      const yr = parts[0];
      const mo = parts[1];
      if (filterYear !== "all" && yr !== filterYear) return false;
      if (filterMonth !== "all" && mo !== filterMonth) return false;
    }
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← ড্যাশবোর্ডে ফিরুন</span>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              মাদ্রাসার কেন্দ্রীয় হিসাবরক্ষণ ও ক্যাশবুক
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              দৈনন্দিন আয়-ব্যয় ভাউচার, বাজার খরচ, বেতন এবং লিল্লাহ ফান্ড হিসাব
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>প্রিন্ট করুন</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন আয় / ব্যয়ের ভাউচার</span>
          </button>
        </div>
      </div>

      {/* টোস্ট মেসেজ নোটিফিকেশন */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ১. জমা ও খরচ সাব-মেনু ট্যাব বার */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200 no-print">
        <button
          type="button"
          onClick={() => handleSwitchTab("income_add")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "income_add"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-300" />
          <span>নতুন অর্থ জমা করুন</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("income_list")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "income_list"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-teal-300" />
          <span>জমার লিস্ট</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("expense_add")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "expense_add"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Minus className="w-3.5 h-3.5 text-rose-300" />
          <span>নতুন খরচ</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("expense_list")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "expense_list"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-300" />
          <span>খরচের লিস্ট</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("vouchers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "vouchers"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />
          <span>ভাউচার</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            activeMainTab === "overview"
              ? "bg-[#1b686e] text-white ring-2 ring-[#1b686e]/30 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-blue-300" />
          <span>ক্যাশ ড্যাশবোর্ড / সামারি</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ২. ভিউ: নতুন অর্থ জমা করুন (ভিডিও টিউটোরিয়াল ও স্ক্রিনশট হুবহু অনুরূপ) */}
      {/* ========================================================================= */}
      {activeMainTab === "income_add" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* বাম কলাম: নতুন জমা যুক্ত করুন ফরম */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-black text-slate-900 border-b pb-2">
              নতুন জমা যুক্ত করুন
            </h2>

            <form onSubmit={handleSubmitIncome} className="space-y-3.5">
              {/* তারিখ ও ভাউচার নং */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    তারিখ (দিন/মাস/বছর) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ভাউচার নং
                  </label>
                  <input
                    type="text"
                    value={incomeVoucherNo}
                    onChange={(e) => setIncomeVoucherNo(e.target.value)}
                    placeholder="যেমন: V2"
                    className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                  />
                </div>
              </div>

              {/* জমার ব্যক্তি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জমার ব্যক্তি
                </label>
                <input
                  type="text"
                  value={incomePersonName}
                  onChange={(e) => setIncomePersonName(e.target.value)}
                  placeholder="জমার ব্যক্তি"
                  className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                />
              </div>

              {/* একাউন্ট */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  একাউন্ট
                </label>
                <div className="relative">
                  <select
                    value={incomeAccount}
                    onChange={(e) => setIncomeAccount(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="সাধারণ একাউন্ট">সাধারণ একাউন্ট (ক্যাশ)</option>
                    <option value="লিল্লাহ ও যাকাত ফান্ড">লিল্লাহ ও যাকাত ফান্ড</option>
                    <option value="উন্নয়ন ও নির্মাণ ফান্ড">উন্নয়ন ও নির্মাণ ফান্ড</option>
                    <option value="মেস ও বোর্ডিং একাউন্ট">মেস ও বোর্ডিং একাউন্ট</option>
                    <option value="মসজিদ ফান্ড">মসজিদ ফান্ড</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ব্যাংক একাউন্ট (যদি থাকে) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ব্যাংক একাউন্ট (যদি থাকে)
                </label>
                <div className="relative">
                  <select
                    value={incomeBankAccount}
                    onChange={(e) => setIncomeBankAccount(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="ইসলামী ব্যাংক বাংলাদেশ লিঃ (হিসাব: ২০৫০১...)">ইসলামী ব্যাংক বাংলাদেশ লিঃ (হিসাব: ২০৫০১...)</option>
                    <option value="আল-আরাফাহ ইসলামী ব্যাংক (হিসাব: ০১২১...)">আল-আরাফাহ ইসলামী ব্যাংক (হিসাব: ০১২১...)</option>
                    <option value="সোনালী ব্যাংক পিএলসি (হিসাব: ৪৪১৩...)">সোনালী ব্যাংক পিএলসি (হিসাব: ৪৪১৩...)</option>
                    <option value="ডাচ্-বাংলা ব্যাংক (হিসাব: ১১৮...)">ডাচ্-বাংলা ব্যাংক (হিসাব: ১১৮...)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* পেমেন্ট মেথড */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পেমেন্ট মেথড
                </label>
                <div className="relative">
                  <select
                    value={incomePaymentMethod}
                    onChange={(e) => setIncomePaymentMethod(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="ক্যাশ (নগদ)">ক্যাশ (নগদ)</option>
                    <option value="ব্যাংক ট্রান্সফার / চেক">ব্যাংক ট্রান্সফার / চেক</option>
                    <option value="বিকাশ (bKash)">বিকাশ (bKash)</option>
                    <option value="নগদ (Nagad)">নগদ (Nagad)</option>
                    <option value="রকেট (Rocket)">রকেট (Rocket)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ডাইনামিক রো টেবিল (স্ক্রিনশটের টেবিল ডিজাইন হুবহু) */}
              <div className="pt-2">
                <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1b686e] text-white font-bold text-center">
                        <th className="py-2 px-2 border-r border-[#135156] w-10">নং</th>
                        <th className="py-2 px-2 border-r border-[#135156] min-w-[140px]">জমার খাত</th>
                        <th className="py-2 px-2 border-r border-[#135156] w-16">বই নং</th>
                        <th className="py-2 px-2 border-r border-[#135156] w-16">রসিদ নং</th>
                        <th className="py-2 px-2 border-r border-[#135156] min-w-[120px]">বিবরণ</th>
                        <th className="py-2 px-2 border-r border-[#135156] w-24">টাকা</th>
                        <th className="py-2 px-2 w-10">ক্রিয়া</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white font-medium">
                      {incomeRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-2 text-center font-bold text-slate-600 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <select
                              value={row.sector}
                              onChange={(e) => handleIncomeRowChange(row.id, "sector", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            >
                              <option value="">নির্বাচন করুন</option>
                              <option value="সাধারণ দান ও অনুদান">সাধারণ দান ও অনুদান</option>
                              <option value="মাসিক চাঁদা">মাসিক চাঁদা</option>
                              <option value="যাকাত ও ফিতরা">যাকাত ও ফিতরা</option>
                              <option value="লিল্লাহ বোর্ডিং ফান্ড">লিল্লাহ বোর্ডিং ফান্ড</option>
                              <option value="কোরবানির চামড়া বিক্রয়">কোরবানির চামড়া বিক্রয়</option>
                              <option value="ছাত্রদের ভর্তি ফি">ছাত্রদের ভর্তি ফি</option>
                              <option value="ছাত্র বেতন ও টিউশন">ছাত্র বেতন ও টিউশন</option>
                              <option value="আবাসিক খোরাকী ফি">আবাসিক খোরাকী ফি</option>
                              <option value="বই ও কিতাব বিক্রয়">বই ও কিতাব বিক্রয়</option>
                              <option value="অন্যান্য বিবিধ আয়">অন্যান্য বিবিধ আয়</option>
                            </select>
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="text"
                              value={row.bookNo}
                              onChange={(e) => handleIncomeRowChange(row.id, "bookNo", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="text"
                              value={row.receiptNo}
                              onChange={(e) => handleIncomeRowChange(row.id, "receiptNo", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) => handleIncomeRowChange(row.id, "description", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={row.amount}
                              onChange={(e) => handleIncomeRowChange(row.id, "amount", e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-right text-slate-900 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveIncomeRow(row.id)}
                              disabled={incomeRows.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={handleAddIncomeRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন যুক্ত</span>
                  </button>
                </div>
              </div>

              {/* মোট টাকার পরিমাণ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোট টাকার পরিমাণ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={totalIncomeAmount.toFixed(2)}
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-black text-slate-900"
                />
              </div>

              {/* অ্যাকশন বাটনসমূহ (পুনরায় সেট করুন, বাতিল, জমা যুক্ত) */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetIncome}
                  className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  পুনরায় সেট করুন
                </button>
                <button
                  type="button"
                  onClick={handleResetIncome}
                  className="px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b686e] hover:bg-[#135156] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  জমা যুক্ত
                </button>
              </div>
            </form>
          </div>

          {/* ডান কলাম: সম্প্রতি জমার বিবরণ */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                সম্প্রতি জমার বিবরণ
              </h2>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                সর্বশেষ {Math.min(recentIncomes.length, 10)} টি
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold text-center">
                    <th className="py-2 px-2 border-r border-[#135156] w-8">নং</th>
                    <th className="py-2 px-2 border-r border-[#135156]">তারিখ</th>
                    <th className="py-2 px-2 border-r border-[#135156]">রসিদ নং</th>
                    <th className="py-2 px-2 border-r border-[#135156]">বই নং</th>
                    <th className="py-2 px-2 border-r border-[#135156]">ব্যক্তি/মাধ্যম</th>
                    <th className="py-2 px-2 border-r border-[#135156]">জমার খাত</th>
                    <th className="py-2 px-2 text-right pr-2">টাকা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  {recentIncomes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        কোনো জমার রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    recentIncomes.slice(0, 10).map((tx, idx) => (
                      <tr 
                        key={tx.id} 
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        title="রসিদ দেখতে ক্লিক করুন"
                      >
                        <td className="py-2 px-2 text-center font-bold text-slate-600 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 whitespace-nowrap text-slate-700">
                          {tx.date}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600 font-mono">
                          {tx.receiptNumber || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600">
                          {tx.bookNo || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-700 truncate max-w-[90px]">
                          {[tx.personName, tx.paymentMethod].filter(Boolean).join(" / ") || "ক্যাশ"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-800 font-semibold truncate max-w-[100px]">
                          {tx.category}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-emerald-700 pr-2 whitespace-nowrap">
                          {Number(tx.amount).toFixed(2)}
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
      {/* ৩. ভিউ: নতুন ব্যয় যুক্ত (খরচের হিসাব ও ভাউচার এন্ট্রি - স্ক্রিনশটের হুবহু) */}
      {/* ========================================================================= */}
      {activeMainTab === "expense_add" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* বাম কলাম: নতুন ব্যয় যুক্ত ফরম (স্ক্রিনশটের অনুরূপ) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-200 pb-2.5">
              নতুন ব্যয় যুক্ত
            </h2>

            <form onSubmit={handleSubmitExpense} className="space-y-4">
              {/* ভাউচার নং */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ভাউচার নং
                </label>
                <input
                  type="text"
                  value={expenseVoucherNo}
                  onChange={(e) => setExpenseVoucherNo(e.target.value)}
                  placeholder="V1"
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                />
              </div>

              {/* তারিখ * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  তারিখ (দিন/মাস/বছর) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                />
              </div>

              {/* একাউন্ট */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  একাউন্ট
                </label>
                <div className="relative">
                  <select
                    value={expenseAccount}
                    onChange={(e) => setExpenseAccount(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="সাধারণ একাউন্ট">সাধারণ একাউন্ট (ক্যাশ)</option>
                    <option value="লিল্লাহ ও যাকাত ফান্ড">লিল্লাহ ও যাকাত ফান্ড</option>
                    <option value="এতিমখানা একাউন্ট">এতিমখানা একাউন্ট</option>
                    <option value="উন্নয়ন ও নির্মাণ ফান্ড">উন্নয়ন ও নির্মাণ ফান্ড</option>
                    <option value="মেস ও বোর্ডিং একাউন্ট">মেস ও বোর্ডিং একাউন্ট</option>
                    <option value="মসজিদ ফান্ড">মসজিদ ফান্ড</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ব্যাংক একাউন্ট (যদি থাকে) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ব্যাংক একাউন্ট (যদি থাকে)
                </label>
                <div className="relative">
                  <select
                    value={expenseBankAccount}
                    onChange={(e) => setExpenseBankAccount(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="ইসলামী ব্যাংক বাংলাদেশ লিঃ (হিসাব: ২০৫০১...)">ইসলামী ব্যাংক বাংলাদেশ লিঃ (হিসাব: ২০৫০১...)</option>
                    <option value="আল-আরাফাহ ইসলামী ব্যাংক (হিসাব: ০১২১...)">আল-আরাফাহ ইসলামী ব্যাংক (হিসাব: ০১২১...)</option>
                    <option value="সোনালী ব্যাংক পিএলসি (হিসাব: ৪৪১৩...)">সোনালী ব্যাংক পিএলসি (হিসাব: ৪৪১৩...)</option>
                    <option value="ডাচ্-বাংলা ব্যাংক (হিসাব: ১১৮...)">ডাচ্-বাংলা ব্যাংক (হিসাব: ১১৮...)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* পেমেন্ট মেথড */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পেমেন্ট মেথড
                </label>
                <div className="relative">
                  <select
                    value={expensePaymentMethod}
                    onChange={(e) => setExpensePaymentMethod(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="ক্যাশ (নগদ)">ক্যাশ (নগদ)</option>
                    <option value="ব্যাংক ট্রান্সফার / চেক">ব্যাংক ট্রান্সফার / চেক</option>
                    <option value="বিকাশ (bKash)">বিকাশ (bKash)</option>
                    <option value="নগদ (Nagad)">নগদ (Nagad)</option>
                    <option value="রকেট (Rocket)">রকেট (Rocket)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* কোন খাত থেকে খরচ হবে * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  কোন খাত থেকে খরচ হবে <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={expenseSourceFund}
                    onChange={(e) => setExpenseSourceFund(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="সাধারণ তহবিল">সাধারণ তহবিল</option>
                    <option value="লিল্লাহ ও যাকাত ফান্ড">লিল্লাহ ও যাকাত ফান্ড</option>
                    <option value="এতিমখানা ফান্ড">এতিমখানা ফান্ড</option>
                    <option value="উন্নয়ন ও নির্মাণ ফান্ড">উন্নয়ন ও নির্মাণ ফান্ড</option>
                    <option value="মেস ও বোর্ডিং একাউন্ট">মেস ও বোর্ডিং একাউন্ট</option>
                    <option value="মসজিদ ফান্ড">মসজিদ ফান্ড</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* খরচের খাত * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  খরচের খাত <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={expenseSector}
                    onChange={(e) => setExpenseSector(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs cursor-pointer"
                  >
                    <option value="এতিমখানার">এতিমখানার</option>
                    <option value="মেস ও কাঁচাবাজার">মেস ও কাঁচাবাজার (চাল, ডাল, তেল)</option>
                    <option value="মাছ, মাংস ও ডিম">মাছ, মাংস ও ডিম</option>
                    <option value="শিক্ষক ও স্টাফ বেতন">শিক্ষক ও স্টাফ বেতন</option>
                    <option value="বিদ্যুৎ বিল">বিদ্যুৎ বিল</option>
                    <option value="গ্যাস সিলিন্ডার ও জ্বালানি">গ্যাস সিলিন্ডার ও জ্বালানি</option>
                    <option value="লিল্লাহ বোর্ডিং ও চিকিৎসা">লিল্লাহ বোর্ডিং ও চিকিৎসা</option>
                    <option value="মাদরাসা মেরামত ও নির্মাণ">মাদরাসা মেরামত ও নির্মাণ</option>
                    <option value="অফিস ও স্টেশনারি">অফিস ও স্টেশনারি</option>
                    <option value="মেহমানদারি ও আপ্যায়ন">মেহমানদারি ও আপ্যায়ন</option>
                    <option value="অন্যান্য সাধারণ খরচ">অন্যান্য সাধারণ খরচ</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* খরচের হিসাব ও বিবরণী টেবিল (ডায়নামিক সাব-আইটেমস - স্ক্রিনশটের হুবহু নং | বিবরণ | পরিমাণ | টাকা | ক্রিয়া) */}
              <div className="pt-1">
                <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1b686e] text-white font-bold text-center">
                        <th className="py-2.5 px-3 border-r border-[#135156] w-12">নং</th>
                        <th className="py-2.5 px-3 border-r border-[#135156]">বিবরণ</th>
                        <th className="py-2.5 px-3 border-r border-[#135156] w-28">পরিমাণ</th>
                        <th className="py-2.5 px-3 border-r border-[#135156] w-32">টাকা</th>
                        <th className="py-2.5 px-2 w-14">ক্রিয়া</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white font-medium">
                      {expenseRows.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 text-center font-bold text-slate-600 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="text"
                              placeholder="বিবরণ লিখুন..."
                              value={row.description}
                              onChange={(e) => handleExpenseRowChange(row.id, "description", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="text"
                              placeholder="যেমন: ৫ কেজি"
                              value={row.quantity}
                              onChange={(e) => handleExpenseRowChange(row.id, "quantity", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 border-r border-slate-200">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              placeholder="০.০০"
                              value={row.amount}
                              onChange={(e) => handleExpenseRowChange(row.id, "amount", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-right text-slate-900 focus:outline-none focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveExpenseRow(row.id)}
                              disabled={expenseRows.length <= 1}
                              className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors rounded-lg hover:bg-rose-50"
                              title="সারি মুছুন"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={handleAddExpenseRow}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন যুক্ত</span>
                  </button>
                </div>
              </div>

              {/* টাকার পরিমাণ * (স্বয়ংক্রিয় যোগফল) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  টাকার পরিমাণ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={totalExpenseAmount > 0 ? totalExpenseAmount.toFixed(2) : "0.00"}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-black text-slate-900 shadow-inner"
                />
              </div>

              {/* খরচের ব্যক্তি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  খরচের ব্যক্তি
                </label>
                <input
                  type="text"
                  placeholder="খরচের ব্যক্তি"
                  value={expensePersonName}
                  onChange={(e) => setExpensePersonName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                />
              </div>

              {/* নোট# */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  নোট#
                </label>
                <textarea
                  rows={3}
                  placeholder="অনুগ্রহপূর্বক বিবরণ"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                />
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetExpense}
                  className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  পুনরায় সেট করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1b686e] hover:bg-[#135156] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* ডান কলাম: সম্প্রতি খরচের বিবরণ (স্ক্রিনশটের অনুরূপ) */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-black text-slate-900">
                সাম্প্রতি খরচের বিবরণ
              </h2>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                সর্বশেষ {Math.min(recentExpenses.length, 10)} টি
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold text-center">
                    <th className="py-2.5 px-2 border-r border-[#135156] w-10">নং</th>
                    <th className="py-2.5 px-2.5 border-r border-[#135156]">ভাউচার নং</th>
                    <th className="py-2.5 px-2.5 border-r border-[#135156]">তারিখ</th>
                    <th className="py-2.5 px-2.5 border-r border-[#135156]">মাধ্যম</th>
                    <th className="py-2.5 px-2.5 text-right pr-3">টাকা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  {recentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                        কোনো খরচের রেকর্ড পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    recentExpenses.slice(0, 10).map((tx, idx) => (
                      <tr 
                        key={tx.id} 
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        title="ক্লিক করে ডেবিট ভাউচার দেখুন ও প্রিন্ট করুন"
                      >
                        <td className="py-2 px-2 text-center font-bold text-slate-600 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200 text-teal-700 font-mono font-bold group-hover:underline">
                          {tx.voucherNo || "-"}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200 whitespace-nowrap text-slate-700">
                          {tx.date}
                        </td>
                        <td className="py-2 px-2.5 border-r border-slate-200 text-slate-700">
                          {tx.paymentMethod || "ক্যাশ"}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold text-rose-700 pr-3 whitespace-nowrap">
                          {Number(tx.amount).toFixed(2)}
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
      {/* ৪. ভিউ: জমার লিস্ট (আদায়ের সম্পূর্ণ খতিয়ান ও তালিকা) */}
      {/* ========================================================================= */}
      {activeMainTab === "income_list" && (() => {
        const allIncomes = transactions.filter(t => t.type === "income");
        const filteredIncomes = allIncomes.filter(t => {
          if (listSearch) {
            const q = listSearch.toLowerCase();
            const matchName = t.personName?.toLowerCase().includes(q);
            const matchCat = t.category?.toLowerCase().includes(q);
            const matchRec = t.receiptNumber?.toLowerCase().includes(q);
            const matchDesc = t.description?.toLowerCase().includes(q);
            if (!matchName && !matchCat && !matchRec && !matchDesc) return false;
          }
          if (listYearFilter !== "all") {
            if (!t.date.startsWith(listYearFilter)) return false;
          }
          if (listMonthFilter !== "all") {
            const parts = t.date.split("-");
            if (parts.length >= 2 && parts[1] !== listMonthFilter) return false;
          }
          return true;
        });

        const listTotalIncome = filteredIncomes.reduce((s, t) => s + t.amount, 0);

        return (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h2 className="text-base font-black text-slate-900">জমার খতিয়ান ও আদায় তালিকা</h2>
                <p className="text-xs text-slate-500">সকল প্রকার অনুদান, ফি, চাঁদা ও বিবিধ আয়ের সংরক্ষিত রেকর্ড</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                  মোট জমা: ৳ {listTotalIncome.toLocaleString()} ({filteredIncomes.length}টি এন্ট্রি)
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#1b686e] hover:bg-[#135156] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* ফিল্টার বার */}
            <div className="flex flex-wrap items-center gap-3 no-print">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="ব্যক্তির নাম, রসিদ নং বা খাত দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* বছর ফিল্টার */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">বছর:</label>
                <select
                  value={listYearFilter}
                  onChange={(e) => setListYearFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                >
                  <option value="all">সকল বছর</option>
                  <option value="2026">২০২৬</option>
                  <option value="2025">২০২৫</option>
                  <option value="2024">২০২৪</option>
                </select>
              </div>

              {/* মাস ফিল্টার */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">মাস:</label>
                <select
                  value={listMonthFilter}
                  onChange={(e) => setListMonthFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                >
                  <option value="all">সকল মাস</option>
                  <option value="01">জানুয়ারি</option>
                  <option value="02">ফেব্রুয়ারি</option>
                  <option value="03">মার্চ</option>
                  <option value="04">এপ্রিল</option>
                  <option value="05">মে</option>
                  <option value="06">জুন</option>
                  <option value="07">জুলাই</option>
                  <option value="08">আগস্ট</option>
                  <option value="09">সেপ্টেম্বর</option>
                  <option value="10">অক্টোবর</option>
                  <option value="11">নভেম্বর</option>
                  <option value="12">ডিসেম্বর</option>
                </select>
              </div>
            </div>

            {/* টেবিল */}
            <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold text-center">
                    <th className="py-2.5 px-2 border-r border-[#135156] w-10">নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">তারিখ</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">ভাউচার নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">রসিদ নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">বই নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">জমার ব্যক্তি</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">জমার খাত</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">একাউন্ট / ফান্ড</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">পেমেন্ট মেথড</th>
                    <th className="py-2.5 px-2 border-r border-[#135156] text-right pr-3">টাকা</th>
                    <th className="py-2.5 px-2 w-16 no-print">রসিদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  {filteredIncomes.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400">
                        কোনো জমার তথ্য খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredIncomes.map((tx, idx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-2 text-center font-bold text-slate-600 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 whitespace-nowrap text-slate-700">
                          {tx.date}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600 font-mono">
                          {tx.voucherNo || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600 font-mono">
                          {tx.receiptNumber || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600">
                          {tx.bookNo || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 font-bold text-slate-800">
                          {tx.personName || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-700 text-[11px]">
                          {tx.account || (tx.fundType === "general" ? "সাধারণ তহবিল" : "লিল্লাহ/যাকাত ফান্ড")}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-700 text-[11px]">
                          {tx.paymentMethod || "ক্যাশ (নগদ)"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-right font-mono font-bold text-emerald-700 pr-3 whitespace-nowrap">
                          ৳ {Number(tx.amount).toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-center no-print">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="p-1 hover:bg-teal-50 text-teal-700 hover:text-teal-900 rounded-lg transition-colors"
                            title="রসিদ প্রিন্ট করুন"
                          >
                            <Printer className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ৫. ভিউ: খরচের লিস্ট (ব্যয়ের সম্পূর্ণ খতিয়ান ও তালিকা) */}
      {/* ========================================================================= */}
      {activeMainTab === "expense_list" && (() => {
        const allExpenses = transactions.filter(t => t.type === "expense");
        const filteredExpenses = allExpenses.filter(t => {
          if (listSearch) {
            const q = listSearch.toLowerCase();
            const matchName = t.personName?.toLowerCase().includes(q);
            const matchCat = t.category?.toLowerCase().includes(q);
            const matchVch = t.voucherNo?.toLowerCase().includes(q);
            const matchDesc = t.description?.toLowerCase().includes(q);
            if (!matchName && !matchCat && !matchVch && !matchDesc) return false;
          }
          if (listYearFilter !== "all") {
            if (!t.date.startsWith(listYearFilter)) return false;
          }
          if (listMonthFilter !== "all") {
            const parts = t.date.split("-");
            if (parts.length >= 2 && parts[1] !== listMonthFilter) return false;
          }
          return true;
        });

        const listTotalExpense = filteredExpenses.reduce((s, t) => s + t.amount, 0);

        return (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h2 className="text-base font-black text-slate-900">খরচের খতিয়ান ও তালিকা</h2>
                <p className="text-xs text-slate-500">মেস বাজার, শিক্ষক বেতন, বিদ্যুৎ ও অন্যান্য ব্যয়ের সংরক্ষিত রেকর্ড</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold">
                  মোট খরচ: ৳ {listTotalExpense.toLocaleString()} ({filteredExpenses.length}টি এন্ট্রি)
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#1b686e] hover:bg-[#135156] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* ফিল্টার বার */}
            <div className="flex flex-wrap items-center gap-3 no-print">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="প্রাপকের নাম, ভাউচার নং বা খাত দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* বছর ফিল্টার */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">বছর:</label>
                <select
                  value={listYearFilter}
                  onChange={(e) => setListYearFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                >
                  <option value="all">সকল বছর</option>
                  <option value="2026">২০২৬</option>
                  <option value="2025">২০২৫</option>
                  <option value="2024">২০২৪</option>
                </select>
              </div>

              {/* মাস ফিল্টার */}
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">মাস:</label>
                <select
                  value={listMonthFilter}
                  onChange={(e) => setListMonthFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                >
                  <option value="all">সকল মাস</option>
                  <option value="01">জানুয়ারি</option>
                  <option value="02">ফেব্রুয়ারি</option>
                  <option value="03">মার্চ</option>
                  <option value="04">এপ্রিল</option>
                  <option value="05">মে</option>
                  <option value="06">জুন</option>
                  <option value="07">জুলাই</option>
                  <option value="08">আগস্ট</option>
                  <option value="09">সেপ্টেম্বর</option>
                  <option value="10">অক্টোবর</option>
                  <option value="11">নভেম্বর</option>
                  <option value="12">ডিসেম্বর</option>
                </select>
              </div>
            </div>

            {/* টেবিল */}
            <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1b686e] text-white font-bold text-center">
                    <th className="py-2.5 px-2 border-r border-[#135156] w-10">নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">তারিখ</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">ভাউচার নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">মেমো নং</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">প্রাপক / ব্যক্তি</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">খরচের খাত</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">একাউন্ট / ফান্ড</th>
                    <th className="py-2.5 px-2 border-r border-[#135156]">পেমেন্ট মেথড</th>
                    <th className="py-2.5 px-2 border-r border-[#135156] text-right pr-3">টাকা</th>
                    <th className="py-2.5 px-2 w-16 no-print">ভাউচার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-medium">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        কোনো খরচের তথ্য খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((tx, idx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-2 text-center font-bold text-slate-600 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 whitespace-nowrap text-slate-700">
                          {tx.date}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600 font-mono">
                          {tx.voucherNo || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-600">
                          {tx.receiptNumber || tx.bookNo || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 font-bold text-slate-800">
                          {tx.personName || "-"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-700 text-[11px]">
                          {tx.account || (tx.fundType === "general" ? "সাধারণ তহবিল" : "লিল্লাহ/যাকাত ফান্ড")}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-slate-700 text-[11px]">
                          {tx.paymentMethod || "ক্যাশ (নগদ)"}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-200 text-right font-mono font-bold text-rose-700 pr-3 whitespace-nowrap">
                          ৳ {Number(tx.amount).toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-center no-print">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="p-1 hover:bg-rose-50 text-rose-700 hover:text-rose-900 rounded-lg transition-colors"
                            title="ভাউচার প্রিন্ট করুন"
                          >
                            <Printer className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ৬. ভিউ: ভাউচার (খতিয়ান ও ভাউচার প্রিন্ট) */}
      {/* ========================================================================= */}
      {activeMainTab === "vouchers" && (() => {
        const filteredAll = transactions.filter(t => {
          if (!listSearch) return true;
          const q = listSearch.toLowerCase();
          return t.voucherNo?.toLowerCase().includes(q) ||
                 t.personName?.toLowerCase().includes(q) ||
                 t.category?.toLowerCase().includes(q) ||
                 t.receiptNumber?.toLowerCase().includes(q);
        });

        return (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h2 className="text-base font-black text-slate-900">ভাউচার খতিয়ান ও প্রিন্ট সিস্টেম</h2>
                <p className="text-xs text-slate-500">সকল প্রকার জমা ও খরচের অফিশিয়াল ডেবিট/ক্রেডিট ভাউচার</p>
              </div>
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="ভাউচার নং বা নাম দিয়ে অনুসন্ধান..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAll.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        tx.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {tx.type === "income" ? "ক্রেডিট / জমার ভাউচার" : "ডেবিট / খরচের ভাউচার"}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1.5">
                        ভাউচার নং: {tx.voucherNo || tx.receiptNumber || tx.id}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">তারিখ: {tx.date}</p>
                    </div>
                    <span className={`text-base font-black font-mono ${
                      tx.type === "income" ? "text-emerald-700" : "text-rose-700"
                    }`}>
                      {tx.type === "income" ? "+" : "-"} ৳ {tx.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 border-t border-slate-200/80 pt-2 space-y-1">
                    <p><span className="text-slate-400 font-bold">ব্যক্তি/প্রাপক:</span> {tx.personName || "ক্যাশ কাউন্টার"}</p>
                    <p><span className="text-slate-400 font-bold">খাত:</span> {tx.category}</p>
                    <p className="text-[11px] text-slate-500 truncate" title={tx.description}>{tx.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="px-3 py-1.5 bg-[#1b686e] hover:bg-[#135156] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>ভাউচার প্রিন্ট</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ৭. ভিউ: ওভারভিউ / ক্যাশ ড্যাশবোর্ড ও ক্যাশবুক সামারি */}
      {/* ========================================================================= */}
      {activeMainTab === "overview" && (
        <div className="space-y-6">
          {/* ক্যাশ ব্যালেন্স সামারি কার্ড (৩টি কার্ড) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* কার্ড ১: মোট ক্যাশ ব্যালেন্স */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">মোট ক্যাশ ব্যালেন্স</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">৳ {netBalance.toLocaleString()}</p>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>মোট আয়: <b className="text-emerald-700">+৳ {totalIncome.toLocaleString()}</b></span>
            <span>মোট ব্যয়: <b className="text-red-600">-৳ {totalExpense.toLocaleString()}</b></span>
          </div>
        </div>

        {/* কার্ড ২: সাধারণ তহবিল (General Fund) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">সাধারণ তহবিল ব্যালেন্স</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-900">৳ {generalBalance.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            ছাত্রদের বেতন ও মাদ্রাসার সাধারণ খরচ
          </p>
        </div>

        {/* কার্ড ৩: লিল্লাহ ও যাকাত ফান্ড */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">লিল্লাহ ও যাকাত ফান্ড</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-900">৳ {lillahBalance.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            শুধু এতিম ও দরিদ্র ছাত্রদের খোরপোষে ব্যবহার্য
          </p>
        </div>
      </div>

      {/* ============================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: ক্লিকযোগ্য বাটনভিত্তিক আয় ও ব্যয় বিশ্লেষণ */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ১. আয়ের উৎসভিত্তিক বাটন গ্রিড */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">আয়ের উৎসভিত্তিক বিশ্লেষণ</h4>
                <p className="text-[11px] text-slate-500">যে কোনো খাতে চাপ দিয়ে বিস্তারিত তালিকা দেখুন</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              মোট: ৳ {totalIncome.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {incomeCategories.map((cat) => {
              const amt = getIncomeAmt(cat);
              if (amt <= 0 && cat.id === "leather") return null;
              const Icon = cat.icon;
              const pct = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0;
              const barWidth = Math.round((amt / maxIncomeAmt) * 100);

              return (
                <button
                  key={cat.id}
                  onClick={() => openDetail(cat.id)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all group shadow-sm hover:shadow active:scale-[0.99] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${cat.bgLight} ${cat.textDark} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {cat.subLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-emerald-700">
                          ৳ {amt.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          আয়ের {pct}%
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* প্রোগ্রেস বার */}
                  <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>ক্লিক করে তালিকা ও বিবরণ দেখুন</span>
                    <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-0.5">
                      বিস্তারিত রেকর্ড <Eye className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ২. খরচের খাতভিত্তিক বাটন গ্রিড */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-sm">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">খরচের খাতভিত্তিক বিশ্লেষণ</h4>
                <p className="text-[11px] text-slate-500">যে কোনো খাতে চাপ দিয়ে খরচের ভাউচার দেখুন</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              মোট: ৳ {totalExpense.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {expenseCategories.map((cat) => {
              const amt = getExpenseAmt(cat);
              const Icon = cat.icon;
              const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
              const barWidth = Math.round((amt / maxExpenseAmt) * 100);

              return (
                <button
                  key={cat.id}
                  onClick={() => openDetail(cat.id)}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50/70 hover:bg-rose-50/60 border border-slate-200/80 hover:border-rose-300 transition-all group shadow-sm hover:shadow active:scale-[0.99] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${cat.bgLight} ${cat.textDark} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-rose-900 transition-colors">
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {cat.subLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-rose-700">
                          ৳ {amt.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ব্যয়ের {pct}%
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* প্রোগ্রেস বার */}
                  <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>ক্লিক করে ভাউচার ও খতিয়ান দেখুন</span>
                    <span className="text-rose-600 font-bold group-hover:underline flex items-center gap-0.5">
                      ভাউচার ও খতিয়ান <Eye className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: দৈনিক ক্যাশবুক রোজনামচা রেজিস্টার বাটন */}
      {/* ============================================================= */}
      {/* ============================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: ৮টি অপশনের নিচে মাঝখান বরাবর দৈনিক রোজনামচা অপশন বাটন */}
      {/* ============================================================= */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-full max-w-3xl">
          <button
            type="button"
            onClick={() => {
              setShowDailyLedgerModal(true);
              setLedgerDate("");
              setLedgerSearchText("");
            }}
            className="w-full text-left p-5 sm:p-6 rounded-3xl bg-white hover:bg-indigo-50/40 border-2 border-indigo-200/90 hover:border-indigo-500 shadow-md hover:shadow-xl transition-all duration-300 group active:scale-[0.99] flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              {/* প্রিমিয়াম ৩ডি রয়্যাল অডিট সিল আইকন */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-800 text-white flex items-center justify-center shadow-xl shadow-indigo-600/35 ring-4 ring-indigo-100 group-hover:ring-indigo-300 group-hover:scale-105 transition-all shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                <CalendarDays className="w-7 h-7 text-white drop-shadow-md relative z-10" />
                {/* গোল্ডেন অডিট রিবন সিল */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md ring-2 ring-white z-20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-950 transition-colors">
                    দৈনিক ক্যাশবুক ও রোজনামচা অডিট রেজিস্টার
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    দৈনিক হিসাব অপশন
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  যেকোনো নির্দিষ্ট তারিখের দৈনিক ক্যাশ জমা-খরচ, সমাপনী ক্যাশ স্থিতি ও ভাউচার স্লিপ
                </p>
                <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-bold pt-0.5">
                  <span>ক্লিক করে দৈনন্দিনের হিসাবগুলার অপশন দেখুন</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block font-bold">মোট সংরক্ষিত লেনদেন</span>
                <span className="text-xs sm:text-sm font-black text-indigo-700">{transactions.length}টি ভাউচার এন্ট্রি</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 group-hover:translate-x-1 transition-all">
                <span>রোজনামচা খুলুন</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: দৈনিক ক্যাশবুক রোজনামচা পপআপ মোডাল */}
      {/* ========================================================================= */}
      {showDailyLedgerModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            
            {/* মোডাল হেডার ও স্ক্রিনশট ২ অনুযায়ী কন্ট্রোল বার */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col gap-4">
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-100 shrink-0">
                    <BookOpenCheck className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      দৈনিক ক্যাশবুক ও রোজনামচা অডিট রেজিস্টার
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      যেকোনো নির্দিষ্ট তারিখের দৈনিক ক্যাশ জমা-খরচ, সমাপনী ক্যাশ স্থিতি ও ভাউচার স্লিপ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDailyLedgerModal(false)}
                  className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* কন্ট্রোল বার: সাহাদাত ভাইয়ের ২য় স্ক্রিনশট অনুযায়ী (মাসের ড্রপডাউন ছাড়া শুধু ফান্ড ও তারিখ) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                
                {/* ১. ফান্ড ফিল্টার সুইচ */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "all" ? "bg-indigo-600 text-white shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    সব ফান্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("general")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "general" ? "bg-blue-600 text-white shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    সাধারণ ফান্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("lillah_zakat")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "lillah_zakat" ? "bg-amber-600 text-white shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100 hover:text-amber-700"
                    }`}
                  >
                    লিল্লাহ / যাকাত
                  </button>
                </div>

                {/* বছর ও মাস নির্বাচন এবং ক্যালেন্ডার তারিখ */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* বছর নির্বাচন বাটন ও স্ক্রলেবল ২০০ বছরের পপআপ */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowYearDropdown(!showYearDropdown);
                        setShowMonthDropdown(false);
                      }}
                      className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-indigo-400 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all active:scale-95"
                      title="সাল নির্বাচন করুন"
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[10px] text-slate-400">বছর:</span>
                      <span className="text-indigo-950 font-black">
                        {filterYear === "all" ? "সকল বছর" : `${toBnNumber(filterYear)}`}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showYearDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowYearDropdown(false)} 
                        />
                        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2.5 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-[11px] font-black text-slate-800">বছর তালিকা (২০০ সাল)</span>
                            <button
                              type="button"
                              onClick={() => { 
                                setFilterYear("all"); 
                                setShowYearDropdown(false); 
                                setLedgerDate("");
                              }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline"
                            >
                              সকল বছর
                            </button>
                          </div>
                          
                          {/* সাল খোঁজার সার্চবক্স */}
                          <div className="mb-2">
                            <input
                              type="text"
                              value={yearSearch}
                              onChange={(e) => setYearSearch(e.target.value)}
                              placeholder="সাল লিখুন (যেমন: ২০২৬)..."
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* স্ক্রলেবল ২০০ বছরের তালিকা */}
                          <div 
                            ref={yearListRef}
                            className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs"
                          >
                            {filteredYears.map((yr) => {
                              const yrStr = String(yr);
                              const isSelected = filterYear === yrStr;
                              return (
                                <button
                                  key={yr}
                                  type="button"
                                  data-active={isSelected}
                                  onClick={() => {
                                    setFilterYear(yrStr);
                                    setShowYearDropdown(false);
                                    setYearSearch("");
                                    setLedgerDate("");
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                                    isSelected
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span>{toBnNumber(yr)} <span className={`text-[10px] ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>({yr})</span></span>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* মাস নির্বাচন বাটন ও পপআপ */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMonthDropdown(!showMonthDropdown);
                        setShowYearDropdown(false);
                      }}
                      className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-indigo-400 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all active:scale-95"
                      title="মাস নির্বাচন করুন"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[10px] text-slate-400">মাস:</span>
                      <span className="text-indigo-950 font-black">
                        {MONTHS_LIST.find(m => m.id === filterMonth)?.shortBn || "সকল মাস"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showMonthDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showMonthDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowMonthDropdown(false)} 
                        />
                        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2.5 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-[11px] font-black text-slate-800">মাস নির্বাচন</span>
                            <button
                              type="button"
                              onClick={() => { 
                                setFilterMonth("all"); 
                                setShowMonthDropdown(false); 
                                setLedgerDate("");
                              }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline"
                            >
                              সব মাস
                            </button>
                          </div>

                          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs">
                            {MONTHS_LIST.map((m) => {
                              const isSelected = filterMonth === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => {
                                    setFilterMonth(m.id);
                                    setShowMonthDropdown(false);
                                    setLedgerDate("");
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                                    isSelected
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span>{m.nameBn}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* ২. নির্দিষ্ট যেকোনো তারিখ নির্বাচন (ক্যালেন্ডার পিকার) */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] text-slate-500 font-bold">তারিখ (দিন/মাস/বছর):</span>
                    <input
                      type="date"
                      value={ledgerDate}
                      onChange={(e) => setLedgerDate(e.target.value)}
                      className="bg-transparent focus:outline-none text-xs cursor-pointer font-bold text-slate-900"
                    />
                    {ledgerDate && (
                      <button
                        type="button"
                        onClick={() => setLedgerDate("")}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold ml-1.5 px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                        title="তারিখ ক্লিয়ার করুন"
                      >
                        সব তারিখ
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* সার্চ বার */}
            <div className="p-3 sm:p-4 bg-white border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={ledgerSearchText}
                  onChange={(e) => setLedgerSearchText(e.target.value)}
                  placeholder="রোজনামচায় যেকোনো খাত, বিবরণ বা ভাউচার নম্বর (#VOUCH / #REC / #DON) দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {ledgerSearchText && (
                <button
                  type="button"
                  onClick={() => setLedgerSearchText("")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 bg-slate-100 rounded-lg"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>

            {/* মোডাল বডি: তারিখ অনুযায়ী গ্রুপড রোজনামচা কার্ড লিস্ট */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {(() => {
                // ১. ফিল্টার করা লেনদেন (ফান্ড, বছর, মাস ও তারিখ পিকার মিলিয়ে)
                const ledgerFilteredTxs = transactions.filter((t) => {
                  if (activeFundFilter !== "all" && t.fundType !== activeFundFilter) return false;
                  if (!matchesMonth(t.date)) return false;
                  if (ledgerSearchText) {
                    const q = ledgerSearchText.toLowerCase();
                    const matchCat = t.category.toLowerCase().includes(q);
                    const matchDesc = t.description.toLowerCase().includes(q);
                    const matchRec = (t.receiptNumber || "").toLowerCase().includes(q);
                    if (!matchCat && !matchDesc && !matchRec) return false;
                  }
                  return true;
                });

                // ২. তারিখ অনুযায়ী গ্রুপ করা
                const grouped: Record<string, CashTransaction[]> = {};
                ledgerFilteredTxs.forEach((t) => {
                  const d = t.date;
                  if (!grouped[d]) grouped[d] = [];
                  grouped[d].push(t);
                });

                const sortedDates = Object.keys(grouped).sort((a, b) => {
                  return normalizeDate(b).localeCompare(normalizeDate(a));
                });

                if (sortedDates.length === 0) {
                  return (
                    <div className="p-10 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-xs space-y-1">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                      <p className="font-bold text-slate-600">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</p>
                      <p className="text-[11px]">নির্বাচিত তারিখ বা ফান্ড ফিল্টার পরিবর্তন করে দেখুন।</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {sortedDates.map((dateKey) => {
                      const dayTxs = grouped[dateKey];
                      const dayIncome = dayTxs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
                      const dayExpense = dayTxs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                      const dayNet = dayIncome - dayExpense;

                      return (
                        <div
                          key={dateKey}
                          className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs hover:border-indigo-300 transition-all"
                        >
                          {/* তারিখের হেডার ব্যানার (দৈনিক সামারি) */}
                          <div className="p-3.5 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-black text-slate-900 block">
                                  {formatBnDate(dateKey)}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  দৈনিক মোট {dayTxs.length}টি লেনদেন ভাউচার
                                </span>
                              </div>
                            </div>

                            {/* দৈনিক মোট আয়, ব্যয় ও নিট স্থিতি */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                                জমা: + ৳ {dayIncome.toLocaleString()}
                              </span>
                              <span className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
                                খরচ: - ৳ {dayExpense.toLocaleString()}
                              </span>
                              <span className={`px-2.5 py-1 rounded-xl font-black border ${
                                dayNet >= 0
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                  : "bg-rose-600 text-white border-rose-600 shadow-sm"
                              }`}>
                                স্থিতি: {dayNet >= 0 ? "+" : ""} ৳ {dayNet.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* ঐ তারিখের লেনদেন তালিকা */}
                          <div className="divide-y divide-slate-100">
                            {dayTxs.map((tx) => (
                              <div
                                key={tx.id}
                                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        tx.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {tx.type === "income" ? "আয় (+)" : "ব্যয় (-)"}
                                    </span>
                                    <span className="font-bold text-slate-900 text-xs">{tx.category}</span>
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                        tx.fundType === "general"
                                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                                          : "bg-amber-50 text-amber-800 border border-amber-200"
                                      }`}
                                    >
                                      {tx.fundType === "general" ? "সাধারণ তহবিল" : "লিল্লাহ/যাকাত ফান্ড"}
                                    </span>
                                    {tx.receiptNumber && (
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        #{tx.receiptNumber}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600">{tx.description}</p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                  <div className="text-right">
                                    <span
                                      className={`text-sm sm:text-base font-black block ${
                                        tx.type === "income" ? "text-emerald-700" : "text-red-600"
                                      }`}
                                    >
                                      {tx.type === "income" ? "+" : "-"} ৳ {tx.amount.toLocaleString()}
                                    </span>
                                  </div>

                                  {/* রসিদ / ভাউচার স্লিপ দেখার বাটন */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedVoucherTx(tx)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-slate-700 transition-all active:scale-95 shadow-2xs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>ভাউচার স্লিপ</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* মোডাল ফুটার */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowDailyLedgerModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: বিস্তারিত ড্রিল-ডাউন মোডাল (Interactive Modal) */}
      {/* ========================================================================= */}
      {activeDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            
            {/* মোডাল হেডার (সাহাদাত ভাইয়ের নির্দেশিত ২-সারিবিশিষ্ট প্রশস্ত লেআউট) */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex flex-col gap-3.5">
              
              {/* সারি ১: খতিয়ান পরিচিতি ও ক্লোজ বাটন */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                    {activeDetail === "donation" && <HeartHandshake className="w-5 h-5" />}
                    {activeDetail === "zakat" && <Coins className="w-5 h-5" />}
                    {activeDetail === "student_fee" && <Users className="w-5 h-5" />}
                    {activeDetail === "teacher_salary" && <GraduationCap className="w-5 h-5" />}
                    {activeDetail === "bazar" && <ShoppingBag className="w-5 h-5" />}
                    {activeDetail === "electricity" && <Zap className="w-5 h-5 text-amber-300" />}
                    {activeDetail === "gas" && <Flame className="w-5 h-5 text-orange-300" />}
                    {activeDetail === "utility" && <Zap className="w-5 h-5" />}
                    {(activeDetail === "other_expense" || activeDetail === "other_income" || activeDetail === "leather") && <Receipt className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {activeDetail === "donation" && "দান ও অনুদান খতিয়ান ও দাতা তালিকা"}
                      {activeDetail === "zakat" && "যাকাত ও ফিতরা ফান্ড আদায় তালিকা"}
                      {activeDetail === "student_fee" && "ছাত্র বেতন ও ফি — জামাতভিত্তিক পূর্ণাঙ্গ খতিয়ান"}
                      {activeDetail === "teacher_salary" && "উস্তাদ ও কর্মকর্তা-কর্মচারী বেতন পে-রোল"}
                      {activeDetail === "bazar" && "মেস ও বোর্ডিং কাঁচাবাজার ও খাদ্য ভাউচার"}
                      {activeDetail === "electricity" && "বিদ্যুৎ বিল পরিশোধ খতিয়ান ও মিটার ভাউচার"}
                      {activeDetail === "gas" && "গ্যাস বিল ও সিলিন্ডার পরিশোধ খতিয়ান"}
                      {activeDetail === "utility" && "বিদ্যুৎ, গ্যাস ও ইউটিলিটি বিল পরিশোধ খতিয়ান"}
                      {activeDetail === "other_expense" && "অন্যান্য প্রাতিষ্ঠানিক খরচের ভাউচার তালিকা"}
                      {activeDetail === "leather" && "কোরবানির চামড়া বিক্রয় লব্ধ তহবিল খতিয়ান"}
                      {activeDetail === "other_income" && "বিবিধ আয়ের খতিয়ান"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      প্রতিটি রেকর্ডের পূর্ণাঙ্গ বিবরণ, পরিমাণ ও অডিট রেফারেন্স
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDetail(null)}
                  className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors shrink-0"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* সারি ২: প্রশস্ত ফিল্টার টুলবার (ফান্ড, বছর, মাস ও তারিখ) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                {/* ফান্ড ফিল্টার বাটন */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "all"
                        ? "bg-indigo-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    সব ফান্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("general")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "general"
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    সাধারণ ফান্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFundFilter("lillah_zakat")}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                      activeFundFilter === "lillah_zakat"
                        ? "bg-amber-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-amber-700"
                    }`}
                  >
                    লিল্লাহ / যাকাত
                  </button>
                </div>

                {/* বছর, মাস ও ক্যালেন্ডার তারিখ গ্রুপ */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* বছর নির্বাচন বাটন ও স্ক্রলেবল ২০০ বছরের পপআপ (সাহাদাত ভাইয়ের নির্দেশিত) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowYearDropdown(!showYearDropdown);
                        setShowMonthDropdown(false);
                      }}
                      className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-indigo-400 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all active:scale-95 whitespace-nowrap"
                      title="সাল নির্বাচন করুন"
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[10px] text-slate-400">বছর:</span>
                      <span className="text-indigo-950 font-black">
                        {filterYear === "all" ? "সকল বছর" : `${toBnNumber(filterYear)}`}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showYearDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowYearDropdown(false)} 
                        />
                        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2.5 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-[11px] font-black text-slate-800">বছর তালিকা (২০০ সাল)</span>
                            <button
                              type="button"
                              onClick={() => { 
                                setFilterYear("all"); 
                                setShowYearDropdown(false); 
                                setLedgerDate("");
                              }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline"
                            >
                              সকল বছর
                            </button>
                          </div>
                          
                          {/* সাল খোঁজার সার্চবক্স */}
                          <div className="mb-2">
                            <input
                              type="text"
                              value={yearSearch}
                              onChange={(e) => setYearSearch(e.target.value)}
                              placeholder="সাল লিখুন (যেমন: ২০২৬)..."
                              className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* স্ক্রলেবল ২০০ বছরের তালিকা */}
                          <div 
                            ref={yearListRef}
                            className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs"
                          >
                            {filteredYears.map((yr) => {
                              const yrStr = String(yr);
                              const isSelected = filterYear === yrStr;
                              return (
                                <button
                                  key={yr}
                                  type="button"
                                  data-active={isSelected}
                                  onClick={() => {
                                    setFilterYear(yrStr);
                                    setShowYearDropdown(false);
                                    setYearSearch("");
                                    setLedgerDate("");
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                                    isSelected
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span>{toBnNumber(yr)} <span className={`text-[10px] ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>({yr})</span></span>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* মাস নির্বাচন বাটন ও পপআপ */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMonthDropdown(!showMonthDropdown);
                        setShowYearDropdown(false);
                      }}
                      className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-indigo-400 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all active:scale-95 whitespace-nowrap"
                      title="মাস নির্বাচন করুন"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[10px] text-slate-400">মাস:</span>
                      <span className="text-indigo-950 font-black">
                        {MONTHS_LIST.find(m => m.id === filterMonth)?.shortBn || "সকল মাস"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showMonthDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showMonthDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowMonthDropdown(false)} 
                        />
                        <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2.5 animate-fadeIn">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-[11px] font-black text-slate-800">মাস নির্বাচন</span>
                            <button
                              type="button"
                              onClick={() => { 
                                setFilterMonth("all"); 
                                setShowMonthDropdown(false); 
                                setLedgerDate("");
                              }}
                              className="text-[10px] text-indigo-600 font-bold hover:underline"
                            >
                              সব মাস
                            </button>
                          </div>

                          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1 text-xs">
                            {MONTHS_LIST.map((m) => {
                              const isSelected = filterMonth === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => {
                                    setFilterMonth(m.id);
                                    setShowMonthDropdown(false);
                                    setLedgerDate("");
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all ${
                                    isSelected
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span>{m.nameBn}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* তারিখ নির্বাচন (ক্যালেন্ডার ইনপুট) */}
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm whitespace-nowrap">
                    <CalendarDays className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-[11px] text-slate-500 font-bold shrink-0">তারিখ (দিন/মাস/বছর):</span>
                    <input
                      type="date"
                      value={ledgerDate}
                      onChange={(e) => setLedgerDate(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    />
                    {ledgerDate && (
                      <button
                        type="button"
                        onClick={() => setLedgerDate("")}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold transition-colors shrink-0"
                        title="সব তারিখের ডাটা দেখুন"
                      >
                        সব তারিখ
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* সার্চ বার (যদি জামাত ভিউ না হয়) */}
            <div className="p-3 sm:p-4 bg-white border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="নাম, ফোন, বিবরণ বা রশিদ নম্বর দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {modalSearch && (
                <button
                  onClick={() => setModalSearch("")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 bg-slate-100 rounded-lg"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>

            {/* মোডাল বডি কন্টেন্ট */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">

              {/* ========================================================= */}
              {/* কেইস ১: দান ও অনুদান (Donation List) */}
              {/* ========================================================= */}
              {activeDetail === "donation" && (() => {
                const list = donations.filter(d => 
                  d.type !== "zakat" && 
                  matchesMonth(d.date) &&
                  (d.donorName.includes(modalSearch) || d.phone.includes(modalSearch) || (d.purpose && d.purpose.includes(modalSearch)))
                );
                const subTotal = list.reduce((s, d) => s + d.amount, 0);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs font-bold text-emerald-900">
                      <span>মোট {list.length} জন দাতার রেকর্ড পাওয়া গেছে</span>
                      <span className="text-sm font-black">মোট আদায়: ৳ {subTotal.toLocaleString()}</span>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {list.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">কোনো অনুদানের রেকর্ড পাওয়া যায়নি।</div>
                      ) : (
                        list.map(d => (
                          <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">{d.donorName}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                                  {d.type === "sadqa" ? "সদকা" : d.type === "fitra" ? "ফিতরা" : "সাধারণ অনুদান"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">#{d.receiptNumber}</span>
                              </div>
                              <p className="text-xs text-slate-600">{d.purpose || "মাদরাসার সাধারণ তহবিল"}</p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                <span>ফোন: <b className="text-slate-600">{d.phone}</b></span>
                                {d.address && <span>• ঠিকানা: {d.address}</span>}
                                <span>• মাধ্যম: <b className="uppercase">{d.paymentMethod}</b></span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-base sm:text-lg font-black text-emerald-700 block">
                                + ৳ {d.amount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">{d.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ২: যাকাত ও ফিতরা (Zakat List) */}
              {/* ========================================================= */}
              {activeDetail === "zakat" && (() => {
                const list = donations.filter(d => 
                  (d.type === "zakat" || d.type === "fitra") && 
                  matchesMonth(d.date) &&
                  (d.donorName.includes(modalSearch) || d.phone.includes(modalSearch) || (d.purpose && d.purpose.includes(modalSearch)))
                );
                const subTotal = list.reduce((s, d) => s + d.amount, 0);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs font-bold text-amber-900">
                      <span>মোট {list.length} জন যাকাত ও ফিতরা দাতার বিবরণ</span>
                      <span className="text-sm font-black">তহবিল মোট: ৳ {subTotal.toLocaleString()}</span>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {list.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">কোনো যাকাতের রেকর্ড পাওয়া যায়নি।</div>
                      ) : (
                        list.map(d => (
                          <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">{d.donorName}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                                  {d.type === "zakat" ? "যাকাত তহবিল" : "সাদাকাতুল ফিতর"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">#{d.receiptNumber}</span>
                              </div>
                              <p className="text-xs text-slate-600">{d.purpose || "এতিম ও দরিদ্র তালেবে ইলমদের খোরপোষ"}</p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                <span>ফোন: <b className="text-slate-600">{d.phone}</b></span>
                                {d.address && <span>• ঠিকানা: {d.address}</span>}
                                <span>• মাধ্যম: <b className="uppercase">{d.paymentMethod}</b></span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-base sm:text-lg font-black text-amber-700 block">
                                + ৳ {d.amount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">{d.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ৩: ছাত্র বেতন ও ফি — জামাতভিত্তিক ও ছাত্রভিত্তিক ড্রিল-ডাউন */}
              {/* ========================================================= */}
              {activeDetail === "student_fee" && (() => {
                // ক. যদি কোনো জামাত সিলেক্ট না থাকে -> ৭টি জামাতের তালিকা দেখাবে
                if (!selectedClassId) {
                  return (
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium flex items-center justify-between">
                        <span>মাদরাসার কিতাব বিভাগের ৭টি জামাত থেকে বেতন আদায়ের সারসংক্ষেপ</span>
                        <span className="font-black">মোট ছাত্র: {students.length} জন</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {classes.map(cls => {
                          const classStudents = students.filter(s => s.classId === cls.id);
                          const totalFees = classStudents.reduce((s, st) => s + (st.monthlyFee || 0), 0);
                          const totalDue = classStudents.reduce((s, st) => s + (st.dueAmount || 0), 0);
                          const totalCollected = Math.max(0, totalFees - totalDue);
                          const paidCount = classStudents.filter(s => s.dueAmount === 0).length;

                          return (
                            <div
                              key={cls.id}
                              onClick={() => setSelectedClassId(cls.id)}
                              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                                    {cls.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    শিক্ষক: {cls.classTeacherName || "নির্ধারিত নয়"}
                                  </p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  {classStudents.length} জন ছাত্র
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">আদায়কৃত বেতন</span>
                                  <span className="font-black text-emerald-700">৳ {totalCollected.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 block">বকেয়া পরিমাণ</span>
                                  <span className={`font-black ${totalDue > 0 ? "text-rose-600" : "text-slate-400"}`}>
                                    ৳ {totalDue.toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-blue-600 group-hover:underline">
                                <span>পরিশোধিত: {paidCount}/{classStudents.length} জন</span>
                                <span className="flex items-center gap-1">
                                  ছাত্রদের তালিকা ও ফি দেখুন <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // খ. যদি কোনো জামাত সিলেক্ট করা থাকে -> ঐ জামাতের ছাত্রদের পূর্ণাঙ্গ তালিকা
                const activeClass = classes.find(c => c.id === selectedClassId);
                const classStudents = students.filter(s => 
                  s.classId === selectedClassId &&
                  (s.name.includes(modalSearch) || s.roll.includes(modalSearch) || s.guardianName.includes(modalSearch))
                );

                const classTotalCollected = classStudents.reduce((s, st) => s + (st.monthlyFee - (st.dueAmount || 0)), 0);
                const classTotalDue = classStudents.reduce((s, st) => s + (st.dueAmount || 0), 0);

                return (
                  <div className="space-y-4">
                    {/* ব্যাক বাটন ও জামাত হেডার */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl">
                      <button
                        onClick={() => setSelectedClassId(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-blue-300 rounded-xl text-xs font-bold text-blue-800 transition-all w-fit"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>← সকল জামাতের তালিকায় ফিরুন</span>
                      </button>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-black text-slate-900 block">{activeClass?.name}</span>
                        <span className="text-[11px] text-blue-700 font-semibold">
                          আদায়: ৳ {classTotalCollected.toLocaleString()} • বকেয়া: ৳ {classTotalDue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* ছাত্রদের টেবিল */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                              <th className="py-2.5 px-3">রোল</th>
                              <th className="py-2.5 px-3">ছাত্রের নাম ও ঠিকানা</th>
                              <th className="py-2.5 px-3">অভিভাবক ও ফোন</th>
                              <th className="py-2.5 px-3 text-right">মাসিক ফি</th>
                              <th className="py-2.5 px-3 text-right">পরিশোধিত</th>
                              <th className="py-2.5 px-3 text-right">বকেয়া</th>
                              <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {classStudents.map(st => {
                              const paid = Math.max(0, (st.monthlyFee || 0) - (st.dueAmount || 0));
                              const isPaid = (st.dueAmount || 0) === 0;

                              return (
                                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{st.roll}</td>
                                  <td className="py-2.5 px-3">
                                    <span className="font-bold text-slate-900 block">{st.name}</span>
                                    <span className="text-[10px] text-slate-400">{st.address}</span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="text-slate-800 block">{st.guardianName}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{st.guardianPhone}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-bold text-slate-700">৳ {st.monthlyFee}</td>
                                  <td className="py-2.5 px-3 text-right font-black text-emerald-700">৳ {paid}</td>
                                  <td className="py-2.5 px-3 text-right font-black text-rose-600">
                                    {st.dueAmount > 0 ? `৳ ${st.dueAmount}` : "০"}
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    {st.isLillahScholarship ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                        লিল্লাহ স্কলারশিপ
                                      </span>
                                    ) : isPaid ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        পরিশোধিত ✓
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                        বকেয়া
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ৪: উস্তাদ ও স্টাফ বেতন পে-রোল */}
              {/* ========================================================= */}
              {activeDetail === "teacher_salary" && (() => {
                const list = teachers.filter(t => 
                  t.name.includes(modalSearch) || t.designation.includes(modalSearch) || t.phone.includes(modalSearch)
                );
                const totalSalary = list.reduce((s, t) => s + (t.salary || 0), 0);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 p-3 rounded-2xl text-xs font-bold text-indigo-900">
                      <span>মাদরাসার সকল উস্তাদ ও খাদেমদের মাসিক সম্মানী খতিয়ান</span>
                      <span className="text-sm font-black">মাসিক পে-রোল: ৳ {totalSalary.toLocaleString()}</span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                              <th className="py-3 px-4">উস্তাদ / কর্মকর্তার নাম</th>
                              <th className="py-3 px-4">পদবী ও দায়িত্ব</th>
                              <th className="py-3 px-4">যোগাযোগ ও যোগ্যতা</th>
                              <th className="py-3 px-4 text-right">সম্মানী (টাকা)</th>
                              <th className="py-3 px-4 text-center">পরিশোধ স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {list.map(tc => (
                              <tr key={tc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-black text-slate-900 block text-xs sm:text-sm">{tc.name}</span>
                                  <span className="text-[10px] text-slate-400">যোগদান: {tc.joiningDate}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-indigo-700 block">{tc.designation}</span>
                                  <span className="text-[10px] text-slate-500">{tc.classAssigned || "সাধারণ প্রশাসন"}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-slate-800 block font-mono">{tc.phone}</span>
                                  <span className="text-[10px] text-slate-400">{tc.qualification}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-black text-sm text-slate-900 whitespace-nowrap">
                                  ৳ {tc.salary.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                    <span>পরিশোধিত</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ৫: মেস ও বাজার খরচ */}
              {/* ========================================================= */}
              {activeDetail === "bazar" && (() => {
                const list = bazarItems.filter(b => 
                  matchesMonth(b.date) &&
                  (b.item.includes(modalSearch) || b.shopperName.includes(modalSearch))
                );
                const subTotal = list.reduce((s, b) => s + b.cost, 0);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-3 rounded-2xl text-xs font-bold text-orange-900">
                      <span>মেস ও বোর্ডিংয়ের চাল, ডাল, মাছ, মাংস ও কাঁচাবাজার ভাউচার</span>
                      <span className="text-sm font-black">মোট খরচ: ৳ {subTotal.toLocaleString()}</span>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {list.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">কোনো বাজার খরচের রেকর্ড পাওয়া যায়নি।</div>
                      ) : (
                        list.map(b => (
                          <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">{b.item}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-800">
                                  {b.quantity}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">বাজারকারী: <b>{b.shopperName}</b></p>
                              <span className="text-[10px] text-slate-400 font-medium">তারিখ: {b.date}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-base sm:text-lg font-black text-rose-600 block">
                                - ৳ {b.cost.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold">ভাউচার সংরক্ষিত ✓</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ৬: বিদ্যুৎ ও গ্যাস বিল (ভিতরে দুইটা অপশন আলাদা) */}
              {/* ========================================================= */}
              {(activeDetail === "utility" || activeDetail === "electricity" || activeDetail === "gas") && (() => {
                const electricityList = transactions.filter(t => 
                  t.type === "expense" && 
                  (t.category.includes("বিদ্যুৎ") || t.category.includes("কারেন্ট") || t.category.includes("ডেসকো") || t.category.includes("পল্লী বিদ্যুৎ")) &&
                  matchesMonth(t.date) &&
                  (t.description.includes(modalSearch) || t.category.includes(modalSearch))
                );
                const gasList = transactions.filter(t => 
                  t.type === "expense" && 
                  (t.category.includes("গ্যাস") || t.category.includes("সিলিন্ডার") || t.category.includes("তিতাস")) &&
                  matchesMonth(t.date) &&
                  (t.description.includes(modalSearch) || t.category.includes(modalSearch))
                );

                const electricityTotal = electricityList.reduce((s, t) => s + t.amount, 0);
                const gasTotal = gasList.reduce((s, t) => s + t.amount, 0);

                const currentList = utilitySubTab === "electricity" ? electricityList : gasList;
                const currentTotal = utilitySubTab === "electricity" ? electricityTotal : gasTotal;

                return (
                  <div className="space-y-4">
                    {/* সাহাদাত ভাইয়ের নির্দেশনা: ভিতরে দুইটা অপশন আলাদা থাকবে */}
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setUtilitySubTab("electricity")}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                          utilitySubTab === "electricity"
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        <span>বিদ্যুৎ বিল</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          utilitySubTab === "electricity" ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          ৳ {electricityTotal.toLocaleString()}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUtilitySubTab("gas")}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
                          utilitySubTab === "gas"
                            ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                        <span>গ্যাস বিল</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          utilitySubTab === "gas" ? "bg-orange-700 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          ৳ {gasTotal.toLocaleString()}
                        </span>
                      </button>
                    </div>

                    {/* নির্বাচিত ক্যাটাগরির বিবরণী কার্ড */}
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold border ${
                      utilitySubTab === "electricity" 
                        ? "bg-amber-50 border-amber-200 text-amber-900" 
                        : "bg-orange-50 border-orange-200 text-orange-900"
                    }`}>
                      <span>
                        {utilitySubTab === "electricity"
                          ? "মাদরাসা ও ছাত্রাবাসের মাসিক বিদ্যুৎ বিল ও মিটার খরচ খতিয়ান"
                          : "বোর্ডিং, মেস ও রান্নাঘরের গ্যাস সিলিন্ডার ও গ্যাস বিল খতিয়ান"}
                      </span>
                      <span className="text-sm sm:text-base font-black">
                        মোট: ৳ {currentTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* ভাউচার ও ট্রানজ্যাকশন তালিকা */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {currentList.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-medium">
                          {utilitySubTab === "electricity" 
                            ? "কোনো বিদ্যুৎ বিল খরচের রেকর্ড পাওয়া যায়নি।" 
                            : "কোনো গ্যাস বিল খরচের রেকর্ড পাওয়া যায়নি।"}
                        </div>
                      ) : (
                        currentList.map(t => (
                          <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">{t.category}</span>
                                {t.receiptNumber && (
                                  <span className="text-[10px] text-slate-400 font-mono">({t.receiptNumber})</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600">{t.description}</p>
                              <span className="text-[10px] text-slate-400 font-medium">পরিশোধের তারিখ: {t.date}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-base sm:text-lg font-black text-rose-600 block">
                                - ৳ {t.amount.toLocaleString()}
                              </span>
                              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                                  {t.fundType === "general" ? "সাধারণ তহবিল" : "লিল্লাহ তহবিল"}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-bold">বিল পরিশোধিত ✓</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* কেইস ৭: অন্যান্য ব্যয় ও অন্যান্য আয় */}
              {/* ========================================================= */}
              {(activeDetail === "other_expense" || activeDetail === "other_income" || activeDetail === "leather") && (() => {
                const isExp = activeDetail === "other_expense";
                const list = transactions.filter(t => {
                  if (isExp && t.type !== "expense") return false;
                  if (!isExp && t.type !== "income") return false;
                  if (!matchesMonth(t.date)) return false;
                  return t.description.includes(modalSearch) || t.category.includes(modalSearch);
                });
                const subTotal = list.reduce((s, t) => s + t.amount, 0);

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-100 border border-slate-200 p-3 rounded-2xl text-xs font-bold text-slate-800">
                      <span>বিস্তারিত ভাউচার ও অডিট তালিকা ({list.length}টি রেকর্ড)</span>
                      <span className="text-sm font-black">মোট: ৳ {subTotal.toLocaleString()}</span>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {list.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">কোনো রেকর্ড পাওয়া যায়নি।</div>
                      ) : (
                        list.map(t => (
                          <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">{t.category}</span>
                                {t.receiptNumber && (
                                  <span className="text-[10px] text-slate-400 font-mono">({t.receiptNumber})</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600">{t.description}</p>
                              <span className="text-[10px] text-slate-400 font-medium">তারিখ: {t.date}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-base sm:text-lg font-black block ${isExp ? "text-rose-600" : "text-emerald-700"}`}>
                                {isExp ? "-" : "+"} ৳ {t.amount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">অডিট ভাউচার</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* মোডাল ফুটার */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setActiveDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* নতুন ভাউচার যোগ করার মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              নতুন আয় বা ব্যয়ের ভাউচার এন্ট্রি
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ভাউচারের ধরণ:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setType("income"); setCategory("দান ও অনুদান"); }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      type === "income" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    আয় (Income +)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType("expense"); setCategory("বাজার খরচ"); }}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      type === "expense" ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    ব্যয় (Expense -)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">খাত নির্বাচন করুন:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  {type === "income" ? (
                    <>
                      <option value="দান ও অনুদান">দান ও অনুদান</option>
                      <option value="যাকাত ও ফিতরা">যাকাত ও ফিতরা</option>
                      <option value="মাসিক চাঁদা">মাসিক চাঁদা</option>
                      <option value="চামড়া বিক্রয় লব্ধ টাকা">চামড়া বিক্রয় লব্ধ টাকা</option>
                      <option value="অন্যান্য আয়">অন্যান্য আয়</option>
                    </>
                  ) : (
                    <>
                      <option value="বাজার খরচ">মেস ও বোর্ডিং বাজার খরচ</option>
                      <option value="শিক্ষক ও স্টাফ বেতন">শিক্ষক ও স্টাফ বেতন</option>
                      <option value="বিদ্যুৎ বিল">বিদ্যুৎ বিল</option>
                      <option value="গ্যাস বিল">গ্যাস বিল</option>
                      <option value="মেরামত ও সংস্কার">মেরামত ও সংস্কার</option>
                      <option value="মেহমানদারি ও আপ্যায়ন">মেহমানদারি ও আপ্যায়ন</option>
                      <option value="অন্যান্য ব্যয়">অন্যান্য ব্যয়</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">তহবিল (Fund):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFundType("general")}
                    className={`py-2 rounded-xl font-bold border ${
                      fundType === "general" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    সাধারণ তহবিল
                  </button>
                  <button
                    type="button"
                    onClick={() => setFundType("lillah_zakat")}
                    className={`py-2 rounded-xl font-bold border ${
                      fundType === "lillah_zakat" ? "bg-amber-600 text-white border-amber-600" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    লিল্লাহ / যাকাত ফান্ড
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">টাকার পরিমাণ (টাকা):</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="যেমন: ৩০০০"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">খরচের সুনির্দিষ্ট বিবরণ:</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: সকাল ও দুপুরের বাজার বাবদ চাল, মাছ ও ডাল..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20"
                >
                  ভাউচার সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* সাহাদাত ভাইয়ের নির্দেশিত: রসিদ ও ভাউচার স্লিপ ভিউয়ার মোডাল (Printable Slip) */}
      {/* ========================================================================= */}
      {selectedVoucherTx && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            
            {/* স্লিপ হেডার */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wide">
                    {selectedVoucherTx.type === "income" ? "অর্থ প্রাপ্তি মানি রসিদ" : "ব্যয় অনুমোদন ভাউচার"}
                  </h4>
                  <span className="text-[10px] text-indigo-200 font-mono">
                    #{selectedVoucherTx.receiptNumber || "VOUCH-AUTO"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVoucherTx(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* অফিশিয়াল ভাউচার স্লিপ বডি */}
            <div className="p-6 space-y-5 bg-amber-50/15">
              
              {/* মাদ্রাসার নাম ও পরিচিতি */}
              <div className="text-center pb-3 border-b-2 border-dashed border-slate-200 space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900">জামিয়া ইসলামিয়া আরাবিয়া</h3>
                <p className="text-[11px] text-slate-500">বড় মসজিদ রোড, জামিয়া কমপ্লেক্স, ঢাকা</p>
                <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedVoucherTx.fundType === "general" ? "সাধারণ তহবিল হিসাব" : "লিল্লাহ ও যাকাত ফান্ড"}
                </div>
              </div>

              {/* স্লিপ মেটাডাটা */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">ভাউচার / রসিদ নং:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedVoucherTx.receiptNumber || "VOUCH-2026"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">লেনদেনের তারিখ:</span>
                  <span className="font-bold text-slate-800">{formatBnDate(selectedVoucherTx.date)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">হিসাবের খাত:</span>
                  <span className="font-black text-indigo-700">{selectedVoucherTx.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">লেনদেনের ধরণ:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] inline-block ${
                    selectedVoucherTx.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {selectedVoucherTx.type === "income" ? "অর্থ জমা (Income)" : "অর্থ ব্যয় (Expense)"}
                  </span>
                </div>
              </div>

              {/* খরচের সুনির্দিষ্ট বিবরণ */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">বিবরণ / উদ্দেশ্য:</span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {selectedVoucherTx.description}
                </p>
              </div>

              {/* টাকার পরিমাণ বক্স */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-600 block font-bold">মোট টাকার পরিমাণ:</span>
                  <span className="text-xs text-slate-500">পরিশোধিত / গৃহীত অর্থ</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-950 font-mono">
                  ৳ {selectedVoucherTx.amount.toLocaleString()}
                </span>
              </div>

              {/* সিল ও স্বাক্ষরের স্থান */}
              <div className="grid grid-cols-2 gap-6 pt-6 text-center text-xs">
                <div className="border-t border-slate-300 pt-1">
                  <span className="text-[10px] text-slate-400 block">প্রস্তুতকারক / হিসাবরক্ষক</span>
                  <span className="text-[11px] font-bold text-slate-700">মুহাম্মদ রফিকুল ইসলাম</span>
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <span className="text-[10px] text-slate-400 block">অনুমোদনকারী মুহতামিম</span>
                  <span className="text-[11px] font-bold text-slate-900">মাওলানা মো. সাহাদাত হোসেন</span>
                </div>
              </div>

            </div>

            {/* স্লিপ ফুটার ও অ্যাকশন বাটন */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedVoucherTx(null)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl text-xs transition-colors"
              >
                বন্ধ করুন
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>ভাউচার স্লিপ প্রিন্ট করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* মানি রিসিট ও অফিশিয়াল ভাউচার স্লিপ প্রিন্ট মোডাল */}
      {/* ========================================================================= */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">
            {/* হেডার */}
            <div className={`p-4 sm:p-5 flex items-center justify-between text-white ${
              selectedReceiptTx.type === "income" ? "bg-[#1b686e]" : "bg-[#800000]"
            }`}>
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5" />
                <div>
                  <h3 className="text-base font-black">
                    {selectedReceiptTx.type === "income" ? "টাকা জমার অফিশিয়াল মানি রিসিট" : "টাকা খরচের অফিশিয়াল ডেবিট ভাউচার"}
                  </h3>
                  <p className="text-[11px] opacity-85">
                    রসিদ নং: {selectedReceiptTx.receiptNumber || selectedReceiptTx.voucherNo || selectedReceiptTx.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptTx(null)}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* প্রিন্টযোগ্য রসিদ পত্র */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 bg-white text-slate-800" id="printable-receipt">
              {/* মাদ্রাসা হেডার */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">দারুল উলুম মাদ্রাসা ঢাকা</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">মাদ্রাসা রোড, ঢাকা - ১২১২ | ফোন: ০১৮০০০০০০০০</p>
                <div className="mt-2 inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-black tracking-wide">
                  {selectedReceiptTx.type === "income" ? "অর্থ প্রাপ্তি রসিদ (MONEY RECEIPT)" : "ব্যয় ভাউচার (EXPENSE VOUCHER)"}
                </div>
              </div>

              {/* মেটাডাটা গ্রিড */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">তারিখ:</span>
                  <span className="font-bold text-slate-800">{selectedReceiptTx.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">ভাউচার নং:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedReceiptTx.voucherNo || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">রসিদ নং:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedReceiptTx.receiptNumber || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">বই নং:</span>
                  <span className="font-bold text-slate-800">{selectedReceiptTx.bookNo || "-"}</span>
                </div>
              </div>

              {/* মূল বিবরণ */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5">
                  <span className="text-slate-500 font-bold">{selectedReceiptTx.type === "income" ? "প্রদানকারী ব্যক্তি:" : "গ্রহণকারী ব্যক্তি/প্রতিষ্ঠান:"}</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedReceiptTx.personName || "অজ্ঞাত"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5">
                  <span className="text-slate-500 font-bold">{selectedReceiptTx.type === "income" ? "জমার খাত:" : "খরচের খাত:"}</span>
                  <span className="font-bold text-slate-900">{selectedReceiptTx.category}</span>
                </div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5">
                  <span className="text-slate-500 font-bold">একাউন্ট / ফান্ড:</span>
                  <span className="font-bold text-slate-900">
                    {selectedReceiptTx.account || (selectedReceiptTx.fundType === "general" ? "সাধারণ তহবিল" : "লিল্লাহ ও যাকাত ফান্ড")}
                  </span>
                </div>
                {selectedReceiptTx.paymentMethod && (
                  <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5">
                    <span className="text-slate-500 font-bold">পেমেন্ট মাধ্যম:</span>
                    <span className="font-bold text-slate-900">{selectedReceiptTx.paymentMethod}</span>
                  </div>
                )}
                {selectedReceiptTx.description && (
                  <div className="border-b border-dashed border-slate-300 pb-1.5">
                    <span className="text-slate-500 font-bold block mb-0.5">বিবরণ / নোট:</span>
                    <p className="text-slate-800 italic">{selectedReceiptTx.description}</p>
                  </div>
                )}
              </div>

              {/* খরচের বিস্তারিত হিসাব টেবিল (যদি আইটেম থাকে) */}
              {selectedReceiptTx.items && selectedReceiptTx.items.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-300">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                        <th className="py-2 px-3 w-10 text-center border-r border-slate-300">নং</th>
                        <th className="py-2 px-3 border-r border-slate-300">বিবরণ</th>
                        <th className="py-2 px-3 text-center border-r border-slate-300 w-24">পরিমাণ</th>
                        <th className="py-2 px-3 text-right pr-3 w-28">টাকা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {selectedReceiptTx.items.map((it, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                          <td className="py-1.5 px-3 text-slate-800 font-bold border-r border-slate-200">{it.description}</td>
                          <td className="py-1.5 px-3 text-center text-slate-600 border-r border-slate-200">{it.quantity || "—"}</td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900 pr-3">৳ {Number(it.amount).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* টাকার পরিমাণ বক্স */}
              <div className="p-4 rounded-xl bg-slate-100 border-2 border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">মোট টাকার পরিমাণ</span>
                  <span className="text-xs text-slate-700">পরিশোধিত অংক</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-slate-900">
                    ৳ {Number(selectedReceiptTx.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* স্বাক্ষর সেকশন */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div className="border-t border-slate-400 pt-1.5">
                  <span className="text-slate-500 block text-[10px]">আদায়কারী / প্রস্তুতকারক</span>
                  <span className="font-bold text-slate-800">হিসাবরক্ষক</span>
                </div>
                <div className="border-t border-slate-400 pt-1.5">
                  <span className="text-slate-500 block text-[10px]">অনুমোদনকারী</span>
                  <span className="font-bold text-slate-800">মুহতামিম</span>
                </div>
              </div>
            </div>

            {/* ফুটার বাটন */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedReceiptTx(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#1b686e] hover:bg-[#135156] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
