import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('levels')
export class LevelsController {
    constructor(private readonly levelsService: LevelsService) { }

    @Get()
    async findByRoadmap(@Query('roadmap') roadmapId: string) {
        return this.levelsService.findByRoadmap(roadmapId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.levelsService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: any, @Request() req) {
        return this.levelsService.create(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.levelsService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.levelsService.delete(id);
    }
}
