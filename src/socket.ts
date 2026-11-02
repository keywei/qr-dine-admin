import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initAdminSocket = (): Socket => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(socketUrl, { transports: ['websocket', 'polling'] });
    socket.on('connect', () => socket?.emit('join', 'admin'));
  }
  return socket;
};

export const getAdminSocket = (): Socket => {
  return socket || initAdminSocket();
};
