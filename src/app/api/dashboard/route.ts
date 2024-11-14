import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const articlesCount = await db.article.count();
    const usersCount = await db.user.count();
    const doctorsCount = await db.doctor.count();

    const publishedArticlesCount = await db.article.count({
      where: {
        published: true,
      },
    });

    return NextResponse.json({
      articlesCount,
      usersCount,
      publishedArticlesCount,
      doctorsCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}