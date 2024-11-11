export default () => ({
    app: {
        port: parseInt(process.env.PORT, 10)
    },
    mongoose: {
        uri: process.env.MONGO_URI,
        useNewUrlParser: true, 
        useCreateIndex: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        authSource: 'admin'
    },
    validateOptions: {
        whitelist: true,
        forbidNonWhitelisted: true
    }    
})