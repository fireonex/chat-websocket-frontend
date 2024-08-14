import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { io } from "socket.io-client";

const socket = io('https://chat-websocket-backend.vercel.app/');

type User = {
    id: string;
    name: string;
}

type Message = {
    message: string;
    id: string;
    user: User;
}

function App() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        socket.on('init-messages-published', (messages: Message[]) => {
            setMessages(messages);
        });
        socket.on('new-message-sent', (message: Message) => {
            setMessages((messages) => [...messages, message]);
        });
        // Cleanup function to avoid memory leaks
        return () => {
            socket.off('init-messages-published');
            socket.off('new-message-sent');
        };
    }, []);

    // useEffect(() => {
    //
    // }, [messages]);

    return (
        <div className={styles.container}>
            <div className={styles.chatWrapper}>
                <div className={styles.messages}>
                    {messages.map((el) => (
                        <div key={el.id}>
                            <b>{el.user.name}:</b> {el.message}
                            <hr />
                        </div>
                    ))}
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.inputField}
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Enter your name"
                    />
                    <textarea
                        className={styles.textarea}
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        rows={3}
                        placeholder="Enter your message"
                    />
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                socket.emit('client-name-sent', name);
                            }}
                        >
                            Save Name
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                socket.emit('client-message-sent', message);
                                setMessage('');
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
