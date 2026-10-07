import { DivisionType } from "@/types";

export interface PredefinedClassItem {
  id: string;
  name: string;
  division: DivisionType;
  defaultSections: string[];
}

export const PRELOADED_CLASSES: PredefinedClassItem[] = [
  // ==========================================
  // ১. নূরানী বিভাগ (শিশু শ্রেণি থেকে ৫ম শ্রেণি)
  // ==========================================
  { id: 'c_shishu', name: 'শিশু শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_nursery', name: 'নার্সারি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_noorani_1', name: 'প্রথম শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_noorani_2', name: 'দ্বিতীয় শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_noorani_3', name: 'তৃতীয় শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_noorani_4', name: 'চতুর্থ শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },
  { id: 'c_noorani_5', name: 'পঞ্চম শ্রেণি', division: 'noorani', defaultSections: ['শাখা ক'] },

  // ==========================================
  // ২. হিফজুল কুরআন ও নাজেরা বিভাগ
  // ==========================================
  { id: 'c_najera', name: 'নাজেরা বিভাগ', division: 'hifz', defaultSections: ['শাখা ক'] },
  { id: 'c_hifz', name: 'হিফজুল কুরআন', division: 'hifz', defaultSections: ['শাখা ক'] },

  // ==========================================
  // ৩. কওমি কিতাব বিভাগ (সুনির্দিষ্ট ৮টি জামাত)
  // ==========================================
  { id: 'c_mizan', name: 'মিজান', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_nahbemir', name: 'নাহবেমির', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_hedayatunnahu', name: 'হেদায়াতুন্নাহু', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_kafiya', name: 'কাফিয়া', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_sharhe_bekaya', name: 'শরহে বেকায়া', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_jalalain', name: 'জালালাইন', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_meshkat', name: 'মেশকাত', division: 'kitab', defaultSections: ['শাখা ক'] },
  { id: 'c_dawra', name: 'দাওরা', division: 'kitab', defaultSections: ['শাখা ক'] },

  // ==========================================
  // ৪. আলিয়া মাদ্রাসা কারিকুলাম
  // ==========================================
  { id: 'c_alia_ibtedayi_1', name: 'ইবতেদায়ী ১ম শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_ibtedayi_2', name: 'ইবতেদায়ী ২য় শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_ibtedayi_3', name: 'ইবতেদায়ী ৩য় শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_ibtedayi_4', name: 'ইবতেদায়ী ৪র্থ শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_ibtedayi_5', name: 'ইবতেদায়ী ৫ম শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_dakhil_6', name: 'দাখিল ৬ষ্ঠ শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_dakhil_7', name: 'দাখিল ৭ম শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_dakhil_8', name: 'দাখিল ৮ম শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_dakhil_9', name: 'দাখিল ৯ম শ্রেণি', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_dakhil_10', name: 'দাখিল ১০ম শ্রেণি', division: 'alia', defaultSections: ['সাধারণ শাখা', 'বিজ্ঞান শাখা'] },
  { id: 'c_alia_alim', name: 'আলিম (১১শ ও ১২শ শ্রেণি)', division: 'alia', defaultSections: ['সাধারণ শাখা', 'বিজ্ঞান শাখা'] },
  { id: 'c_alia_fazil', name: 'ফাজিল (ডিগ্রি সমমান)', division: 'alia', defaultSections: ['শাখা ক'] },
  { id: 'c_alia_kamil', name: 'কামিল (মাস্টার্স সমমান)', division: 'alia', defaultSections: ['হাদিস বিভাগ', 'তাফসির বিভাগ'] },
];

// ==========================================
// ৫. অতিরিক্ত / বিশেষায়িত জামাতসমূহ (অ্যাড অপশনে সিলেক্ট করে অ্যাড করার জন্য)
// ==========================================
export const SPECIAL_ADDABLE_CLASSES: { name: string; division: DivisionType; defaultSections: string[] }[] = [
  { name: 'ইফতা (তাখাসসুস ফিল ফিকহ)', division: 'kitab', defaultSections: ['শাখা ক'] },
  { name: 'আদব (তাখাসসুস ফিল আদব)', division: 'kitab', defaultSections: ['শাখা ক'] },
  { name: 'উলুমুল হাদিস (উচ্চতর হাদিস গবেষণা)', division: 'kitab', defaultSections: ['শাখা ক'] },
  { name: 'হিফজ রিভিশন ও দাওর বিভাগ', division: 'hifz', defaultSections: ['শাখা ক'] },
  { name: 'আমপারা ও কায়দা বিভাগ', division: 'noorani', defaultSections: ['শাখা ক'] },
  { name: 'কিরাত ও তাজবীদ বিভাগ', division: 'hifz', defaultSections: ['শাখা ক'] },
];
