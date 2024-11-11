import { InjectModel } from '@nestjs/mongoose'
import { PlanetRepository } from '../planet.repository'
import { PlanetDto } from '../../model/planet.model.dto'
import { IPlanet } from '../../interfaces/planet.interface'
import { Model } from 'mongoose'
import { PlanetConverter } from '../planet.converter'
import { PlanetUpdateDto } from 'src/planet/model/planet.update.model.dto'

export class MongoPlanetRepository implements PlanetRepository {
    constructor(
        @InjectModel('Planet') private readonly planetModel: Model<IPlanet>,
        private readonly planetDtoConverter: PlanetConverter
    ){}
   
    async findAllPlanets(): Promise<PlanetDto[]> {
        
        const result = await this.planetModel.find()
        const planetsConverted = result?.map((planet) => this.planetDtoConverter.converterPlanetToDto(planet))

        return planetsConverted
    }

    async findPlanetByName(name: string): Promise<PlanetDto> {

        const result = await this.planetModel.findOne({name})
        const planetConverted = result ? this.planetDtoConverter.converterPlanetToDto(result) : null

        return planetConverted
    }
    
    async insertPlanet(planet: PlanetDto): Promise<PlanetDto> {
        
        const newPlanet = new this.planetModel({
            name: planet.name,
            diameterInKilometers: planet.diameterInKilometers,
            aphelion: planet.aphelion,
            perihelion: planet.perihelion
        })

        const result = await newPlanet.save()
        const planetConverted = result ? this.planetDtoConverter.converterPlanetToDto(result) : null

        return planetConverted
    }

    async updatePlanet(name: string, valuesToUpdate: PlanetUpdateDto): Promise<PlanetDto> {
        const result = await this.planetModel.findOneAndUpdate({name: name}, valuesToUpdate, {new:true})
        const planetConverted = result ? this.planetDtoConverter.converterPlanetToDto(result) : null        
        
        return planetConverted
    }
}