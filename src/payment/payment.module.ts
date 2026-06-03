import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Booking, BookingSchema } from 'src/booking/schemas/booking.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payment.name, schema: PaymentSchema },
            { name: Booking.name, schema: BookingSchema },
        ]),
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
