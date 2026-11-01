import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Car.name, schema: CarSchema },
			{ name: Booking.name, schema: BookingSchema },
		]),
	],
	controllers: [CarController],
	providers: [CarService],
	exports: [CarService],
})
export class CarModule {}
