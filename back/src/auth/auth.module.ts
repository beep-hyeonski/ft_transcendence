import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { jwtConstants } from './strategy/constants';
import { FtStrategy } from './strategy/ft.strategy';
import { UsersModule } from 'src/users/users.module';
import { MailjetModule } from '@clever-app/nestjs-mailjet';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([User]),
    MailjetModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('MJ_APIKEY_PUBLIC'),
        apiSecret: configService.get<string>('MJ_APIKEY_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
