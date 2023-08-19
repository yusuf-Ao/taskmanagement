import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSignUpDto } from './dto/user-signup.dto';
import { CustomResponse } from 'src/common/custom-response';
import { UserSignInDto } from './dto/user-signin.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ){}


    async userSignUp(userSignUpDto: UserSignUpDto): Promise<CustomResponse> {
        try {
            const response = new CustomResponse();

            const { email, username, password } = userSignUpDto;
            const user = new User();
            user.email = email;
            user.username = username;
            user.salt = await bcrypt.genSalt();
            user.password = await this.hashPassword(password, user.salt);
            response.data = await user.save();
    
            return response;
        } catch (error) {
            throw new ConflictException('Invalid Credentials');
        }
    }

    async userSignIn(userSignInDto: UserSignInDto): Promise<CustomResponse> {
        try {
            const response = new CustomResponse();
            const { username, password } = userSignInDto;

            const user = await this.userRepository.findOneBy({username});

            if (await user.isValidPassword(password)) {
                const payload: JwtPayload = { sub: user.id, username: user.username }
                response.data = { accessToken: await this.jwtService.signAsync(payload) };
                return response;
            }

            response.success = false;
            response.data = 'Failure';
            return response;
        } catch (error) {
            throw new ConflictException()
        }
    }


    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
