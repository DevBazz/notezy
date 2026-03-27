import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { corsJson, handlePreflight } from "@/lib/cors";

// Preflight
export async function OPTIONS(request: NextRequest) {
  return handlePreflight(request);
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return corsJson(request, { error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return corsJson(request, { error: "User not found" }, { status: 404 });
    }

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        icon: true,
        color: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return corsJson(request, { notes });
  } catch (error) {
    console.error("[GET /api/notes]", error);
    return corsJson(request, { error: "Internal server error" }, { status: 500 });
  }
}
