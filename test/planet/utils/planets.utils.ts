/* eslint-disable @typescript-eslint/no-empty-function */
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
    
    public cretePromise(): Promise<any>{
        return new Promise((value) => {
            return value
        })
    }
}

export class PlanetsRepositoryMock {            
    
    findAllPlanets(): Promise<PlanetDto[]> {
        return new PlanetUtils().cretePromise()
    }
    
    insertPlanet(planet: PlanetDto){}
    
    findPlanetByName(name: string): Promise<PlanetDto>{
        return new PlanetUtils().cretePromise()
    }
}


