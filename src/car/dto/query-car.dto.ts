import { IsDateString, IsOptional, Matches } from 'class-validator';

export class QueryCarDto {
	@IsOptional()
	@IsDateString({ strict: true, strictSeparator: true })
	@Matches(/T.*Z$/, { message: 'startDate must include a UTC time ending in Z' })
	startDate?: string;

	@IsOptional()
	@IsDateString({ strict: true, strictSeparator: true })
	@Matches(/T.*Z$/, { message: 'endDate must include a UTC time ending in Z' })
	endDate?: string;
}
