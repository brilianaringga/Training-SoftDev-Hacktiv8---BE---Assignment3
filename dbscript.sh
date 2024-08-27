# Generate Model
npx sequelize model:generate --name Users --attributes name:string,username:string,email:string,password:string
npx sequelize model:generate --name Todo --attributes task:string,userId:integer
npx sequelize db:migrate

