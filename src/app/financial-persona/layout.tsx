import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Personality Quiz — Are You a Saver, Spender, or Builder?",
  description: "Take the free 2-minute financial personality quiz and discover whether you're a Protector, Lifestyle Builder, Wealth Builder, Avoider, or Financial Architect.",
};

export default function FinancialPersonaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
