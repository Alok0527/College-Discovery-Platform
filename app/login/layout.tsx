import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CampusConnect",
  description: "Sign in to your CampusConnect account.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}