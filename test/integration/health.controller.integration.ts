import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { HealthModule } from '../../src/health/health.module';

describe('HealthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HealthModule
      ],
    })
      .compile();

    app = module.createNestApplication();    
    await app.init();
    
  });

  afterAll(async () => {
    await app.close();
  }); 

  it('/health (GET)', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('OK');
  });
});
