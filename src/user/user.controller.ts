import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as AuthTypes from 'src/auth/types/jwt-payload';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile/me')
    @UseGuards(JwtAuthGuard)
    findUserByEmail(@Request() req: AuthTypes.RequestWithUser) {
        return this.userService.findUserById(req.user.userId);
    }

    @Get('allUsers')
    @UseGuards(JwtAuthGuard)
    findAllUsers() {
        return this.userService.findAllUsers();
    }
}
