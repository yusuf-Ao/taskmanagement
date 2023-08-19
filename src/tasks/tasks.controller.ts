import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { AddTaskDto } from './dto/add-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { CustomResponse } from 'src/common/custom-response';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    @UsePipes(ValidationPipe)
    getAllTasks(@Query() taskFilterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskService.getTasksByFilter(taskFilterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    addTask(@Body() addTaskDto: AddTaskDto): Promise<Task> { 
        return this.taskService.addTask(addTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
        ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete('/:id') 
    deleteTaskById(@Param('id') id: number): Promise<CustomResponse> {
       return this.taskService.deleteTaskById(id);
    } 
}
