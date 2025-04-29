import express from 'express' 
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL (Vite)
    credentials: true // ✅ Allows sending cookies
}));
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
app.use(bodyParser.json()); // Parses JSON data
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import trackRouter from './routes/track.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/tracks', trackRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/comments', commentRouter)

export {app}