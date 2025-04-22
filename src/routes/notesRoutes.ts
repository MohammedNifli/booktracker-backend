import { Elysia } from "elysia";
import { notSchema } from "../schemas/noteSchema";
import { db } from "../db";
import { notes } from "../models/note";
import { eq } from "drizzle-orm";
import { StatusCodeEnum } from "../enum/statusCode";

const noteRoutes = new Elysia({ prefix: "/books" });

noteRoutes.post("/:id/notes", async ({ params, body, set }) => {
  const bookId = Number(params.id);
  if (isNaN(bookId)) {
    set.status = StatusCodeEnum.BAD_REQUEST;
    return {
      success: false,
      message: "Invalid book ID",
    };
  }

  const parsed = notSchema.safeParse(body);

  if (!parsed.success) {
    set.status = StatusCodeEnum.BAD_REQUEST;
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
    set.status = StatusCodeEnum.CONFLICT;
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
  set.status = StatusCodeEnum.CREATED;

  return {
    message: "Note added Succesfully",
    data: insertedNote,
  };
});

noteRoutes.get("/:id/notes", async ({ params, set }) => {
  const bookId = Number(params.id);

  if (isNaN(bookId)) {
    set.status = StatusCodeEnum.BAD_REQUEST;
    return {
      success: false,
      error: "Invalid book ID",
      message: "The provided book ID must be a number.",
    };
  }

  try {
    const bookNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.bookId, bookId));

    set.status = StatusCodeEnum.OK;

    return {
      success: true,
      message: "Notes fetched successfully",
      data: bookNotes,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    set.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
    return {
      error: "Failed to fetch notes",
      message: error.message,
    };
  }
});

noteRoutes.delete("/:id/notes", async ({ params, set }) => {
  const noteId = Number(params.id);

  if (isNaN(noteId)) {
    set.status = StatusCodeEnum.BAD_REQUEST;
    return {
      success: false,
      error: "Invalid ID",
      message: `The provided ID is not a valid number: ${params.id}`,
    };
  }

  try {
    const result = await db.delete(notes).where(eq(notes.id, noteId));

    if (result.rowCount === 0) {
      set.status = StatusCodeEnum.NOT_FOUND;
      return {
        success: false,
        error: "Note not found",
        message: `No note found with ID ${noteId}`,
      };
    }

    set.status = StatusCodeEnum.OK;

    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    set.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
    return {
      success: false,
      error: "Server error",
      message:
        "An error occurred while deleting the note. Please try again later.",
    };
  }
});

export default noteRoutes;
