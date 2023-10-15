import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import {
  GroupChatMessage,
  JoinCommentDto,
  JoinGroupChatDto,
  PostCommentMessage,
} from './dto/joinGroupChat.dto';

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

  @SubscribeMessage('message:groupchat')
  handleChat(
    @MessageBody() data: GroupChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`groupchat:${data.activityId}`).emit('message:groupchat', data); // Broadcast the message to all clients in the room
  }

  @SubscribeMessage('postcomment:join')
  joinComment(
    @MessageBody() data: JoinCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('postComment', data);
    client.join(`postcomment:${data.postId}`); // Join the room
  }

  @SubscribeMessage('postcomment:leave')
  leaveComment(
    @MessageBody() data: JoinCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`postComment:${data.postId}`); // Leave the room
  }

  @SubscribeMessage('message:comment')
  handleComment(
    @MessageBody() data: PostCommentMessage,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`postcomment:${data.postId}`).emit('message:postcomment', data); // Broadcast the message to all clients in the room
  }
}
