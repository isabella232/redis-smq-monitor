import { io, Socket } from 'socket.io-client';

const API_URL = process.env.API_URL ?? '';
let socket: Socket | null = null;

const connect = async (): Promise<Socket> => {
    console.log('Trying to connect to WS server...');
    return new Promise((resolve, reject) => {
        const ws = io(API_URL);
        ws.once('connect', () => {
            console.log('Successfully connected to WS server.');
            resolve(ws);
        });
        ws.once('connect_error', (e: Error) => {
            console.error('An error occurred while trying to connect to WS server.');
            reject(e);
        });
    });
};

const Websocket = async () => {
    if (!socket) {
        socket = await connect();
        socket.once('disconnect', () => {
            socket = null;
        });
    }
    return socket;
};

export default Websocket;
