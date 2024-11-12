import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer

export default MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return {
            uri,
        }
    },
    inject: [ConfigService],
})


export const closeMongoConnection = async () => {
    if (mongod) await mongod.stop()
}

export const getMongoServer = () =>{
    return mongod
}