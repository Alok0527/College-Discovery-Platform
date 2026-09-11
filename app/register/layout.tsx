import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | CampusConnect",
  description: "Create your CampusConnect account to explore engineering colleges in India.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}