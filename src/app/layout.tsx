import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "মাদ্রাসা ম্যানেজমেন্ট",
  description: "বাংলাদেশের কওমি ও আলিয়া মাদ্রাসার জন্য একটি সমন্বিত, সহজ ও পূর্ণাঙ্গ ডিজিটাল ক্যাম্পাস প্ল্যাটফর্ম।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
