import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { CarService } from 'src/car/car.service';
import { QueryBookingDto } from './dto/qurey-booking.dto';

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking.name) 
		private readonly bookingModel: Model<BookingDocument>,
		private readonly carService: CarService,
	) {}

	// create booking
	async create(userId: string, createBookingDto: CreateBookingDto) {
		const car = await this.carService.findById(createBookingDto.car);

		if (!car) {
			throw new NotFoundException('Car not found');
		}

		if (car.status === 'coming_soon') {
			throw new BadRequestException('This car is not available for booking yet');
		}

		const startDate = new Date(createBookingDto.startDate); // 10
		const endDate = new Date(createBookingDto.endDate); // 15

		if (endDate <= startDate) {
			throw new BadRequestException('End date must be after start date');
		}

		const existingBooking = await this.bookingModel.findOne({
			car: car._id,
			status: { $ne: 'cancelled' },
			startDate: { $lte: endDate },
			endDate: { $gte: startDate },
		}).exec();

		if (existingBooking) {
			throw new BadRequestException('Car is already booked for this date range');
		}

		const msPerDay = 24 * 60 * 60 * 1000;
		const gracePeriodMs = 3 * 60 * 60 * 1000;
		const durationMs = endDate.getTime() - startDate.getTime();
		const fullDays = Math.floor(durationMs / msPerDay);
		const extraDay = durationMs % msPerDay > gracePeriodMs ? 1 : 0;
		const totalDays = Math.max(1, fullDays + extraDay);

		const totalPrice = totalDays * car.pricePerDay;

		const booking = await this.bookingModel.create({
			user: userId,
			car: car._id,
			startDate,
			endDate,
			totalPrice,
		})

		return {
			message: 'Booking created successfully',
			booking: {
				id: booking._id,
				car: booking.car,
				startDate: booking.startDate,
				endDate: booking.endDate,
				totalPrice: booking.totalPrice,
				status: booking.status,
			},
		};
	}

	// find all bookings
	async getAll(userId: string, role: string, query: QueryBookingDto) {
		const { page, limit, sortBy, sortOrder, status } = query;

		const filter: Record<string, string | number | Date> = {}

		if (role !== 'admin') {
			filter.user = userId;
		}

		if (status) {
			filter.status = status;
		}

		const pageNumber = parseInt(page ?? '1') || 1;
		const limitNumber = parseInt(limit ?? '10') || 10;
		const skip = (pageNumber - 1) * limitNumber;

		const sortByString = sortBy ?? 'createdAt';
		const sortOrderNumber = sortOrder === 'asc' ? 1 : -1;
		//  1 = asc (น้อย → มาก, เก่า → ใหม่)
		// -1 = desc (มาก → น้อย, ใหม่ → เก่า)

		const bookingsQuery = this.bookingModel
			.find(filter)
			.populate('car')
			.sort({ [sortByString]: sortOrderNumber })
			.skip(skip)
			.limit(limitNumber)
			.exec()

		const totalQuery = this.bookingModel.countDocuments(filter);

		const [bookings, total] = await Promise.all([bookingsQuery, totalQuery]);

		return {
			message: 'Bookings fetched successfully',
			data: bookings,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limitNumber),
			}
		}
	}

	// find one booking
	async findOne(userId: string, role: string, bookingId: string) {
		const booking = await this.bookingModel.findById(bookingId).populate('car').exec();

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (booking.user.toString() !== userId && role === 'user') {
			throw new ForbiddenException('You are not allowed to view this booking');
		}

		return booking;
	}

	// update booking status (admin only)
	async update(bookingId: string, updateBookingDto: UpdateBookingDto) {
		const booking = await this.bookingModel.findById(bookingId).exec();

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		booking.status = updateBookingDto.status;
		await booking.save();

		return {
			message: 'Booking updated successfully',
			booking: {
				id: booking._id,
				car: booking.car,
				startDate: booking.startDate,
				endDate: booking.endDate,
				totalPrice: booking.totalPrice,
				status: booking.status,
			},
		};
	}

	async remove(userId: string, role: string, bookingId: string) {
		const booking = await this.bookingModel.findById(bookingId).exec();

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (role !== 'admin' && booking.user.toString() !== userId) {
			throw new ForbiddenException('You are not allowed to cancel this booking');
		}

		if (booking.status === 'cancelled') {
			throw new BadRequestException('Booking is already cancelled');
		}

		booking.status = 'cancelled';
		await booking.save();

		return { message: 'Booking cancelled successfully' };
	}
}
