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
	Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import * as AuthTypes from 'src/auth/types/jwt-payload';
import { QueryBookingDto } from './dto/qurey-booking.dto';

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
	@UseGuards(JwtAuthGuard)
	getAll(
		@Query() query: QueryBookingDto,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.getAll(req.user.userId, req.user.role, query);
	}

	@Get(':bookingId')
	@UseGuards(JwtAuthGuard)
	findOne(
		@Param('bookingId') bookingId: string,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.findOne(req.user.userId, req.user.role, bookingId);
	}

	@Patch(':bookingId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('admin')
	update(
		@Param('bookingId') bookingId: string,
		@Body() updateBookingDto: UpdateBookingDto,
	) {
		return this.bookingService.update(bookingId, updateBookingDto);
	}

	@Delete(':bookingId')
	@UseGuards(JwtAuthGuard)
	remove(
		@Param('bookingId') bookingId: string,
		@Req() req: AuthTypes.RequestWithUser,
	) {
		return this.bookingService.remove(req.user.userId, req.user.role, bookingId);
	}
}
