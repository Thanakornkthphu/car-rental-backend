import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
    booking: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'credit_card', enum: ['credit_card'] })
    method: string;

    @Prop({ required: true })
    cardLast4: string;

    @Prop({ required: true })
    cardHolder: string;

    @Prop({ default: 'pending', enum: ['pending', 'success', 'failed'] })
    status: 'pending' | 'success' | 'failed';

    @Prop()
    paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
