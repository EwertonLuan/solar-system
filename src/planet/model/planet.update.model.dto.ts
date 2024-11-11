import { IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PlanetUpdateDto {
    
    @IsString()
    @IsOptional()
    public name?: string
    
    @IsNumber()
    @IsOptional()
    public diameterInKilometers?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Maximum distance to the Sun',
    })
    public aphelion?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Minimum distance to the Sun',
    })
    public perihelion?: number
    
}