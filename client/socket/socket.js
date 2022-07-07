import {io} from "socket.io-client";
import React from 'react';

export const socket = io(process.env.REACT_APP_socket_END_POINT, {
    transports: ['websocket'],
    withCredentials: true,
  });
export const SocketContext = React.createContext();

