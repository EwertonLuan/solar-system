import { UnprocessableEntityException } from "@nestjs/common";

export class DuplicatedPlanetException extends UnprocessableEntityException {
    constructor(message: string) {
        super(message);
    }
}