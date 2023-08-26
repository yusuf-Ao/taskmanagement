import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomResponse } from 'common/dto/custom-response';
import { GetTaskFilterDto } from 'common/dto/get-task-filter.dto';
import { AddTaskDto } from '../../../common/dto/add-task.dto';
import { Task } from '../../../common/entities/task.entity';
import { TaskStatusValidationPipe } from '../../../common/pipes/task-status-validation.pipe';
import { TaskStatus } from '../../../common/constants';
import { TasksService } from '../service/tasks.service';
import { GetUser } from 'common/decorators/get-user.decorator';
import { User } from 'common/entities/user.entity';
import { Response } from 'express';
import { Public } from 'common/decorators/public-route.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  @Public()
  @UsePipes(ValidationPipe)
  getAllTasks(
    @Query() taskFilterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getTasksByFilter(user, taskFilterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addTask(
    @Res() response: Response,
    @Body() addTaskDto: AddTaskDto,
    @GetUser() user: User,
  ): Promise<CustomResponse> {
    const res = new CustomResponse();
    try {
      res.data = this.taskService.addTask(addTaskDto, user);
      res.statusCode = response.statusCode;
      return res;
    } catch (error) {
      res.error = error;
      res.success = false;
    }
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: number): Promise<CustomResponse> {
    return this.taskService.deleteTaskById(id);
  }
}
