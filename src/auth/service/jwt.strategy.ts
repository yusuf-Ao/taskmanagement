import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from '../../../common/dto/jwt-payload.dto';
import { User } from '../../../common/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'myscret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      this.logger.log('Attempting to validate payload');
      const { sub: id, username } = payload;
      const user = this.userRepository.findOneBy({ id, username });
      if (!user) {
        this.logger.error('User not found.');
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
