const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()

const connectDB = () => {
    console.log(process.env.Connect_DB);
    mongoose.connect(process.env.Connect_DB)
    .then( ()=>{
        console.log('Db connected')
    })
    .catch((error) => {
        console.log(error)

    })
}

module.exports = connectDB