import styles from "../app/App.module.css";
import {Message, User} from "../common/types/common-types";
import React from "react";
import {useAppSelector} from "../app/store";

type Props = {
   messagesAnchorRef: React.RefObject<HTMLDivElement>;
    setIsAutoScrollActive: (isAutoScrollActive: boolean) => void
}

export const Messages = ({messagesAnchorRef, setIsAutoScrollActive}: Props) => {

    const messages = useAppSelector(state => state.chat.messages);
    const typingUsers = useAppSelector(state => state.chat.typingUsers);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
        setIsAutoScrollActive(isBottom);
    };

    return <div className={styles.messages} onScroll={handleScroll}>
        {messages.map((el: Message) => (
            <div key={el.id}>
                <b>{el.user.name}:</b> {el.message}
                <hr/>
            </div>
        ))}
        {
            typingUsers.map((el: User) => (
                <div key={el.id}>
                    <p>{el.name} печатает...</p>
                </div>
            ))}
        <div ref={messagesAnchorRef}></div>
    </div>
}