"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, BookOpen, Layers, Type, ExternalLink } from "lucide-react";

interface FontOption {
  id: string;
  nameBn: string;
  nameEn: string;
  cssClass: string;
  fontFamily: string;
  category: string;
  description: string;
  sampleHeading: string;
  sampleBody: string;
  sampleTable: {
    receipt: string;
    student: string;
    jamat: string;
    month: string;
    amount: string;
  };
}

const FONTS: FontOption[] = [
  {
    id: "hind",
    nameBn: "হিন্দ শিলিগুড়ি",
    nameEn: "Hind Siliguri",
    cssClass: "font-hind",
    fontFamily: "'Hind Siliguri', 'SolaimanLipi', sans-serif",
    category: "মডার্ন ও ক্লিন (বর্তমান ডিফল্ট)",
    description: "স্ক্রিন ও ওয়েবের জন্য সর্বাধিক পঠিত ও সবচেয়ে পরিষ্কার বাংলা ফন্ট। সফটওয়্যারের মেনু, ফর্ম ও তালিকার জন্য নিখুঁত।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  },
  {
    id: "tiro",
    nameBn: "টিরো বাংলা",
    nameEn: "Tiro Bangla",
    cssClass: "font-tiro",
    fontFamily: "'Tiro Bangla', serif",
    category: "ক্লাসিক ও মার্জিত (বই ও প্রকাশনা স্টাইল)",
    description: "জন হাডসন ও ফিয়োনা রসের বিখ্যাত ক্লাসিক টাইপোগ্রাফি ফন্ট। সনাতন কিতাব, কিতাবখানা, প্রত্যয়নপত্র ও রসিদের জন্য অত্যন্ত রাজকীয় ও ঐতিহ্যবাহী রূপ দেয়।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  },
  {
    id: "noto",
    nameBn: "নোটো সান্স বাংলা",
    nameEn: "Noto Sans Bengali",
    cssClass: "font-noto",
    fontFamily: "'Noto Sans Bengali', sans-serif",
    category: "গুগল ইন্টারন্যাশনাল স্ট্যান্ডার্ড",
    description: "গুগলের আন্তর্জাতিক মানসম্মত ও সব ধরণের স্ক্রিনে সমানভাবে স্পষ্ট ফন্ট। সব বর্ণ ও যুক্তবর্ণের ভারসাম্য অসাধারণ।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  },
  {
    id: "anek",
    nameBn: "অনেক বাংলা",
    nameEn: "Anek Bangla",
    cssClass: "font-anek",
    fontFamily: "'Anek Bangla', sans-serif",
    category: "বোল্ড ও আধুনিক কর্পোরেট",
    description: "আধুনিক ডিজাইন ট্রেন্ডের চমৎকার একটি ফন্ট। শিরোনাম ও কার্ডগুলোতে অত্যন্ত শক্তিশালী ও সুস্পষ্ট উপস্থাপন তৈরি করে।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  },
  {
    id: "solaiman",
    nameBn: "সোলাইমান লিপি",
    nameEn: "SolaimanLipi",
    cssClass: "font-solaiman",
    fontFamily: "'SolaimanLipi', sans-serif",
    category: "চিরচেনা জনপ্রিয় ক্লাসিক",
    description: "বাংলাদেশের সর্বাধিক পরিচিত ও বিশ্বস্ত বাংলা ফন্ট। সরকারি অফিস, ওয়েবসাইট ও নিউজ পোর্টালে বহু বছর ধরে ব্যবহৃত।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  },
  {
    id: "kalpurush",
    nameBn: "কালপুরুষ",
    nameEn: "Kalpurush",
    cssClass: "font-kalpurush",
    fontFamily: "'Kalpurush', sans-serif",
    category: "অফিসিয়াল ও পত্রিকা স্টাইল",
    description: "পত্রিকা ও প্রকাশনায় বহুল ব্যবহৃত ফন্ট। স্পষ্ট ও সহজপাঠ্য রূপরেখা তৈরি করে।",
    sampleHeading: "দারুল উলুম কওমিয়া মাদরাসা ও এতিমখানা",
    sampleBody: "অভিভাবকের মোবাইল: ০১৭১২-৩৪৫৬৭৮ • রক্তের গ্রুপ: ও+ (পজেটিভ) • বিভাগ: কিতাব বিভাগ",
    sampleTable: {
      receipt: "রসিদ নং: K-2026-041",
      student: "আব্দুল্লাহ আল মারুফ",
      jamat: "মিজান জামাত",
      month: "মার্চ ২০২৬",
      amount: "৳ ৩,০০০ (কথায়: তিন হাজার টাকা মাত্র)"
    }
  }
];

export default function FontPreviewPage() {
  const [activeFontId, setActiveFontId] = useState<string>("hind");
  const [appliedMsg, setAppliedMsg] = useState<string>("");

  useEffect(() => {
    try {
      const savedFont = localStorage.getItem("madrasa_app_font");
      if (savedFont) {
        const found = FONTS.find(f => f.fontFamily === savedFont);
        if (found) setActiveFontId(found.id);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleApplyFont = (font: FontOption) => {
    try {
      localStorage.setItem("madrasa_app_font", font.fontFamily);
      document.documentElement.style.setProperty("--font-bangla", font.fontFamily);
      setActiveFontId(font.id);
      setAppliedMsg(`সফল! পুরো সফটওয়্যারে "${font.nameBn} (${font.nameEn})" ফন্ট সেট করা হয়েছে।`);
      setTimeout(() => setAppliedMsg(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* টপ হেডার */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ড্যাশবোর্ডে ফিরুন</span>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Type className="w-5 h-5 text-indigo-600" />
                বাংলা ফন্ট প্রিভিউ ও সিলেকশন
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                মাদরাসা সফটওয়্যারের জন্য বিভিন্ন বাংলা ফন্টের লাইভ স্যাম্পল দেখুন এবং পছন্দের ফন্ট বেছে নিন
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>সফটওয়্যার দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* কনফার্মেশন ব্যানার */}
      {appliedMsg && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top duration-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{appliedMsg}</span>
            </div>
            <Link href="/" className="underline text-emerald-900 hover:text-emerald-950 font-black">
              ড্যাশবোর্ডে পরীক্ষা করুন →
            </Link>
          </div>
        </div>
      )}

      {/* প্রধান কন্টেন্ট এরিয়া */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* পরিচিতি কার্ড */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>লাইভ টাইপোগ্রাফি প্রিভিউয়ার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              আপনার পছন্দের ফন্ট সিলেক্ট করুন
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-normal">
              নিচে প্রতিটি ফন্টে মাদরাসার নাম, জামাত, ছাত্রের বিবরণ এবং রসিদের নমুনা দেওয়া রয়েছে। 
              যেকোনো ফন্টের নিচে <strong>&ldquo;এই ফন্টটি পুরো অ্যাপে সক্রিয় করুন&rdquo;</strong> বোতামে ক্লিক করলে সাথে সাথে পুরো সফটওয়্যার সেই ফন্টে পরিবর্তিত হয়ে যাবে।
            </p>
          </div>
        </div>

        {/* ফন্ট কার্ড গ্রিড */}
        <div className="grid grid-cols-1 gap-6">
          {FONTS.map((font, idx) => {
            const isCurrentlyActive = activeFontId === font.id;

            return (
              <div
                key={font.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
                  isCurrentlyActive ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200"
                }`}
              >
                {/* কার্ড হেডার */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-2xs">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">
                          {font.nameBn} <span className="text-xs font-bold text-slate-500 font-mono">({font.nameEn})</span>
                        </h3>
                        {isCurrentlyActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            সক্রিয় ফন্ট
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700">
                        {font.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyFont(font)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                      isCurrentlyActive
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {isCurrentlyActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>সক্রিয় রয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>এই ফন্টটি পুরো অ্যাপে সেট করুন</span>
                      </>
                    )}
                  </button>
                </div>

                {/* স্যাম্পল প্রদর্শন এরিয়া (নির্দিষ্ট ফন্টে রেন্ডার করা) */}
                <div className={`p-6 sm:p-8 space-y-5 ${font.cssClass}`}>
                  <p className="text-xs text-slate-500 italic pb-2 border-b border-slate-100">
                    বিবরণ: {font.description}
                  </p>

                  {/* হেডিং স্যাম্পল */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      বড় শিরোনাম নমুনা (Heading Sample):
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                      {font.sampleHeading}
                    </h2>
                    <p className="text-sm font-bold text-indigo-700">
                      ইসলামিক শিক্ষা ও আদর্শ মানুষ গড়ার অনন্য প্রতিষ্ঠান (প্রতিষ্ঠিত: ২০০০ ইং)
                    </p>
                  </div>

                  {/* আরবি ও বাংলা মিশ্রণ */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      আরবি ও বাংলা সমন্বিত টেক্সট:
                    </span>
                    <div className="text-lg font-serif text-emerald-800 font-bold" style={{ fontFamily: "'Amiri', serif" }}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَقُل رَّبِّ زِدْنِي عِلْمًا
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      &ldquo;হে আমার প্রতিপালক! আমাকে জ্ঞানে সমৃদ্ধ করুন।&rdquo; • {font.sampleBody}
                    </div>
                  </div>

                  {/* টেবিল ও রসিদ স্যাম্পল */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      টেবিল ও খতিয়ান নমুনা (Table & Invoice Sample):
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-800 text-white font-bold text-[11px]">
                            <th className="py-2 px-3 border border-slate-700">রসিদ বিবরণ</th>
                            <th className="py-2 px-3 border border-slate-700">ছাত্রের নাম</th>
                            <th className="py-2 px-3 border border-slate-700">জামাত</th>
                            <th className="py-2 px-3 border border-slate-700">মাস</th>
                            <th className="py-2 px-3 border border-slate-700 text-right">আদায়কৃত টাকা</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="py-2.5 px-3 border font-mono font-bold text-indigo-700">{font.sampleTable.receipt}</td>
                            <td className="py-2.5 px-3 border font-black text-slate-900">{font.sampleTable.student}</td>
                            <td className="py-2.5 px-3 border font-bold text-slate-700">{font.sampleTable.jamat}</td>
                            <td className="py-2.5 px-3 border font-medium text-slate-600">{font.sampleTable.month}</td>
                            <td className="py-2.5 px-3 border text-right font-black text-emerald-700">{font.sampleTable.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
