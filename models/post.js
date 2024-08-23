import { ObjectId } from "mongodb";

let db;

class Post {
  static async injectDB(conn) {
    try {
      db = conn.db("todo");
    } catch (err) {
      console.error(`연결실패: ${err}`);
    }
  }
  static async getAll() {
    return await db
      .collection("posts")
      .find()
      .sort({ _id: -1 })
      // .limit(3) // 필요시 주석 해제
      .toArray();
  }
  static async create(postData) {
    const { title, dateOfGoals, dateOfCreate, todoDetail } = postData;
    return await db
      .collection("posts")
      .insertOne({ title, dateOfGoals, dateOfCreate, todoDetail });
  }
  static async delete(postId) {
    return await db
      .collection("posts")
      .deleteOne({ _id: new ObjectId(postId) });
  }
  static async getOne(postId) {
    return await db.collection("posts").findOne({ _id: new ObjectId(postId) });
  }
  static async update(postId, postData) {
    const { title, dateOfGoals, dateOfCreate, todoDetail } = postData;
    return await db
      .collection("posts")
      .updateOne(
        { _id: postId },
        { $set: { title, dateOfGoals, dateOfCreate, todoDetail } }
      );
  }
}

export default Post;
