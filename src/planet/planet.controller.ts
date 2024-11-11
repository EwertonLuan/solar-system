import { Body, Controller, Get, Post, Param, NotFoundException, Put, HttpCode } from '@nestjs/common';

import { PlanetDto } from './model/planet.model.dto'
import { PlanetsService } from './planet.service';
import { PlanetUpdateDto } from './model/planet.update.model.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('planets')
@ApiTags('Planets')
export class PlanetsController {
    constructor(private readonly appService: PlanetsService) {}

  @Get('/:name')
    async getPlanet(@Param('name') name: string): Promise<PlanetDto> {
        const result = await this.appService.getPlanetByName(name)
    
        if(!result) throw new NotFoundException(`Planet with name ${name} not found`);  
    
        return result;
    }

  @Get()
  async getAllPlanets(): Promise<PlanetDto[]> {
      const result = await this.appService.getAllPlanets()
      return result;
  }

  @Post()
  async insertPlanet(@Body() planet: PlanetDto) {
      await this.appService.createPlanet(planet)
  }

  @Put('/:name')
  @HttpCode(204)
  async updatePlanet(@Param('name') name: string, @Body() valuesToUpdate: PlanetUpdateDto) {
      const result = await this.appService.updatePlanet(name, valuesToUpdate) 
      if(!result) throw new NotFoundException(`Planet with name ${name} not found`);  
  }
}
