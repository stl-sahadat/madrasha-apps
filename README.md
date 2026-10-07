# 🕌 Madrasa Management & Automation ERP Web Application

> **Repository:** [https://github.com/stl-sahadat/madrasha-apps](https://github.com/stl-sahadat/madrasha-apps)  
> **Project Name:** Madrasa Management & Automation ERP System  
> **Founder & Lead Architect:** [Md Sahadat Hossain](https://github.com/stl-sahadat)  
> **Brand & Channel:** [YouTube @SahadatAutomation](https://youtube.com/@SahadatAutomation)  
> **Design Framework:** Islamic Emerald & Gold Premium Theme (Tailwind CSS, Lucide Icons, UI/UX Pro Max)  
> **Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, QR Code Generator, Prisma ORM ready

---

## 📌 ১. ওভারভিউ (Project Overview)

**Madrasa Management & Automation ERP** হলো বাংলাদেশের কওমি ও আলিয়া মাদরাসা, হেফজখানা, এতিমখানা এবং দ্বীনি শিক্ষাপ্রতিষ্ঠানসমূহের জন্য তৈরি একটি পূর্ণাঙ্গ, আধুনিক এবং উচ্চ-ক্ষমতাসম্পন্ন ক্লাউড-রেডি ওয়েব অ্যাপ্লিকেশন। 

প্রথাগত খাতা-কলমে হিসাব ও রেজিস্টার ব্যবস্থাপনার পরিবর্তে একটি একক প্ল্যাটফর্মে শিক্ষার্থী ভর্তি, হিফজ ডায়েরি (সবক, সাতসবক, আমুখতা), লাইভ হাজিরা, ডিজিটাল আইডি কার্ড (QR Code সহ), পরীক্ষা ও ফলাফল মেধা তালিকা, শিক্ষক ও মুহতামিম ডিরেক্টরি, অভিভাবক পোর্টাল, বোর্ডিং-মেস ও বাজার খরচ, জাকাত-দান অনুদান এবং স্বয়ংক্রিয় অডিট রিপোর্ট পরিচালনা করার জন্য এই ইআরপি সিস্টেমটি ডিজাইন করা হয়েছে।

যেকোনো নতুন ডেভেলপার যেন কোডবেজটি খুব দ্রুত বুঝে নিজের প্রয়োজনমতো কাস্টমাইজ, মডিউল সংযোজন কিংবা ডেটাবেজ ইন্টিগ্রেশন করতে পারেন, সেই লক্ষ্যে নিচে প্রজেক্টের সম্পূর্ণ স্থাপত্য (Architecture), ডিরেক্টরি স্ট্রাকচার এবং গাইডলাইন বিস্তারিত তুলে ধরা হলো।

---

## 🏗️ ২. প্রজেক্ট ডিরেক্টরি স্ট্রাকচার (Folder & File Structure)

```text
madrasha-apps/
├── .gitignore                     # Git ignore rules (node_modules, .next, env ইত্যাদি)
├── package.json                   # Dependencies, Scripts ও প্রজেক্ট কনফিগারেশন
├── tsconfig.json                  # TypeScript Compiler কনফিগারেশন
├── tailwind.config.ts             # Tailwind CSS থিম ও কালার টোকেন
├── postcss.config.mjs             # PostCSS প্লাগইন সেটিংস
├── next.config.mjs                # Next.js ইঞ্জিন কনফিগারেশন
├── README.md                      # পূর্ণাঙ্গ সিস্টেম আর্কিটেকচার ও ডেভেলপার গাইড (এই ফাইলটি)
├── public/                        # স্ট্যাটিক অ্যাসেটস ও ইমেজ
├── prisma/
│   └── schema.prisma              # ডাটাবেজ স্কিমা মডেল (SQLite / PostgreSQL ready)
└── src/
    ├── app/                       # Next.js 14 App Router
    │   ├── globals.css            # গ্লোবাল সিএসএস ও শাদসিএন ভ্যারিয়েবলস
    │   ├── layout.tsx             # রুট লেআউট (Font setup, Meta tags, Providers)
    │   ├── page.tsx               # মূল এন্ট্রি পয়েন্ট এবং সিঙ্গেল-পেজ মডিউল রাউটিং হাব
    │   └── font-preview/          # বাংলা ও ইসলামিক ফন্ট প্রিভিউ পেজ
    ├── lib/                       # হেল্পার ইউটিলিটিস ও স্টেট স্টোর
    │   ├── store.ts               # ইন-মেমোরি ও লোকালস্টোরেজ সেন্ট্রাল স্টেট হাব (Store Context)
    │   ├── preloadedClasses.ts    # প্রিলোডেড জামাত ও ক্লাস কনফিগারেশন (নুরানি, হিফজ, কিতাব বিভাগ)
    │   ├── translations.ts        # বহুভাষিক অনুবাদ ডিকশনারি (বাংলা ও ইংরেজি)
    │   └── dateUtils.ts           # হিজরি ক্যালেন্ডার, বাংলা ও গ্রেগরিয়ান তারিখ কনভার্টার
    ├── types/
    │   └── index.ts               # টাইপস্ক্রিপ্ট টাইপস ও ইন্টারফেস ডেফিনিশন (Student, Teacher, Fee etc.)
    └── components/                # মডুলার কম্পোনেন্ট আর্কিটেকচার
        ├── layout/
        │   └── Navbar.tsx         # গ্লোবাল হেডার, প্রোফাইল ড্রপডাউন (মাদরাসা/ব্যক্তিগত), সার্চ বার
        ├── home/
        │   └── LandingHero.tsx    # হোম হিরো সেকশন, কুইক লিংকস ও স্ট্যাটিস্টিক কার্ডস
        ├── dashboard/
        │   └── MainDashboard.tsx  # এক্সিকিউটিভ ড্যাশবোর্ড (KPIs, রেভিনিউ চার্ট, সাম্প্রতিক অ্যাক্টিভিটি)
        ├── students/
        │   ├── StudentsActivitiesHub.tsx  # শিক্ষার্থী তালিকা ও সার্বিক কার্যক্রম হাব
        │   ├── StudentRegistersView.tsx   # শিক্ষার্থী রেজিস্টার ও ক্লাস ফিল্টারিং ভিউ
        │   └── StudentProfileModal.tsx    # শিক্ষার্থীর বিস্তারিত প্রোফাইল মডাল ও হিস্ট্রি
        ├── admissions/
        │   └── AdmissionsView.tsx         # নতুন ছাত্র ভর্তি ফরম, রক্তের গ্রুপ, অভিভাবকের তথ্য
        ├── hifz/
        │   └── HifzDiaryView.tsx          # হিফজ দৈনিক ট্র্যাকার (সবক, সাতসবক, আমুখতা, পারা ও পৃষ্ঠা)
        ├── attendance/
        │   └── AttendanceHubView.tsx      # শিক্ষার্থী ও শিক্ষকদের ডিজিটাল বায়োমেট্রিক/ম্যানুয়াল হাজিরা
        ├── exams/
        │   ├── ExamsHubView.tsx           # পরীক্ষার মার্কশিট এন্ট্রি, গ্রেডিং ও মেধা তালিকা
        │   └── ExamReportView.tsx         # প্রিন্ট-রেডি পরীক্ষার রেজাল্ট কার্ড ও ট্রান্সক্রিপ্ট
        ├── idcard/
        │   └── IdCardGeneratorView.tsx    # ইনস্ট্যান্ট প্রিন্টেবল স্টুডেন্ট আইডি কার্ড (QR Code সহ)
        ├── accounts/
        │   └── AccountsView.tsx           # বেতন-ফি কালেকশন, দৈনিক আয়-ব্যয় ভাউচার ও রসিদ
        ├── boarding/
        │   └── BoardingMessView.tsx       # ছাত্রাবাস/বোর্ডিং মিল হিসাব, ডাইনিং ফি ও সিট বণ্টন
        ├── bazar/
        │   └── BazarManagementView.tsx    # বাবুর্চি ও দৈনিক বাজার খরচ ভাউচার এন্ট্রি
        ├── donations/
        │   ├── ZakatDonationsView.tsx     # জাকাত ও সাধারণ দান কালেকশন ট্র্যাকার
        │   └── MonthlyContributorsView.tsx# মাসিক আজীবন দাতা ও ডোনার রেজিস্টার
        ├── committee/
        │   └── CommitteeMembersView.tsx   # শুরা কমিটি, গভর্নিং বডি ও মেম্বার পোর্টাল
        ├── teachers/
        │   └── TeacherDirectory.tsx       # উস্তাদ ও স্টাফ ডিরেক্টরি, পদবী ও বেতন স্কেল
        ├── guardian/
        │   └── GuardianPortal.tsx         # অভিভাবকদের জন্য ডেডিকেটেড নোটিশ ও প্রগ্রেস ভিউ
        ├── sms/
        │   └── SmsPortalView.tsx          # বাল্ক এসএমএস পোর্টাল (বকেয়া ফি, ছুটির নোটিশ, রেজাল্ট এলার্ট)
        ├── reports/
        │   └── DailyAuditReportView.tsx   # দৈনিক অডিট ও সমন্বিত ক্যাশ-ফ্লো রিপোর্ট
        ├── settings/
        │   └── SettingsView.tsx           # মাদরাসা সেটিংস, লোগো ও মুহতামিম প্রোফাইল নিয়ন্ত্রণ
        ├── registration/
        │   └── RegisterWizard.tsx         # মাল্টি-স্টেপ প্রতিষ্ঠান রেজিস্ট্রেশন উইজার্ড
        ├── classes/
        │   └── ClassView.tsx              # বিভাগ, জামাত ও সেকশন ম্যানেজমেন্ট
        └── auth/
            └── WelcomeAuthModal.tsx       # রোল-বেসড সিকিউর অথেন্টিকেশন মডাল
```

---

## 🎨 ৩. ডিজাইন আর্কিটেকচার (Design System & Theming)

মাদরাসার ভাবগাম্ভীর্য ও আধুনিক প্রযুক্তির মেলবন্ধনে একটি প্রিমিয়াম **Islamic Emerald Green & Royal Gold Theme** অনুসরণ করা হয়েছে:

### ক. কালার প্যালেট (Color Tokens):
* **প্রাইমারি পান্না সবুজ (Emerald Primary):** `#065f46` (Tailwind `emerald-800`), `#047857` (Tailwind `emerald-700`) — মূল অ্যাকশন, সাইডবার, হেডার ও ব্র্যান্ডিং।
* **সেকেন্ডারি রয়েল গোল্ড (Royal Amber/Gold):** `#d97706` (Tailwind `amber-600`), `#f59e0b` (Tailwind `amber-500`) — ব্যাজ, গোল্ডেন হাইলাইট, মেধা তালিকা ও আইকন অ্যাকসেন্ট।
* **সারফেস ও কার্ড ব্যাকগ্রাউন্ড:** `#f8fafc` (Slate 50), `#ffffff` (White Card), `#f0fdf4` (Emerald Tint Soft)।
* **হাই-কন্ট্রাস্ট টেক্সট:** `#0f172a` (Slate 900), `#334155` (Slate 700), `#64748b` (Slate 500)।

### খ. টাইপোগ্রাফি (Typography):
* **বাংলা ফন্ট:** `Hind Siliguri` ও `Noto Sans Bengali` — চমৎকার সুস্পষ্ট পঠনযোগ্যতা।
* **ইংরেজি ও নিউমেরিক ফন্ট:** `Inter`, `Geist Sans` — আধুনিক এবং পরিষ্কার ডেটা গ্রিড ও টেবিল ডিসপ্লে।

### গ. আইকনোগ্রাফি:
* সম্পূর্ণ প্রজেক্টে হালকা এবং প্রফেশনাল ভেক্টর আইকনের জন্য `lucide-react` লাইব্রেরি ব্যবহার করা হয়েছে (বই, কলম, কুরআন, ক্যালেন্ডার, ইউজার, প্রিন্টার ইত্যাদি)।

---

## ⚙️ ৪. মূল মডিউল ও কার্যপদ্ধতি (Core Functional Modules)

| মডিউল | ফাইলের অবস্থান | প্রধান কার্যাবলী |
| :--- | :--- | :--- |
| **১. মূল ড্যাশবোর্ড** | `src/components/dashboard/MainDashboard.tsx` | মোট শিক্ষার্থী, শিক্ষক, আজকের মোট আয়-ব্যয়, উপস্থিতির শতাংশ ও জরুরি নোটিশ। |
| **২. হিফজ ডায়েরি** | `src/components/hifz/HifzDiaryView.tsx` | প্রতিদিনের সবক (নতুন পাঠ), সাতসবক (সাম্প্রতিক পারা), ও আমুখতা (পূর্ববর্তী মুখস্থ) ট্র্যাকিং। |
| **৩. ডিজিটাল আইডি কার্ড** | `src/components/idcard/IdCardGeneratorView.tsx` | প্রতিটি ছাত্রের রোল, বিভাগ, রক্তের গ্রুপ ও ইউনিক কিউআর কোড সহ অটো প্রিন্টেবল আইডি কার্ড। |
| **৪. ডিজিটাল হাজিরা** | `src/components/attendance/AttendanceHubView.tsx` | ক্লাস ও সেকশন অনুযায়ী তাৎক্ষণিক উপস্থিতি, অনুপস্থিতি ও ছুটি মার্কিং। |
| **৫. পরীক্ষা ও ফলাফল** | `src/components/exams/ExamsHubView.tsx` | ১ম সাময়িক, ২য় সাময়িক ও বার্ষিক পরীক্ষার নম্বর এন্ট্রি, জিপিএ/মাকাম ক্যালকুলেশন ও রেজাল্ট শিট। |
| **৬. হিসাব ও অডিট** | `src/components/accounts/AccountsView.tsx` | মাসিক বেতন কালেকশন, মানি রসিদ প্রিন্ট, ক্যাশবুক এবং দৈনিক অডিট সামারি। |
| **৭. মেস ও বাজার** | `src/components/boarding/`, `src/components/bazar/` | বোর্ডিং মিল ব্যবস্থাপনা, ছাত্রাবাস খাদ্য হিসাব এবং বাবুর্চির বাজার খরচ ভাউচার। |
| **৮. জাকাত ও দাতা তহবিল** | `src/components/donations/` | লিল্লাহ বোর্ডিংয়ের জাকাত কালেকশন, আজীবন দাতা তালিকা ও ব্যাংক ডিপোজিট রেকর্ড। |
| **৯. সেটিংস ও প্রোফাইল** | `src/components/settings/SettingsView.tsx` | প্রতিষ্ঠান প্রোফাইল (মাদরাসা নাম, লোগো, ঠিকানা) এবং মুহতামিম ব্যক্তিগত প্রোফাইল পৃথক ব্যবস্থাপনা। |

---

## 🚀 ৫. লোকাল ডেভেলপমেন্ট সেটআপ (Getting Started)

যেকোনো ডেভেলপার খুব সহজেই নিজের পিসিতে প্রজেক্টটি রান করতে পারেন:

### রিকোয়ারমেন্টস:
- Node.js version 18.17.0 বা তার পরবর্তী সংস্করণ।
- Git ইনস্টল করা থাকতে হবে।
- প্যাকেজ ম্যানেজার: `npm`, `yarn` অথবা `pnpm`।

### ধাপসমূহ:

1. **রিপোজিটরি ক্লোন করুন:**
   ```bash
   git clone https://github.com/stl-sahadat/madrasha-apps.git
   cd madrasha-apps
   ```

2. **ডিপেন্ডেন্সি ইনস্টল করুন:**
   ```bash
   npm install
   ```

3. **ডেভেলপমেন্ট সার্ভার চালু করুন:**
   ```bash
   npm run dev
   ```

4. **ব্রাউজারে ওপেন করুন:**
   ব্রাউজারে গিয়ে [http://localhost:3000](http://localhost:3000) ভিজিট করলেই সম্পূর্ণ অ্যাপটি লাইভ দেখতে পাবেন!

5. **প্রোডাকশন বিল্ড তৈরি করুন:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🛠️ ৬. ডেভেলপার গাইড ও কাস্টমাইজেশন (Developer Guide)

### ১. নতুন কোনো মডিউল বা পেজ যোগ করতে চাইলে:
1. `src/components/` ফোল্ডারের ভেতর আপনার নতুন মডিউলের জন্য একটি কম্পোনেন্ট ফাইল তৈরি করুন (যেমন `src/components/library/LibraryManagement.tsx`)।
2. `src/types/index.ts`-এ প্রয়োজনীয় টাইপ ও ইন্টারফেস ডিফাইন করুন।
3. `src/app/page.tsx`-এ আপনার নতুন মডিউলটি ইমপোর্ট করে ট্যাব অথবা নেভিগেশন স্টেট অনুযায়ী রেন্ডার করুন।

### ২. প্রতিষ্ঠান এবং মুহতামিম প্রোফাইল কাস্টমাইজেশন:
- সেটিংস প্যানেল থেকে যেকোনো সময় মাদরাসার অফিশিয়াল নাম, লোগো, ফোন এবং মুহতামিম সাহেবের ছবি ও ব্যক্তিগত বিবরণ আলাদাভাবে আপডেট করা যায়।
- স্টেট ডাটা স্টোর রয়েছে `src/lib/store.ts`-এ, যা লোকালস্টোরেজ বা পরবর্তীতে রিমোট ব্যাকএন্ড এপিআই-এর সাথে প্লাগ-অ্যান্ড-প্লে পদ্ধতিতে কাজ করতে সক্ষম।

---

## 👨‍💻 অবদান ও ক্রেডিট (Author & Credits)

- **স্থপতি ও ডেভেলপার:** **Md Sahadat Hossain**
- **GitHub:** [@stl-sahadat](https://github.com/stl-sahadat)
- **YouTube:** [@SahadatAutomation](https://youtube.com/@SahadatAutomation)
- **ইমেইল:** `stdrsahadat@gmail.com`

---

## 📄 লাইসেন্স (License)

এই প্রজেক্টটি সর্বসাধারণের কল্যাণ এবং দ্বীনি শিক্ষাপ্রতিষ্ঠানের আধুনিক অটোমেশনের উদ্দেশ্যে নির্মিত। সর্বস্বত্ব সংরক্ষিত © ২০২৫-২০২৬ **Md Sahadat Hossain**।
