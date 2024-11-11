import * as request from 'supertest';

import DbModule, { closeMongoConnection } from './utils/mongo.test.module';
import { Test, TestingModule } from '@nestjs/testing';

import {AppModule} from '../../src/app.module';
import { Connection } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

describe('App (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DbModule({
                    connectionName: (new Date().getTime() * Math.random()).toString(16)
                }),
                AppModule
            ],
        }).compile();

        connection = await module.get(getConnectionToken());

        app = module.createNestApplication();    
        await app.init();
    
    });

    afterAll(async () => {
        await connection.close()
        await closeMongoConnection()
        await app.close();
    }); 

    it('/health (GET)', async () => {
        await request(app.getHttpServer())
            .get('/health')
            .expect(200)
            .expect('OK');
    });
});
