import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges | CampusConnect",
  description:
    "Compare up to 3 engineering colleges side-by-side on fees, ratings, placements, and courses.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}