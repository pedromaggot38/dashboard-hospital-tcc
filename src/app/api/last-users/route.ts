import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { lastUsersCount } from "@/lib/vars";

export async function GET() {
  const lastUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: lastUsersCount,
  });

  return NextResponse.json(lastUsers);
}