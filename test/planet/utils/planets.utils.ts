 import { PlanetDto } from "../../../src/planet/model/planet.model.dto"

export class PlanetUtils {
    public getPlanet(name = 'MERCURY') {
        const planet =  new PlanetDto()
        
        planet.name= name
        planet.diameterInKilometers= 10
        planet.aphelion= 2000
        planet.perihelion= 123213

        return planet
    }
}

export class PlanetsRepositoryMock {            
    
    findAllPlanets(): Promise<PlanetDto[]> {
        return Promise.resolve([])
    }
    
    insertPlanet(){}
    
    findPlanetByName(): Promise<PlanetDto>{
        const planet = new PlanetUtils().getPlanet()
        return Promise.resolve(planet)
    }
}
