import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initAdminSocket = () => {
  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Admin Socket] Connected:', socket?.id);
      // Join admin notification room
      socket?.emit('join', 'admin');
    });

    socket.on('disconnect', () => {
      console.log('[Admin Socket] Disconnected');
    });
  }
  return socket;
};

export const getAdminSocket = () => {
  return socket || initAdminSocket();
};

