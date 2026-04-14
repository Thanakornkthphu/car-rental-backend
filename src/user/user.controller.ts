import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile/me')
    @UseGuards(JwtAuthGuard)
    findUserByEmail(@Request() req: { user: { userId: string } } ) {
        return this.userService.findUserById(req.user.userId);
    }

    @Get('allUsers')
    @UseGuards(JwtAuthGuard)
    findAllUsers() {
        return this.userService.findAllUsers();
    }
}
