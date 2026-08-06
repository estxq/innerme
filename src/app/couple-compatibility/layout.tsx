import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Couple Money Compatibility Test",
  description: "Find out how compatible you and your partner really are with money. Take InnerMe's free couple financial compatibility quiz together and see your results.",
};

export default function CoupleCompatibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
