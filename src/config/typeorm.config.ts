import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/entities/user.entity";
import { Task } from "src/tasks/entities/task.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgress',
    database: 'taskmanagement',
    //entities: [__dirname + '../**/**.entity.ts'],
    entities: [Task, User],
    synchronize: true,
};