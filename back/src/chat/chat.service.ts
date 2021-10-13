import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatStatus } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { hash, isHashValid } from '../utils/encrypt';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  server: Server;

  attachServer(server: Server) {
    this.server = server;
  }

  async getChats() {
    return await this.chatRepository.find({
      relations: ['ownerUser', 'joinUsers'],
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

    if (
      createChatDto.status === ChatStatus.PROTECTED &&
      !createChatDto.password
    ) {
      throw new BadRequestException('Password Required');
    }

    if (createChatDto.password) {
      if (createChatDto.status !== ChatStatus.PROTECTED)
        throw new BadRequestException('Invalid Chat Status');
      createChatDto.password = await hash(createChatDto.password);
    }

    const createChat = new Chat();

    for (const fieldName in createChatDto) {
      createChat[fieldName] = createChatDto[fieldName];
    }

    createChat.ownerUser = user;
    createChat.adminUsers = [user];
    createChat.joinUsers = [user];

    return await this.chatRepository.save(createChat);
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
      throw new ForbiddenException('Permission Denied');
    if (updateChatDto.status !== ChatStatus.PROTECTED && updateChatDto.password)
      throw new BadRequestException('Do Not set Password if not protected');
    if (
      chat.status === ChatStatus.PUBLIC &&
      updateChatDto.status === ChatStatus.PROTECTED &&
      (!updateChatDto.password ||
        !(
          updateChatDto.password.length >= 8 &&
          updateChatDto.password.length <= 20
        ))
    ) {
      throw new BadRequestException(
        'Valid 8 ~ 20 Characters of Password Required',
      );
    }
    if (
      chat.status === ChatStatus.PROTECTED &&
      updateChatDto.status === ChatStatus.PROTECTED &&
      updateChatDto.password
    ) {
      if (
        !(
          updateChatDto.password.length >= 8 &&
          updateChatDto.password.length <= 20
        )
      ) {
        throw new BadRequestException(
          'Valid 8 ~ 20 Characters of Password Required',
        );
      }
    }

    if (updateChatDto.password) {
      updateChatDto.password = await hash(updateChatDto.password);
    }

    for (const fieldName in updateChatDto) {
      chat[fieldName] = updateChatDto[fieldName];
    }

    await this.chatRepository.save(chat);
    return chat;
  }

  async deleteChat(user: User, chatIndex: number) {
    if (user.role === UserRole.USER) {
      throw new ForbiddenException('Permission Denied');
    }

    const chat = await this.chatRepository.findOneOrFail({
      where: { index: chatIndex },
    });

    this.server.to(String(chat.index)).emit('deleteChat', chat);

    return await this.chatRepository.remove(chat);
  }

  async joinChat(user: User, chatIndex: number, password: string) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['joinUsers', 'bannedUsers'],
      where: { index: chatIndex },
    });

    if (chat.joinUsers.find((joinUser) => joinUser.index === user.index)) {
      throw new BadRequestException('Already joined user');
    }

    if (
      chat.bannedUsers &&
      chat.bannedUsers.find((bannedUser) => bannedUser.index === user.index)
    )
      throw new BadRequestException('User Banned');

    if (chat.status === ChatStatus.PROTECTED) {
      if (!password) {
        throw new BadRequestException('Password Required');
      }

      if (!(await isHashValid(password, chat.password))) {
        throw new BadRequestException('Invalid Password');
      }
    }

    chat.joinUsers.push(user);
    await this.chatRepository.save(chat);

    return chat;
  }

  async leaveChat(user: User, chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers'],
      where: { index: chatIndex },
    });

    if (!chat.joinUsers.find((joinUser) => joinUser.index === user.index)) {
      throw new BadRequestException('User Not Entered this chat');
    }

    if (chat.joinUsers.length === 1) {
      this.chatRepository.remove(chat);
    } else {
      chat.joinUsers = chat.joinUsers.filter(
        (joinUser) => joinUser.index !== user.index,
      );
      chat.adminUsers = chat.adminUsers.filter(
        (adminUser) => adminUser.index !== user.index,
      );
      if (chat.ownerUser.index === user.index) {
        chat.ownerUser = chat.joinUsers[0];
        chat.adminUsers.push(chat.ownerUser);
      }

      return await this.chatRepository.save(chat);
    }
  }

  async registerAdmin(user: User, chatIndex: number, username: string) {
    const toBeAdmin = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers'],
      where: { index: chatIndex },
    });

    if (user.index !== chat.ownerUser.index && user.role === UserRole.USER)
      throw new ForbiddenException('Permission Denied');

    if (!this.existUserInChat(toBeAdmin.index, chat))
      throw new BadRequestException('User is not in the chat');

    if (
      chat.adminUsers.find((adminUser) => adminUser.index === toBeAdmin.index)
    )
      throw new BadRequestException('User is already admin');

    chat.adminUsers.push(toBeAdmin);
    await this.chatRepository.save(chat);

    return chat;
  }

  async unRegisterAdmin(user: User, chatIndex: number, username: string) {
    const toNotBeAdmin = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers'],
      where: { index: chatIndex },
    });

    if (user.index !== chat.ownerUser.index && user.role === UserRole.USER)
      throw new ForbiddenException('Permission Denied');

    if (
      !chat.adminUsers.find(
        (adminUser) => adminUser.index === toNotBeAdmin.index,
      )
    ) {
      throw new BadRequestException('User is not admin');
    }

    if (chat.ownerUser.index === toNotBeAdmin.index) {
      throw new BadRequestException('Owner cannot be removed from admin');
    }

    chat.adminUsers = chat.adminUsers.filter(
      (adminUser) => adminUser.index !== toNotBeAdmin.index,
    );
    await this.chatRepository.save(chat);

    return chat;
  }

  async registerMuteUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'mutedUsers'],
      where: { index: chatIndex },
    });

    if (
      jwtPayloadDto.sub !== chat.ownerUser.index &&
      !chat.adminUsers.find(
        (adminUser) => adminUser.index === jwtPayloadDto.sub,
      )
    ) {
      throw new ForbiddenException('Permission Denied');
    }

    if (chat.adminUsers.find((adminUser) => adminUser.index === user.index)) {
      throw new BadRequestException('Impossible to mute owner or admin');
    }

    if (chat.mutedUsers.find((mutedUser) => mutedUser.index === user.index)) {
      throw new BadRequestException('User have already been muted');
    }

    if (!this.existUserInChat(user.index, chat))
      throw new BadRequestException('User is not in the chat');

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
      where: { username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'mutedUsers'],
      where: { index: chatIndex },
    });

    if (jwtPayloadDto.sub !== chat.ownerUser.index) {
      if (
        !chat.adminUsers.find(
          (adminUser) => adminUser.index === jwtPayloadDto.sub,
        )
      ) {
        throw new ForbiddenException('Permission Denied');
      }
    }
    if (!chat.mutedUsers.find((mutedUser) => mutedUser.index === user.index)) {
      throw new BadRequestException('User have not been muted');
    }

    chat.mutedUsers = chat.mutedUsers.filter(
      (mutedUser) => mutedUser.index !== user.index,
    );

    await this.chatRepository.save(chat);

    return chat;
  }

  async registerBanUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
    });

    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'bannedUsers'],
      where: { index: chatIndex },
    });

    if (
      jwtPayloadDto.username !== chat.ownerUser.username &&
      !chat.adminUsers.find(
        (adminUser) => adminUser.index === jwtPayloadDto.sub,
      )
    ) {
      throw new ForbiddenException('Permission Denied');
    }

    if (chat.adminUsers.find((adminUser) => adminUser.index === user.index)) {
      throw new BadRequestException('Impossible to ban owner or admin');
    }

    if (
      chat.bannedUsers.find((bannedUser) => bannedUser.index === user.index)
    ) {
      throw new BadRequestException('User have already been banned');
    }

    if (this.existUserInChat(user.index, chat) === false)
      throw new BadRequestException('User is not in the chat');

    chat.bannedUsers.push(user);
    chat.joinUsers = chat.joinUsers.filter(
      (joinUser) => joinUser.index !== user.index,
    );
    await this.chatRepository.save(chat);

    return chat;
  }

  async unRegisterBanUser(
    jwtPayloadDto: JwtPayloadDto,
    chatIndex: number,
    username: string,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['ownerUser', 'adminUsers', 'joinUsers', 'bannedUsers'],
      where: { index: chatIndex },
    });

    if (
      jwtPayloadDto.username !== chat.ownerUser.username &&
      !chat.adminUsers.find(
        (adminUser) => adminUser.index === jwtPayloadDto.sub,
      )
    ) {
      throw new ForbiddenException('Permission Denied');
    }

    if (
      !chat.bannedUsers.find((bannedUser) => bannedUser.index === user.index)
    ) {
      throw new BadRequestException('User have not been banned');
    }

    chat.bannedUsers = chat.bannedUsers.filter(
      (bannedUser) => bannedUser.index !== user.index,
    );
    await this.chatRepository.save(chat);

    return chat;
  }

  async getMessages(user: User, chatIndex: number) {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['joinUsers'],
      where: { index: chatIndex },
    });

    if (
      user.role !== UserRole.USER ||
      chat.joinUsers.find((joinUser) => joinUser.index === user.index)
    ) {
      return await this.messageRepository.find({
        where: { chat: chat },
        relations: ['sendUser'],
        order: { createdAt: 'ASC' },
      });
    } else {
      throw new ForbiddenException('Permission Denied');
    }
  }

  existUserInChat(userIndex: number, chat: Chat): boolean {
    for (let index = 0; index < chat.joinUsers.length; index++) {
      if (chat.joinUsers[index].index === userIndex) return true;
    }
    return false;
  }
}
