export type Language = "bn" | "en" | "ar";

export interface TranslationDictionary {
  madrasaManagement: string;
  smartEducation: string;
  subtitle: string;
  hijriDate: string;
  goBack: string;
  language: string;
  dashboard: string;
  overview: string;
  accounts: string;
  students: string;
  teachers: string;
  donations: string;
  admissions: string;
  attendance: string;
  hifz: string;
  boarding: string;
  scanner: string;
  logout: string;
  totalCash: string;
  totalStudents: string;
  totalTeachers: string;
  todayAttendance: string;
  newExpense: string;
  newAdmission: string;
  classes: string;
  actions: string;
  monthlyPayroll: string;
  zakatFund: string;
  quickNotice: string;
  auditLedger: string;
  income: string;
  expense: string;
  netBalance: string;
  generalFund: string;
  lillahFund: string;
  analyticsTitle: string;
  muhtamim: string;
  online: string;
  mainMenu: string;
  toolsFeatures: string;
  quranAyahText: string;
  quranAyahSurah: string;
  quranAyahMeaning: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  bn: {
    madrasaManagement: "মাদ্রাসা ম্যানেজমেন্ট",
    smartEducation: "স্মার্ট এডুকেশন",
    subtitle: "কওমি ও আলিয়া মাদরাসা ইআরপি প্ল্যাটফর্ম",
    hijriDate: "১৫ সফর ১৪৪৮ হিজরি",
    goBack: "পিছনে যান",
    language: "ভাষা",
    dashboard: "ড্যাশবোর্ড",
    overview: "প্রধান সারসংক্ষেপ",
    accounts: "কেন্দ্রীয় হিসাবরক্ষণ ও ক্যাশবুক",
    students: "ছাত্র-ছাত্রী ব্যবস্থাপনা",
    teachers: "মুহাদ্দিস ও স্টাফ পে-রোল",
    donations: "দান, অনুদান ও যাকাত ফান্ড",
    admissions: "নতুন ছাত্র ভর্তি কার্যক্রম",
    attendance: "ডিজিটাল হাজিরা",
    hifz: "হিফজুল কুরআন ডায়েরি",
    boarding: "বোর্ডিং মেস ও বাজার",
    scanner: "বারকোড স্ক্যানার",
    logout: "লগআউট করুন",
    totalCash: "মোট ক্যাশ ব্যালেন্স",
    totalStudents: "মোট শিক্ষার্থী",
    totalTeachers: "উস্তাদ ও কর্মচারী",
    todayAttendance: "আজকের উপস্থিতি",
    newExpense: "+ নতুন খরচ",
    newAdmission: "+ নতুন ভর্তি",
    classes: "জামাত ও বিভাগ",
    actions: "দ্রুত অ্যাকশন",
    monthlyPayroll: "মাসিক পে-রোল",
    zakatFund: "যাকাত ও ফিতরা",
    quickNotice: "অভিভাবকদের SMS পাঠান",
    auditLedger: "দৈনিক ক্যাশবুক ও রোজনামচা",
    income: "মোট আয়",
    expense: "মোট ব্যয়",
    netBalance: "নিট স্থিতি",
    generalFund: "সাধারণ তহবিল",
    lillahFund: "লিল্লাহ ও যাকাত ফান্ড",
    analyticsTitle: "কেন্দ্রীয় প্রাতিষ্ঠানিক অ্যানালিটিক্স ও অডিট ড্যাশবোর্ড",
    muhtamim: "মুহতামিম সাহেব",
    online: "অনলাইন সক্রিয়",
    mainMenu: "প্রধান মেনু ও মডিউল",
    toolsFeatures: "ফিচার ও টুলস",
    quranAyahText: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ",
    quranAyahSurah: "সূরা আশ-শূরা: ৩৮",
    quranAyahMeaning: "তাদের পারস্পরিক কাজকর্ম পরামর্শের ভিত্তিতে পরিচালিত হয়",
  },
  en: {
    madrasaManagement: "Madrasa Management",
    smartEducation: "Smart Education",
    subtitle: "Qawmi & Alia Madrasa ERP Platform",
    hijriDate: "15 Safar 1448 Hijri",
    goBack: "Go Back",
    language: "Language",
    dashboard: "Dashboard",
    overview: "Main Overview",
    accounts: "Central Accounts & Cash Book",
    students: "Student Management",
    teachers: "Faculty & Staff Payroll",
    donations: "Donations & Zakat Fund",
    admissions: "New Student Admissions",
    attendance: "Digital Attendance",
    hifz: "Hifz Quran Diary",
    boarding: "Boarding Mess & Kitchen",
    scanner: "Barcode Scanner",
    logout: "Logout",
    totalCash: "Total Cash Balance",
    totalStudents: "Total Students",
    totalTeachers: "Faculty & Staff",
    todayAttendance: "Today's Attendance",
    newExpense: "+ New Expense",
    newAdmission: "+ New Admission",
    classes: "Classes & Divisions",
    actions: "Quick Actions",
    monthlyPayroll: "Monthly Payroll",
    zakatFund: "Zakat & Fitra",
    quickNotice: "Send SMS Notice",
    auditLedger: "Daily Cash Book & Audit",
    income: "Total Income",
    expense: "Total Expense",
    netBalance: "Net Balance",
    generalFund: "General Fund",
    lillahFund: "Lillah & Zakat Fund",
    analyticsTitle: "Central Institutional Analytics & Audit Dashboard",
    muhtamim: "Principal / Muhtamim",
    online: "Online Active",
    mainMenu: "Main Menu & Modules",
    toolsFeatures: "Features & Tools",
    quranAyahText: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ",
    quranAyahSurah: "Surah Ash-Shura: 38",
    quranAyahMeaning: "And whose affair is conducted by mutual consultation",
  },
  ar: {
    madrasaManagement: "إدارة المدرسة الإسلامية",
    smartEducation: "التعليم الذكي",
    subtitle: "منصة الإدارة المتكاملة للمدارس الدينية",
    hijriDate: "١٥ صفر ١٤٤٨ هـ",
    goBack: "رجوع",
    language: "اللغة",
    dashboard: "لوحة التحكم",
    overview: "الملخص الرئيسي",
    accounts: "الحسابات المركزية وسجل الخزينة",
    students: "شؤون الطلاب والطالبات",
    teachers: "هيئة التدريس ورواتب الموظفين",
    donations: "صندوق التبرعات والزكاة",
    admissions: "إجراءات القبول والتسجيل",
    attendance: "سجل الحضور الرقمي",
    hifz: "سجل تحفيظ القرآن الكريم",
    boarding: "المطبخ والإعاشة الداخلية",
    scanner: "قارئ الباركود",
    logout: "تسجيل الخروج",
    totalCash: "إجمالي الرصيد النقدي",
    totalStudents: "إجمالي الطلاب",
    totalTeachers: "المعلمون والموظفون",
    todayAttendance: "نسبة حضور اليوم",
    newExpense: "+ صرف جديد",
    newAdmission: "+ تسجيل جديد",
    classes: "الفصول والمراحل الدراسية",
    actions: "إجراءات سريعة",
    monthlyPayroll: "الرواتب الشهرية",
    zakatFund: "صندوق الزكاة والصدقات",
    quickNotice: "إرسال إشعار SMS",
    auditLedger: "دفتر اليومية ومراجعة الحسابات",
    income: "إجمالي الإيرادات",
    expense: "إجمالي المصروفات",
    netBalance: "صافي الرصيد",
    generalFund: "الصندوق العام",
    lillahFund: "صندوق الزكاة والفقراء",
    analyticsTitle: "لوحة التحليلات المركزية والمراجعة المؤسسية",
    muhtamim: "فضيلة المدير / المهتمم",
    online: "متصل الآن",
    mainMenu: "القائمة الرئيسية والأقسام",
    toolsFeatures: "الأدوات والميزات",
    quranAyahText: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ",
    quranAyahSurah: "سورة الشورى: ٣٨",
    quranAyahMeaning: "إدارة شؤونهم قائمة على الشورى والتعاون المبارك",
  }
};
