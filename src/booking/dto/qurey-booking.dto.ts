import { IsEnum, IsOptional, IsString } from "class-validator";


export class QueryBookingDto {
    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
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