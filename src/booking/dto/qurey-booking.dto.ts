import { IsEnum, IsNumber, IsOptional } from "class-validator";


export class QueryBookingDto {
    @IsOptional()
    @IsNumber()
    page?: string;

    @IsOptional()
    @IsNumber()
    limit?: string;

    @IsOptional()
    @IsEnum(['createdAt', 'totalPrice', 'startDate'])
    sortBy?: string;     

    @IsOptional()
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: string;  
}