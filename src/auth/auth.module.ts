import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/jwt-config';

@Module({
  imports: [
      JwtModule.register({
      global: true,
      secret: JwtConfig.secret,
      signOptions: {
        expiresIn: 3600,
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule {}
