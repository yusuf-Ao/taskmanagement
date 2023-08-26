import { Body, Controller, Post, Res } from '@nestjs/common';
import { CustomResponse } from 'common/dto/custom-response';
import { UserSignInDto } from '../../../common/dto/user-signin.dto';
import { UserSignUpDto } from '../../../common/dto/user-signup.dto';
import { AuthService } from '../service/auth.service';
import { Public } from 'common/decorators/public-route.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  async userSignUp(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<CustomResponse> {
    return this.authService.userSignUp(userSignUpDto);
  }

  @Public()
  @Post('/signin')
  async userSignIn(
    @Res() response: Response,
    @Body() userSignInDto: UserSignInDto,
  ): Promise<CustomResponse> {
    const res = new CustomResponse();
    try {
      res.data = await this.authService.userSignIn(userSignInDto);
      res.statusCode = response.statusCode;
      console.log(res);
      return res;
    } catch (error) {
      res.error = error;
      res.success = false;
      res.statusCode = response.statusCode;
      return res;
    }
  }
}
