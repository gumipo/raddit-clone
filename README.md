# raddit-clone

//typeORM の初期設定
typeorm init --database postgres

psql で db 作成

//Typwscript をインストール　最新のバージョン
npm i ts-node@latest @types/node@latest typescript@latest

npm install express

//Typescript
npm install -D @types/express mogan @types/mogan

//DB のアップデートを常に監視する
npm install -D nodemon

//DB に登録する際のバリデーションをまとめたもの
npm install class-validator

//パスワードの暗号化　ハッシュ化
npm install bcrypt
npm i -D @types/bcrypt

//validation かけて json を直す
npm install class-transformer

npm i jsonwebtoken cookie cookie-parser
npm install -D @types/jsonwebtoken @types/cookie @types/cookie-parser

npm install dotenv

//Entity ファイルを作成
typeorm entity:create --name ファイル名

//マイグレーション
npm run typeorm migration:generate -- --name create-users-table

//typeErr 確認
tsc --noEmit

//Client とドメインが違う場合許可する
npm install cors
npm install -D @types/cors
