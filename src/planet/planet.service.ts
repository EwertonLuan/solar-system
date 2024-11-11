import { Injectable, Inject } from '@nestjs/common';
import { PlanetDto } from './model/planet.model.dto'
import { PlanetRepository } from './repository/planet.repository';
import { Logger } from '@nestjs/common'
import { DuplicatedPlanetException } from './exceptions/planet/duplicated.planet.exception';
import { PlanetUpdateDto } from './model/planet.update.model.dto';


@Injectable()
export class PlanetsService {
    constructor(@Inject('PlanetRepository') private readonly planetRepository: PlanetRepository){}

  private readonly logger = new Logger(PlanetsService.name);
  
  async getPlanetByName(name: string): Promise<PlanetDto> {  
      const result = await this.planetRepository.findPlanetByName(name)
      return result
  }

  async getAllPlanets(): Promise<PlanetDto[]> {  
      const result = await this.planetRepository.findAllPlanets()
      return result
  }

  async createPlanet(planet: PlanetDto) {
      try {
          this.logger.log(`Creating a new Planet ${JSON.stringify(planet)}`)

          const planetExist = await this.planetRepository.findPlanetByName(planet.name)
          if(planetExist){
              const msg = `Planet with the name ${planet.name} already exist`
              this.logger.log(msg)
              throw new DuplicatedPlanetException(msg)
          } 
      
          const result = await this.planetRepository.insertPlanet(planet)  
          return result

      } catch (error) {    
          const msg = `Error when try create the Planet ${JSON.stringify(planet)}`
          this.logger.error(msg, error)
          throw error;      
      }
    
  }

  async updatePlanet(name:string, valuesToUpdate: PlanetUpdateDto){
      try {
          this.logger.log(`Updating the planet ${name} with the values ${JSON.stringify(valuesToUpdate)}`)

          const result = await  this.planetRepository.updatePlanet(name, valuesToUpdate)
          return result
      
      } catch (error) {
          const msg = `Error when try update the planet ${name} with the values ${JSON.stringify(valuesToUpdate)}`
          this.logger.error(msg, error)
          throw error;
      }
    
  }
}
