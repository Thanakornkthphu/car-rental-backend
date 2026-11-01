import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { QueryCarDto } from './dto/query-car.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('cars')
export class CarController {
	constructor(private readonly carService: CarService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('admin')
	create(@Body() createCarDto: CreateCarDto) {
		return this.carService.create(createCarDto);
	}

	@Get()
	getAllCars(@Query() query: QueryCarDto) {
		return this.carService.getAllCars(query);
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.carService.findById(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('admin')
	update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
		return this.carService.update(id, updateCarDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('admin')
	remove(@Param('id') id: string) {
		return this.carService.remove(id);
	}
}
