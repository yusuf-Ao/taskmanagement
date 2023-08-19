import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtConfig } from "src/common/jwt-config";
import { JwtPayload } from "./dto/jwt-payload.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JwtConfig.secret
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { sub: id, username } = payload;
        const user = this.userRepository.findOneBy({id, username});

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}