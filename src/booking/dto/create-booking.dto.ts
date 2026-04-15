import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    car: string;

    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
        message: 'startDate must be in ISO 8601 format (e.g. 2026-04-20T09:00:00Z)',
    })
    @IsNotEmpty()
    startDate: string;

    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
        message: 'endDate must be in ISO 8601 format (e.g. 2026-04-20T09:00:00Z)',
    })
    @IsNotEmpty()
    endDate: string;
}
