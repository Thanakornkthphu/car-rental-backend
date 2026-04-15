import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model } from 'mongoose';
import { CarService } from 'src/car/car.service';

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
		const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);

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
	async getAllBooking() {
		const bookings = await this.bookingModel.find().exec();
		
		return bookings
	}

	// find one booking
	findOne(userId: string, bookingId: string) {
		return `This action returns a #${bookingId} booking`;
	}

	// update booking
	update(userId: string, bookingId: string) {
		return `This action updates a #${bookingId} booking`;
	}

	async remove(userId: string, bookingId: string) {
		const booking = await this.bookingModel.findById(bookingId).exec();

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (booking.user.toString() !== userId) {
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
