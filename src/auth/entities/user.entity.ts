import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'user_id',
    })
    id: number;

    @Column({
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        nullable: false,
        default: '',
    })
    @Exclude()
    password: string;


    @Column({
        nullable: false,
        default: '',
    })
    @Exclude()
    salt: string;

    async isValidPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}