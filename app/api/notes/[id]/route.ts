import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { corsJson, handlePreflight } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return handlePreflight(request);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return corsJson(request, { error: "Unauthorized" }, { status: 401 });
    }

    const { id: noteId } = await context.params;

    if (!noteId) {
      return corsJson(request, { error: "Note ID is required" }, { status: 400 });
    }

    // Parse and validate body
    let body: { text?: unknown };
    try {
      body = await request.json();
    } catch {
      return corsJson(request, { error: "Invalid JSON body" }, { status: 400 });
    }

    const text = body.text;

    if (typeof text !== "string" || !text.trim()) {
      return corsJson(request, { error: "text must be a non-empty string" }, { status: 400 });
    }

    // Hard cap — prevent abuse
    if (text.length > 5000) {
      return corsJson(request, { error: "text exceeds 5000 character limit" }, { status: 400 });
    }

    // Resolve DB user
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return corsJson(request, { error: "User not found" }, { status: 404 });
    }

    // Fetch note — must belong to this user
    const note = await prisma.note.findFirst({
      where: { id: noteId, authorId: user.id },
      select: { id: true, content: true },
    });

    if (!note) {
      return corsJson(
        request,
        { error: "Note not found or you are not the owner" },
        { status: 404 }
      );
    }

    // Append with a clear separator so existing content is never mangled
    const separator = "\n\n---\n";
    const updatedContent = note.content + separator + text.trim();

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { content: updatedContent },
      select: { id: true, title: true, updatedAt: true },
    });

    return corsJson(request, { success: true, note: updated });
  } catch (error) {
    console.error("[PATCH /api/notes/[id]]", error);
    return corsJson(request, { error: "Internal server error" }, { status: 500 });
  }
}
