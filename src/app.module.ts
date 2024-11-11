import {ConfigModule, ConfigService} from '@nestjs/config';

import {HealthModule} from './health/health.module'
import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import {PlanetModule} from './planet/planet.module'
import configuration from '../config/configuration';

@Module({
    imports:[
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => configService.get('mongoose'),
            inject: [ConfigService],
        }),
        PlanetModule,
        HealthModule
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule{}
