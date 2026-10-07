"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Phone, 
  FileText 
} from "lucide-react";
import { Student, MadrasaInfo } from "@/types";

interface GuardianPortalProps {
  madrasa: MadrasaInfo;
  students: Student[];
  onBack: () => void;
}

export const GuardianPortal: React.FC<GuardianPortalProps> = ({
  madrasa,
  students,
  onBack,
}) => {
  const [studentIdOrRoll, setStudentIdOrRoll] = useState("");
  const [pin, setPin] = useState("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFoundStudent(null);

    const query = studentIdOrRoll.trim().toLowerCase();
    const student = students.find(
      (s) =>
        (s.roll.toLowerCase() === query || s.id.toLowerCase() === query) &&
        s.guardianPin === pin.trim()
    );

    if (student) {
      setFoundStudent(student);
    } else {
      setErrorMsg("শিক্ষার্থীর রোল/আইডি অথবা গোপন পিন নম্বর সঠিক নয়। অনুগ্রহ করে মাদ্রাসার দেওয়া সঠিক তথ্য দিন।");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (foundStudent) {
              setFoundStudent(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>← {foundStudent ? "অনুসন্ধানে ফিরুন" : "আগের পেজে ফিরে যান"}</span>
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            অভিভাবক ও শিক্ষার্থী কর্নার
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {madrasa.name} — ফলাফল, বকেয়া বেতন ও পড়ার অগ্রগতি অনুসন্ধান
          </p>
        </div>
      </div>

      {!foundStudent ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              👨‍👩‍👦
            </div>
            <h3 className="text-lg font-bold text-slate-900">সন্তানের তথ্য দেখতে লগইন করুন</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              আইডি কার্ডে থাকা রোল/আইডি এবং ভর্তির সময় দেওয়া ৪-সংখ্যার গোপন পিন দিন।
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                শিক্ষার্থীর রোল নম্বর বা আইডি:
              </label>
              <input
                type="text"
                required
                value={studentIdOrRoll}
                onChange={(e) => setStudentIdOrRoll(e.target.value)}
                placeholder="যেমন: ০১ বা DARUL-2026-101"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                অভিভাবকের গোপন পিন (৪ সংখ্যা):
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="যেমন: ১২৩৪"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-widest text-center font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                (পিন ভুলে গেলে মাদ্রাসার শ্রেণি শিক্ষকের সাথে যোগাযোগ করুন)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>ফলাফল ও হিসাব দেখুন</span>
            </button>
          </form>
        </div>
      ) : (
        /* শিক্ষার্থীর পূর্ণাঙ্গ অভিভাবক ভিউ */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-base flex items-center justify-center">
                  {foundStudent.roll}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{foundStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    আইডি: {foundStudent.id} | {foundStudent.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFoundStudent(null)}
                className="text-xs text-teal-700 font-bold hover:underline"
              >
                আরেকটি খুঁজুন
              </button>
            </div>

            {/* আজকের হাজিরা ও পড়ার অবস্থা */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-emerald-800 font-bold flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  আজকের হাজিরা
                </span>
                <p className="text-base font-black text-emerald-700">উপস্থিত ✓</p>
                <p className="text-[10px] text-slate-500 mt-0.5">সময়মতো ক্লাসে প্রবেশ করেছে</p>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-blue-800 font-bold flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  পড়ার বর্তমান অবস্থা
                </span>
                <p className="text-sm font-bold text-blue-950 truncate">{foundStudent.currentLesson}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">উস্তাদের মূল্যায়ন: ভালো</p>
              </div>
            </div>

            {/* বকেয়া ও বেতন হিসাব */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">চলতি মাসের ফি স্ট্যাটাস:</span>
                {foundStudent.dueAmount > 0 ? (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 font-black rounded-full">
                    বকেয়া: ৳ {foundStudent.dueAmount}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black rounded-full">
                    ✓ সম্পূর্ণ পরিশোধিত
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                মাসিক নির্ধারিত ফি: <b>৳ {foundStudent.monthlyFee}</b>
              </p>
            </div>

            {/* শ্রেণি শিক্ষকের সাথে যোগাযোগ */}
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl text-xs flex items-center justify-between">
              <div>
                <span className="text-teal-900 font-bold block">শ্রেণি শিক্ষক: মাওলানা ইমরান হুসাইন</span>
                <span className="text-[11px] text-slate-500">যোগাযোগের উপযুক্ত সময়: সকাল ১০টা - দুপুর ১টা</span>
              </div>
              <a
                href="tel:01711223344"
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল করুন</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
