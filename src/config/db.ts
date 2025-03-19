import color  from "colors"
import mongoose from 'mongoose'
import 'dotenv/config'

export const connectDB = async () => {
    const URL = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.hq0mm.mongodb.net/Cluster0`

    try {
        const {connection} = await mongoose.connect(URL)
        const URL2 = `${connection.host}:${connection.port}`
        console.log(color.magenta.italic(`MongoDB Conectado em ${URL2} !`))
    } catch (error) {
        console.log(color.red.bold.italic(error.message))
        process.exit(1)
    }
}
