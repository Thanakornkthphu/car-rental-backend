import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import * as AuthTypes from 'src/auth/types/jwt-payload';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile/me')
    @UseGuards(JwtAuthGuard)
    getMe(@Request() req: AuthTypes.RequestWithUser) {
        return this.userService.findUserById(req.user.userId);
    }

    @Get('allUsers')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    findAllUsers() {
        return this.userService.findAllUsers();
    }
}
