import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../common/entities/task.entity';
import { TasksController } from './controller/tasks.controller';
import { TasksService } from './service/tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task])
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
