import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { validateUserCreate } from "@/lib/validation";

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
        const { name, email, password, phone, role, image } = body;

        // Validation
        const validation = validateUserCreate({
            name,
            email,
            password,
            phone,
            role,
        });

        if (!validation.valid) {
            return NextResponse.json(
                { error: "Validation failed", errors: validation.errors },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email.trim()))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        // Generate UUID
        const userId = uuidv4();

        // Create user
        await db.insert(users).values({
            id: userId,
            name: name.trim(),
            email: email.trim(),
            emailVerified: false,
            phone: phone?.trim() || null,
            image: image?.trim() || null,
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