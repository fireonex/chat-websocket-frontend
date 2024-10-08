import styles from "../app/App.module.css";
import {chatThunks} from "../app/chat-reducer";
import React from "react";
import {AppDispatch, useAppSelector} from "../app/store";
import {useDispatch} from "react-redux";

type Props = {
    setMessage: (message: string) => void
    message: string
    name: string
}

export const ChatButtons = ({ setMessage, message, name }: Props) => {
    const error = useAppSelector(state => state.chat.error);
    const dispatch = useDispatch<AppDispatch>();

    const sendMessageHandler = () => {
        dispatch(chatThunks.setClientMessage(message)).then((result) => {
            setMessage('');
        });
    }

    const saveNameHandler = () => {
        console.log("Saving name:", name); // Логирование
        dispatch(chatThunks.setClientName(name));
    }

    return (
        <div className={styles.buttonGroup}>
            <button
                className={styles.button}
                onClick={saveNameHandler}
            >
                Save Name
            </button>
            <button
                className={styles.button}
                onClick={sendMessageHandler}
                disabled={!!error}
            >
                Send
            </button>
        </div>
    );
}

