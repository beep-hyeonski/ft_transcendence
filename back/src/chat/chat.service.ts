import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatStatus } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getChats() {
    return await this.chatRepository.find({
      relations: ['ownerUser'],
    });
  }

  async getChat(chatIndex: number): Promise<Chat> {
    return await this.chatRepository.findOneOrFail({
      relations: [
        'ownerUser',
        'adminUsers',
        'joinUsers',
        'mutedUsers',
        'bannedUsers',
      ],
      where: { index: chatIndex },
    });
  }

  async createChat(jwtPayloadDto: JwtPayloadDto, createChatDto: CreateChatDto) {
    const user = await this.userRepository.findOneOrFail({
      relations: ['ownerChannels'],
      where: { index: jwtPayloadDto.sub },
    });

    if (user.username !== createChatDto.owner)
      throw new BadRequestException('Invalid Owner');
    if (createChatDto.password && createChatDto.status !== ChatStatus.PROTECTED)
      throw new BadRequestException('Invalid Chat Status');

    const createChat = new Chat();

    for (const fieldName in createChatDto) {
      createChat[fieldName] = createChatDto[fieldName];
    }

    createChat.adminUsers.push(user);
    await this.userRepository.save(user);
    await this.chatRepository.save(createChat);

    return createChat;
  }

  async updateChat(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    updateChatDto: UpdateChatDto,
  ) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser'],
      where: { index: chatIndex },
    });

    if (chat.ownerUser.index !== jwtPayloadDto.sub)
      throw new UnauthorizedException('No Permission');
    if (updateChatDto.status !== ChatStatus.PROTECTED && updateChatDto.password)
      throw new BadRequestException('Do Not set Password if not protected');

    for (const fieldName in updateChatDto) {
      chat[fieldName] = updateChatDto[fieldName];
    }

    await this.chatRepository.save(chat);
    return chat;
  }

  async deleteChat(jwtPayloadDto: JwtPayloadDto, chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser'],
      where: { index: chatIndex },
    });

    if (chat.ownerUser.index !== jwtPayloadDto.sub)
      throw new UnauthorizedException('No Permission');

    return await this.chatRepository.delete(chat);
  }

  async joinChat(jwtPayloadDto: JwtPayloadDto, chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['joinUsers'],
      where: { index: chatIndex },
    });

    const user = await this.userRepository.findOneOrFail({
      where: { index: jwtPayloadDto.sub },
    });

    if (
      chat.joinUsers.find((joinUser) => {
        if (joinUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('Already user joined');
    }

    chat.joinUsers.push(user);
    await this.chatRepository.save(chat);

    return chat;
  }

  async leaveChat(jwtPayloadDto: JwtPayloadDto, chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['joinUsers'],
      where: { index: chatIndex },
    });

    const user = await this.userRepository.findOneOrFail({
      where: { index: jwtPayloadDto.sub },
    });

    if (
      !chat.joinUsers.find((joinUser) => {
        if (joinUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User Not Entered this chat');
    }

    chat.joinUsers = chat.joinUsers.filter((joinUser) => {
      joinUser.index !== user.index;
    });
    await this.chatRepository.save(chat);

    return chat;
  }

  async registerAdmin(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.sub !== chat.ownerUser.index)
      throw new UnauthorizedException('No Permission');
    // if (this.existUserInChat(user.index, chat) === false)
    // 	throw new BadRequestException('Do not join user this chat');
    if (
      chat.adminUsers.find((adminUser) => {
        if (adminUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User is already admin');
    }

    chat.adminUsers.push(user);
    await this.chatRepository.save(chat);

    return chat;
  }

  async unRegisterAdmin(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.sub !== chat.ownerUser.index)
      throw new UnauthorizedException('No Permission');
    if (
      !chat.adminUsers.find((adminUser) => {
        if (adminUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User is not admin');
    }

    chat.adminUsers = chat.adminUsers.filter((adminUser) => {
      adminUser.index !== user.index;
    });
    await this.chatRepository.save(chat);

    return chat;
  }

  async registerMuteUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'mutedUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.sub !== chat.ownerUser.index) {
      if (
        !chat.adminUsers.find((adminUser) => {
          if (adminUser.index === jwtPayloadDto.sub) {
            return true;
          }
        })
      ) {
        throw new UnauthorizedException('No Permission');
      }
    }
    if (
      chat.adminUsers.find((adminUser) => {
        if (adminUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('Impossible mute for owner / admin user');
    }
    // if (this.existUserInChat(user.index, chat) === false)
    // 	throw new BadRequestException('Do not join user this chat');
    if (
      chat.mutedUsers.find((mutedUser) => {
        if (mutedUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User have already been muted');
    }

    chat.mutedUsers.push(user);
    await this.chatRepository.save(chat);

    return chat;
  }

  async unRegisterMuteUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'mutedUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.sub !== chat.ownerUser.index) {
      if (
        !chat.adminUsers.find((adminUser) => {
          if (adminUser.index === jwtPayloadDto.sub) {
            return true;
          }
        })
      ) {
        throw new UnauthorizedException('No Permission');
      }
    }
    if (
      !chat.mutedUsers.find((mutedUser) => {
        if (mutedUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User have not been muted');
    }

    chat.mutedUsers = chat.mutedUsers.filter((mutedUser) => {
      mutedUser.index !== user.index;
    });
    await this.chatRepository.save(chat);

    return chat;
  }

  async registerBanUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'bannedUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.username !== chat.ownerUser.username) {
      if (
        !chat.adminUsers.find((adminUser) => {
          if (adminUser.index === jwtPayloadDto.sub) {
            return true;
          }
        })
      ) {
        throw new UnauthorizedException('No Permission');
      }
    }
    if (
      chat.adminUsers.find((adminUser) => {
        if (adminUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('Impossible ban for owner / admin user');
    }
    // if (this.existUserInChat(user.index, chat) === false)
    // 	throw new BadRequestException('Do not join user this chat');
    if (
      chat.bannedUsers.find((bannedUser) => {
        if (bannedUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User have already been banned');
    }

    chat.bannedUsers.push(user);
    await this.chatRepository.save(chat);

    return chat;
  }

  async unRegisterBanUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username: username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'bannedUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.username !== chat.ownerUser.username) {
      if (
        !chat.adminUsers.find((adminUser) => {
          if (adminUser.index === jwtPayloadDto.sub) {
            return true;
          }
        })
      ) {
        throw new UnauthorizedException('No Permission');
      }
    }
    if (
      !chat.bannedUsers.find((bannedUser) => {
        if (bannedUser.index === user.index) {
          return true;
        }
      })
    ) {
      throw new BadRequestException('User have not been banned');
    }

    chat.bannedUsers = chat.bannedUsers.filter((bannedUser) => {
      bannedUser.index !== user.index;
    });
    await this.chatRepository.save(chat);

    return chat;
  }

  async getMessages(chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['messages'],
      where: { index: chatIndex },
    });

    return chat.messages;
  }

  existUserInChat(userIndex: number, chat: Chat): boolean {
    for (let index = 0; index < chat.joinUsers.length; index++) {
      if (chat.joinUsers[index].index === userIndex) return true;
    }
    return false;
  }
}
