import { Box } from "@mui/material";
import { IconButton, Popover, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ConversationResponse, Member } from "@/types/conversationType";
import Image from "next/image";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import GroupMemberAction from "./GroupMemberAction";
import isConversationDeputy from "@/utils/conversation/messages/isConversationDeputy";

const MemberTab = ({
    listMembers,
    currentConversation,
    currentUserId,
}: {
    listMembers: Member[];
    currentConversation: ConversationResponse;
    currentUserId: number;
}) => {
    return (
        <Box sx={{ p: 3 }}>
            {listMembers.map((member) => (
                <Box
                    key={uuidv4()}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        my: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                        }}
                    >
                        <Image
                            src={member.image_url}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="object-cover w-full h-full rounded-full"
                        />
                    </Box>
                    <Box>
                        <Typography className="font-bold">
                            {member.name}
                        </Typography>
                        <Typography className="text-sm text-gray-500">
                            {currentConversation.deputies &&
                            isConversationDeputy(
                                member.user_id,
                                currentConversation
                            )
                                ? "Deputy"
                                : "Member"}
                        </Typography>
                    </Box>
                    <PopupState variant="popover" popupId="group-popup-popover">
                        {(popupState) => (
                            <div className="ml-auto">
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    {...bindTrigger(popupState)}
                                >
                                    <MoreHorizIcon />
                                </IconButton>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <GroupMemberAction
                                        settings={currentConversation.settings}
                                        userRole={
                                            currentConversation.owner_id ===
                                            currentUserId
                                                ? "ADMIN"
                                                : currentConversation.deputies &&
                                                  isConversationDeputy(
                                                      currentUserId,
                                                      currentConversation
                                                  )
                                                ? "DEPUTY"
                                                : "MEMBER"
                                        }
                                        targetUserRole={
                                            currentConversation.owner_id ===
                                            member.user_id
                                                ? "ADMIN"
                                                : currentConversation.deputies &&
                                                  isConversationDeputy(
                                                      member.user_id,
                                                      currentConversation
                                                  )
                                                ? "DEPUTY"
                                                : "MEMBER"
                                        }
                                        userId={member.user_id}
                                        conversationId={
                                            currentConversation.conversation_id
                                        }
                                        popupState={popupState}
                                    ></GroupMemberAction>
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                </Box>
            ))}
        </Box>
    );
};

export default MemberTab;
