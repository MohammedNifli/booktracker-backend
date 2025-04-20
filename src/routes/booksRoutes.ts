import { Elysia, error } from "elysia";
import { bookSchema } from "../schemas/bookSchema";
import { parse } from "dotenv";
import { db } from "../db";
import { books } from "../models/book";

const booksRoutes = new Elysia({ prefix: "/books" });

booksRoutes.post("/", async ({ body }) => {
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      details: parsed.error.format(),
    };
  }

  const book = parsed.data;

  try {
    const existingBook = await db.query.books.findFirst({
      where: (books, { and, eq }) =>
        and(eq(books.title, book.title), eq(books.author, book.author)),
    });

    if (existingBook) {
      return {
        success: false,
        error: "Book already exists",
        details: { title: book.title, author: book.author },
      };
    }

    const [insertedBook] = await db
      .insert(books)
      .values({
        title: book.title,
        author: book.author,
        status: book.status,
      })
      .returning();

    return {
      success: true,
      message: "Book created successfully",
      data: insertedBook,
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      error: "Database operation failed",
      message: error.message,
    };
  }
});


booksRoutes.get('/',async()=>{

    try{
        const allBooks=await db.select().from(books)
        console.log("allbooooooooks",allBooks)
        return {
            success:true,
            message:"Books fetched Succesfully ",
            data:allBooks
        }

        

    }catch(error){
        console.log('Database error',error)
        return{
            success:false,
            message:'failed to fetch books'
        }
    }  

})


booksRoutes.get('/:id',async({params})=>{

    try{
        const bookId=Number(params.id);
        const book=await db.query.books.findFirst({
            where:(books,{eq})=>eq(books.id,bookId),
        })

        

        if (!book) {
            return {
              success: false,
              message: `Book with ID ${bookId} not found.`,
            }
        }

            return {
                success: true,
                message: "Book fetched successfully",
                data: book,
              };

    }catch(error){
        console.log("❌ Error fetching book:", error);

        return {
            success: false,
            message: "An error occurred while fetching the book.",
          };
    }

})







export default booksRoutes;
