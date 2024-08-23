const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let db; // 전역 변수로 db 연결 저장

// 서버 시작 시 DB 연결
connectDB();

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/list", async (req, res) => {
  try {
    const posts = await db
      .collection("posts")
      .find()
      .sort({ _id: -1 })
      // .limit(3) // 필요시 주석 해제
      .toArray();

    res.render("list", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.post("/add", async (req, res) => {
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;

  try {
    await db
      .collection("posts")
      .insertOne({ title, dateOfGoals, dateOfCreate, todoDetail });
    res.redirect("list");
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.delete("/delete/:id", async (req, res) => {
  // console.log(req.params.id);

  const _id = new ObjectId(req.params.id);
  try {
    const result = await db.collection("posts").deleteOne({ _id });

    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "삭제할 데이터가 없습니다.",
        success: false,
      });
    } else {
      res.json({ message: "성공적으로 삭제되었습니다.", success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/detail/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const post = await db.collection("posts").findOne({ _id });
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("detail", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/edit/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const post = await db.collection("posts").findOne({ _id });
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("edit", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.put("/edit/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;

  try {
    const result = await db
      .collection("posts")
      .updateOne(
        { _id },
        { $set: { title, dateOfGoals, dateOfCreate, todoDetail } }
      );

    if (result.modifiedCount === 1) {
      // 수정 성공 시 JSON 응답으로 리다이렉트 정보 전달
      res.json({
        success: true,
        message: "수정 완료",
        redirectUrl: `/detail/${_id.toString()}`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

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

app.listen(3000, () => {
  console.log("서버 실행중...");
});
