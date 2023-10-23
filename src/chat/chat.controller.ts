import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';
import { CreateMessageDto } from './dto/createMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  sendMessageToChat(
    @User() user: RequestUser,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.sendMessageToChat(user, createMessageDto);
  }
}
