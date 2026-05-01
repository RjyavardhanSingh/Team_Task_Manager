import mongoose from "mongoose";

const connectDB = async (retries = 5) => {
    const MONGO_URI = process.env.MONGO_URI

    while(retries){
        try {
            const conn = await mongoose.connect(MONGO_URI)
            console.log(`MongoDB connected on host: ${conn.connection.host}`);
            break
        } catch (error) {
            console.error(`MongoDB connection failed ${error.message}`)
            retries -=1
            console.log(`Retries left ${retries}`);
            
            if(retries === 0){
                console.error('Could not connect to MongoDB after multiplr attemps')
                process.exit(1)
            }
            await new Promise(res => setTimeout(res,5000))
        }
    }
}

export default connectDB