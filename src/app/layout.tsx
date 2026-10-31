import QueryProvider from "@/lib/providers/query-provider";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "توروبلند",
  description: "فروشگاه اینترنتی/",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-200">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
