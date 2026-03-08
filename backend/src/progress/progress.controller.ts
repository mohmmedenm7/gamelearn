import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserProgress(@Request() req) {
        return this.progressService.getUserProgress(req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('roadmap/:roadmapId')
    async getRoadmapProgress(@Request() req, @Param('roadmapId') roadmapId: string) {
        return this.progressService.getRoadmapProgress(req.user._id, roadmapId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getUserStats(@Request() req) {
        return this.progressService.getUserStats(req.user._id);
    }
}
