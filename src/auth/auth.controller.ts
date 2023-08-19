import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { CustomResponse } from 'src/common/custom-response';
import { UserSignInDto } from './dto/user-signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){};

    @Post('/signup')
    async userSignUp(@Body() userSignUpDto: UserSignUpDto): Promise<CustomResponse> {
        return this.authService.userSignUp(userSignUpDto);
    }

    @Post('/signin') 
    async userSignIn(@Body() userSignInDto: UserSignInDto): Promise<CustomResponse> {
        return this.authService.userSignIn(userSignInDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user);
    }
}
