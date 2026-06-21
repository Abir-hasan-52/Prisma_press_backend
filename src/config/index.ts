import dotenv from "dotenv";
import path from "path";
import process from "process";



dotenv.config({path: path.join(process.cwd(), ".env")});

export default{
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    app_url:process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret:process.env.JWR_ACCESS_SECRET,
    jwt_access_expires_in:process.env.JWR_ACCESS_EXPIRES_IN,
    jwt_refresh_secret:process.env.JWR_REFRESH_SECRET,
    jwt_refresh_expires_in:process.env.JWR_REFRESH_EXPIRES_IN,

}