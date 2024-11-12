export default () => ({
    app: {
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
    },
    mongoose: {
        uri: process.env.MONGO_URI,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        authSource: 'admin'
    },
    validateOptions: {
        whitelist: true,
        forbidNonWhitelisted: true
    }    
})