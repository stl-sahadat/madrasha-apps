"use client";

import React, { useState } from "react";
import { 
  Users2, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  ArrowLeft,
  X,
  CheckCircle2,
  Phone,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { MadrasaInfo, CommitteeMember } from "@/types";

interface CommitteeMembersViewProps {
  madrasa: MadrasaInfo;
  onBack: () => void;
}

const INITIAL_MEMBERS: CommitteeMember[] = [
  {
    id: "com_1",
    name: "আলহাজ্ব মাওলানা মোঃ রফিকুল ইসলাম",
    phone: "01711000111",
    address: "চকবাজার, ঢাকা",
    designation: "সভাপতি (ম্যানেজিং কমিটি)",
    joiningDate: "2024-01-01"
  },
  {
    id: "com_2",
    name: "হাজী মোহাম্মদ ইউনুস আলী",
    phone: "01812000222",
    address: "লালবাগ, ঢাকা",
    designation: "সহ-সভাপতি",
    joiningDate: "2024-01-01"
  },
  {
    id: "com_3",
    name: "মুফতি আব্দুর রহমান কাসেমী",
    phone: "01913000333",
    address: "মিরপুর, ঢাকা",
    designation: "সাধারণ সম্পাদক",
    joiningDate: "2024-01-01"
  },
  {
    id: "com_4",
    name: "মোঃ দেলোয়ার হোসেন",
    phone: "01714000444",
    address: "কামরাঙ্গীরচর, ঢাকা",
    designation: "অর্থ সম্পাদক / কোষাধ্যক্ষ",
    joiningDate: "2024-01-01"
  },
  {
    id: "com_5",
    name: "মাওলানা ক্বারী নুরুল হক",
    phone: "01615000555",
    address: "কেরানীগঞ্জ, ঢাকা",
    designation: "সদস্য (শুরা কমিটি)",
    joiningDate: "2024-01-01"
  }
];

export const CommitteeMembersView: React.FC<CommitteeMembersViewProps> = ({
  madrasa,
  onBack
}) => {
  const [members, setMembers] = useState<CommitteeMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    address: "",
    designation: ""
  });
  const [successMsg, setSuccessMsg] = useState(false);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.phone.includes(searchQuery) ||
    m.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;
    const added: CommitteeMember = {
      id: `com_${Date.now()}`,
      name: newMember.name,
      phone: newMember.phone,
      address: newMember.address,
      designation: newMember.designation || "সম্মানিত সদস্য",
      joiningDate: new Date().toISOString().split("T")[0]
    };
    setMembers(prev => [added, ...prev]);
    setShowAddModal(false);
    setNewMember({ name: "", phone: "", address: "", designation: "" });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleDelete = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

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
              <Users2 className="w-6 h-6 text-purple-600" />
              <span>পরিচালনা ও শুরা কমিটির সদস্যগণ</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              মাদ্রাসার সম্মানিত পরিচালনা পরিষদ, উপদেষ্টা ও কার্যকরী কমিটির তালিকা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ কমিটির সদস্য যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>কমিটির নতুন সদস্য সফলভাবে যুক্ত করা হয়েছে।</span>
        </div>
      )}

      {/* সার্চ ও ফিল্টার */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="সদস্যের নাম, পদবি বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* তালিকা টেবিল (প্রিন্ট ফরম্যাট) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">{madrasa.name}</h2>
          <p className="text-xs text-slate-500 font-medium">{madrasa.address} • ফোন: {madrasa.phone}</p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-black uppercase tracking-wider border border-purple-200">
              মাদ্রাসা পরিচালনা কমিটির সদস্য তালিকা
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white text-[11px] font-black uppercase">
                <th className="py-3 px-4 w-12 text-center">নং</th>
                <th className="py-3 px-4">কমিটির সদস্যের নাম</th>
                <th className="py-3 px-4">সদস্য পদবি</th>
                <th className="py-3 px-4">মোবাইল নম্বর</th>
                <th className="py-3 px-4">ঠিকানা</th>
                <th className="py-3 px-4 text-center no-print">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMembers.map((m, idx) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-purple-700">{m.designation}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{m.phone}</td>
                  <td className="py-3 px-4 text-slate-600">{m.address}</td>
                  <td className="py-3 px-4 text-center no-print">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
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

        <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="text-center border-t border-slate-400 pt-2 w-44">
            সাধারণ সম্পাদকের স্বাক্ষর
          </div>
          <div className="text-center border-t border-slate-400 pt-2 w-44">
            সভাপতির স্বাক্ষর ও সীল
          </div>
        </div>
      </div>

      {/* নতুন সদস্য যুক্ত করার মডাল (স্ক্রিনশট ৩৮ অনুরূপ) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-purple-600" />
                <span>কমিটির সদস্য যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1.5">কমিটির সদস্যের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="কমিটির সদস্যের নাম লিখুন..."
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1.5">কমিটির সদস্যের মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="কমিটির সদস্যের মোবাইল নম্বর লিখুন..."
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1.5">কমিটির সদস্যের ঠিকানা *</label>
                <input
                  type="text"
                  required
                  placeholder="কমিটির সদস্যের ঠিকানা লিখুন..."
                  value={newMember.address}
                  onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1.5">সদস্য পদবি</label>
                <input
                  type="text"
                  placeholder="সদস্য পদবি লিখুন (যেমন: সভাপতি, সাধারণ সম্পাদক, সদস্য)..."
                  value={newMember.designation}
                  onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
