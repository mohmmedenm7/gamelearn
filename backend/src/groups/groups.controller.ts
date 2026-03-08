import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createGroup(@Request() req, @Body() body: any) {
        return this.groupsService.createGroup(req.user._id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('join/code')
    async joinByCode(@Request() req, @Body('inviteCode') inviteCode: string) {
        return this.groupsService.joinByCode(req.user._id, inviteCode);
    }

    @UseGuards(JwtAuthGuard)
    @Post('join/username')
    async joinByUsername(
        @Request() req,
        @Body('username') username: string,
        @Body('groupId') groupId: string,
    ) {
        return this.groupsService.joinByUsername(req.user._id, username, groupId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    async getMyGroups(@Request() req) {
        return this.groupsService.getMyGroups(req.user._id);
    }

    @Get('search')
    async searchGroups(@Query('q') query: string) {
        return this.groupsService.searchGroups(query || '');
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getGroupDetails(@Param('id') id: string, @Request() req) {
        return this.groupsService.getGroupDetails(id, req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateGroup(@Param('id') id: string, @Request() req, @Body() body: any) {
        return this.groupsService.updateGroup(id, req.user._id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/leave')
    async leaveGroup(@Param('id') id: string, @Request() req) {
        return this.groupsService.leaveGroup(id, req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteGroup(@Param('id') id: string, @Request() req) {
        return this.groupsService.deleteGroup(id, req.user._id);
    }
}
