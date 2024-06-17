import { UploadFileQueue } from "@/types/commonType";
import { ConversationResponse, MessageData } from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversation: ConversationResponse;
    listConversation: ConversationResponse[];
    currentSize: number;
    isReplying: boolean;
    messageReply: MessageData;
    reactionSelected: {
        name: string;
        emoji: string;
    };
    uploadQueue: UploadFileQueue[];
};

const initialState: ConversationType = {
    currentConversation: {} as ConversationResponse,
    listConversation: [],
    currentSize: 10,
    isReplying: false,
    messageReply: {} as MessageData,
    reactionSelected: {
        name: "",
        emoji: "",
    },
    uploadQueue: [],
};

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setCurrentConversation(
            state,
            action: PayloadAction<ConversationResponse>
        ) {
            state.currentConversation = action.payload;
        },
        setListConversation(
            state,
            action: PayloadAction<ConversationResponse[]>
        ) {
            state.listConversation = action.payload;
        },
        setCurrentSize(state, action: PayloadAction<number>) {
            state.currentSize = action.payload;
        },
        setIsReplying(state, action: PayloadAction<boolean>) {
            state.isReplying = action.payload;
        },
        setMessageReply(state, action: PayloadAction<MessageData>) {
            state.messageReply = action.payload;
        },
        setReactionSelected(
            state,
            action: PayloadAction<{ name: string; emoji: string }>
        ) {
            state.reactionSelected = action.payload;
        },
        setUploadQueue(state, action: PayloadAction<UploadFileQueue[]>) {
            state.uploadQueue = action.payload;
        },
    },
});

export const {
    setCurrentConversation,
    setListConversation,
    setCurrentSize,
    setIsReplying,
    setMessageReply,
    setReactionSelected,
    setUploadQueue,
} = conversationSlice.actions;
export default conversationSlice.reducer;
