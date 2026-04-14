import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateCarDto {
	@IsString()
	@IsNotEmpty()
	brand: string;

	@IsString()
	@IsNotEmpty()
	model: string;

	@IsNumber()
	@Min(1990)
	year: number;

	@IsString()
	@IsNotEmpty()
	licensePlate: string;

	@IsNumber()
	@Min(0)
	pricePerDay: number;

	@IsString()
	@IsOptional()
	color?: string;

	@IsNumber()
	@Min(4)
	@IsOptional()
	seats?: number;

	@IsEnum(['auto', 'manual'])
	@IsOptional()
	transmission?: string;

	@IsEnum(['petrol', 'diesel', 'ev', 'hybrid'])
	@IsOptional()
	fuelType?: string;

	@IsString()
	@IsOptional()
	image?: string;
}
