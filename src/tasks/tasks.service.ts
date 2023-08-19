import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { AddTaskDto } from './dto/add-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CustomResponse } from 'src/common/custom-response';




@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>
    ){}

    async getTaskById(id: number): Promise<Task> {
        const task = await this.tasksRepository.findOneBy({id: id});
        if (!task) {
            throw new NotFoundException(`Task with id "${id}" is not found`);
        }
        return task;
    }


    async getTasksByFilter(taskFilter: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = taskFilter;
        const query = this.tasksRepository.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%`})
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async addTask(addTaskDto: AddTaskDto): Promise<Task> {
        const {title, description} = addTaskDto;

        const task =  new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await this.tasksRepository.save(task);

        return task;
    }

    async deleteTaskById(id: number): Promise<CustomResponse> {
        const response = new CustomResponse();
        const task = await this.tasksRepository.delete(id);
        if (task.affected === 0) {
            response.message = `Unable to delete task with id ${id}`;
        }
        return response;
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
