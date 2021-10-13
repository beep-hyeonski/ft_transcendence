import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginStatusDto } from './dto/user-login-status.dto';
import { FtAuthGuard } from './strategy/ft-auth.guard';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { TwoFactorTokenDto } from 'src/auth/dto/two-factor-token.dto';
import { Permission } from './strategy/permission.decorator';
import { JwtPermission } from './dto/jwt-payload.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'intra42를 통한 로그인 요청' })
  @ApiFoundResponse({ description: 'intra42 Grant 페이지로 로그인' })
  @UseGuards(FtAuthGuard)
  @Get('login')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async logIn() {}

  @ApiOperation({
    summary: 'intra42 로그인 callback url',
    description:
      '로그인 callback url. 처리 후 로그인 상태(회원 가입 필요, 2단계 인증 필요, 완료)에 대한 데이터 전송',
  })
  @ApiFoundResponse({
    description:
      '로그인 완료, jwt는 cookie로 발급, app_url/auth?type={type}으로 redirect, type에 따라 signup/twofa/ban 처리 진행',
  })
  @UseGuards(FtAuthGuard)
  @Get('callback')
  async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      const loginRet = await this.authService.logIn(req.user);
      res
        .cookie('p_auth', loginRet.jwt)
        .redirect(`${process.env.CLIENT_APP_URL}/auth?type=${loginRet.status}`);
    } catch (error) {
      if (error.message === 'User is banned') {
        res.redirect(`${process.env.CLIENT_APP_URL}/auth?type=banned`);
      } else {
        throw error;
      }
    }
  }

  @ApiOperation({ summary: '회원 가입' })
  @ApiCreatedResponse({ description: '회원가입 성공, response로 jwt 발급' })
  @ApiBadRequestResponse({
    description: '중복 닉네임 불가 (Duplicated Nickname)',
  })
  @Permission(JwtPermission.SIGNUP)
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  async signUp(@Req() req: any, @Body() userInfo: CreateUserDto) {
    const signUpRet = await this.usersService.signUp(req.user, userInfo);
    return { jwt: signUpRet.jwt };
  }

  @ApiOperation({
    summary: '2단계 인증',
    description: '이메일로 전송된 2단계 인증 토큰으로 유저 확인, 로그인 처리',
  })
  @ApiCreatedResponse({ description: '2단계 인증 성공, response로 jwt 발급' })
  @ApiNotFoundResponse({ description: '등록되어 있지 않은 유저 (Not Found)' })
  @ApiForbiddenResponse({
    description:
      '2FA가 활성화되어 있지 않은 경우 (Did Not Turn On 2-Factor Authorization)',
  })
  @ApiUnauthorizedResponse({
    description: '잘못된 2FA 토큰 (Invalid 2-Factor Token)',
  })
  @Permission(JwtPermission.TWOFA)
  @UseGuards(JwtAuthGuard)
  @Post('twofa')
  async TwoFactorAuth(
    @Req() req: any,
    @Body() twoFactorTokenDto: TwoFactorTokenDto,
  ) {
    const twoFARet = await this.authService.checkTwoFactor(
      req.user,
      twoFactorTokenDto,
    );
    return { jwt: twoFARet.jwt };
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '유저의 status offline 처리',
  })
  @ApiNoContentResponse({ description: '로그아웃 성공, jwt 삭제 필요' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Req() req: any, @Res() res: Response) {
    await this.authService.logOut(req.user);
    res.status(204).send();
  }
}
