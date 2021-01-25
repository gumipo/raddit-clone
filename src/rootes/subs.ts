import { Response, Request, Router } from "express";
import User from "../entities/User";
import auth from "../middleware/auth";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import Sub from "../entities/Sub";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "名前の入力がない";
    if (isEmpty(title)) errors.name = "タイトルの入力がない";

    //存在しているか
    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    //存在していたらエラー
    if (sub) errors.name = "すでに存在しています";
    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    //Subを登録
    const sub = new Sub({ name, description, title, user });
    await sub.save();
    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "失敗しました" });
  }
};

const router = Router();

router.post("/", auth, createSub);

export default router;
