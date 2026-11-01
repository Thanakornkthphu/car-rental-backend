import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Car } from './schemas/car.schema';
import { Booking } from '../booking/schemas/booking.schema';

describe('CarService', () => {
	let service: CarService;
	const cars = [{ _id: 'free-car', status: 'available' }];
	const carModel = { find: jest.fn() };
	const bookingModel = { distinct: jest.fn() };

	beforeEach(async () => {
		jest.clearAllMocks();
		carModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(cars) });
		bookingModel.distinct.mockReturnValue({
			exec: jest.fn().mockResolvedValue(['booked-car']),
		});
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CarService,
				{ provide: getModelToken(Car.name), useValue: carModel },
				{ provide: getModelToken(Booking.name), useValue: bookingModel },
			],
		}).compile();

		service = module.get<CarService>(CarService);
	});

	it('returns all cars without checking bookings when no dates are provided', async () => {
		expect(await service.getAllCars()).toEqual(cars);
		expect(carModel.find).toHaveBeenCalledWith();
		expect(bookingModel.distinct).not.toHaveBeenCalled();
	});

	it('excludes overlapping non-cancelled bookings and coming-soon cars', async () => {
		const query = {
			startDate: '2027-01-01T08:00:00Z',
			endDate: '2027-01-02T12:00:00Z',
		};

		expect(await service.getAllCars(query)).toEqual(cars);
		expect(bookingModel.distinct).toHaveBeenCalledWith('car', {
			status: { $ne: 'cancelled' },
			startDate: { $lte: new Date(query.endDate) },
			endDate: { $gte: new Date(query.startDate) },
		});
		expect(carModel.find).toHaveBeenCalledWith({
			_id: { $nin: ['booked-car'] },
			$or: [{ status: 'available' }, { status: { $exists: false } }],
		});
	});

	it('still filters by bookable status when no bookings overlap', async () => {
		bookingModel.distinct.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
		await service.getAllCars({
			startDate: '2027-01-01T08:00:00Z',
			endDate: '2027-01-02T12:00:00Z',
		});
		expect(carModel.find).toHaveBeenCalledWith(expect.objectContaining({
			_id: { $nin: [] },
			$or: [{ status: 'available' }, { status: { $exists: false } }],
		}));
	});

	it.each([
		{ startDate: '2027-01-01T08:00:00Z' },
		{ endDate: '2027-01-02T08:00:00Z' },
		{ startDate: '2027-01-01T08:00:00Z', endDate: '2027-01-01T08:00:00Z' },
		{ startDate: '2027-01-02T08:00:00Z', endDate: '2027-01-01T08:00:00Z' },
	])('rejects an incomplete or reversed range: %j', async (query) => {
		await expect(service.getAllCars(query)).rejects.toBeInstanceOf(BadRequestException);
		expect(carModel.find).not.toHaveBeenCalled();
		expect(bookingModel.distinct).not.toHaveBeenCalled();
	});
});
