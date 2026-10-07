"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Plus, 
  Building, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle 
} from "lucide-react";
import { MadrasaInfo, MadrasaType, DivisionType, MadrasaClass } from "@/types";
import { PRELOADED_CLASSES, SPECIAL_ADDABLE_CLASSES } from "@/lib/preloadedClasses";

interface RegisterWizardProps {
  onComplete: (madrasa: MadrasaInfo, selectedClasses: MadrasaClass[]) => void;
  onCancel: () => void;
}

export const RegisterWizard: React.FC<RegisterWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);

  // ধাপ ১: ফরম স্টেট
  const [name, setName] = useState("");
  const [type, setType] = useState<MadrasaType>("qawmi");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [eiinOrBefaqCode, setEiinOrBefaqCode] = useState("");

  // ধাপ ২: জামাত সিলেকশন স্টেট
  const [activeDivision, setActiveDivision] = useState<DivisionType>("noorani");
  const [selectedClasses, setSelectedClasses] = useState<MadrasaClass[]>([
    { id: "c_shishu", name: "শিশু শ্রেণি (প্লে/নার্সারি)", division: "noorani", sections: ["শাখা ক"] },
    { id: "c_noorani_1", name: "নূরানী ১ম শ্রেণি", division: "noorani", sections: ["শাখা ক"] },
    { id: "c_noorani_2", name: "নূরানী ২য় শ্রেণি", division: "noorani", sections: ["শাখা ক"] },
  ]);
  const [customClassName, setCustomClassName] = useState("");
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // অটো-স্লাগ জেনারেশন
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === "") {
      const suggestedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "darul-ulum";
      setSlug(suggestedSlug);
    }
  };

  // ক্লাস সিলেক্ট করা
  const toggleClass = (classItem: { id: string; name: string; division: DivisionType; defaultSections: string[] }) => {
    const exists = selectedClasses.find((c) => c.id === classItem.id);
    if (exists) {
      setClassToDelete(classItem.id);
    } else {
      setSelectedClasses((prev) => [
        ...prev,
        {
          id: classItem.id,
          name: classItem.name,
          division: classItem.division,
          sections: [...classItem.defaultSections],
        },
      ]);
    }
  };

  // স্পেশাল কাস্টম ক্লাস যোগ
  const addCustomClass = () => {
    if (!customClassName.trim()) return;
    const newId = `custom_${Date.now()}`;
    setSelectedClasses((prev) => [
      ...prev,
      {
        id: newId,
        name: customClassName.trim(),
        division: activeDivision,
        sections: ["শাখা ক"],
      },
    ]);
    setCustomClassName("");
  };

  // ধাপ ১ থেকে ধাপ ২ এ যাওয়া
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone || !password) {
      alert("অনুগ্রহ করে মাদ্রাসার নাম, ঠিকানা, মোবাইল নম্বর ও পাসওয়ার্ড পূরণ করুন।");
      return;
    }
    setStep(2);
  };

  // রেজিস্ট্রেশন সম্পন্ন
  const handleFinalSubmit = () => {
    if (selectedClasses.length === 0) {
      alert("অনুগ্রহ করে আপনার মাদ্রাসার অন্তত একটি জামাত নির্বাচন করুন।");
      return;
    }

    const newMadrasa: MadrasaInfo = {
      id: `mad_${Date.now()}`,
      name,
      type,
      slug: slug || "darul-ulum",
      address,
      phone,
      password,
      eiinOrBefaqCode,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onComplete(newMadrasa, selectedClasses);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* ধাপ ১: তথ্য ও স্প্লিট-স্ক্রিন ফর্ম */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* বামপাশে মার্কেটিং ও সুযোগ-সুবিধা প্যানেল */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700/50 rounded-full text-xs font-semibold text-emerald-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>মাদ্রাসার জন্য পূর্ণাঙ্গ ডিজিটাল সলিউশন</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              কেন আপনার মাদ্রাসায় আমাদের সফটওয়্যার চালু করবেন?
            </h2>

            <ul className="space-y-4 text-sm text-emerald-100 font-medium mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>কওমি ও আলিয়া উভয় ধারার জামাত সেটআপ এক ক্লিকে</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>তাৎক্ষণিক বাংলা মানি রিসিট (A4 ও POS থার্মাল প্রিন্ট)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>বারকোড ও কিউআর সম্বলিত রেডি-টু-প্রিন্ট স্মার্ট আইডি কার্ড</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>হিফজখানা ডায়েরি (সবক, সাত-সবক ও আমপারা ট্র্যাকিং)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>অনুপস্থিত ও বকেয়ার স্বয়ংক্রিয় SMS ও WhatsApp বার্তা</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>১০০% ক্লাউড ডাটা ব্যাকআপ ও শতভাগ নিরাপত্তা</span>
              </li>
            </ul>

            <div className="p-4 bg-emerald-700/40 rounded-2xl border border-emerald-600/30 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-300 shrink-0" />
              <span>কোনো জটিল ট্রেনিং ছাড়াই সাধারণ স্মার্টফোনেই পুরো মাদ্রাসা পরিচালনা করুন।</span>
            </div>
          </div>

          {/* ডানপাশে রেজিস্ট্রেশন ফর্ম */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">আপনার মাদ্রাসা নিবন্ধন করুন</h3>
                <p className="text-xs text-slate-500 font-medium">ধাপ ১/২: মূল প্রাতিষ্ঠানিক তথ্য</p>
              </div>
              <button 
                onClick={onCancel}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>← পিছনে যান</span>
              </button>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              {/* ১. মাদ্রাসার নাম */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাদ্রাসার পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="যেমন: জামিয়া আরাবিয়া দারুল উলুম..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* ২. মাদ্রাসার ধরণ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  মাদ্রাসার ধরণ <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("qawmi")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      type === "qawmi" 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    কওমি মাদ্রাসা
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("alia")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      type === "alia" 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    আলিয়া মাদ্রাসা
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("combined")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      type === "combined" 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    উভয় / কম্বাইন্ড
                  </button>
                </div>
              </div>

              {/* ৩. এক বক্সে পূর্ণ ঠিকানা */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাদ্রাসার পূর্ণ ঠিকানা (গ্রাম, ডাকঘর, থানা, জেলা) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="উদা: হাজী পাড়া, ডাকঘর: মিরপুর, থানা: মিরপুর, জেলা: ঢাকা"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* ৪. মাদ্রাসার নিজস্ব লিঙ্ক ও UID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মাদ্রাসার নিজস্ব পোর্টাল লিঙ্ক ও UID
                </label>
                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">madrasha.app/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="darul-ulum-dhaka"
                    className="bg-transparent font-bold text-emerald-700 focus:outline-none flex-1 ml-1"
                  />
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                    ✓ খালি আছে
                  </span>
                </div>
              </div>

              {/* ৫. মোবাইল নম্বর ও পাসওয়ার্ড */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অফিসিয়াল মোবাইল নম্বর (ইউজারনেম) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭১১XXXXXX"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাকাউন্টের পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* ৬. বেফাক বা EIIN কোড (ঐচ্ছিক) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বেফাক কোড বা EIIN নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={eiinOrBefaqCode}
                  onChange={(e) => setEiinOrBefaqCode(e.target.value)}
                  placeholder="যেমন: BEFAQ-1234 বা EIIN-13456"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* পরবর্তী বাটন */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>পরবর্তী ধাপে যান: জামাত নির্বাচন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ধাপ ২: জামাত ও কারিকুলাম সিলেকশন উইজার্ড */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">আপনার মাদ্রাসার জামাত / শ্রেণি নির্বাচন করুন</h3>
              <p className="text-xs text-slate-500 font-medium">ধাপ ২/২: বাটন চেপে আপনার ক্লাসের তালিকা সক্রিয় করুন</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 px-3 py-1.5 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>← আগের ধাপে যান</span>
            </button>
          </div>

          {/* সক্রিয় জামাতসমূহ (টপ বক্স) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                আপনার মাদ্রাসায় সক্রিয় জামাতসমূহ: ({selectedClasses.length}টি জামাত)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedClasses.map((cls) => (
                <span
                  key={cls.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 shadow-sm"
                >
                  <span>✓ {cls.name}</span>
                  <button
                    type="button"
                    onClick={() => setClassToDelete(cls.id)}
                    className="p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {selectedClasses.length === 0 && (
                <p className="text-xs text-slate-500 italic">এখনো কোনো জামাত নির্বাচন করা হয়নি। নিচের বাটনে ক্লিক করুন।</p>
              )}
            </div>
          </div>

          {/* বিভাগ নির্বাচন বাটন */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">বিভাগ বেছে নিন:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveDivision("noorani")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  activeDivision === "noorani"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ১. নূরানী ও নাজেরা
              </button>
              <button
                type="button"
                onClick={() => setActiveDivision("hifz")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  activeDivision === "hifz"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ২. হিফজুল কুরআন
              </button>
              <button
                type="button"
                onClick={() => setActiveDivision("kitab")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  activeDivision === "kitab"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ৩. কওমি কিতাব বিভাগ
              </button>
              <button
                type="button"
                onClick={() => setActiveDivision("alia")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  activeDivision === "alia"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ৪. আলিয়া কারিকুলাম
              </button>
            </div>
          </div>

          {/* সংশ্লিষ্ট বিভাগের ক্লাস বাটনসমূহ */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">
                ক্লিক করে যুক্ত করুন (উপলব্ধ জামাতসমূহ):
              </span>
              <button
                type="button"
                onClick={() => {
                  const filtered = PRELOADED_CLASSES.filter((c) => c.division === activeDivision);
                  filtered.forEach((item) => {
                    if (!selectedClasses.some((s) => s.id === item.id)) {
                      setSelectedClasses((prev) => [
                        ...prev,
                        { id: item.id, name: item.name, division: item.division, sections: [...item.defaultSections] },
                      ]);
                    }
                  });
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                ⚡ এই বিভাগের সবগুলো এক ক্লিকে যুক্ত করুন
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {PRELOADED_CLASSES.filter((c) => c.division === activeDivision).map((c) => {
                const isSelected = selectedClasses.some((s) => s.id === c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleClass(c)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-white text-slate-800 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span>{isSelected ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* বিশেষায়িত জামাতসমূহ (ইফতা, আদব ও অন্যান্য) */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl mb-4">
            <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>উচ্চতর ও বিশেষায়িত জামাত (প্রয়োজনে সিলেক্ট করে যুক্ত করুন):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_ADDABLE_CLASSES.map((sp) => {
                const isSelected = selectedClasses.some((s) => s.name === sp.name);
                return (
                  <button
                    key={sp.name}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        const target = selectedClasses.find(s => s.name === sp.name);
                        if (target) setClassToDelete(target.id);
                      } else {
                        setSelectedClasses((prev) => [
                          ...prev,
                          {
                            id: `sp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                            name: sp.name,
                            division: sp.division,
                            sections: [...sp.defaultSections]
                          }
                        ]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-white text-amber-950 border-amber-300/80 hover:bg-amber-100/70"
                    }`}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    <span>{sp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* কাস্টম স্পেশাল জামাত যোগ করার ফিল্ড */}
          <div className="flex items-center gap-2 p-3 bg-slate-100/70 border border-slate-200 rounded-2xl mb-8">
            <input
              type="text"
              value={customClassName}
              onChange={(e) => setCustomClassName(e.target.value)}
              placeholder="আপনার মাদ্রাসার কোনো বিশেষ ক্লাসের নাম থাকলে লিখুন..."
              className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="button"
              onClick={addCustomClass}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>যুক্ত করুন</span>
            </button>
          </div>

          {/* সাবমিট ও ড্যাশবোর্ডে প্রবেশ বাটন */}
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>🚀 মাদ্রাসা সেটআপ সম্পন্ন করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ক্লাস ডিলিট কনফার্মেশন ওয়ার্নিং মডাল */}
      {classToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-slate-900 text-sm">জামাত তালিকা থেকে বাদ দিতে চান?</h4>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              আপনি কি নিশ্চিত এই জামাতটি মাদ্রাসার তালিকা থেকে সরিয়ে ফেলতে চান?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setClassToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedClasses((prev) => prev.filter((c) => c.id !== classToDelete));
                  setClassToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
              >
                হ্যাঁ, বাদ দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
