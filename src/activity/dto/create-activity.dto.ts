import { IsDate, IsNotEmpty, MinLength } from "class-validator";

export class CreateActivityDto {
    @MinLength(3)
    name: string;
    @IsNotEmpty()
    background: string;

    @IsDate()
    startDate: Date;
    @IsDate()
    endDate: Date;
}


