import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total users
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);

    // Get users by role
    const adminUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "admin"));

    const regularUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "user"));

    const guestUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "guest"));

    return NextResponse.json({
      totalUsers: Number(totalUsers[0]?.count || 0),
      adminUsers: Number(adminUsers[0]?.count || 0),
      regularUsers: Number(regularUsers[0]?.count || 0),
      guestUsers: Number(guestUsers[0]?.count || 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}