import { IsNumber } from 'class-validator';
import { RequestUser } from 'src/auth/utils/user-decorator';

export class JoinGroupChatDto {
  @IsNumber()
  activityId: number;
}

export class GroupChatMessage {
  activityId: number;
  message: string;
  sender: RequestUser;
}
