import mongoose from "mongoose";


 const connectdb = async()=>{
    try {
        
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/auth`)
        console.log(`mongodb:connect: ${conn.connection.host}`)
       
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectdb