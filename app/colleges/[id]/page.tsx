import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CollegeDetailClient, {
  CollegeDetail,
} from "./college-client";

async function getCollege(idOrSlug: string) {
  const college = await prisma.college.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      courses: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      cutoffs: {
        orderBy: { year: "desc" },
        take: 50,
      },
    },
  });

  if (!college) return null;

  return {
    id: college.id,
    name: college.name,
    slug: college.slug,
    city: college.city,
    state: college.state,
    location: college.location,
    fees: college.fees,
    rating: college.rating,
    overview: college.overview,
    placementAverage: college.placementAverage,
    placementHighest: college.placementHighest,
    imageUrl: college.imageUrl,
    createdAt: college.createdAt.toISOString(),
    updatedAt: college.updatedAt.toISOString(),
    courses: college.courses.map(
      (c: Record<string, unknown>) => ({
        id: String(c.id),
        name: String(c.name),
        duration: Number(c.duration),
      })
    ),
    reviews: college.reviews.map(
      (r: Record<string, unknown>) => ({
        id: String(r.id),
        rating: Number(r.rating),
        comment: String(r.comment),
        createdAt: String(r.createdAt),
      })
    ),
    cutoffs: college.cutoffs.map(
      (c: Record<string, unknown>) => ({
        id: String(c.id),
        exam: String(c.exam),
        branch: String(c.branch),
        category: String(c.category),
        openingRank: c.openingRank === null ? null : Number(c.openingRank),
        closingRank: Number(c.closingRank),
        year: Number(c.year),
      })
    ),
  } as CollegeDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const college = await getCollege(id);

  if (!college) {
    return {
      title: "College Not Found | CampusConnect",
      description: "The requested college could not be found.",
    };
  }

  const title = `${college.name} - Fees, Cutoffs & Placements | CampusConnect`;
  const description = `Get details about ${college.name} in ${college.city}, ${college.state}. View fees (₹${college.fees.toLocaleString("en-IN")}), rating (${college.rating.toFixed(1)}), cutoffs, courses and placements.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: college.imageUrl ? [{ url: college.imageUrl }] : undefined,
    },
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const college = await getCollege(id);

  if (!college) {
    notFound();
  }

  return <CollegeDetailClient initialCollege={college} />;
}