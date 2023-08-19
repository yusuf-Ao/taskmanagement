import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserSignInDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @MinLength(6)
    @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s])/)
    password: string;
}