import mongoose from 'mongoose';

const connectionDB = async ( req, res) => {
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connection sucessfull.");
    } catch (error) {
        console.log("mongodb connection faild.");
        process.exit(1);
    }
}

export default connectionDB;