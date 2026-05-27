import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HoverPay | Modern UPI Experience",
  description: "Gesture-assisted payment verification for the Indian ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-[#09090b] text-zinc-50 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}