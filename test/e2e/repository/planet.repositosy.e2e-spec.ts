import DbModule, { closeMongoConnection } from '../utils/mongo.test.module';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Connection } from 'mongoose';
import { MongoPlanetRepository } from '../../../src/planet/repository/mongodb/mongo.planet.repository';
import { PlanetConverter } from '../../../src/planet/repository/planet.converter';
import { PlanetRepository } from '../../../src/planet/repository/planet.repository';
import { PlanetSchema } from '../../../src/planet/repository/mongodb/schemas/planet.schema';
import { PlanetUpdateDto } from '../../../src/planet/model/planet.update.model.dto';
import { PlanetUtils } from '../../planet/utils/planets.utils';

describe('MongoPlanetRepository Test', () => {
    let mongoPlanetRepository: PlanetRepository;
    let connection: Connection;

    beforeEach(async () => {
        const module:TestingModule = await Test.createTestingModule({
            imports: [
                DbModule({
                    connectionName: (new Date().getTime() * Math.random()).toString(16)
                }),
                MongooseModule.forFeature([
                    { name: 'Planet', schema: PlanetSchema }
                ])
            ],
            providers: [
                {
                    provide: 'PlanetRepository',
                    useClass: MongoPlanetRepository
                },
                PlanetConverter
            ]
        }).compile();

        mongoPlanetRepository = module.get('PlanetRepository');
        connection = await module.get(getConnectionToken());

    });

    afterEach(async () => {
        await connection.close()
        await closeMongoConnection()
    })
  
    it('insertPlanet - should insert a planet', async () => {

        const planet = new PlanetUtils().getPlanet();
        
        await expect(mongoPlanetRepository.insertPlanet(planet)).resolves.toEqual(planet)
    })

    it('insertPlanet - should not insert a planet when already exist a planet with the same name', async () => {

        const planet = new PlanetUtils().getPlanet();
    
        //First planet have to be success
        await mongoPlanetRepository.insertPlanet(planet)
        
        await expect(mongoPlanetRepository.insertPlanet(planet)).rejects.toThrowError(`E11000 duplicate key error dup key: { : "${planet.name}" }`)
    })

    it('findAllPlanets - should return an list with all planets', async () => {

        const planet1 = new PlanetUtils().getPlanet();
        const planet2 = new PlanetUtils().getPlanet();
        planet2.name = "test2"

        const planets = [planet1, planet2]
    
        await mongoPlanetRepository.insertPlanet(planet1)
        await mongoPlanetRepository.insertPlanet(planet2)        
    
        await expect(mongoPlanetRepository.findAllPlanets()).resolves.toEqual(planets)
    })

    it('findPlanetByName - should find a planet by name ', async () => {

        const planet = new PlanetUtils().getPlanet();
        await mongoPlanetRepository.insertPlanet(planet)
            
        await expect(mongoPlanetRepository.findPlanetByName(planet.name)).resolves.toEqual(planet)
    })

    it('updatePlanet - should find a planet by name and update', async () => {

        const planet1 = new PlanetUtils().getPlanet('test1');
        const planet2 = new PlanetUtils().getPlanet('test2');
        const valuesToUpdate = new PlanetUpdateDto()
        valuesToUpdate.perihelion = 40
        valuesToUpdate.aphelion =19

        //Inserting two planets to validate that just one is being updated
        await mongoPlanetRepository.insertPlanet(planet1)
        await mongoPlanetRepository.insertPlanet(planet2)
    
        const planetUpdated = {...planet1}
        planetUpdated.aphelion = 19
        planetUpdated.perihelion = 40
    
    
        await expect(mongoPlanetRepository.updatePlanet(planet1.name, valuesToUpdate)).resolves.toEqual(planetUpdated)
    })

    it('updatePlanet - should not update if the name do not match', async () => {

        const planet = new PlanetUtils().getPlanet();
        const valuesToUpdate = new PlanetUpdateDto()
        valuesToUpdate.perihelion = 40
    
        await mongoPlanetRepository.insertPlanet(planet)
    
        await expect(mongoPlanetRepository.updatePlanet('planetNotValid', valuesToUpdate)).resolves.toEqual(null)
    })

});