import { PlanetDto } from '../model/planet.model.dto'
import { PlanetUpdateDto } from '../model/planet.update.model.dto';

export interface PlanetRepository {
    findAllPlanets(): Promise<PlanetDto[]>
    insertPlanet(planet: PlanetDto): Promise<PlanetDto>
    findPlanetByName(name: string): Promise<PlanetDto>
    updatePlanet(name:string, values:PlanetUpdateDto): Promise<PlanetDto>
}