import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { isValidObjectId, Model, mongo } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { InjectModel } from '@nestjs/mongoose';

function isDuplicateKeyError(
  error: unknown,
): error is mongo.MongoServerError & { keyPattern: Record<string, number> } {
  return error instanceof mongo.MongoServerError && error.code === 11000;
}

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

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

  async findAll(): Promise<CarDocument[]> {
    return this.carModel.find().exec();
  }

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
