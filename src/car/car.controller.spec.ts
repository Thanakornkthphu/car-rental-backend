import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { QueryCarDto } from './dto/query-car.dto';

describe('CarController', () => {
	let controller: CarController;
	const carService = { getAllCars: jest.fn() };
	const pipe = new ValidationPipe({ whitelist: true, transform: true });

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CarController],
			providers: [{ provide: CarService, useValue: carService }],
		}).compile();

		controller = module.get<CarController>(CarController);
	});

	it('passes validated dates to the availability search', async () => {
		const query = await pipe.transform({
			startDate: '2027-01-01T08:00:00Z',
			endDate: '2027-01-02T12:00:00Z',
		}, { type: 'query', metatype: QueryCarDto });
		carService.getAllCars.mockResolvedValue([]);
		expect(await controller.getAllCars(query)).toEqual([]);
		expect(carService.getAllCars).toHaveBeenCalledWith(query);
	});

	it('allows listing without a date filter', async () => {
		await expect(pipe.transform({}, { type: 'query', metatype: QueryCarDto }))
			.resolves.toEqual({});
	});

	it.each([
		'not-a-date',
		'2027-02-30T08:00:00Z',
		'2027-01-01',
		'2027-01-01T08:00:00',
		'',
		['2027-01-01T08:00:00Z'],
	])('rejects malformed dates: %j', async (startDate) => {
		await expect(pipe.transform({ startDate }, { type: 'query', metatype: QueryCarDto }))
			.rejects.toBeInstanceOf(BadRequestException);
	});
});
