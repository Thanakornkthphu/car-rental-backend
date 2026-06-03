import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Booking, BookingDocument } from 'src/booking/schemas/booking.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name)
        private readonly paymentModel: Model<PaymentDocument>,
        @InjectModel(Booking.name)
        private readonly bookingModel: Model<BookingDocument>,
    ) {}

    async pay(userId: string, dto: CreatePaymentDto) {
        // 1. หา booking
        const booking = await this.bookingModel.findById(dto.bookingId).exec();
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // 2. ต้องเป็น booking ของตัวเอง
        if (booking.user.toString() !== userId) {
            throw new ForbiddenException('You are not allowed to pay for this booking');
        }

        // 3. จ่ายได้เฉพาะ booking ที่ยัง pending อยู่
        if (booking.status !== 'pending') {
            throw new BadRequestException(`Cannot pay for a booking with status: ${booking.status}`);
        }

        // 4. เช็คว่าเคยจ่ายสำเร็จไปแล้วหรือยัง
        const existingPayment = await this.paymentModel.findOne({
            booking: booking._id,
            status: 'success',
        }).exec();

        if (existingPayment) {
            throw new BadRequestException('This booking has already been paid');
        }

        const cardLast4 = dto.cardNumber.slice(-4);

        // 5. ประมวลผลการจ่ายเงิน (mock)
        //
        // ─── MOCK ───────────────────────────────────────────────────────────
        // บัตร 4111111111111111 = สำเร็จ, บัตรอื่น = ล้มเหลว
        //
        // ─── ถ้าใช้ Stripe จริง จะเป็นแบบนี้แทน ────────────────────────────
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: booking.totalPrice * 100, // Stripe ใช้หน่วย satang/cent
        //     currency: 'thb',
        //     payment_method_data: {
        //         type: 'card',
        //         card: { token: dto.stripeToken }, // FE ส่ง token มา ไม่ส่ง card number ตรงๆ
        //     },
        //     confirm: true,
        // });
        // const isSuccess = paymentIntent.status === 'succeeded';
        // ────────────────────────────────────────────────────────────────────
        const isSuccess = dto.cardNumber.startsWith('4111111111111');

        // 6. บันทึก payment record
        const payment = await this.paymentModel.create({
            booking: booking._id,
            user: userId,
            amount: booking.totalPrice,
            cardLast4,
            cardHolder: dto.cardHolder,
            status: isSuccess ? 'success' : 'failed',
            paidAt: isSuccess ? new Date() : undefined,
        });

        // 7. ถ้าจ่ายสำเร็จ → เปลี่ยน booking status เป็น confirmed
        if (isSuccess) {
            booking.status = 'confirmed';
            await booking.save();
        }

        return {
            message: isSuccess ? 'Payment successful' : 'Payment failed',
            payment: {
                id: payment._id,
                bookingId: booking._id,
                amount: payment.amount,
                method: payment.method,
                cardLast4: payment.cardLast4,
                status: payment.status,
                paidAt: payment.paidAt,
            },
        };
    }

    async getPaymentByBooking(userId: string, role: string, bookingId: string) {
        const booking = await this.bookingModel.findById(bookingId).exec();
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (role !== 'admin' && booking.user.toString() !== userId) {
            throw new ForbiddenException('You are not allowed to view this payment');
        }

        const payment = await this.paymentModel
            .findOne({ booking: bookingId })
            .sort({ createdAt: -1 })
            .exec();

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        return payment;
    }
}
