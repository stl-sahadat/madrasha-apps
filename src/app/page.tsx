"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Language } from "@/lib/translations";
import { WelcomeAuthModal } from "@/components/auth/WelcomeAuthModal";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { ClassView } from "@/components/classes/ClassView";
import { StudentProfileModal } from "@/components/students/StudentProfileModal";
import { 
  INITIAL_MADRASA, 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_TRANSACTIONS,
  INITIAL_DONATIONS,
  INITIAL_HIFZ_RECORDS,
  INITIAL_MEALS,
  INITIAL_BAZAR,
  INITIAL_REPORTS
} from "@/lib/store";
import { PRELOADED_CLASSES } from "@/lib/preloadedClasses";
import { 
  MadrasaInfo, 
  MadrasaClass, 
  Student, 
  TeacherStaff, 
  CashTransaction,
  DonationRecord,
  HifzRecord,
  BoardingMealRecord,
  DailyBazarItem,
  StudentReportCard
} from "@/types";
import { QrCode, X, CheckCircle2 } from "lucide-react";

export default function Home() {
  // অথেনটিকেশন ও ভিউ স্টেট (অ্যাপ ওপেন হলেই অ্যানিমেটেড ওয়েলকাম ও লগইন/রেজিস্ট্রেশন স্ক্রিন)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<
    "welcome" | "dashboard" | "class_view" | "super_admin"
  >("welcome");
  const [historyStack, setHistoryStack] = useState<string[]>(["welcome"]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("bn");

  // ব্রাউজার হিস্ট্রি (Back / Forward বোতাম) সিঙ্ক্রোনাইজেশন
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view");
      if (viewParam === "dashboard") {
        setIsAuthenticated(true);
        setCurrentView("dashboard");
        setHistoryStack(["dashboard"]);
      }

      const handlePopState = (event: PopStateEvent) => {
        if (event.state && event.state.view) {
          setCurrentView(event.state.view);
          setHistoryStack((prev) => {
            if (prev.length > 1) {
              const next = [...prev];
              next.pop();
              return next;
            }
            return [event.state.view];
          });
        } else {
          setCurrentView(isAuthenticated ? "dashboard" : "welcome");
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [isAuthenticated]);

  // Esc কী চাপলে যেকোনো খোলা মডাল বন্ধ
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowScannerModal(false);
        setSelectedStudentForProfile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // লোকাল স্টোরেজ থেকে কাস্টম লোগো, মুহতামিম ফটো, ওয়াটারমার্ক অপাসিটি ও মাদ্রাসার প্রাতিষ্ঠানিক তথ্য লোড
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLogo = localStorage.getItem("madrasha_custom_logo");
        const savedMuhtamimPhoto = localStorage.getItem("madrasha_muhtamim_photo");
        const savedOpacity = localStorage.getItem("madrasha_watermark_opacity");
        const savedInfo = localStorage.getItem("madrasha_custom_info");
        let parsedInfo: Partial<MadrasaInfo> = {};
        if (savedInfo) {
          try {
            parsedInfo = JSON.parse(savedInfo);
          } catch (e) {
            console.error("Error parsing saved madrasa info", e);
          }
        }
        setMadrasa((prev) => ({
          ...prev,
          ...parsedInfo,
          ...(savedLogo ? { logoUrl: savedLogo } : {}),
          ...(savedMuhtamimPhoto ? { muhtamimPhotoUrl: savedMuhtamimPhoto } : {}),
          ...(savedOpacity !== null ? { watermarkOpacity: Number(savedOpacity) } : {}),
        }));
      } catch (err) {
        console.error("Error loading madrasa from localStorage", err);
      }
    }
  }, []);

  const navigateTo = (view: "welcome" | "dashboard" | "class_view" | "super_admin") => {
    if (typeof window !== "undefined") {
      window.history.pushState({ view }, "", `?view=${view}`);
    }
    setHistoryStack((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && historyStack.length > 1) {
      window.history.back();
    } else {
      setHistoryStack(["dashboard"]);
      setCurrentView("dashboard");
      if (typeof window !== "undefined") {
        window.history.replaceState({ view: "dashboard" }, "", window.location.pathname);
      }
    }
  };

  // মূল ডেটা স্টেট
  const [madrasa, setMadrasa] = useState<MadrasaInfo>(INITIAL_MADRASA);
  const [classes, setClasses] = useState<MadrasaClass[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherStaff[]>(INITIAL_TEACHERS);
  const [transactions, setTransactions] = useState<CashTransaction[]>(INITIAL_TRANSACTIONS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [hifzRecords, setHifzRecords] = useState<HifzRecord[]>(INITIAL_HIFZ_RECORDS);
  const [meals, setMeals] = useState<BoardingMealRecord[]>(INITIAL_MEALS);
  const [bazarItems, setBazarItems] = useState<DailyBazarItem[]>(INITIAL_BAZAR);
  const [reports, setReports] = useState<StudentReportCard[]>(INITIAL_REPORTS);

  // সিলেকশন স্টেট
  const [selectedClass, setSelectedClass] = useState<MadrasaClass | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // লগইন ও রেজিস্ট্রেশন হ্যান্ডলার
  const handleLoginSuccess = (loggedInMadrasa: MadrasaInfo) => {
    setMadrasa(loggedInMadrasa);
    setIsAuthenticated(true);
    navigateTo("dashboard");
  };

  const handleRegisterSuccess = (registeredMadrasa: MadrasaInfo) => {
    setMadrasa(registeredMadrasa);
    const activeDivs = registeredMadrasa.activeDivisions || (registeredMadrasa.type === "alia" ? ["alia"] : ["noorani", "hifz", "kitab"]);
    const matchingClasses: MadrasaClass[] = PRELOADED_CLASSES.filter(c => activeDivs.includes(c.division)).map(c => ({
      id: c.id,
      name: c.name,
      division: c.division,
      sections: [...c.defaultSections],
      studentCount: 0
    }));
    setClasses(matchingClasses.length > 0 ? matchingClasses : INITIAL_CLASSES);
    setIsAuthenticated(true);
    navigateTo("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigateTo("welcome");
  };

  // ক্লাসের ভেতরে ঢোকা
  const handleOpenClass = (cls: MadrasaClass) => {
    setSelectedClass(cls);
    navigateTo("class_view");
  };

  // ফি আদায়ের রসিদ কাটা হলে স্টেট আপডেট
  const handleFeeCollected = (amount: number, feeType: string, method: string) => {
    if (!selectedStudentForProfile) return;

    // ছাত্রের বকেয়া কমানো
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudentForProfile.id) {
          const newDue = Math.max(0, s.dueAmount - amount);
          return { ...s, dueAmount: newDue };
        }
        return s;
      })
    );

    // কেন্দ্রীয় ক্যাশবুকে আয় পোস্টিং
    const newTx: CashTransaction = {
      id: `tx_${Date.now()}`,
      type: "income",
      category: "ছাত্রদের ফি",
      fundType: "general",
      amount,
      date: new Date().toISOString().split("T")[0],
      description: `${selectedStudentForProfile.name} (${selectedStudentForProfile.className})-এর ফি বাবদ আদায়`,
      receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // নতুন লেনদেন ভাউচার যুক্ত
  const handleAddTransaction = (tx: Omit<CashTransaction, "id">) => {
    const newTx: CashTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // নতুন দান-অনুদান গ্রহণ ও কেন্দ্রীয় আয় হিসেবে পোস্টিং
  const handleAddDonation = (donation: Omit<DonationRecord, "id">) => {
    const newDonation: DonationRecord = {
      ...donation,
      id: `don_${Date.now()}`,
    };
    setDonations((prev) => [newDonation, ...prev]);

    // ক্যাশবুকে অটো পোস্টিং
    const newTx: CashTransaction = {
      id: `tx_${Date.now()}`,
      type: "income",
      category: donation.type === "zakat" ? "যাকাত ও লিল্লাহ" : "সাধারণ দান-সদকা",
      fundType: donation.type === "zakat" || donation.type === "fitra" ? "lillah_zakat" : "general",
      amount: donation.amount,
      date: donation.date,
      description: `${donation.donorName} কর্তৃক অনুদান (${donation.purpose || "দান"})`,
      receiptNumber: donation.receiptNumber,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // নতুন শিক্ষার্থী ভর্তি
  const handleAddNewStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);

    // ভর্তি ফি ক্যাশবুকে পোস্টিং
    const newTx: CashTransaction = {
      id: `tx_${Date.now()}`,
      type: "income",
      category: "ভর্তি ফি",
      fundType: "general",
      amount: 1500,
      date: newStudent.admissionDate,
      description: `${newStudent.name} (${newStudent.className})-এর নতুন ভর্তি ফি`,
      receiptNumber: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // নতুন শিক্ষক যুক্ত
  const handleAddTeacher = (teacher: Omit<TeacherStaff, "id">) => {
    const newTeacher: TeacherStaff = {
      ...teacher,
      id: `tch_${Date.now()}`,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  // হিফজ নতুন সবক এন্ট্রি
  const handleAddHifzRecord = (record: Omit<HifzRecord, "id">) => {
    const newRec: HifzRecord = {
      ...record,
      id: `hfz_${Date.now()}`,
    };
    setHifzRecords((prev) => [newRec, ...prev]);
  };

  // বোর্ডিং মিল অন/অফ আপডেট
  const handleUpdateMeal = (recordId: string, type: "breakfast" | "lunch" | "dinner", val: boolean) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === recordId ? { ...m, [type]: val } : m))
    );
  };

  // মেস বাজার যুক্ত ও কেন্দ্রীয় অ্যাকাউন্টে অটো-পোস্টিং
  const handleAddBazarItem = (item: Omit<DailyBazarItem, "id">) => {
    const newItem: DailyBazarItem = {
      ...item,
      id: `bz_${Date.now()}`,
    };
    setBazarItems((prev) => [newItem, ...prev]);

    // কেন্দ্রীয় ক্যাশবুকে খরচ এন্ট্রি
    const newTx: CashTransaction = {
      id: `tx_${Date.now()}`,
      type: "expense",
      category: "বাজার খরচ",
      fundType: "general",
      amount: item.cost,
      date: item.date,
      description: `মেস বাজার: ${item.item} (${item.quantity}) - ${item.shopperName}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // ক্লাস উস্তাদের নাম ও মোবাইল আপডেট
  const handleUpdateClassTeacher = (classId: string, name: string, phone: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, classTeacherName: name, classTeacherPhone: phone } : c
      )
    );
  };

  // শিক্ষার্থীর অ্যাক্টিভিটি, নোটিশ বা প্রশংসা যুক্ত করা
  const handleAddStudentActivity = (studentId: string, activity: any) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentActs = s.activities || [];
          return {
            ...s,
            activities: [{ ...activity, id: `act_${Date.now()}` }, ...currentActs],
          };
        }
        return s;
      })
    );
  };

  // মাদরাসা ও মুহতামিম প্রোফাইল আপডেট (লোগো সহ)
  const handleUpdateMadrasa = (updated: Partial<MadrasaInfo>) => {
    setMadrasa((prev) => {
      const next = { ...prev, ...updated };
      if (typeof window !== "undefined") {
        try {
          if (updated.logoUrl && updated.logoUrl !== "/logo.png") {
            try {
              localStorage.setItem("madrasha_custom_logo", updated.logoUrl);
            } catch (err) {
              console.warn("Storage quota warning for logo", err);
            }
          } else if (updated.logoUrl === "/logo.png") {
            localStorage.removeItem("madrasha_custom_logo");
          }

          if (updated.muhtamimPhotoUrl) {
            try {
              localStorage.setItem("madrasha_muhtamim_photo", updated.muhtamimPhotoUrl);
            } catch (err) {
              console.warn("Storage quota warning for muhtamim photo", err);
            }
          } else if (updated.muhtamimPhotoUrl === "") {
            localStorage.removeItem("madrasha_muhtamim_photo");
          }

          if (updated.watermarkOpacity !== undefined) {
            localStorage.setItem("madrasha_watermark_opacity", String(updated.watermarkOpacity));
          }

          const infoToSave = {
            name: next.name,
            muhtamimName: next.muhtamimName,
            address: next.address,
            phone: next.phone,
            eiinOrBefaqCode: next.eiinOrBefaqCode,
          };
          localStorage.setItem("madrasha_custom_info", JSON.stringify(infoToSave));
        } catch (e) {
          console.error("Failed to save madrasa info to localStorage", e);
        }
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* গ্লোবাল নেভবার: ড্যাশবোর্ড ছাড়া অন্যান্য পেজে রেন্ডার হবে */}
      {currentView !== "dashboard" && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === "home") {
              if (isAuthenticated) navigateTo("dashboard");
              else navigateTo("welcome");
            } else if (view === "super_admin") {
              navigateTo("super_admin");
            }
          }}
          onGoBack={handleGoBack}
          canGoBack={currentView !== "welcome"}
          madrasaName={isAuthenticated && currentView !== "welcome" ? madrasa.name : undefined}
          madrasaLogo={isAuthenticated && currentView !== "welcome" ? madrasa.logoUrl : undefined}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      )}

      <main className="flex-1">
        {/* ভিউ ১: অ্যানিমেটেড ওয়েলকাম, রেজিস্ট্রেশন ও লগইন স্ক্রিন */}
        {(!isAuthenticated || currentView === "welcome") && (
          <WelcomeAuthModal
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
            initialMadrasa={madrasa}
          />
        )}

        {/* ভিউ ২: সাহাদাত ভাইয়ের মূল ৫টি স্তম্ভ ড্যাশবোর্ড */}
        {isAuthenticated && currentView === "dashboard" && (
          <MainDashboard
            language={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            madrasa={madrasa}
            onUpdateMadrasa={handleUpdateMadrasa}
            classes={classes}
            students={students}
            teachers={teachers}
            transactions={transactions}
            donations={donations}
            hifzRecords={hifzRecords}
            meals={meals}
            bazarItems={bazarItems}
            onOpenClass={handleOpenClass}
            onOpenScanner={() => setShowScannerModal(true)}
            onOpenStudentProfile={(s) => setSelectedStudentForProfile(s)}
            onAddNewStudent={handleAddNewStudent}
            onAddTransaction={handleAddTransaction}
            onAddTeacher={handleAddTeacher}
            onAddDonation={handleAddDonation}
            onAddHifzRecord={handleAddHifzRecord}
            onUpdateMeal={handleUpdateMeal}
            onAddBazarItem={handleAddBazarItem}
            onAddStudentActivity={handleAddStudentActivity}
            onLogout={handleLogout}
          />
        )}

        {/* ভিউ ৩: ক্লাসের ভেতরের চিত্র (হাজিরা ও ছাত্র তালিকা) */}
        {isAuthenticated && currentView === "class_view" && selectedClass && (
          <ClassView
            classItem={selectedClass}
            students={students}
            onBack={handleGoBack}
            onOpenStudentProfile={(s) => setSelectedStudentForProfile(s)}
            onCollectFee={(s) => setSelectedStudentForProfile(s)}
            onAddNewStudent={() => {}}
            onUpdateTeacher={handleUpdateClassTeacher}
            onAddStudentActivity={handleAddStudentActivity}
          />
        )}

        {/* ভিউ ৪: সেন্ট্রাল সুপার-অ্যাডমিন অডিট কন্ট্রোল */}
        {currentView === "super_admin" && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">সেন্ট্রাল প্ল্যাটফর্ম অডিট কন্ট্রোল</h2>
                <p className="text-xs text-slate-500">মাদরাসা ম্যানেজমেন্ট সিস্টেম মনিটরিং</p>
              </div>
              <button
                onClick={handleGoBack}
                className="text-xs font-bold px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg"
              >
                ← ফিরে যান
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500">সক্রিয় প্রতিষ্ঠান</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">{madrasa.name}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500">মোট শিক্ষার্থী</span>
                <p className="text-2xl font-black text-blue-700 mt-1">{students.length} জন</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500">মোট উস্তাদ ও স্টাফ</span>
                <p className="text-2xl font-black text-purple-700 mt-1">{teachers.length} জন</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* স্টুডেন্ট প্রোফাইল, বারকোড আইডি কার্ড ও মানি রিসিট মডাল */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          madrasa={madrasa}
          onClose={() => setSelectedStudentForProfile(null)}
          onFeeCollected={handleFeeCollected}
          onAddActivity={handleAddStudentActivity}
        />
      )}

      {/* বারকোড ও কিউআর স্ক্যানার মডাল */}
      {showScannerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
              <QrCode className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">স্মার্ট বারকোড ও কিউআর স্ক্যানার</h3>
              <p className="text-xs text-slate-500 mt-1">
                ছাত্রের আইডি কার্ডের বারকোড বা কিউআর কোড স্ক্যান করুন।
              </p>
            </div>

            <div className="h-44 bg-slate-900 rounded-2xl border-2 border-dashed border-emerald-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="w-full h-1 bg-emerald-500 animate-pulse absolute top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500"></div>
              <span className="text-xs text-slate-300 font-mono mt-10">ক্যামেরা সক্রিয়...</span>
            </div>

            <button
              onClick={() => {
                setShowScannerModal(false);
                setSelectedStudentForProfile(students[0]);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              [ আব্দুল্লাহর আইডি কার্ড স্ক্যান সম্পন্ন ]
            </button>

            <button
              onClick={() => setShowScannerModal(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
