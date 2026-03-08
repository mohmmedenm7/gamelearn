import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SubstagesService } from './substages.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('substages')
export class SubstagesController {
    constructor(private readonly substagesService: SubstagesService) { }

    @Get()
    async findByLevel(@Query('level') levelId: string) {
        return this.substagesService.findByLevel(levelId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.substagesService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: any, @Request() req) {
        return this.substagesService.create(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.substagesService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.substagesService.delete(id);
    }
}
