import express from 'express' 
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import router from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())


connectdb()
app.use('/api/user',router)
app.get('/',(res,req)=>{
   res.send("this is Home")
})

app.listen(PORT,()=>{
     console.log(`server is running on port ${PORT}`)
})