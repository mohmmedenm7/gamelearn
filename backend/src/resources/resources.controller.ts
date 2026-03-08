import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Get()
    async findBySubStage(@Query('subStage') subStageId: string) {
        return this.resourcesService.findBySubStage(subStageId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.resourcesService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: any, @Request() req) {
        return this.resourcesService.create(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.resourcesService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.resourcesService.delete(id);
    }
}
