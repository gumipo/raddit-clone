import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/auth";

//新規登録
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    //TODO varidate data
    let errors: any = {};

    //存在しているか確認する
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    //存在していたらエラー文を追加
    if (emailUser) errors.email = "Email is already taken";
    if (usernameUser) errors.username = "Username is already taken";

    // errosの数あればStatus400を返す
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //TODO create the User
    //新しくユーザーを作成
    const user = new User({ email, username, password });
    //バリデーションをかける
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ errors });

    //dbに登録
    await user.save();

    //TODO Return the User
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

//ログイン時
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};

    //usernameが空だったら
    if (isEmpty(username)) errors.username = "ユーザーネームの入力が空です";
    if (isEmpty(password)) errors.password = "パスワードの入力が空です";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //usernameが存在しているか
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ error: "アカウント名が存在しません" });

    //passwordがあっているか
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(403).json({
        password: "パスワードが間違っています",
      });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );

    return res.json(user);
  } catch (err) {}
};

//ログイン情報を取得
const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

//ログアウト
const logout = (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/me", auth, me);
router.post("/logout", auth, logout);

export default router;
