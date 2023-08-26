import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CustomResponse } from 'common/dto/custom-response';
import { Repository } from 'typeorm';
import { JwtPayload } from '../../../common/dto/jwt-payload.dto';
import { UserSignInDto } from '../../../common/dto/user-signin.dto';
import { UserSignUpDto } from '../../../common/dto/user-signup.dto';
import { User } from '../../../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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

  async userSignIn(userSignInDto: UserSignInDto): Promise<any> {
    try {
      const { username, password } = userSignInDto;

      const user = await this.userRepository.findOneBy({ username });

      if (await user.isValidPassword(password)) {
        const payload: JwtPayload = { sub: user.id, username: user.username };
        return { accessToken: await this.jwtService.signAsync(payload) };
      }

      throw new UnauthorizedException();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
