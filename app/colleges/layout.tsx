import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Colleges | CampusConnect",
  description:
    "Search and filter engineering colleges across India by course, state, city, fees, and rating.",
};

export default function CollegesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}