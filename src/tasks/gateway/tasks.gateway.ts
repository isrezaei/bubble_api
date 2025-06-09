import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({ namespace: 'task' })
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients = new Map<string, Socket>(); // نگهداری WebSocket ها بر اساس userId

  constructor(private readonly prisma: PrismaService) {}

  // هنگام اتصال WebSocket
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    // this.clients.set(userId, client);
  }

  // هنگام قطع ارتباط
  handleDisconnect(client: Socket) {
    // const userId = client.handshake.query.userId;
    // this.clients.delete(userId);
  }

  // زمانی که داده‌ای برای یک کاربر آپدیت می‌شود
  @SubscribeMessage('updateData')
  async handleDataUpdate(
    @MessageBody() newValue: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.query.userId;


    // const updatedData = await this.userDataService.updateData(userId, newValue);


    // client.emit('dataUpdated', updatedData);
  }


  // sendDataToAllUsers(data: any) {
  //   this.clients.forEach((client) => {
  //     client.emit('dataUpdated', data);
  //   });
  // }
}
