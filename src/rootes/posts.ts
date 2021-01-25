import { Router, Response, Request } from "express";
import auth from "../middleware/auth";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({ title: "タイトルの入力がありません" });
  }
  try {
    //TODO:find sub
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "投稿に失敗した" });
  }
};

const router = Router();

router.post("/", auth, createPost);

export default router;
