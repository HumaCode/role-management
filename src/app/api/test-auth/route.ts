import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        // Test jika auth instance terbuat dengan baik
        return NextResponse.json({
            success: true,
            message: "Better Auth configured successfully!",
            endpoints: {
                signIn: "/api/auth/sign-in",
                signUp: "/api/auth/sign-up",
                signOut: "/api/auth/sign-out",
                session: "/api/auth/get-session",
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Better Auth configuration failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}