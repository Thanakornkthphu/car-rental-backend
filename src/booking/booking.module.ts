import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { CarModule } from 'src/car/car.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
		CarModule,
	],
	controllers: [BookingController],
	providers: [BookingService],
})
export class BookingModule {}
