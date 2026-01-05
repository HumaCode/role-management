import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// GET - Fetch single user
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, params.id))
            .limit(1);

        if (user.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// PUT - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, email, password, phone, role, image } = body;

        // Check if user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, params.id))
            .limit(1);

        if (existingUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if email is taken by another user
        if (email && email !== existingUser[0].email) {
            const emailCheck = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (emailCheck.length > 0) {
                return NextResponse.json(
                    { error: "Email already exists" },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {
            name: name || existingUser[0].name,
            email: email || existingUser[0].email,
            phone: phone !== undefined ? phone : existingUser[0].phone,
            role: role || existingUser[0].role,
            image: image !== undefined ? image : existingUser[0].image,
            updatedAt: new Date(),
        };

        // Update user
        await db.update(users).set(updateData).where(eq(users.id, params.id));

        return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, params.id))
            .limit(1);

        if (existingUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete user
        await db.delete(users).where(eq(users.id, params.id));

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}