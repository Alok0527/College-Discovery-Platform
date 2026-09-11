import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reviews | CampusConnect",
  description: "View and manage the college reviews you've submitted.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}