import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    // ═══ Public / Student ═══

    @Get('substage/:subStageId')
    async getProjectsForSubStage(@Param('subStageId') subStageId: string) {
        return this.projectsService.getProjectsForSubStage(subStageId);
    }

    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        return this.projectsService.getProjectById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/submit')
    async submitProject(
        @Param('id') id: string,
        @Request() req,
        @Body() body: { content: string; fileUrl?: string },
    ) {
        return this.projectsService.submitProject(id, req.user._id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('submissions/my')
    async getMySubmissions(@Request() req, @Query('project') projectId?: string) {
        return this.projectsService.getMySubmissions(req.user._id, projectId);
    }

    // ═══ Admin ═══

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createProject(@Body() body: any, @Request() req) {
        return this.projectsService.createProject(body, req.user._id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async updateProject(@Param('id') id: string, @Body() body: any) {
        return this.projectsService.updateProject(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteProject(@Param('id') id: string) {
        return this.projectsService.deleteProject(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/pending')
    async getPendingSubmissions() {
        return this.projectsService.getPendingSubmissions();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put('admin/grade/:submissionId')
    async gradeSubmission(
        @Param('submissionId') submissionId: string,
        @Request() req,
        @Body() body: { grade: number; feedback: string; status: 'passed' | 'failed' },
    ) {
        return this.projectsService.gradeSubmission(submissionId, req.user._id, body);
    }
}
