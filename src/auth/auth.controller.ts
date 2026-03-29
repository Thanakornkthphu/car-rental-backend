import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
