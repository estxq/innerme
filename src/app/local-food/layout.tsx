import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Which Singaporean Local Food Are You?",
  description: "Chicken rice, bak kut teh, chilli crab or kaya toast? Take InnerMe's free quiz to find out which Singaporean hawker dish matches your personality.",
};

export default function LocalFoodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
