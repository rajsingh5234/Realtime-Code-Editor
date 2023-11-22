import React, { useEffect, useRef, useState } from 'react'
import Client from './Components/Client'
import CodeEditor from './Components/CodeEditor'
import { initSocket } from '../../config/socket'
import ACTIONS from '../../Constants/Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Editor = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const [code, setCode] = useState("");
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();

    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect', () => {
                toast.success('Connected to the server');
            });

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username
            })

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId
                })
            })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((currentClients) => {
                    const updatedClients = currentClients.filter((client) => client.socketId !== socketId);
                    return updatedClients;
                })
            })
        }
        init();

        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, [])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    setCode(code);
                    codeRef.current = code;
                }
            })
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        }
    }, [socketRef.current])

    const onCodeChange = (code) => {
        setCode(code);
        codeRef.current = code;
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
        });
    }

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    const leaveRoom = () => {
        reactNavigator('/');
    }

    if (!location.state || !location.state.username) {
        <Navigate to="/" />
    }

    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img className='logoImage' src="/code-sync.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className='clientList'>
                        {
                            clients.map((client) => {
                                return (
                                    <Client
                                        key={client.socketId}
                                        username={client.username}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
            </div>
            <div className='editorWrap'>
                <CodeEditor
                    socketRef={socketRef}
                    roomId={roomId}
                    code={code}
                    onCodeChange={onCodeChange}
                />
            </div>
        </div>
    )
}

export default Editor