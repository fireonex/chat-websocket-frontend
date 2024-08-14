import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../common/api/api";
import { Message, User } from "../common/types/common-types";
import { AppThunk, AppDispatch } from "./store";

const initialState = {
    messages: [] as Message[],
    typingUsers: [] as User[], // Исправлено для множественного числа
};

const slice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        messagesReceived: (state, action: PayloadAction<{ messages: Message[] }>) => {
            state.messages = action.payload.messages;
        },
        newMessagesReceived: (state, action: PayloadAction<{ message: Message }>) => {
            state.messages.push(action.payload.message);
        },
        addedUserTyping: (state, action: PayloadAction<{ user: User }>) => {
            if (!state.typingUsers.some((u) => u.id === action.payload.user.id)) {
                state.typingUsers.push(action.payload.user);
            }
        },
        removeUserTyping: (state, action: PayloadAction<{ userId: string }>) => {
            state.typingUsers = state.typingUsers.filter(u => u.id !== action.payload.userId);
        }
    },
});

export const chatReducer = slice.reducer;
export const chatActions = slice.actions;


export const createConnection = (): AppThunk => async (dispatch: AppDispatch) => {
    api.createConnection();
    api.subscribe(
        (messages: Message[]) => {
            dispatch(chatActions.messagesReceived({ messages }));
        },
        (message: Message) => {
            dispatch(chatActions.newMessagesReceived({ message }));
        },
        (user: User) => {
            dispatch(chatActions.addedUserTyping({ user }));
        }
    );
};

export const destroyConnection = (): AppThunk => async (dispatch: AppDispatch) => {
    api.destroyConnection();
};

export const setClientName = (name: string): AppThunk => async (dispatch: AppDispatch) => {
    api.sentName(name);
};

export const setClientMessage = (message: string): AppThunk => async (dispatch: AppDispatch) => {
    api.sentMessage(message);
};

export const typeMessage = (): AppThunk => async (dispatch: AppDispatch) => {
    api.typeMessage();
};

export const chatThunks = {
    createConnection,
    destroyConnection,
    setClientName,
    setClientMessage,
    typeMessage,
};
