import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { classToPlain, Exclude } from "class-transformer";

//共通のEntity
export default abstract class Entity extends BaseEntity {
  //Id
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  //作成日
  @CreateDateColumn()
  createAt: Date;

  //更新日
  @UpdateDateColumn()
  updateAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
