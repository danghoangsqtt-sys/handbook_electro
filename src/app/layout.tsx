import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electro Creative - Electronics Engineering Hub",
  description: "Sổ tay bách khoa công nghệ số, hỗ trợ kỹ sư và sinh viên tra cứu thuật ngữ, module, và làm dự án với AI.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${plusJakarta.variable} ${firaCode.variable} h-full antialiased dark`}>
      <body suppressHydrationWarning className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col font-sans">
        <ProgressProvider>
            {children}

        </ProgressProvider>
      </body>
    </html>
  );
}
