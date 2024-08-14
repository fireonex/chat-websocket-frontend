import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "./store";
import { chatThunks } from "./chat-reducer";
import { Message, User } from "../common/types/common-types";

function App() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);

    const messagesAnchorRef = useRef<HTMLDivElement>(null);

    const messages = useAppSelector(state => state.chat.messages);
    const typingUsers = useAppSelector(state => state.chat.typingUsers);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(chatThunks.createConnection());

        return () => {
            dispatch(chatThunks.destroyConnection());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
        setIsAutoScrollActive(isBottom);
    };

    return (
        <div className={styles.container}>
            <div className={styles.chatWrapper}>
                <div className={styles.messages} onScroll={handleScroll}>
                    {messages.map((el: Message) => (
                        <div key={el.id}>
                            <b>{el.user.name}:</b> {el.message}
                            <hr/>
                        </div>
                    ))}
                    {typingUsers.map((el: User) => (
                        <div key={el.id}>
                            <b>{el.name}:</b> печатает...
                        </div>
                    ))}
                    <div ref={messagesAnchorRef}></div>
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
                        onKeyPress={() => {
                            dispatch(chatThunks.typeMessage())
                        }}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        rows={3}
                        placeholder="Enter your message"
                    />
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                dispatch(chatThunks.setClientName(name));
                            }}
                        >
                            Save Name
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                dispatch(chatThunks.setClientMessage(message));
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
