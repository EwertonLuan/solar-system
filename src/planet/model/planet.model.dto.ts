import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PlanetDto {
    
    @IsString()
    @IsNotEmpty()
    public name: string
    
    @IsNumber()
    @IsNotEmpty()
    public diameterInKilometers: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Maximum distance to the Sun',
    })
    public aphelion: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Minimum distance to the Sun',
    })
    public perihelion: number
    
}