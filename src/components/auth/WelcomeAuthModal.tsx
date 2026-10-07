"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Check,
  Building,
  ShieldAlert,
  KeyRound
} from "lucide-react";
import { MadrasaInfo, MadrasaType, DivisionType } from "@/types";

interface WelcomeAuthModalProps {
  onLoginSuccess: (madrasa: MadrasaInfo) => void;
  onRegisterSuccess: (madrasa: MadrasaInfo) => void;
  initialMadrasa: MadrasaInfo;
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
  initialMadrasa,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // পাসওয়ার্ড শো / হাইড স্টেট (চোখের আইকন টগল)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // লগইন ফর্ম স্টেট
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // রেজিস্ট্রেশন ফর্ম স্টেট
  const [regMadrasaName, setRegMadrasaName] = useState("");
  const [regMuhtamimName, setRegMuhtamimName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regType, setRegType] = useState<MadrasaType>("qawmi");
  const [qawmiDivisions, setQawmiDivisions] = useState<DivisionType[]>(["noorani", "hifz", "kitab"]);
  const [regAddress, setRegAddress] = useState("");
  const [regError, setRegError] = useState("");

  const toggleQawmiDivision = (div: DivisionType) => {
    setQawmiDivisions((prev) => {
      if (prev.includes(div)) {
        if (prev.length <= 1) return prev; // কমপক্ষে একটি বিভাগ সক্রিয় থাকতে হবে
        return prev.filter((d) => d !== div);
      } else {
        return [...prev, div];
      }
    });
  };

  // পাসওয়ার্ড স্ট্রেংথ ক্যালকুলেটর (সিকিউরিটি অ্যানালাইসিস)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200", percent: 0, textColor: "text-slate-400" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[!@#$%^&*()_+]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score++;

    if (score <= 1) {
      return { score: 1, label: "দুর্বল (Weak)", color: "bg-rose-500", percent: 30, textColor: "text-rose-600" };
    }
    if (score <= 2) {
      return { score: 2, label: "মাঝারি (Medium)", color: "bg-amber-500", percent: 65, textColor: "text-amber-600" };
    }
    return { score: 3, label: "শক্তিশালী (Strong)", color: "bg-emerald-600", percent: 100, textColor: "text-emerald-700" };
  };

  const loginPassStrength = getPasswordStrength(loginPassword);
  const regPassStrength = getPasswordStrength(regPassword);

  // লগইন সাবমিট (কড়া সিকিউরিটি চেক)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanPhone = loginPhone.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanPhone || !cleanPassword) {
      setLoginError("অনুগ্রহ করে মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন");
      return;
    }

    // পাসওয়ার্ডের দৈর্ঘ্য ও সিকিউরিটি চেক
    if (cleanPassword.length < 4) {
      setLoginError("পাসওয়ার্ড অত্যন্ত ছোট! সঠিক পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    // মুহতামিম সাহাদাত ভাইয়ের অ্যাকাউন্ট অথবা রেজিস্টার্ড অ্যাকাউন্ট চেক
    const validPhones = ["01700000000", "01711000000", "01800000000", initialMadrasa.phone];
    const validPasswords = ["123456", "sahadat123", "Madrasa@2026", initialMadrasa.password];

    const isMatch = validPhones.includes(cleanPhone) && validPasswords.includes(cleanPassword);

    if (isMatch) {
      onLoginSuccess(initialMadrasa);
    } else {
      // সিকিউরিটি ভ্যালিডেশন ফেইল হলে সরাসরি রিজেক্ট
      setLoginError("ভুল মোবাইল নম্বর অথবা পাসওয়ার্ড! সঠিক নম্বর ও পাসওয়ার্ড প্রদান করুন অথবা 'নতুন মাদরাসা রেজিস্ট্রেশন' ট্যাবে যান।");
    }
  };

  // রেজিস্ট্রেশন সাবমিট (স্ট্রং পাসওয়ার্ড পলিসি)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regMadrasaName.trim()) {
      setRegError("মাদরাসার নাম লিখুন");
      return;
    }
    if (!regMuhtamimName.trim()) {
      setRegError("মুহতামিম সাহেবের নাম লিখুন");
      return;
    }
    if (!regPhone.trim()) {
      setRegError("মোবাইল নম্বর লিখুন");
      return;
    }
    // পাসওয়ার্ড সিকিউরিটি পলিসি
    if (regPassword.length < 6) {
      setRegError("নিরাপত্তার স্বার্থে পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }

    const activeDivisions: DivisionType[] = regType === "qawmi" ? qawmiDivisions : ["alia"];

    const newMadrasa: MadrasaInfo = {
      id: `mad_${Date.now()}`,
      name: regMadrasaName,
      muhtamimName: regMuhtamimName,
      type: regType,
      activeDivisions,
      slug: regMadrasaName.toLowerCase().replace(/\s+/g, "-"),
      address: regAddress || "বাংলাদেশ",
      phone: regPhone,
      password: regPassword,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onRegisterSuccess(newMadrasa);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0B0F19] via-[#0D1127] to-[#1E1B4B] py-8 sm:py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* অলংকৃত ব্যাকগ্রাউন্ড আভা ও পালস লাইট */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* সমগ্র পেজ এন্ট্রান্স অ্যানিমেশন কন্টেইনার */}
      <div className="w-full max-w-xl mx-auto relative z-10 space-y-6">
        {/* ১. রাজকীয় স্বাগত হেডার ও অফিসিয়াল লোগো (ভেসে ওঠার অ্যানিমেশন) */}
        <div className="text-center space-y-3">
          {/* আমাদের কাস্টম অফিসিয়াল লোগো (লোগো ব্যাকগ্রাউন্ড রিমুভ ও অ্যাডজাস্টেড) */}
          <div className="inline-flex items-center justify-center relative group anim-item-1">
            <div className="absolute inset-0 bg-indigo-500/25 rounded-full blur-2xl group-hover:blur-3xl transition-all pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="মাদ্রাসা ম্যানেজমেন্ট লোগো" 
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-[0_16px_32px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-2">
            <div className="anim-item-2">
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold tracking-wide shadow-sm">
                ✨ বিসমিল্লাহির রাহমানির রাহিম
              </span>
            </div>
            
            <h1 className="anim-item-3 text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              মাদরাসা ম্যানেজমেন্ট অ্যাপসে <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent font-black">
                আপনাকে স্বাগতম
              </span>
            </h1>
            
            <p className="anim-item-4 text-xs sm:text-sm text-indigo-200/90 max-w-md mx-auto font-medium">
              কওমি ও আলিয়া মাদরাসার হিসাব-নিকাশ, ছাত্র, শিক্ষক ও ফান্ড পরিচালনার পূর্ণাঙ্গ অটোমেশন
            </p>
          </div>
        </div>

        {/* ২. ইউনিক লাক্সারি কার্ড (সাদার ব্যাকগ্রাউন্ডে মাঝখান বরাবর লোগো ওয়াটারমার্ক ও এন্ট্রান্স অ্যানিমেশন) */}
        <div className="anim-item-5 relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 border border-slate-200/90 text-slate-900">
          {/* সাদার জায়গার একদম মাঝখান বরাবর সূক্ষ্ম প্রিমিয়াম লোগো ওয়াটারমার্ক */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="" 
              className="w-64 h-64 sm:w-80 sm:h-80 object-contain opacity-[0.06] select-none pointer-events-none" 
            />
          </div>

          {/* ট্যাব সুইচার: লগইন বনাম রেজিস্ট্রেশন (হোভার ও ক্লিক অ্যানিমেশন) */}
          <div className="relative z-10 flex rounded-2xl bg-slate-100 p-1.5 mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setLoginError("");
              }}
              className={`flex-1 py-3 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "login"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 transition-transform ${authMode === "login" ? "text-white scale-110" : "text-slate-500"}`} />
              <span>লগইন করুন</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setRegError("");
              }}
              className={`flex-1 py-3 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "register"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Sparkles className={`w-4 h-4 transition-transform ${authMode === "register" ? "text-amber-300 scale-110" : "text-slate-500"}`} />
              <span>নতুন মাদরাসা রেজিস্ট্রেশন</span>
            </button>
          </div>

          {/* ১. লগইন ফর্ম */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="relative z-10 space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  মুহতামিম / ম্যানেজারের মোবাইল নম্বর
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="০১৭১১০০০০০০"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    গোপন পাসওয়ার্ড
                  </label>
                  {loginPassword && (
                    <span className={`text-[11px] font-bold ${loginPassStrength.textColor} flex items-center gap-1`}>
                      <KeyRound className="w-3 h-3" />
                      {loginPassStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-mono"
                  />
                  {/* পাসওয়ার্ড শো/হাইড চোখের আইকন */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-indigo-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                </div>

                {/* পাসওয়ার্ড সিকিউরিটি বার */}
                {loginPassword && (
                  <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${loginPassStrength.color}`}
                      style={{ width: `${loginPassStrength.percent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* লগইন বাটন (রয়েল ইন্ডিগো ও ভায়োলেট গ্রেডিয়েন্ট - মাইক্রো-অ্যানিমেশন) */}
              <button
                type="submit"
                className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-xl text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
            </form>
          )}

          {/* ২. নতুন মাদরাসা রেজিস্ট্রেশন ফর্ম */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="relative z-10 space-y-3.5 text-xs">
              {regError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  মাদরাসার পূর্ণ নাম
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regMadrasaName}
                    onChange={(e) => setRegMadrasaName(e.target.value)}
                    placeholder="যেমন: জামিয়া আরাবিয়া দারুল উলুম"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    মুহতামিম সাহেবের নাম
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regMuhtamimName}
                      onChange={(e) => setRegMuhtamimName(e.target.value)}
                      placeholder="মুহতামিম / প্রিন্সিপাল"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    মুহতামিমের মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="০১৭১১০০০০০০"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-800">
                      নিরাপদ পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
                    </label>
                    {regPassword && (
                      <span className={`text-[10px] font-bold ${regPassStrength.textColor}`}>
                        {regPassStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {regPassword && (
                    <div className="mt-1.5 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${regPassStrength.color}`}
                        style={{ width: `${regPassStrength.percent}%` }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    কনফার্ম পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="পুনরায় পাসওয়ার্ড লিখুন..."
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  মাদরাসার ধরন
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "qawmi", label: "কওমি মাদরাসা" },
                    { id: "alia", label: "আলিয়া মাদরাসা" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRegType(t.id as MadrasaType)}
                      className={`py-2.5 px-3 rounded-xl text-center font-bold border transition-all text-xs sm:text-sm ${
                        regType === t.id
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm ring-1 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* কওমি মাদরাসা সিলেক্ট করা হলে সাব-বিভাগ (নূরানী, হিফজখানা, কিতাব বিভাগ) সিলেকশন */}
                {regType === "qawmi" && (
                  <div className="mt-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-950">মাদরাসার সক্রিয় বিভাগসমূহ বেছে নিন:</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">(কমপক্ষে ১টি সিলেক্ট করুন)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "noorani" as DivisionType, label: "নূরানী", sub: "শিশু - ৫ম" },
                        { id: "hifz" as DivisionType, label: "হিফজখানা", sub: "নাজেরা ও হিফজ" },
                        { id: "kitab" as DivisionType, label: "কিতাব বিভাগ", sub: "মিজান - দাওরা" },
                      ].map((div) => {
                        const isSelected = qawmiDivisions.includes(div.id);
                        return (
                          <button
                            key={div.id}
                            type="button"
                            onClick={() => toggleQawmiDivision(div.id)}
                            className={`p-2 rounded-lg border text-left transition-all relative ${
                              isSelected
                                ? "bg-white border-indigo-600 text-indigo-950 shadow-sm ring-1 ring-indigo-500/20"
                                : "bg-slate-50/80 border-slate-200 text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold leading-tight">{div.label}</span>
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{div.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="গ্রাম, ডাকঘর, থানা ও জেলা..."
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-indigo-600 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-xl text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
                <span>মাদরাসা অ্যাকাউন্ট রেজিস্টার করুন</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
