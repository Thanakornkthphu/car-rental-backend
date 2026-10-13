import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema({
	timestamps: true,
	toJSON: {
		transform: (_document, car) => {
			Reflect.deleteProperty(car, 'available');
			return car;
		},
	},
})
export class Car {
	@Prop({ required: true })
	brand: string;

	@Prop({ required: true })
	model: string;

	@Prop({ required: true })
	year: number;

	@Prop({ unique: true, sparse: true })
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
		enum: ['petrol', 'diesel', 'ev', 'hybrid'],
	})
	fuelType: string;

	@Prop()
	image: string;

	@Prop({ type: [String], default: [] })
	images: string[];

	@Prop({ default: 'available', enum: ['available', 'coming_soon'] })
	status: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
