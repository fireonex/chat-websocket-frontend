import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {api} from "../common/api/api";
import {Message, User} from "../common/types/common-types";
import {AppDispatch, AppThunk} from "./store";

const initialState = {
    messages: [] as Message[],
    typingUsers: [] as User[],
    error: null as string | null
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
        errorOccurred: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
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

export const setClientMessage =
    (message: string): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
        return new Promise<void>((resolve, reject) => {
            if (message.length === 0) {
                dispatch(chatActions.errorOccurred({error: 'You can\'t send an empty message'}));
            } else if (message.length > 100) {
                dispatch(chatActions.errorOccurred({error: 'Message length should be less than 100 symbols'}));
            } else {
                api.sentMessage(message);
                dispatch(chatActions.errorOccurred({error: null}));
                resolve(); // Сообщение успешно отправлено
            }
        });
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
