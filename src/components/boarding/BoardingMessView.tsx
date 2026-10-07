"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  CheckCircle2, 
  Calendar,
  Layers,
  Receipt
} from "lucide-react";
import { BoardingMealRecord, DailyBazarItem, Student } from "@/types";

interface BoardingMessViewProps {
  meals: BoardingMealRecord[];
  bazarItems: DailyBazarItem[];
  students: Student[];
  onBack: () => void;
  onUpdateMeal: (recordId: string, type: "breakfast" | "lunch" | "dinner", val: boolean) => void;
  onAddBazarItem: (item: Omit<DailyBazarItem, "id">) => void;
}

export const BoardingMessView: React.FC<BoardingMessViewProps> = ({
  meals,
  bazarItems,
  students,
  onBack,
  onUpdateMeal,
  onAddBazarItem,
}) => {
  const [activeTab, setActiveTab] = useState<"meals" | "bazar" | "audit">("meals");
  const [showAddBazarModal, setShowAddBazarModal] = useState(false);

  // বাজার ফর্ম স্টেট
  const [bazarItemName, setBazarItemName] = useState("");
  const [bazarQty, setBazarQty] = useState("");
  const [bazarCost, setBazarCost] = useState<number>(1000);
  const [shopperName, setShopperName] = useState("মাওলানা ইমরান হুসাইন");

  // মোট মিল গণনা
  const totalBreakfast = meals.filter(m => m.breakfast).length;
  const totalLunch = meals.filter(m => m.lunch).length;
  const totalDinner = meals.filter(m => m.dinner).length;
  const totalGuestMeals = meals.reduce((acc, m) => acc + (m.guestMeals || 0), 0);
  const totalMealsCount = totalBreakfast + totalLunch + totalDinner + totalGuestMeals;

  // মোট বাজার খরচ
  const totalBazarCost = bazarItems.reduce((acc, b) => acc + b.cost, 0);

  // মিল রেট (মোট খরচ ÷ মোট মিল)
  const mealRate = totalMealsCount > 0 ? (totalBazarCost / totalMealsCount).toFixed(1) : "৪৫.০";

  const handleBazarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bazarItemName || !bazarCost) return;
    onAddBazarItem({
      date: new Date().toISOString().split("T")[0],
      item: bazarItemName,
      quantity: bazarQty || "প্রয়োজনীয় পরিমাণ",
      cost: bazarCost,
      shopperName,
    });
    setShowAddBazarModal(false);
    setBazarItemName("");
    setBazarQty("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>← ড্যাশবোর্ডে ফিরুন</span>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-amber-600" />
              <span>বোর্ডিং ও মেস ম্যানেজমেন্ট</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              আবাসিক ছাত্র ও মেহমানদের মিল ট্র্যাকিং, বাজার খরচ ও মিল রেট হিসাব
            </p>
          </div>
        </div>

        {/* ট্যাব সুইচ বাটন */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("meals")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "meals" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🍽️ আজকের মিল
          </button>
          <button
            onClick={() => setActiveTab("bazar")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "bazar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛒 দৈনিক বাজার
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "audit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📊 মিল রেট হিসাব
          </button>
        </div>
      </div>

      {/* ৪টি পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">আজকের মোট মিল</span>
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalMealsCount} টি মিল</p>
          <p className="text-[11px] text-slate-500 mt-1">
            সকাল: {totalBreakfast} | দুপুর: {totalLunch} | রাত: {totalDinner}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">চলতি মাসের বাজার</span>
            <ShoppingCart className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700">৳ {totalBazarCost.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">মোট ভাউচার: {bazarItems.length} টি</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">গড় মিল রেট</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700">৳ {mealRate} <span className="text-xs font-bold">/মিল</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">পরিমিত ও সাশ্রয়ী বাজেট</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">মেহমান মিল</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700">{totalGuestMeals} টি</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">লিল্লাহ/মেহমান ফান্ডভুক্ত</p>
        </div>
      </div>

      {/* ট্যাব ১: আজকের মিল ট্র্যাকার */}
      {activeTab === "meals" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">আবাসিক ছাত্রদের দৈনন্দিন মিল ট্র্যাকিং</h3>
              <p className="text-xs text-slate-500">মিল অন/অফ করতে টিক চিহ্নে ক্লিক করুন (স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়)</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg self-start">
              আজকের তারিখ: {new Date().toISOString().split("T")[0]}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-700">
                  <th className="py-3.5 px-4 text-center">রোল</th>
                  <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3.5 px-4">জামাত</th>
                  <th className="py-3.5 px-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-600" />
                      <span>সকাল (নাস্তা)</span>
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-orange-500" />
                      <span>দুপুর (ভাত)</span>
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>রাত (ভাত)</span>
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-center">মোট মিল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {meals.map((m) => {
                  const studentDayMeals = (m.breakfast ? 1 : 0) + (m.lunch ? 1 : 0) + (m.dinner ? 1 : 0);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{m.roll}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{m.studentName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{m.className}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onUpdateMeal(m.id, "breakfast", !m.breakfast)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs inline-flex items-center justify-center transition-all ${
                            m.breakfast ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {m.breakfast ? "✓" : "✕"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onUpdateMeal(m.id, "lunch", !m.lunch)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs inline-flex items-center justify-center transition-all ${
                            m.lunch ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {m.lunch ? "✓" : "✕"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onUpdateMeal(m.id, "dinner", !m.dinner)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs inline-flex items-center justify-center transition-all ${
                            m.dinner ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {m.dinner ? "✓" : "✕"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {studentDayMeals} টি মিল
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ট্যাব ২: দৈনিক বাজার ভাউচার */}
      {activeTab === "bazar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">বোর্ডিং বাজার খরচের তালিকা</h3>
            <button
              onClick={() => setShowAddBazarModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বাজার খরচ যুক্ত করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-700">
                  <th className="py-3.5 px-4">তারিখ</th>
                  <th className="py-3.5 px-4">পণ্যের বিবরণ / আইটেম</th>
                  <th className="py-3.5 px-4">পরিমাণ</th>
                  <th className="py-3.5 px-4">বাজারকারী ব্যক্তি</th>
                  <th className="py-3.5 px-4 text-right">খরচ (টাকা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {bazarItems.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{b.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{b.item}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-600">{b.shopperName}</td>
                    <td className="py-3.5 px-4 text-right font-black text-red-600">
                      - ৳ {b.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ট্যাব ৩: মিল রেট ও অডিট */}
      {activeTab === "audit" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              📐 স্বয়ংক্রিয় মিল রেট ফর্মুলা
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">মোট মেস বাজার খরচ:</span>
                <b className="text-slate-900">৳ {totalBazarCost.toLocaleString()}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">মোট খাওয়ার মিল সংখ্যা:</span>
                <b className="text-slate-900">{totalMealsCount} টি</b>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-emerald-800">
                <span>বর্তমান মিল রেট:</span>
                <span>৳ {mealRate} /মিল</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              * বাজার খরচের সাথে মিল গণনা মিলিয়ে প্রতি মাসের শেষে ছাত্রদের বোর্ডিং ফি সমন্বয় করা হয়।
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              🕌 মেহমান ও আসাতায়ে কেরামের মিল সমন্বয়
            </h4>
            <div className="p-4 bg-purple-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-900">আজকের মেহমান মিল:</span>
                <b className="text-purple-900">{totalGuestMeals} টি</b>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-900">মেহমান মিল বাবদ খরচ:</span>
                <b className="text-purple-900">৳ {(totalGuestMeals * parseFloat(mealRate)).toFixed(0)}</b>
              </div>
              <p className="text-[11px] text-purple-700 pt-1">
                মেহমান মিলের খরচ সরাসরি সাধারণ তহবিল অথবা মেহমানদারি খাত থেকে নির্বাহ করা হয়।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* নতুন বাজার ভাউচার মডাল */}
      {showAddBazarModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-600" />
                <span>দৈনিক মেস বাজার এন্ট্রি</span>
              </h3>
              <button
                onClick={() => setShowAddBazarModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                ✕ বন্ধ
              </button>
            </div>

            <form onSubmit={handleBazarSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বাজারের পণ্যের নাম *</label>
                <input
                  type="text"
                  required
                  value={bazarItemName}
                  onChange={(e) => setBazarItemName(e.target.value)}
                  placeholder="যেমন: মিনিকেট চাল, ডাল ও রুই মাছ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পরিমাণ ও ওজন</label>
                  <input
                    type="text"
                    value={bazarQty}
                    onChange={(e) => setBazarQty(e.target.value)}
                    placeholder="যেমন: ২৫ কেজি, ৫ লিটার"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোট খরচ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={bazarCost}
                    onChange={(e) => setBazarCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-amber-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">যিনি বাজার করেছেন</label>
                <input
                  type="text"
                  value={shopperName}
                  onChange={(e) => setShopperName(e.target.value)}
                  placeholder="যেমন: হাফেজ মাওলানা জুবায়ের"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 transition-all"
              >
                বাজার ভাউচার যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
