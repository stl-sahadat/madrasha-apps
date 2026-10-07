// মাদ্রাসা ম্যানেজমেন্ট ও অটোমেশন সফটওয়্যার - কোর টাইপ ডেফিনিশন

export type MadrasaType = 'qawmi' | 'alia' | 'combined';

export interface MadrasaInfo {
  id: string;
  name: string;
  muhtamimName?: string;
  type: MadrasaType;
  activeDivisions?: DivisionType[]; // সক্রিয় বিভাগসমূহ (কওমির ক্ষেত্রে: নূরানী, হিফজ, কিতাব)
  slug: string; // e.g. darul-ulum-dhaka
  address: string; // গ্রাম, ডাকঘর, থানা, জেলা
  phone: string;
  password?: string;
  logoUrl?: string;
  watermarkOpacity?: number; // e.g. 10 (representing 10% opacity)
  muhtamimPhotoUrl?: string;
  eiinOrBefaqCode?: string;
  createdAt: string;
}

export type DivisionType = 'noorani' | 'hifz' | 'kitab' | 'alia';

export interface MadrasaClass {
  id: string;
  name: string;
  division: DivisionType;
  sections: string[]; // e.g. ['শাখা ক', 'শাখা খ']
  classTeacherName?: string;
  classTeacherPhone?: string;
  studentCount?: number;
}

export type StudentStatus = 'residential' | 'non_residential'; // আবাসিক / অনাবাসিক

export type ActivityType = 'praise' | 'warning' | 'notice'; // প্রশংসা / ভালো কাজ, সতর্কবার্তা / উল্টাপাল্টা কাজ, নোটিশ / চিঠি

export interface StudentActivityLog {
  id: string;
  studentId: string;
  date: string;
  type: ActivityType;
  title: string;
  description: string;
  recordedBy: string; // মুহতামিম / প্রধান শিক্ষক
}

export interface Student {
  id: string; // e.g. STD-2026-101
  roll: string; // 01, 02
  name: string;
  englishName?: string;
  classId: string;
  className: string;
  section: string;
  status: StudentStatus;
  guardianName: string;
  guardianPhone: string;
  phone?: string;
  guardianPin: string; // 4-digit secret pin e.g. 1234
  emergencyPhone?: string;
  address: string;
  bloodGroup?: string;
  currentLesson?: string; // ঐচ্ছিক
  monthlyFee: number;
  dueAmount: number;
  isLillahScholarship?: boolean; // ফি মওকুফ / লিল্লাহ ফান্ড
  admissionDate: string;
  barcode: string;
  activities?: StudentActivityLog[]; // মুহতামিম সাহেবের নোটিশ, প্রশংসা ও সতর্কবার্তা

  // বর্ধিত ভর্তি ও প্রোফাইল তথ্যসমূহ
  birthDate?: string;
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  guardianRelation?: string;
  presentAddress?: string;
  permanentAddress?: string;
  formNumber?: string;
  quotaFee?: string;
  residentialType?: string;
  khorakiType?: string;
  isBoardingMeal?: string;
  khanaFeeText?: string;
  khanaFee?: number;
  isOrphan?: string;
  studentType?: string;
  batchType?: string;
  classTime?: string;
  photoUrl?: string;
  birthCertificateNo?: string;
  guardianNid?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  previousMadrasa?: string;
  previousTcInfo?: string;
  studentCategory?: string;
  remarks?: string;
  statusBadge?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface FeeReceipt {
  id: string; // e.g. REC-1045
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  date: string;
  feeType: string; // e.g. 'মাসিক বেতন ও বোর্ডিং ফি'
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  paymentMethod: 'cash' | 'bkash' | 'bank';
  collectedBy: string;
}

export interface TeacherStaff {
  id: string;
  name: string;
  designation: string; // e.g. 'মুহতামিম', 'নাজেমে তালিমাত', 'হিফজ শিক্ষক'
  phone: string;
  classAssigned?: string;
  nid?: string;
  qualification: string; // e.g. 'দাওরায়ে হাদিস ফারেগ, ইফতা'
  salary: number;
  joiningDate: string;
  bloodGroup?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  hasPreviousExperience?: string; // "হ্যাঁ" | "না"
  previousInstitution?: string; // পূর্বের মাদরাসা / প্রতিষ্ঠানের নাম
  experienceYears?: number | string; // অভিজ্ঞতার বছর
  experienceMonths?: number | string; // অভিজ্ঞতার মাস
  experienceDuration?: string; // যেমন: "২ বছর ৬ মাস"
}

export interface CashTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string; // 'ছাত্রদের ফি', 'অনুদান', 'বাজার খরচ', 'শিক্ষক বেতন', 'বিল'
  fundType: 'general' | 'lillah_zakat';
  amount: number;
  date: string;
  description: string;
  receiptNumber?: string;
  voucherNo?: string;
  personName?: string;
  account?: string;
  bankAccount?: string;
  paymentMethod?: string;
  bookNo?: string;
  note?: string;
  items?: {
    description: string;
    quantity?: string;
    amount: number;
  }[];
}

// হিফজ ট্র্যাকার টাইপ
export interface HifzRecord {
  id: string;
  studentId: string;
  studentName: string;
  roll: string;
  date: string;
  sabakPara: string; // যেমন: পারা ১৫
  sabakSurah: string; // যেমন: সূরা বনি ইসরাঈল
  sabakPage: string; // পৃষ্ঠা ৫ (১০ লাইন)
  sabkiPara: string; // পারা ১৪ (সাত-সবক)
  amparaSurah?: string; // নাজেরা / আমপারা
  quality: 'mumtaz' | 'jayyid' | 'daif'; // মুমতাজ (উত্তম), জায়্যিদ (চলনসই), দফ (দুর্বল)
  teacherRemarks: string;
}

// বোর্ডিং ও মেস ট্র্যাকার টাইপ
export interface BoardingMealRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  guestMeals: number; // মেহমান মিল
}

export interface DailyBazarItem {
  id: string;
  date: string;
  item: string; // চাল, ডাল, মাছ, মাংস, তেল
  quantity: string; // ২৫ কেজি, ৫ লিটার
  cost: number;
  shopperName: string; // যিনি বাজার করেছেন
}

// পরীক্ষা ও রেজাল্ট শিট টাইপ
export interface SubjectMark {
  subjectName: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string; // মুমতাজ / A+
}

export interface StudentReportCard {
  id: string;
  examName: string; // ১ম সাময়িক পরীক্ষা, বার্ষিক পরীক্ষা
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  subjects: SubjectMark[];
  totalFullMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string; // মুমতাজ / A+
  meritPosition: number;
  attendanceDays: number;
  characterRemark: string; // উত্তম ও নিয়মিত
}

// যাকাত ও দান-সদকা ট্র্যাকার টাইপ
export interface DonationRecord {
  id: string;
  donorName: string;
  phone: string;
  type: 'zakat' | 'fitra' | 'sadqa' | 'general'; // যাকাত, ফিতরা, সদকা, সাধারণ দান
  amount: number;
  date: string;
  receiptNumber: string;
  purpose?: string;
  address?: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank';
}

// মাসিক চাঁদাদাতা ও ডোনার
export interface MonthlyDonor {
  id: string;
  name: string;
  fatherName?: string;
  phone: string;
  address: string;
  type: 'monthly' | 'yearly' | 'one_time';
  amount: number;
  remarks?: string;
  payments?: {
    month: string;
    amount: number;
    date: string;
    receiptNo: string;
    bookNo: string;
    receiver: string;
    remarks?: string;
  }[];
}

// পরিচালনা ও শুরা কমিটির সদস্য
export interface CommitteeMember {
  id: string;
  name: string;
  phone: string;
  address: string;
  designation: string; // সভাপতি, সহ-সভাপতি, সাধারণ সম্পাদক, কোষাধ্যক্ষ, সদস্য
  joiningDate?: string;
}

// পরীক্ষা ও বিষয়
export interface ExamItem {
  id: string;
  name: string;
  year: string;
  term: string;
}

// ব্যাংক ও আর্থিক একাউন্ট
export interface BankAccountItem {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchName?: string;
  contactPerson?: string;
  contactPhone?: string;
  balance: number;
}
