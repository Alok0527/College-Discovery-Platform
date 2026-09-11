import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admission Predictor | CampusConnect",
  description:
    "Enter your JEE Main or JEE Advanced rank and find colleges where you have a realistic chance of admission.",
};

export default function PredictorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}