import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_PASS = process.env.MONGO_PASS;
const uri = `mongodb+srv://wonseok:${MONGO_PASS}@cluster0.w0bst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

// getDB() 함수 대신 connectDB() 함수를 사용하여 서버 시작 시 한 번만 연결합니다
// 데이터베이스 연결 함수
async function connectDB() {
  try {
    await client.connect();
    console.log("DB 연결 성공");
    return client;
  } catch (err) {
    console.error("DB 연결 실패", err);
    process.exit(1); // 서버 종료
  }
}
export default connectDB;
