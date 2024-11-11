import { IPlanet } from "src/planet/interfaces/planet.interface";
import { Injectable } from "@nestjs/common";
import { PlanetDto } from "../model/planet.model.dto";

@Injectable()
export class PlanetConverter {

    converterPlanetToDto(data: IPlanet): PlanetDto {

        const planet = new PlanetDto()  
        
        planet.name = data.name
        planet.diameterInKilometers = data.diameterInKilometers
        planet.perihelion = data.perihelion
        planet.aphelion = data.aphelion
        
        return planet
    }
}