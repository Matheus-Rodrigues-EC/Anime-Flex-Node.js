import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let dataBase;

try{
    await mongoClient.connect();
    dataBase = mongoClient.db("AnimeFlex");
    console.log("DataBase connected...");
}catch(error){
    console.log(error);
}

export default dataBase;