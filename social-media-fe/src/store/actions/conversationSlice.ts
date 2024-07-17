import { UploadFileQueue } from "@/types/commonType";
import {
    ConversationResponse,
    MessageData,
    PendingUser,
} from "@/types/conversationType";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConversationType = {
    currentConversation: ConversationResponse;
    listConversation: ConversationResponse[];
    triggerFetchingConversation: boolean;
    currentSize: number;
    isReplying: boolean;
    messageReply: MessageData;
    reactionSelected: {
        name: string;
        emoji: string;
    };
    uploadQueue: UploadFileQueue[];
    listPendingUsers: PendingUser[];
};

const initialState: ConversationType = {
    currentConversation: {} as ConversationResponse,
    listConversation: [],
    triggerFetchingConversation: false,
    currentSize: 10,
    isReplying: false,
    messageReply: {} as MessageData,
    reactionSelected: {
        name: "",
        emoji: "",
    },
    uploadQueue: [],
    listPendingUsers: [],
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
        setTriggerFetchingConversation(state, action: PayloadAction<boolean>) {
            state.triggerFetchingConversation = action.payload;
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
        setListPendingUsers(state, action: PayloadAction<PendingUser[]>) {
            state.listPendingUsers = action.payload;
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
    setTriggerFetchingConversation,
    setListPendingUsers,
} = conversationSlice.actions;
export default conversationSlice.reducer;
