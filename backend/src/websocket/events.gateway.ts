import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JobsService } from '../jobs/jobs.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(EventsGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private jobsService: JobsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, payload.sub);
      
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
      
      // Join user to their personal room for notifications
      client.join(`user_${payload.sub}`);
      
      // Join technician to technician room if applicable
      if (payload.role === 'technician') {
        client.join('technicians');
      }

      // Join managers to manager room
      if (['admin', 'manager'].includes(payload.role)) {
        client.join('managers');
      }

      client.emit('connected', { message: 'Successfully connected to FireLink WebSocket' });
    } catch (error) {
      this.logger.error('WebSocket connection failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('job_status_update')
  async handleJobStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { jobId: string; status: string },
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) return;

      // Update job status in database
      const job = await this.jobsService.updateStatus(payload.jobId, {
        status: payload.status,
        actual_start_time: payload.status === 'in_progress' ? new Date() : undefined,
        actual_end_time: payload.status === 'completed' ? new Date() : undefined,
      });

      // Broadcast update to all interested parties
      this.server.to(`job_${payload.jobId}`).emit('job_updated', job);
      this.server.to('technicians').emit('job_status_changed', job);
      
      // Notify managers
      this.server.to('managers').emit('job_updated', job);

      client.emit('job_update_success', { jobId: payload.jobId });
    } catch (error) {
      client.emit('job_update_error', { error: error.message });
    }
  }

  @SubscribeMessage('join_job_room')
  handleJoinJobRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() jobId: string,
  ) {
    client.join(`job_${jobId}`);
    this.logger.log(`Client ${client.id} joined job room: ${jobId}`);
  }

  @SubscribeMessage('leave_job_room')
  handleLeaveJobRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() jobId: string,
  ) {
    client.leave(`job_${jobId}`);
  }

  @SubscribeMessage('technician_location')
  handleTechnicianLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() location: { lat: number; lng: number; jobId?: string },
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) return;

    // Broadcast location to managers and relevant users
    this.server.to('managers').emit('technician_location_update', {
      userId,
      ...location,
      timestamp: new Date(),
    });

    if (location.jobId) {
      this.server.to(`job_${location.jobId}`).emit('technician_location', {
        userId,
        ...location,
      });
    }
  }

  // Method to emit events from services
  emitJobCreated(job: any) {
    this.server.emit('job_created', job);
    this.server.to('technicians').emit('new_job_assignment', job);
  }

  emitJobUpdated(job: any) {
    this.server.to(`job_${job.id}`).emit('job_updated', job);
    this.server.emit('jobs_updated'); // For list refreshes
  }

  emitFormSubmitted(form: any) {
    this.server.to(`job_${form.job_id}`).emit('form_submitted', form);
    this.server.to('managers').emit('compliance_form_submitted', form);
  }

  emitDefectCreated(defect: any) {
    this.server.to(`job_${defect.job_id}`).emit('defect_created', defect);
    this.server.to('managers').emit('new_defect_reported', defect);
  }
}
