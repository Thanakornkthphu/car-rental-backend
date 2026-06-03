import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as AuthTypes from 'src/auth/types/jwt-payload';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('pay')
    @UseGuards(JwtAuthGuard)
    pay(
        @Body() createPaymentDto: CreatePaymentDto,
        @Req() req: AuthTypes.RequestWithUser,
    ) {
        return this.paymentService.pay(req.user.userId, createPaymentDto);
    }

    @Get(':bookingId')
    @UseGuards(JwtAuthGuard)
    getPaymentByBooking(
        @Param('bookingId') bookingId: string,
        @Req() req: AuthTypes.RequestWithUser,
    ) {
        return this.paymentService.getPaymentByBooking(req.user.userId, req.user.role, bookingId);
    }
}
