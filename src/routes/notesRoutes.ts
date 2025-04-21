import { Elysia } from "elysia";
import { notSchema } from "../schemas/noteSchema";
import { db } from "../db";
import { notes } from "../models/note";
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

noteRoutes.delete("/:id", async ({ params }) => {
  const noteId = Number(params.id);

  if (isNaN(noteId)) {
    return {
      status: 400,
      error: "Invalid ID",
      message: `The provided ID is not a valid number: ${params.id}`,
    };
  }

  try {
    const deletedNote = await db.delete(notes).where(eq(notes.id, noteId));

    if (deletedNote.rowCount === 0) {
      return {
        status: 404,
        error: "Note not found",
        message: `No note found with ID ${noteId}`,
      };
    }

    return {
      status: 200,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      status: 500,
      error: "Server error",
      message:
        "An error occurred while deleting the note. Please try again later.",
    };
  }
});

export default noteRoutes;
