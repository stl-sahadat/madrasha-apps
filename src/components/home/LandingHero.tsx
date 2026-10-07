"use client";

import React from "react";
import { Rocket, Lock, Users, Sparkles, BookOpen, Receipt, ShieldCheck } from "lucide-react";

interface LandingHeroProps {
  onSelectAction: (action: "register" | "login" | "guardian") => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectAction }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 sm:py-12">
      {/* শিরোনাম ও সাব-শিরোনাম */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>আধুনিক কওমি ও আলিয়া মাদ্রাসা ডিজিটালাইজেশন</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug mb-3">
          মাদ্রাসা ম্যানেজমেন্ট
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
          ভর্তি, ডিজিটাল হাজিরা, হিফজ ট্র্যাকিং, ফি আদায় ও বাংলা মানি রিসিট—সবকিছু এক প্ল্যাটফর্মে।
        </p>
      </div>

      {/* ৩টি মূল প্রবেশদ্বার বাটন (মনিটরে পাশাপাশি ৩টি কার্ড, মোবাইলে ১২px পরিমিত গ্যাপে সাজানো) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-10">
        {/* বাটন ১: নতুন মাদ্রাসা রেজিস্ট্রেশন */}
        <button
          onClick={() => onSelectAction("register")}
          className="group relative bg-white hover:bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/80 shadow-md hover:shadow-xl hover:border-emerald-600 transition-all duration-200 text-left flex items-center justify-between md:flex-col md:items-start"
        >
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                নতুন মাদ্রাসা রেজিস্ট্রেশন
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                নতুন প্রতিষ্ঠানের জন্য ডিজিটাল ক্যাম্পাস চালু
              </p>
            </div>
          </div>
          <span className="text-emerald-600 font-bold text-lg md:mt-4 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        {/* বাটন ২: ম্যানেজমেন্ট লগইন */}
        <button
          onClick={() => onSelectAction("login")}
          className="group relative bg-white hover:bg-slate-50 p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all duration-200 text-left flex items-center justify-between md:flex-col md:items-start"
        >
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-800/20 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                ম্যানেজমেন্ট লগইন
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                মুহতামিম, শিক্ষক ও কর্মকর্তা প্যানেল
              </p>
            </div>
          </div>
          <span className="text-slate-600 font-bold text-lg md:mt-4 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        {/* বাটন ৩: অভিভাবক কর্নার */}
        <button
          onClick={() => onSelectAction("guardian")}
          className="group relative bg-white hover:bg-teal-50/50 p-5 sm:p-6 rounded-2xl border-2 border-teal-500/80 shadow-md hover:shadow-xl hover:border-teal-600 transition-all duration-200 text-left flex items-center justify-between md:flex-col md:items-start"
        >
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                অভিভাবক কর্নার
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ফলাফল, বকেয়া ফি ও অগ্রগতি অনুসন্ধান
              </p>
            </div>
          </div>
          <span className="text-teal-600 font-bold text-lg md:mt-4 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* নিচের মার্জিত ফিচার ব্যাজ */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>কওমি ও আলিয়া কারিকুলাম</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
          <Receipt className="w-3.5 h-3.5 text-emerald-600" />
          <span>ডিজিটাল মানি রিসিট ও ক্যাশমেমো</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>১০০% ক্লাউড ডাটা নিরাপত্তা</span>
        </div>
      </div>
    </div>
  );
};
