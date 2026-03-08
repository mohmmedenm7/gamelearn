import { Controller, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() body: { name?: string; username?: string }) {
        return this.usersService.updateProfile(req.user._id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Put('avatar')
    async updateAvatar(@Request() req, @Body() body: any) {
        return this.usersService.updateAvatar(req.user._id, body);
    }

    @Get('leaderboard')
    async getLeaderboard(@Query('limit') limit?: string) {
        return this.usersService.getLeaderboard(limit ? parseInt(limit) : 50);
    }

    @Get('leaderboard/weekly')
    async getWeeklyLeaderboard(@Query('limit') limit?: string) {
        return this.usersService.getWeeklyLeaderboard(limit ? parseInt(limit) : 50);
    }

    @Get('username/:username')
    async findByUsername(@Param('username') username: string) {
        const user = await this.usersService.findByUsername(username);
        return {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
            },
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/all')
    async getAllUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.usersService.getAllUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        return {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
                streak: user.streak,
            },
        };
    }
}
