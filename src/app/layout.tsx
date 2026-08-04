import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
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
        <div className="fixed inset-0 -z-10" style={{
          background: `
            radial-gradient(ellipse at 0% 60%, rgba(255,216,192,0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 0%, rgba(240,200,212,0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(140,204,232,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 0% 100%, rgba(255,245,220,0.5) 0%, transparent 45%),
            #FAF8F5
          `
        }}/>
        <Navbar />
        <main>{children}</main>

        {/* Meta Pixel — replace YOUR_PIXEL_ID with your actual ID from Meta Ads Manager */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'YOUR_PIXEL_ID');
          fbq('track', 'PageView');
        `}</Script>
      </body>
    </html>
  );
}
