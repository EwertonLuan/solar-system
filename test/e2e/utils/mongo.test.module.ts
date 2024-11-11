import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod:MongoMemoryServer

export default (customOpts: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        mongod = new MongoMemoryServer();
        const uri = await mongod.getUri();
        return {
            uri,
            ...customOpts
        }
    },
    inject: [ConfigService],
})


export const closeMongoConnection = async () => {
    if (mongod) await mongod.stop()
}