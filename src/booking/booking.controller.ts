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

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(
		@Body() createBookingDto: CreateBookingDto,
		@Req() req: { 
			user: {
				userId: string;
			}
		 } 
	) {
		return this.bookingService.create(req.user.userId, createBookingDto);
	}

	@Get()
	findAll() {
		return this.bookingService.findAll();
	}

	@Get(':id')
	findOne(
		@Param('id') id: string,
		@Req() req: { 
			user: {
				userId: string;
			}
		 } 
	) {
		return this.bookingService.findOne(req.user.userId, id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateBookingDto: UpdateBookingDto,
		@Req() req: { 
			user: {
				userId: string;
			}
		 } 
	) {
		return this.bookingService.update(req.user.userId, id, updateBookingDto);
	}

	@Delete(':id')
	remove(
		@Param('id') id: string,
		@Req() req: { 
			user: {
				userId: string;
			}
		 } 
	) {
		return this.bookingService.remove(req.user.userId, id, UpdateBookingDto);
	}
}
