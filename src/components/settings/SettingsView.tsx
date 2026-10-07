"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Building2, 
  CreditCard, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowLeft,
  DollarSign,
  Users,
  Printer,
  Camera,
  Upload,
  RotateCcw,
  Sliders,
  Sparkles,
  FileCheck,
  User,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { MadrasaInfo, MadrasaClass } from "@/types";

interface SettingsViewProps {
  madrasa: MadrasaInfo;
  classes: MadrasaClass[];
  onBack: () => void;
  onUpdateMadrasa?: (updated: Partial<MadrasaInfo>) => void;
  initialTab?: "info" | "personal_profile" | "expense_cats" | "income_cats" | "payment_methods" | "jamats";
  onTabChange?: (tab: "info" | "personal_profile" | "expense_cats" | "income_cats" | "payment_methods" | "jamats") => void;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  "খানকা শরীফ",
  "মাজার শরীফ",
  "মসজিদ",
  "দান বাক্স",
  "দান সদকা (গরু)",
  "দান সদকা (খাসি)",
  "দান সদকা (হাঁস)",
  "দান সদকা (মুরগী)",
  "ব্যক্তিগত খরচ",
  "শিক্ষকগণের বেতন",
  "সাপ্তাহিক বাজার",
  "মাসিক বাজার",
  "বিদ্যুৎ বিল",
  "গ্যাস বিল",
  "ইন্টারনেট ও ডোমেইন বিল",
  "অফিস স্টেশনারি ও প্রিন্টিং"
];

const DEFAULT_INCOME_CATEGORIES = [
  "ছাত্রদের মাসিক বেতন",
  "নতুন ছাত্র ভর্তি ফি",
  "খানার টাকা / বোর্ডিং ফি",
  "মাসিক চাঁদাদাতাদের অনুদান",
  "লিল্লাহ ফান্ড যাকাত ও ফিতরা",
  "দান বাক্স কালেকশন",
  "কোরবানির চামড়া ও দান",
  "সাধারণ এককালীন অনুদান"
];

const DEFAULT_PAYMENT_METHODS = ["নগদ ক্যাশ", "বিকাশ মার্চেন্ট", "নগদ", "রকেট", "ইসলামী ব্যাংক বাংলাদেশ লিঃ", "আল-আরাফাহ ইসলামী ব্যাংক লিঃ"];

export const SettingsView: React.FC<SettingsViewProps> = ({
  madrasa,
  classes,
  onBack,
  onUpdateMadrasa,
  initialTab = "info",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "personal_profile" | "expense_cats" | "income_cats" | "payment_methods" | "jamats">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: "info" | "personal_profile" | "expense_cats" | "income_cats" | "payment_methods" | "jamats") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const [expenseCats, setExpenseCats] = useState<string[]>(DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCats, setIncomeCats] = useState<string[]>(DEFAULT_INCOME_CATEGORIES);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(DEFAULT_PAYMENT_METHODS);
  const [newCatInput, setNewCatInput] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isPersonalSaved, setIsPersonalSaved] = useState(false);

  // ১. মাদ্রাসার প্রাতিষ্ঠানিক প্রোফাইল স্টেট
  const [mName, setMName] = useState(madrasa.name);
  const [mPhone, setMPhone] = useState(madrasa.phone || "01700000000");
  const [mAddress, setMAddress] = useState(madrasa.address);
  const [mCode, setMCode] = useState(madrasa.eiinOrBefaqCode || "");
  const [mLogo, setMLogo] = useState(madrasa.logoUrl || "");
  const [mOpacity, setMOpacity] = useState<number>(madrasa.watermarkOpacity ?? 10);

  // ২. মুহতামিম সাহেবের ব্যক্তিগত প্রোফাইল স্টেট
  const [mMuhtamimName, setMMuhtamimName] = useState(madrasa.muhtamimName || "মাওলানা মো. সাহাদাত হোসেন");
  const [mMuhtamimPhoto, setMMuhtamimPhoto] = useState(madrasa.muhtamimPhotoUrl || "");
  const [mMuhtamimPhone, setMMuhtamimPhone] = useState(madrasa.phone || "01700000000");
  const [mMuhtamimTitle, setMMuhtamimTitle] = useState("মুহতামিম ও পরিচালক");
  const [mMuhtamimEmail, setMMuhtamimEmail] = useState("admin@madrasa.edu.bd");
  const [mMuhtamimBio, setMMuhtamimBio] = useState("মাদ্রাসার সার্বিক শিক্ষা, হিফজ ও প্রশাসনিক দায়িত্বপ্রাপ্ত প্রধান।");

  // যদি প্যারেন্ট থেকে madrasa আপডেট আসে তবে লোকাল স্টেট সিঙ্ক করা
  useEffect(() => {
    if (madrasa) {
      if (madrasa.name) setMName(madrasa.name);
      if (madrasa.phone) {
        setMPhone(madrasa.phone);
        setMMuhtamimPhone(madrasa.phone);
      }
      if (madrasa.muhtamimName) setMMuhtamimName(madrasa.muhtamimName);
      if (madrasa.muhtamimPhotoUrl) setMMuhtamimPhoto(madrasa.muhtamimPhotoUrl);
      if (madrasa.address) setMAddress(madrasa.address);
      if (madrasa.eiinOrBefaqCode !== undefined) setMCode(madrasa.eiinOrBefaqCode);
      if (madrasa.logoUrl) setMLogo(madrasa.logoUrl);
      if (madrasa.watermarkOpacity !== undefined) setMOpacity(madrasa.watermarkOpacity);
    }
  }, [madrasa]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const personalPhotoInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("লোগো ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // ব্রাউজার লোকালস্টোরেজ কোটা নিরাপদ রাখতে সর্বোচ্চ ৫০০x৫০০ সাইজে অপ্টিমাইজ করা
        const maxDim = 500;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.9);
          setMLogo(compressed);
        } else {
          setMLogo(dataUrl);
        }
      };
      img.onerror = () => {
        setMLogo(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setMLogo("");
  };

  // মুহতামিম ব্যক্তিগত ছবি আপলোড (সর্বোচ্চ ৪০০x৪০০ অপ্টিমাইজড)
  const handlePersonalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("ছবির ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.9);
          setMMuhtamimPhoto(compressed);
        } else {
          setMMuhtamimPhoto(dataUrl);
        }
      };
      img.onerror = () => {
        setMMuhtamimPhoto(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPersonalPhoto = () => {
    setMMuhtamimPhoto("");
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (activeTab === "expense_cats") {
      setExpenseCats(prev => [...prev, newCatInput.trim()]);
    } else if (activeTab === "income_cats") {
      setIncomeCats(prev => [...prev, newCatInput.trim()]);
    } else if (activeTab === "payment_methods") {
      setPaymentMethods(prev => [...prev, newCatInput.trim()]);
    }
    setNewCatInput("");
    setSaveMsg("সফলভাবে নতুন খাত যুক্ত করা হয়েছে!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleDeleteCat = (cat: string) => {
    if (activeTab === "expense_cats") {
      setExpenseCats(prev => prev.filter(c => c !== cat));
    } else if (activeTab === "income_cats") {
      setIncomeCats(prev => prev.filter(c => c !== cat));
    } else if (activeTab === "payment_methods") {
      setPaymentMethods(prev => prev.filter(c => c !== cat));
    }
  };

  const handleSaveInfo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!mName.trim()) {
      alert("দয়া করে মাদ্রাসার পূর্ণ নাম প্রদান করুন।");
      return;
    }

    const updatedData: Partial<MadrasaInfo> = {
      name: mName.trim(),
      phone: mPhone.trim(),
      address: mAddress.trim(),
      eiinOrBefaqCode: mCode.trim(),
      logoUrl: mLogo || "/logo.png",
      watermarkOpacity: mOpacity,
    };

    // সরাসরি ব্রাউজার লোকালস্টোরেজে সংরক্ষণ যাতে কখনোই না হারায়
    if (typeof window !== "undefined") {
      try {
        if (mLogo && mLogo !== "/logo.png") {
          localStorage.setItem("madrasha_custom_logo", mLogo);
        } else {
          localStorage.removeItem("madrasha_custom_logo");
        }
        localStorage.setItem("madrasha_watermark_opacity", String(mOpacity));
        const savedInfo = localStorage.getItem("madrasha_custom_info");
        let parsed = savedInfo ? JSON.parse(savedInfo) : {};
        parsed.name = mName.trim();
        parsed.phone = mPhone.trim();
        parsed.address = mAddress.trim();
        parsed.eiinOrBefaqCode = mCode.trim();
        localStorage.setItem("madrasha_custom_info", JSON.stringify(parsed));
      } catch (err) {
        console.warn("LocalStorage save warning:", err);
      }
    }

    // প্যারেন্ট স্টেট আপডেট
    if (onUpdateMadrasa) {
      onUpdateMadrasa(updatedData);
    }

    setIsSaved(true);
    setSaveMsg("মাদ্রাসার প্রাতিষ্ঠানিক প্রোফাইল, লোগো ও ওয়াটারমার্ক সংরক্ষিত হয়েছে!");
    setTimeout(() => {
      setIsSaved(false);
      setSaveMsg("");
    }, 4500);
  };

  // ২. মুহতামিম ব্যক্তিগত প্রোফাইল সংরক্ষণ
  const handleSavePersonalProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!mMuhtamimName.trim()) {
      alert("দয়া করে মুহতামিম সাহেবের নাম প্রদান করুন।");
      return;
    }

    const updatedData: Partial<MadrasaInfo> = {
      muhtamimName: mMuhtamimName.trim(),
      muhtamimPhotoUrl: mMuhtamimPhoto,
      phone: mMuhtamimPhone.trim(),
    };

    if (typeof window !== "undefined") {
      try {
        if (mMuhtamimPhoto) {
          localStorage.setItem("madrasha_muhtamim_photo", mMuhtamimPhoto);
        } else {
          localStorage.removeItem("madrasha_muhtamim_photo");
        }
        const savedInfo = localStorage.getItem("madrasha_custom_info");
        let parsed = savedInfo ? JSON.parse(savedInfo) : {};
        parsed.muhtamimName = mMuhtamimName.trim();
        parsed.phone = mMuhtamimPhone.trim();
        localStorage.setItem("madrasha_custom_info", JSON.stringify(parsed));
      } catch (err) {
        console.warn("Personal profile save warning:", err);
      }
    }

    if (onUpdateMadrasa) {
      onUpdateMadrasa(updatedData);
    }

    setIsPersonalSaved(true);
    setSaveMsg("মুহতামিম সাহেবের পার্সোনাল প্রোফাইল ও ছবি সফলভাবে সংরক্ষিত হয়েছে!");
    setTimeout(() => {
      setIsPersonalSaved(false);
      setSaveMsg("");
    }, 4500);
  };

  const effectiveLogo = mLogo || "/logo.png";

  return (
    <div className="space-y-6">
      {/* হেডার */}
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
              <Settings className="w-6 h-6 text-slate-700" />
              <span>সফটওয়্যার সেটিংস ও মাদ্রাসার প্রোফাইল</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মাদ্রাসার নিজস্ব তথ্য, লোগো, প্রিন্ট ওয়াটারমার্ক ব্রাইটনেস ও হিসাবের খাতসমূহ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* সাব-ট্যাব */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabChange("info")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "info" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>মাদরাসা প্রাতিষ্ঠানিক প্রোফাইল</span>
            </button>
            <button
              onClick={() => handleTabChange("personal_profile")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "personal_profile" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>মুহতামিম / পার্সোনাল প্রোফাইল</span>
            </button>
            <button
              onClick={() => handleTabChange("expense_cats")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "expense_cats" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              খরচের খাতসমূহ
            </button>
            <button
              onClick={() => handleTabChange("income_cats")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "income_cats" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              জমার খাতসমূহ
            </button>
            <button
              onClick={() => handleTabChange("payment_methods")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "payment_methods" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              পেমেন্ট মাধ্যম
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* নোটিফিকেশন মেসেজ */}
      {saveMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ১. মাদ্রাসার প্রোফাইল ও প্রাতিষ্ঠানিক লোগো সেটিংস (ট্যাব ১) */}
      {/* ========================================================================= */}
      {activeTab === "info" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>মাদ্রাসার প্রাতিষ্ঠানিক প্রোফাইল, লোগো ও ওয়াটারমার্ক সেটিংস</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              এখানে দেওয়া নাম, ঠিকানা ও লোগো সকল সার্টিফিকেট, প্রত্যয়নপত্র, ভর্তি ফরম ও মানি রিসিটে যুক্ত হবে
            </p>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-8">
            {/* ক. লোগো ও ওয়াটারমার্ক ব্রাইটনেস কন্ট্রোল সেকশন */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-indigo-100">
              {/* বাম পাশ: লোগো আপলোড ও প্রিভিউ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-900">মাদ্রাসার প্রাতিষ্ঠানিক লোগো (মনোগ্রাম)</h4>
                </div>

                <div className="flex items-center gap-4">
                  {/* লোগো প্রিভিউ বক্স */}
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-indigo-200 shadow-md p-2 flex items-center justify-center relative overflow-hidden shrink-0">
                    <img 
                      src={effectiveLogo} 
                      alt="মাদরাসা লোগো" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload} 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>লোগো আপলোড করুন</span>
                    </button>
                    {mLogo && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ডিফল্ট লোগোতে ফিরুন</span>
                      </button>
                    )}
                    <p className="text-[11px] text-slate-500">
                      পিএনজি (PNG) বা জেপিজি (JPG) ফরম্যাট। ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট লোগো সবচেয়ে সুন্দর দেখাবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* ডান পাশ: ওয়াটারমার্ক ব্রাইটনেস/হাইলাইট স্লাইডার ও লাইভ প্রিভিউ */}
              <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 lg:pl-6 pt-4 lg:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-black text-slate-900">প্রিন্ট ওয়াটারমার্ক ব্রাইটনেস / হাইলাইট</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs">
                    {mOpacity}% স্পষ্টতা
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min={2}
                    max={30}
                    step={1}
                    value={mOpacity}
                    onChange={(e) => setMOpacity(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>হালকা (২%)</span>
                    <span>মাঝারি (১০% রিকমেন্ডেড)</span>
                    <span>উজ্জ্বল (৩০%)</span>
                  </div>
                </div>

                {/* রিয়েল-টাইম লাইভ প্রিভিউ কার্ড */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 relative overflow-hidden space-y-1 shadow-2xs">
                  {/* ওয়াটারমার্ক লাইভ প্রিভিউ */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-200"
                    style={{ opacity: mOpacity / 100 }}
                  >
                    <img src={effectiveLogo} alt="watermark preview" className="w-24 h-24 object-contain" />
                  </div>
                  <div className="relative z-10 text-[11px]">
                    <div className="font-bold text-slate-800">📄 প্রিন্ট প্রিভিউ টেস্ট:</div>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      "এই মর্মে প্রত্যয়ন করা যাইতেছে যে, শিক্ষার্থী কৃতিত্বের সহিত পরীক্ষায় উত্তীর্ণ হইয়াছে..."
                    </p>
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>লাইভ স্লাইডার নাড়ালে ব্যাকগ্রাউন্ডের জলছাপ হালকা বা স্পষ্ট হবে।</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* খ. মাদ্রাসার অফিশিয়াল বিস্তারিত তথ্য */}
            <div className="space-y-4 max-w-2xl text-xs font-bold text-slate-700">
              <h4 className="text-sm font-black text-slate-900 border-b pb-2">মাদ্রাসার প্রাতিষ্ঠানিক তথ্যসমূহ</h4>

              <div>
                <label className="block mb-1.5 text-slate-700">মাদ্রাসার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="যেমন: জামিয়া ইসলামিয়া আরাবিয়া"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-700">মাদ্রাসার অফিসিয়াল মোবাইল / হেল্পলাইন *</label>
                  <input
                    type="tel"
                    required
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">বেফাক / শিক্ষাবোর্ড কোড / EIIN (যদি থাকে)</label>
                  <input
                    type="text"
                    value={mCode}
                    onChange={(e) => setMCode(e.target.value)}
                    placeholder="যেমন: B-10492"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-700">মাদ্রাসার পূর্ণাঙ্গ ঠিকানা *</label>
                <input
                  type="text"
                  required
                  value={mAddress}
                  onChange={(e) => setMAddress(e.target.value)}
                  placeholder="যেমন: বড় মসজিদ রোড, জামিয়া কমপ্লেক্স, ঢাকা"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveInfo()}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                    isSaved
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-4 ring-emerald-100"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                      <span>তথ্য ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>তথ্য ও সেটিংস সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>

                {isSaved && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>প্রোফাইল, মনোগ্রাম ও জলছাপ সক্রিয় হয়েছে!</span>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ২. মুহতামিম / পার্সোনাল প্রোফাইল ও ফটো সেটিংস (ট্যাব ২) */}
      {/* ========================================================================= */}
      {activeTab === "personal_profile" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>মুহতামিম / অধ্যক্ষের ব্যক্তিগত প্রোফাইল ও ছবি</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              এখানে দেওয়া নাম ও প্রোফাইল ছবি সাইডবারের অ্যাডমিন কার্ডে প্রদর্শিত হবে
            </p>
          </div>

          <form onSubmit={handleSavePersonalProfile} className="space-y-8">
            {/* ক. ফটো আপলোড ও লাইভ প্রিভিউ কার্ড */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-purple-100">
              {/* বাম পাশ: প্রোফাইল ফটো */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-black text-slate-900">মুহতামিম সাহেবের প্রোফাইল ফটো</h4>
                </div>

                <div className="flex items-center gap-4">
                  {/* সার্কুলার ফটো প্রিভিউ */}
                  <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative shrink-0">
                    {mMuhtamimPhoto ? (
                      <img 
                        src={mMuhtamimPhoto} 
                        alt="মুহতামিম ফটো" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl text-white">
                        {mMuhtamimName ? mMuhtamimName.slice(0, 1) : "মু"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={personalPhotoInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePersonalPhotoUpload} 
                    />
                    <button
                      type="button"
                      onClick={() => personalPhotoInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>প্রোফাইল ছবি পরিবর্তন করুন</span>
                    </button>
                    {mMuhtamimPhoto && (
                      <button
                        type="button"
                        onClick={handleResetPersonalPhoto}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ছবি মুছুন / রিসেট</span>
                      </button>
                    )}
                    <p className="text-[11px] text-slate-500">
                      পাসপোর্ট সাইজ বা পরিষ্কার ফরমাল ছবি সাইডবার ও সিস্টেমে সবচেয়ে সুন্দর দেখাবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* ডান পাশ: লাইভ আইডেন্টিটি ব্যাজ প্রিভিউ */}
              <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 lg:pl-6 pt-4 lg:pt-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-black text-slate-900">সাইডবার ডিসপ্লে প্রিভিউ</h4>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B0F19] text-white border border-slate-800 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-400 overflow-hidden flex items-center justify-center">
                        {mMuhtamimPhoto ? (
                          <img src={mMuhtamimPhoto} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-black text-sm text-white">{mMuhtamimName.slice(0, 1) || "মু"}</span>
                        )}
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F19] absolute -bottom-0.5 -right-0.5 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{mMuhtamimName || "মাওলানা মো. সাহাদাত হোসেন"}</p>
                      <p className="text-[10px] text-indigo-300 font-medium truncate">{mMuhtamimTitle} • {mName || "মাদরাসা"}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{mMuhtamimPhone}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  💡 এখান থেকে নাম ও ছবি সেভ করলে সাইডবারের স্ট্যাটাস কার্ডে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
                </p>
              </div>
            </div>

            {/* খ. ব্যক্তিগত তথ্যের ফিল্ডসমূহ */}
            <div className="space-y-4 max-w-2xl text-xs font-bold text-slate-700">
              <h4 className="text-sm font-black text-slate-900 border-b pb-2">মুহতামিম সাহেবের তথ্যসমূহ</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-700">মুহতামিম / অধ্যক্ষের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={mMuhtamimName}
                    onChange={(e) => setMMuhtamimName(e.target.value)}
                    placeholder="মাওলানা মো. সাহাদাত হোসেন"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">পদবি / দায়িত্ব *</label>
                  <input
                    type="text"
                    value={mMuhtamimTitle}
                    onChange={(e) => setMMuhtamimTitle(e.target.value)}
                    placeholder="মুহতামিম ও পরিচালক"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-700">ব্যক্তিগত মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={mMuhtamimPhone}
                    onChange={(e) => setMMuhtamimPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={mMuhtamimEmail}
                    onChange={(e) => setMMuhtamimEmail(e.target.value)}
                    placeholder="admin@madrasa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-700">সংক্ষিপ্ত পরিচিতি / বায়ো</label>
                <textarea
                  rows={2}
                  value={mMuhtamimBio}
                  onChange={(e) => setMMuhtamimBio(e.target.value)}
                  placeholder="মুহতামিম সাহেবের সংক্ষিপ্ত পরিচিতি..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSavePersonalProfile()}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                    isPersonalSaved
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-4 ring-emerald-100"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30"
                  }`}
                >
                  {isPersonalSaved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                      <span>পার্সোনাল প্রোফাইল সংরক্ষিত হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>মুহতামিম সাহেবের প্রোফাইল সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>

                {isPersonalSaved && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>সাইডবার প্রোফাইল ছবি ও তথ্য আপডেট হয়েছে!</span>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ৩. হিসাবের খাতসমূহ ও পেমেন্ট মেথড (ট্যাব ৩, ৪, ৫) */}
      {/* ========================================================================= */}
      {["expense_cats", "income_cats", "payment_methods"].includes(activeTab) && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>
                {activeTab === "expense_cats" ? "খরচের খাতসমূহ পরিচালনা" :
                 activeTab === "income_cats" ? "জমার খাতসমূহ পরিচালনা" : "পেমেন্ট মাধ্যমসমূহ"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              এখানে তৈরি করা খাতগুলো ক্যাশবুক ও ট্রানজেকশন এন্ট্রির ড্রপডাউনে স্বয়ংক্রিয়ভাবে পাওয়া যাবে
            </p>
          </div>

          {/* নতুন খাত যুক্ত করার ফর্ম */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              placeholder="নতুন খাতের নাম লিখুন..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>যোগ করুন</span>
            </button>
          </div>

          {/* খাতের টেবিল */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                  <th className="py-2.5 px-4 w-14 text-center">নং</th>
                  <th className="py-2.5 px-4">খাত / বিবরণ</th>
                  <th className="py-2.5 px-4 text-center w-28">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(activeTab === "expense_cats" ? expenseCats : activeTab === "income_cats" ? incomeCats : paymentMethods).map((item, idx) => (
                  <tr key={item} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-black text-slate-900">{item}</td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteCat(item)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* স্ক্রিনে সরাসরি ফ্লোটিং কনফার্মেশন ব্যানার */}
      {saveMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xl shadow-emerald-950/50 border border-emerald-500 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
          <div>
            <p className="font-black text-sm">সংরক্ষিত হয়েছে!</p>
            <p className="text-[11px] text-emerald-100 font-medium">{saveMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};
