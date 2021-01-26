import { Router, Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title.trim() === "") {
    return res.status(400).json({ title: "タイトルが見入力です" });
  }

  try {
    // find sub

    //subを検索
    const subRecord = await Sub.findOneOrFail({ name: sub });

    //postを登録
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "投稿に失敗しました。",
    });
  }
};

//投稿を全てGET
const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createAt: "DESC" },
      // relations: ["sub"], subnameがあるため必要ない
    });

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.json({ error: "取得に失敗しました" });
  }
};

//identifier slugを指定して特定のPostを取得
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const posts = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      { relations: ["sub"] }
    );

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "指定のPostは見つかりませんでした" });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    });

    await comment.save();
    return res.json(comment);
  } catch (err) {
    console.log(err);

    return res.status(404).json({ error: "Postがみつかりません" });
  }
};

const router = Router();

router.post("/", auth, createPost);
router.get("/", getPosts);
router.get("/:identifier/:slug", getPost);
router.post("/:identifier/:slug/comments", auth, commentOnPost);

export default router;
