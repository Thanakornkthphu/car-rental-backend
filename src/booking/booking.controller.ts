import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as AuthTypes from 'src/auth/types/jwt-payload';

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(
		@Body() createBookingDto: CreateBookingDto,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.create(req.user.userId, createBookingDto);
	}

	@Get()
	getAllBooking() {
		return this.bookingService.getAllBooking();
	}

	@Get(':bookingId')
	findOne(
		@Param('bookingId') bookingId: string,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.findOne(req.user.userId, bookingId);
	}

	@Patch(':id')
	update(
		@Param('id') bookingId: string,
		@Body() updateBookingDto: UpdateBookingDto,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.update(req.user.userId, bookingId);
	}

	@Delete(':bookingId')
	remove(
		@Param('bookingId') bookingId: string,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.remove(req.user.userId, bookingId);
	}
}
