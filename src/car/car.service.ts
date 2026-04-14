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

@Injectable()
export class CarService {
	constructor(
		@InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
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
	async findAll(): Promise<CarDocument[]> {
		return this.carModel.find().exec();
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
			const result = await this.carModel
				.findByIdAndUpdate(id, updateCarDto, { new: true })
				.exec();
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
