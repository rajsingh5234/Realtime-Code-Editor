import { io } from 'socket.io-client';

export let socket;

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    socket = io(process.env.REACT_APP_BACKEND_URL, options);
};
