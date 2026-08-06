import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "InnerMe | Discover Your Financial Personality",
    template: "%s | InnerMe",
  },
  description: "Take our free quiz to uncover your financial personality type and get personalized money tips to help you save, invest, and grow smarter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen`}>
        {/* Global background */}
        <div className="fixed inset-0 -z-10" style={{
          background: "linear-gradient(135deg, #FBF3EA 0%, #F7EFEA 40%, #EFEEEE 70%, #E9EFF0 100%)"
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
