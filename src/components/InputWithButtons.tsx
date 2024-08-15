import styles from "../app/App.module.css";
import {chatActions, chatThunks} from "../app/chat-reducer";
import {ChatButtons} from "./ChatButtons";
import React, {ChangeEvent} from "react";
import {AppDispatch, useAppSelector} from "../app/store";
import {useDispatch} from "react-redux";


type Props = {
    setMessage: (message: string) => void
    message: string
    setName: (name: string) => void
    name: string
}


export const InputWithButtons = ({setMessage, message, name, setName}: Props) => {

    const error = useAppSelector(state => state.chat.error);
    const dispatch = useDispatch<AppDispatch>();

    const setMessageHandler = (e: ChangeEvent<HTMLTextAreaElement> ) => {
        setMessage(e.currentTarget.value);
        dispatch(chatActions.errorOccurred({ error: null }));
    }

    return <div className={styles.inputWrapper}>
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
            onChange={setMessageHandler}
            rows={3}
            placeholder="Enter your message"
        />
        {error && <div>{error}</div>}
        <ChatButtons setMessage={setMessage} message={message} name={name}/>
    </div>
}