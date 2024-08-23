import express from "express";
import path from "path";
import postRoutes from "./routes/postRoutes.js";
import connectDB from "./config/database.js";
import Post from "./models/post.js";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  res.render("index");
});

// 모든 요청을 postRoutes로 넘기겠다~
app.use("/", postRoutes);

async function start() {
  // 서버 시작 시 DB 연결
  const client = await connectDB();
  await Post.injectDB(client);

  process.on("SIGINT", async () => {
    try {
      await client.close();
      console.log("정상 DB 연결 종료");
      process.exit(0);
    } catch (err) {
      console.error("오류에 의한 DB 연결 종료", err);
      process.exit(1);
    }
  });

  return app; // app 객체를 반환
}

export default start();
