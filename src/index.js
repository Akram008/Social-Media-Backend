import dotenv from 'dotenv'
import { app } from './app.js'
import connectDB from './db/index.js'

dotenv.config({
    path: './.env'
})

const Port = process.env.PORT || 5000

connectDB()
.then(()=>{
    app.listen(Port, ()=>{
        console.log(`Server is running on port ${Port}`)
    })
}).catch((error)=>{
    console.log(error)
})
