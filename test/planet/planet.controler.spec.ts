import * as request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule, ConfigService } from '@nestjs/config';
import { DuplicatedPlanetException } from '../../src/planet/exceptions/planet/duplicated.planet.exception';
import { PlanetUtils } from "./utils/planets.utils";
import { PlanetsController } from "../../src/planet/planet.controller";
import { PlanetsService } from "../../src/planet/planet.service";
import configuration from '../../config/configuration';

jest.mock('../../src/planet/planet.service')

describe('AppController', () => {
    let planetsService: PlanetsService
    let app: INestApplication;

    beforeAll(async () => {
        
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports:[ConfigModule.forRoot({
                load: [configuration],
                isGlobal: true,
            })],
            providers: [ PlanetsService ],
            controllers: [ PlanetsController ]
        }).compile()

        planetsService = await moduleRef.resolve(PlanetsService);
        
        app = moduleRef.createNestApplication();
        
        const validateOptions = app.get(ConfigService).get<ValidationPipe>('validateOptions') ?? {}
        app.useGlobalPipes(new ValidationPipe(validateOptions))
        
        await app.init();        
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    afterAll(async () => {
        await app.close();
    });
  

    it('should return a Planet', async () => {
        const result = new PlanetUtils().getPlanet();
        jest.spyOn(planetsService, 'getPlanetByName').mockResolvedValueOnce(result);    
        

        await request(app.getHttpServer())
            .get(`/planets/name?=${result.name}`)
            .expect(200)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .expect(JSON.parse(JSON.stringify(result)));
    });

    it('should return http status code 404 when do not find a Planet', async () => {
        const planetName = 'VULCAN'
        jest.spyOn(planetsService, 'getPlanetByName').mockResolvedValueOnce(undefined);    
        
        await request(app.getHttpServer())
            .get(`/planets/${planetName}`)
            .expect(404)
            .expect({
                statusCode: 404,
                message: `Planet with name ${planetName} not found`,
                error: 'Not Found'
            });
    });

    it('should return http status code 201 with a empty body when create a new planet', async () => {
        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(planetsService, 'createPlanet').mockResolvedValueOnce(planet);    
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(planet)))
            .expect(201)
            .expect({});
    });

    it('should return a list of planets', async () => {
        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(planetsService, 'getAllPlanets').mockResolvedValueOnce([planet]);    
        
        await request(app.getHttpServer())
            .get(`/planets/`)
            .expect(200)
             
            .expect([JSON.parse(JSON.stringify(planet))]);
    });

    it('should return BAD REQUEST when try create a planet without a required value', async () => {
        const body = {
            name:"test",
            diameterInKilometers: 10,
            aphelion:100
        }
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(body)))
            .expect(400)
            .expect({
                statusCode:400,
                message:[
                    "perihelion should not be empty",
                    "perihelion must be a number conforming to the specified constraints"],
                error:"Bad Request"
            });
    });

    it('should return http status 500 to exceptions not handled ', async () => {
        const planet = new PlanetUtils().getPlanet();
        
        jest.spyOn(planetsService, 'createPlanet').mockRejectedValueOnce({error: "Error"});    
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(planet)))
            .expect(500)
            .expect({
                statusCode: 500,
                message:"Internal server error"
            });
    });

    it('should return BAD REQUEST when try create a planet with a unKnow value', async () => {
        const body = {
            name:"test",
            diameterInKilometers: 10,
            aphelion:100,
            perihelion: 123,
            unKnowValue: "asd"
        }
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(body)))
            .expect(400)
            .expect({
                statusCode:400,
                message:["property unKnowValue should not exist"],
                error:"Bad Request"
            });
    });

    it('should return BAD REQUEST when try create a planet with a value with the wrong type', async () => {
        const body = {
            name:"test",
            diameterInKilometers: 10,
            aphelion:100,
            perihelion: "123",
        }
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(body)))
            .expect(400)
            .expect({
                statusCode:400,
                message:["perihelion must be a number conforming to the specified constraints"],
                error:"Bad Request"
            });
    });

    it('should return 422 when try create a planet with a name that already exist', async () => {
        const planet = new PlanetUtils().getPlanet();

        const msg = `Planet with the name ${planet.name} already exist`

        jest.spyOn(planetsService, 'createPlanet').mockImplementationOnce(() => {
            throw new DuplicatedPlanetException(msg)
        })
        
        await request(app.getHttpServer())
            .post(`/planets`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(planet)))
            .expect(422)
            .expect({
                statusCode: 422,
                message: msg,
                error: 'Unprocessable Entity'
            });
    });

    it('should return http status code 204 when update a planet', async () => {
        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(planetsService, 'updatePlanet').mockResolvedValueOnce(planet);    
        
        await request(app.getHttpServer())
            .put(`/planets/${planet.name}`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(planet)))
            .expect(204)
            .expect({});
    });

    it('should return BAD REQUEST when try update a planet with a unKnow value', async () => {
        const planetName = 'VULCAN'
        const body = {
            unKnowValue: "asd"
        }
        
        await request(app.getHttpServer())
            .put(`/planets/${planetName}`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(body)))
            .expect(400)
            .expect({
                statusCode:400,
                message:["property unKnowValue should not exist"],
                error:"Bad Request"
            });
    });
    
    it('should return http status code 404 when try update that do not exist planet', async () => {
        
        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(planetsService, 'updatePlanet').mockResolvedValueOnce(undefined);    
        
        await request(app.getHttpServer())
            .put(`/planets/${planet.name}`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .send(JSON.parse(JSON.stringify(planet)))
            .expect(404)
            .expect({
                statusCode: 404,
                message: `Planet with name ${planet.name} not found`,
                error: 'Not Found'
            });
    });
    
});
