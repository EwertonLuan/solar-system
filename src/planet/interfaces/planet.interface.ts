import { Document } from 'mongoose';

export interface IPlanet extends Document {
    name: string
    diameterInKilometers: number
    aphelion: number
    perihelion: number
}