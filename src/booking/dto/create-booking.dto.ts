import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    car: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
