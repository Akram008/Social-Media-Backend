import mongoose from 'mongoose'
const db_name = 'main-project'

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`)
        console.log(`MONGO_DB is connected || DB_HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGO_DB connection error: ${error}`)
        process.exit(1)
    }
}

export default connectDB