import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lastNewsCount } from "@/lib/vars";

export async function GET() {
  const lastNews = await db.article.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: lastNewsCount,
  });
  return NextResponse.json(lastNews);
}