import { Controller, Post } from "@nestjs/common";


@Controller('auth')
export class AuthController {
    @Post('register')
    async regsiter(){
        return{
            statusCode: '00',
        }
    }
}