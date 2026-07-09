import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "innerme",
  description: "Discover your financial personality",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen`}>
        {/* Global background */}
        <div className="fixed inset-0 -z-10">
          <img src="/magicpattern-oPH_5xuMgQw-unsplash.jpg" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-[#FAF8F5]/85"/>
        </div>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
