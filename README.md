# raddit-clone

//typeORM の初期設定
typeorm init --database postgres

//Typwscript をインストール　最新のバージョン
npm i ts-node@latest @types/node@latest typescript@latest

npm install express

//タイプスクリプト
npm install -D @types/express mogan @types/mogan

//DB のアップデートを常に監視する
npm install -D nodemon

//DB に登録する際のバリデーションをまとめたもの
npm install class-validator

//パスワードの暗号化　ハッシュ化
npm install bcrypt
