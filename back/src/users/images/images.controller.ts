import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { JwtPermission } from 'src/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { Permission } from 'src/auth/strategy/permission.decorator';
import { multerOptions } from './multer.options';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  @ApiOperation({
    summary: '이미지 업로드',
    description:
      'jpg, jpeg, png, gif 유형의 파일 업로드 가능, multipart/form-data 형식으로 image 필드에 요청 (image 필드가 없거나 비어있는 경우에도 200 응답함. 추후 수정 예정)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '업로드된 이미지의 URL',
  })
  @Permission(JwtPermission.SIGNUP, JwtPermission.GENERAL)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  uploadAvatar(@Req() req: any) {
    /*
     * body data 필터링 logic 추가 필요
     */
    return {
      status: 'SUCCESS',
      image: `${process.env.SERVER_DOMAIN}/images/${req.avatarUUID}`,
    };
  }

  @ApiOperation({
    summary: '이미지 요청 url',
    description: '업로드 시 응답받은 url에 GET 요청',
  })
  @ApiOkResponse({ description: '이미지 데이터 응답' })
  @Get(':image')
  getAvatar(
    @Param('image') image: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const path = join(process.cwd(), 'images', image);
    if (!existsSync(path)) {
      res.status(404).send();
      return;
    }

    const file = createReadStream(path);
    res.setHeader('Content-Type', `image/${image.split('.')[1]}`);
    return new StreamableFile(file);
  }
}
