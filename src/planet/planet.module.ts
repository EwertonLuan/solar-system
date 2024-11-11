import { Module } from '@nestjs/common';
import { MongoPlanetRepository } from './repository/mongodb/mongo.planet.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { PlanetConverter } from './repository/planet.converter';
import { PlanetSchema } from './repository/mongodb/schemas/planet.schema'
import { PlanetsController } from './planet.controller';
import { PlanetsService } from './planet.service';

@Module({
    imports: [MongooseModule.forFeature([{name: 'Planet', schema: PlanetSchema}])],
    controllers: [PlanetsController],
    providers: [PlanetsService,
        {
            provide: 'PlanetRepository',
            useClass: MongoPlanetRepository
        },
        PlanetConverter
    ],
    
})
export class PlanetModule {}
