import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { isValidObjectId, Model } from 'mongoose';
import { isDuplicateKeyError } from '../Utils/Utils';
import { Car, CarDocument } from './schemas/car.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';
import { QueryCarDto } from './dto/query-car.dto';

@Injectable()
export class CarService {
	constructor(
		@InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
		@InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
	) {}


	// create
	async create(createCarDto: CreateCarDto): Promise<CarDocument> {
		try {
			return await this.carModel.create(createCarDto);
		} catch (error) {
			if (isDuplicateKeyError(error)) {
				const field = Object.keys(error.keyPattern)[0];
				throw new ConflictException(`${field} already exists`);
			}
			throw new BadRequestException('Failed to create car');
		}
	}


	// find all
	async getAllCars(query: QueryCarDto = {}): Promise<CarDocument[]> {
		const { startDate, endDate } = query;

		if (startDate === undefined && endDate === undefined) {
			return this.carModel.find().exec();
		}

		if (startDate === undefined || endDate === undefined) {
			throw new BadRequestException('startDate and endDate must be provided together');
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (end <= start) {
			throw new BadRequestException('End date must be after start date');
		}

		const bookedCarIds = await this.bookingModel.distinct('car', {
			status: { $ne: 'cancelled' },
			startDate: { $lte: end },
			endDate: { $gte: start },
		}).exec();

		return this.carModel.find({
			_id: { $nin: bookedCarIds },
			$or: [{ status: 'available' }, { status: { $exists: false } }],
		}).exec();
	}

	// find by id
	async findById(id: string): Promise<CarDocument> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('Invalid car ID');
		}
		const result = await this.carModel.findById(id).exec();
		if (!result) {
			throw new NotFoundException('Car not found');
		}
		return result;
	}

	// update
	async update(id: string, updateCarDto: UpdateCarDto): Promise<CarDocument> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('Invalid car ID');
		}
		try {
			const result = await this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
			if (!result) {
				throw new NotFoundException('Car not found');
			}
			return result;
		} catch (error) {
			if (isDuplicateKeyError(error)) {
				const field = Object.keys(error.keyPattern)[0];
				throw new ConflictException(`${field} already exists`);
			}
			throw error;
		}
	}

	// delete
	async remove(id: string): Promise<{ message: string }> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('Invalid car ID');
		}
		const result = await this.carModel.findByIdAndDelete(id).exec();
		if (!result) {
			throw new NotFoundException('Car not found');
		}
		return { message: 'Car deleted successfully' };
	}
}
