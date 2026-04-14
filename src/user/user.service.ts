import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isDuplicateKeyError } from 'src/Utils/Utils';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async createUser(user: Partial<User>): Promise<UserDocument> {
		try {
			return await this.userModel.create(user);
		} catch (error) {
			if (isDuplicateKeyError(error)) {
				const field = Object.keys(error.keyPattern)[0];
				throw new ConflictException(`${field} already exists`);
			}
			throw new BadRequestException('Failed to create user');
		}
	}

	async findUserByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async findUserById(id: string): Promise<UserDocument | null> {
		return this.userModel.findById(id).exec();
	}

	async findAllUsers() {
		const result = await this.userModel.find().exec();
		return result.map(user => {
			return {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			}
		})
	}
}
