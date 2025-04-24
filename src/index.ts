import { Elysia, t } from "elysia";
import dotenv from "dotenv";
import { db, poolClient } from "./db/index";
import booksRoutes from "./routes/booksRoutes";
import noteRoutes from "./routes/notesRoutes";
import { cors } from "@elysiajs/cors";
import { StatusCodeEnum } from "./enum/statusCode";

dotenv.config();

const app = new Elysia();
app.use(cors());
app.use(booksRoutes);
app.use(noteRoutes);

// app.onError(({ code, error, set }) => {
//   console.error("Error:", error);

//   set.status = code === "NOT_FOUND" ? StatusCodeEnum.NOT_FOUND
//              : code === "VALIDATION" ? StatusCodeEnum.BAD_REQUEST
//              : StatusCodeEnum.INTERNAL_SERVER_ERROR;

//   return {
//     success: false,
//     error: code ?? "UNHANDLED_ERROR",
//   };
// });


const port = process.env.PORT || 4000;

app.onStart(async () => {
  try {
    await poolClient.query("SELECT 1"); // Just pinging the DB
    console.log(" Database connected successfully");
  } catch (err) {
    console.error(" Database connection failed:", err);
  }
});

app.listen(Number(port), () => {
  console.log(`server running on the http://localhost:${port}`);
});
