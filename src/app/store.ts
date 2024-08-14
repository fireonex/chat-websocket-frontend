import {AnyAction, combineReducers} from "redux";
import {configureStore, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {chatReducer} from "./chat-reducer";


const rootReducer = combineReducers({
    chat: chatReducer
});

export const store = configureStore({
    reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;