import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) { }

    @UseGuards(JwtAuthGuard)
    @Get('start/:subStageId')
    async startQuiz(@Param('subStageId') subStageId: string, @Request() req) {
        return this.quizzesService.startQuiz(subStageId, req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('submit/:subStageId')
    async submitQuiz(
        @Param('subStageId') subStageId: string,
        @Request() req,
        @Body() body: { questionIds: string[]; answers: number[] },
    ) {
        return this.quizzesService.submitQuiz(subStageId, req.user._id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('attempts/:subStageId')
    async getAttempts(@Param('subStageId') subStageId: string, @Request() req) {
        return this.quizzesService.getAttempts(subStageId, req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('passed/:subStageId')
    async hasPassedSubStage(@Param('subStageId') subStageId: string, @Request() req) {
        const passed = await this.quizzesService.hasPassedSubStage(subStageId, req.user._id);
        return { success: true, passed };
    }
}
