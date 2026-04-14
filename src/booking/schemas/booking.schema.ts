import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
    car: Types.ObjectId;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    totalPrice: number;

    @Prop({
        default: 'pending',
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    })
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const BookingSchema = SchemaFactory.createForClass(Booking);