import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    // Admin: get all questions with answers
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    async findBySubStage(@Query('subStage') subStageId: string) {
        return this.questionsService.findBySubStage(subStageId);
    }

    // Student: get random quiz questions (no answers)
    @UseGuards(JwtAuthGuard)
    @Get('quiz/:subStageId')
    async getQuizQuestions(
        @Param('subStageId') subStageId: string,
        @Query('count') count?: string,
    ) {
        return this.questionsService.getQuizQuestions(subStageId, count ? parseInt(count) : 5);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.questionsService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: any, @Request() req) {
        return this.questionsService.create(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.questionsService.update(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.questionsService.delete(id);
    }
}
