import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { Booking } from './schemas/booking.schema';
import { CarService } from '../car/car.service';

describe('BookingService', () => {
	let service: BookingService;
	const bookingModel = {
		findOne: jest.fn(),
		create: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		bookingModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
		bookingModel.create.mockImplementation(async (booking) => ({
			...booking,
			_id: 'booking-id',
			status: 'pending',
		}));
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{ provide: getModelToken(Booking.name), useValue: bookingModel },
				{
					provide: CarService,
					useValue: {
						findById: jest.fn().mockResolvedValue({
							_id: 'car-id',
							status: 'available',
							pricePerDay: 1000,
						}),
					},
				},
			],
		}).compile();

		service = module.get<BookingService>(BookingService);
	});

	it.each([
		['2027-01-01T09:00:00Z', 1],
		['2027-01-02T08:00:00Z', 1],
		['2027-01-02T11:00:00Z', 1],
		['2027-01-02T11:00:00.001Z', 2],
		['2027-01-02T12:00:00Z', 2],
		['2027-01-03T08:00:00Z', 2],
		['2027-01-03T11:00:00Z', 2],
		['2027-01-03T11:00:00.001Z', 3],
	])('charges %s as %i days', async (endDate, expectedDays) => {
		const result = await service.create('user-id', {
			car: 'car-id',
			startDate: '2027-01-01T08:00:00Z',
			endDate,
		});

		expect(result.booking.totalPrice).toBe(expectedDays * 1000);
		expect(bookingModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ totalPrice: expectedDays * 1000 }),
		);
	});
});
