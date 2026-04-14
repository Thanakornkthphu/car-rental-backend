import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
	],
	controllers: [CarController],
	providers: [CarService],
	exports: [CarService],
})
export class CarModule {}
