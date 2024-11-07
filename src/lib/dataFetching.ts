import { db } from "@/lib/db";

export async function fetchDashboardData() {

  try {
    const articlesCount = await db.article.count();
    const usersCount = await db.user.count();
    const doctorsCount = await db.doctor.count();

    const publishedArticlesCount = await db.article.count({
      where: {
        published: true,
      },
    });

    return {
      articlesCount,
      usersCount,
      publishedArticlesCount,
      doctorsCount
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}
