import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: true,
})
export class User {
	@Prop()
	name: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: 'user', enum: ['user', 'admin'] })
	role: 'user' | 'admin';

	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
