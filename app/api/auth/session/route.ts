import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { corsJson, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return handlePreflight(request);
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return corsJson(request, { authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    });

    if (!user) {
      return corsJson(request, { authenticated: false }, { status: 404 });
    }

    return corsJson(request, {
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("[GET /api/auth/session]", error);
    return corsJson(request, { error: "Internal server error" }, { status: 500 });
  }
}
