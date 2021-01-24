import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { validate } from "class-validator";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //TODO varidate data
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    //存在しているか確認する
    if (emailUser) errors.email = "Email is already taken";

    if (usernameUser) errors.username = "Username is already taken";

    // errosの数が一工場あればStatus400を返す
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //TODO create the User
    const user = new User({ email, username, password });

    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ errors });

    await user.save();

    //TODO Return the User
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const router = Router();
router.post("/register", register);

export default router;
