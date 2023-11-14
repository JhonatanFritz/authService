// /auth-service/config/config.js
export default {
    port: process.env.PORT || 300,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/auth-service',
    secretKey: process.env.SECRET_KEY || 'tu_clave_secreta_para_jwt',
};
