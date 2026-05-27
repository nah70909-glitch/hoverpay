import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "HoverPay | Futuristic Touchless UPI Platform",
  description: "Next-generation touchless payments using gesture verification, AI merchant prediction, and secure ambient authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-[#030303] text-zinc-50 overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}