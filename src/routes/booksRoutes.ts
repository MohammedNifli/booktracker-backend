import { Elysia, error } from "elysia";
import { bookSchema } from "../schemas/bookSchema";
import { parse } from "dotenv";
import { db } from "../db";
import { books } from "../models/book";
import { eq } from 'drizzle-orm';

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




booksRoutes.put('/:id', async ({ body,params }) => {
 
    const bookId = Number(params.id);

  if (isNaN(bookId)) {
    return {
      success: false,
      error: 'Invalid book ID',
      message: 'Please provide a valid numeric book ID'
    };
  }

  
  const parsed = bookSchema.partial().safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      details: parsed.error.format(),
    };
  }

  const updateData = parsed.data;

  try {
   
    const existingBook = await db.query.books.findFirst({
      where: eq(books.id, bookId)
    });
    console.log("existing book",existingBook)

    if (!existingBook) {
      return {
        success: false,
        error: 'Not Found',
        message: `Book with ID ${bookId} not found`
      };
    }


    const [updatedBook] = await db.update(books)
      .set({
        ...updateData,
        updatedAt: new Date() 
      })
      .where(eq(books.id, bookId))
      .returning();

    return {
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    };

  } catch (error) {
    console.error('Update error:', error);
    return {
      success: false,
      error: 'Update Failed',
      message: error instanceof Error ? error.message : 'Database operation failed'
    };
  }
});


booksRoutes.delete('/:id', async ({ params }) => {
    try {
      const bookId = Number(params.id);
  
      const result = await db.delete(books).where(eq(books.id, bookId));
  
      if (result.rowCount === 0) {
        return {
          error: 'Book not found',
          message: `No book found with ID ${bookId}`,
        };
      }
  
      return {
        message: 'Book deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting book:', error);
      return {
        error: 'Database operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
  






export default booksRoutes;
