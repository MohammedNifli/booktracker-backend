import {Elysia,t} from 'elysia'
import dotenv from 'dotenv'
import {db,poolClient} from './db/index'
import booksRoutes from './routes/booksRoutes'

dotenv.config()

const app=new Elysia()

app.use(booksRoutes)

const port=process.env.PORT || 4000



app.get('/',()=>"Hello world")

app.onStart(async () => {
    try {
      await poolClient.query('SELECT 1') // Just pinging the DB
      console.log('✅ Database connected successfully')
    } catch (err) {
      console.error('❌ Database connection failed:', err)
    }
  })


app.listen(Number(port),()=>{
    console.log(`server running on the http://localhost:${port}`)
})