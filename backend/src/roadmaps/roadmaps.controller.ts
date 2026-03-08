import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('roadmaps')
export class RoadmapsController {
    constructor(private readonly roadmapsService: RoadmapsService) { }

    @Get()
    async findAll(@Query('all') all?: string) {
        return this.roadmapsService.findAll(all !== 'true');
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.roadmapsService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: any, @Request() req) {
        return this.roadmapsService.create(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.roadmapsService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.roadmapsService.delete(id);
    }
}
