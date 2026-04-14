import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema({
	timestamps: true,
})
export class Car {
	@Prop({ required: true })
	brand: string;

	@Prop({ required: true })
	model: string;

	@Prop({ required: true })
	year: number;

	@Prop({ required: true, unique: true })
	licensePlate: string;

	@Prop({ required: true })
	pricePerDay: number;

	@Prop()
	color: string;

	@Prop({ default: 4 })
	seats: number;

	@Prop({ default: 'auto', enum: ['auto', 'manual'] })
	transmission: string;

	@Prop({
		default: 'petrol',
		enum: ['petrol', 'diesel', 'electric', 'hybrid'],
	})
	fuelType: string;

	@Prop()
	image: string;

	@Prop({ default: true })
	available: boolean;
}

export const CarSchema = SchemaFactory.createForClass(Car);
