import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async signup(signupDto: SignupDto) {
		const existingUser = await this.userService.findUserByEmail(
			signupDto.email,
		);
		if (existingUser) {
			throw new ConflictException('Something went wrong');
		}
		const hashedPassword = await bcrypt.hash(signupDto.password, 10);
		const newUser = await this.userService.createUser({
			...signupDto,
			password: hashedPassword,
		});

		return {
			message: 'User created successfully',
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			}
		};
	}

	async login(loginDto: LoginDto) {
		const user = await this.userService.findUserByEmail(loginDto.email);
		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}
    
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
	
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
	}
}
