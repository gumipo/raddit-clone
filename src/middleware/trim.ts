import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  const exceptions = ["password"];
  Object.keys(req.body).forEach((key) => {
    if (!exceptions.includes(key) && typeof req.body[key] === "string") {
      //受け取った値の空白を消す
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};
