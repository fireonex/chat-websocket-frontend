import { io, Socket } from "socket.io-client";
import {Message, User} from "../types/common-types";

export const api = {
    socket: null as null | Socket,
    createConnection() {
        this.socket = io('https://eff1a773-2617-446e-a3ae-279ac887e44f-00-3q6d1tbffzf1p.worf.replit.dev/')
    },
    subscribe(
        initMessagesHandler: (messages: Message[]) => void,
        newMessageSentHandler: (message: Message) => void,
        userTypingHandler: (user: User) => void,
    ) {
        this.socket?.on('init-messages-published', initMessagesHandler);
        this.socket?.on('new-message-sent', newMessageSentHandler);
        this.socket?.on('user-typing', userTypingHandler);
    },
    destroyConnection() {
        this.socket?.disconnect()
        this.socket = null
    },
    sentName(name: string) {
        this.socket?.emit('client-name-sent', name)
    },
    sentMessage(message: string) {
        this.socket?.emit('client-message-sent', message, (error: string | null) => {
            if (error) alert(error)
        })
    },
    typeMessage() {
        this.socket?.emit('client-typed')
    },
}
