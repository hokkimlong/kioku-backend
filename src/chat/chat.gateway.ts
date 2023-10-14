import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GroupChatMessage, JoinGroupChatDto } from './dto/joinGroupChat.dto';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('groupchat:join')
  joinGroupChat(
    @MessageBody() data: JoinGroupChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joinGroupChat', data);
    client.join(`groupchat:${data.activityId}`); // Join the room
  }

  @SubscribeMessage('groupchat:leave')
  leaveGroupChat(
    @MessageBody() data: JoinGroupChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`groupchat:${data.activityId}`); // Leave the room
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: GroupChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`groupchat:${data.activityId}`).emit('message', data); // Broadcast the message to all clients in the room
  }
}
