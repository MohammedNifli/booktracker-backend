import { Elysia } from "elysia";
import { notSchema } from "../schemas/noteSchema";
import { db } from "../db";
import { notes } from "../models/note";
import { parse } from "dotenv";
import { eq } from "drizzle-orm";

const noteRoutes = new Elysia({ prefix: "/books" });

noteRoutes.post("/:id/notes", async ({ params, body }) => {
  const bookId = Number(params.id);
  const parsed = notSchema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false,
      message: "validation error",
    };
  }

  const { content } = parsed.data;

  const existingNote = await db.query.notes.findFirst({
    where: (notes, { eq }) => eq(notes.content, content),
  });

  if (existingNote) {
    return {
      success: false,
      message: "note already exist",
    };
  }

  const [insertedNote] = await db
    .insert(notes)
    .values({
      bookId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return {
    message: "Note added Succesfully",
    data: insertedNote,
  };
});

noteRoutes.get("/:id/notes", async ({ params }) => {
  const bookId = Number(params.id);

  if (isNaN(bookId)) {
    return {
      error: "Invalid book ID",
      message: "The provided book ID must be a number.",
    };
  }

  try {
    const bookNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.bookId, bookId));
    return {
      message: "Notes fetched successfully",
      data: bookNotes,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      error: "Failed to fetch notes",
      message: error.message,
    };
  }
});

export default noteRoutes;
