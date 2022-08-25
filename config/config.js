import 'dotenv/config';
// there are packages for validating and setting env vars

const requiredEnvs = ['JWT_SECRET', 'DB_URI']
const missingEnvs = requiredEnvs.filter(envName => !process.env[envName])

if(missingEnvs.length) {
    throw new Error(`Missing required envs${missingEnvs}`)
}



export default {
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || 30,
    JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30,
    DB_URI: process.env.DB_URI,
    NODE_ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT || 8000,
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || './public/uploads/img',
    MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD || 10**6 // 1 MG
}


