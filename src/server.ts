import express from 'express'
import router from './router'
import cors from 'cors'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

connectDB()

const app = express()

//cors
app.use(cors(corsConfig))
//necessário para ler dados
app.use(express.json())

app.use("/", router)


export default app