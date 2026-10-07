/**
 * তারিখ ফরম্যাটিং ইউটিলিটি ফাংশনসমূহ (দিন/মাস/বছর - DD/MM/YYYY ফরম্যাট)
 */

export const getTodayDMY = (): string => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateToDMY = (dateStr: string | undefined | null): string => {
  if (!dateStr) return "";
  const clean = dateStr.trim();
  if (!clean) return "";

  // যদি ইতোমধ্যেই দিন/মাস/বছর (যেমন: 01/10/2026 বা ০১/১০/২০২৬) ফরম্যাটে থাকে
  if (clean.includes("/") && clean.split("/").length === 3) {
    const parts = clean.split("/");
    if (parts[0].length <= 2 && parts[2].length === 4) {
      return clean;
    }
  }

  // বাংলা সংখ্যা চিহ্নিতকরণ
  const bnToEnMap: { [key: string]: string } = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  const isBanglaDigit = /[০-৯]/.test(clean);

  // যদি YYYY-MM-DD ফরম্যাটে থাকে (যেমন: 2026-10-01 বা ২০২৬-০৩-২৪)
  const dashParts = clean.split("-");
  if (dashParts.length === 3) {
    if (dashParts[0].length === 4) {
      // YYYY-MM-DD -> DD/MM/YYYY
      return `${dashParts[2]}/${dashParts[1]}/${dashParts[0]}`;
    }
    if (dashParts[2].length === 4) {
      // DD-MM-YYYY -> DD/MM/YYYY
      return `${dashParts[0]}/${dashParts[1]}/${dashParts[2]}`;
    }
  }

  // ইংরেজি স্ট্রিং ডেট পার্সিং (যেমন: 13 Dec 2025)
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return clean;
};

export const dmyToISO = (dmyStr: string): string => {
  if (!dmyStr) return "";
  const parts = dmyStr.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return dmyStr;
};
