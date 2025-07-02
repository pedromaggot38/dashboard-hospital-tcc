import { db } from '@/lib/db';

export async function getDashboardCounts() {
  const articlesCount = await db.article.count();
  const usersCount = await db.user.count();
  const doctorsCount = await db.doctor.count();
  const publishedArticlesCount = await db.article.count({
    where: { published: true },
  });

  return {
    articlesCount,
    usersCount,
    doctorsCount,
    publishedArticlesCount,
  };
}
