import { PlanetUtils, PlanetsRepositoryMock } from './utils/planets.utils'
import { Test, TestingModule } from "@nestjs/testing"

import { DuplicatedPlanetException } from '../../src/planet/exceptions/planet/duplicated.planet.exception';
import { PlanetsService } from "../../src/planet/planet.service"

describe('Planets Test', () => {

    let planetsService: PlanetsService;

    let mockPlanetsRepository: PlanetsRepositoryMock

    beforeEach(async () => {
        
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PlanetsService,
                {
                    provide: 'PlanetRepository',
                    useClass: PlanetsRepositoryMock,
                }
            ]
        }).compile()

        planetsService = moduleRef.get(PlanetsService);
        mockPlanetsRepository = moduleRef.get('PlanetRepository');
    })

    
    it('InsertPlanet - should insert a new planet', async () => {
        const result = new PlanetUtils().getPlanet();
        jest.spyOn(mockPlanetsRepository, 'findPlanetByName').mockReturnValue(Promise.resolve(null))
        
        await planetsService.createPlanet(result)
    })

    it('InsertPlanet - should throw an Error if some problem happened when try create a new planet', async () => {

        const result = new PlanetUtils().getPlanet();
        const msg = 'Error when try create a new planet'
        jest.spyOn(mockPlanetsRepository, 'findPlanetByName').mockReturnValue(Promise.resolve(null))
        jest.spyOn(mockPlanetsRepository, 'insertPlanet').mockImplementation(() => {
            throw new Error(msg)
        });    
            
        await expect(planetsService.createPlanet(result)).rejects.toThrowError(msg)
    })

    it('InsertPlanet - should throw an DuplicatedPlanetException when try create planet with an existing name ', async () => {

        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(mockPlanetsRepository, 'findPlanetByName').mockReturnValue(Promise.resolve(planet))    
            
        await expect(planetsService.createPlanet(planet)).rejects.toThrowError(DuplicatedPlanetException)
    })

    it('getPlanetByName - should should return a planet', async () => {

        const planet = new PlanetUtils().getPlanet();
        jest.spyOn(mockPlanetsRepository, 'findPlanetByName').mockReturnValue(Promise.resolve(planet))    
            
        await expect(planetsService.getPlanetByName(planet.name)).resolves.toEqual(planet)
    })

    it('getAllPlanets - should return a list of planets', async () => {

        const planet = new PlanetUtils().getPlanet()
        const planetList = [ planet ]
        jest.spyOn(mockPlanetsRepository, 'findAllPlanets').mockReturnValue(Promise.resolve(planetList))    
            
        await expect(planetsService.getAllPlanets()).resolves.toEqual(planetList)
    })

}) 