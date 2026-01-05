import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

// GET - Fetch all users with optional search
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search") || "";

        let query = db.select().from(users);

        if (search) {
            query = query.where(
                or(
                    like(users.name, `%${search}%`),
                    like(users.email, `%${search}%`),
                    like(users.role, `%${search}%`)
                )
            ) as any;
        }

        const allUsers = await query;

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phone, role } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create user
        await db.insert(users).values({
            id: userId,
            name,
            email,
            emailVerified: false,
            phone: phone || null,
            image: null,
            role: role || "user",
        });

        return NextResponse.json(
            { message: "User created successfully", id: userId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}