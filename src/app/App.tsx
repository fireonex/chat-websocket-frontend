import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "./store";
import {chatThunks} from "./chat-reducer";
import {InputWithButtons} from "../components/InputWithButtons";
import {Messages} from "../components/Messages";

function App() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);

    const messagesAnchorRef = useRef<HTMLDivElement>(null);

    const messages = useAppSelector(state => state.chat.messages);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(chatThunks.createConnection());

        return () => {
            dispatch(chatThunks.destroyConnection());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);


    return (
        <div className={styles.container}>
            <div className={styles.chatWrapper}>
                <Messages messagesAnchorRef={messagesAnchorRef} setIsAutoScrollActive={setIsAutoScrollActive}/>
                <InputWithButtons message={message} name={name} setName={setName} setMessage={setMessage}/>
            </div>
        </div>
    );
}

export default App;
