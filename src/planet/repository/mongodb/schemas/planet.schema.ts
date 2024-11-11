import * as mongoose from 'mongoose';

export const PlanetSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    diameterInKilometers: { type: Number, required: true},
    aphelion: { type: Number, required: true},
    perihelion: { type: Number, required: true}
});