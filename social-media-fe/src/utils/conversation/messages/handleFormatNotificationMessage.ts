import { NOTIFICATION_TYPE } from "@/constants/global";
import { GroupSettings, MessageData } from "@/types/conversationType";

export default function handleFormatNotificationMessage(
    message: MessageData,
    userId: number,
    settings: GroupSettings
) {
    let formattedMessage = "";
    switch (message.notification_type) {
        case NOTIFICATION_TYPE.ADD_MEMBER:
            const addedMembers = (message.target_user_id ?? []).map((member) =>
                (member.user_id === userId ? "you" : member.name).concat(
                    (message.target_user_id ?? []).indexOf(member) ===
                        (message.target_user_id ?? []).length - 1
                        ? ""
                        : ", "
                )
            );
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } added ${addedMembers} `;
            break;

        case NOTIFICATION_TYPE.CHANGE_GROUP_AVATAR:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are changing the group avatar`;
            break;

        case NOTIFICATION_TYPE.CHANGE_GROUP_NAME:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are changing the group name to ${message.content}`;
            break;

        case NOTIFICATION_TYPE.CHANGE_GROUP_OWNER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are changing the group owner to ${
                message.target_user_id?.[0].name
            }`;
            break;

        case NOTIFICATION_TYPE.CONFIRM_NEW_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are turning ${
                message.content === "true" ? "on" : "off"
            } the confirm new member feature`;
            break;

        case NOTIFICATION_TYPE.DEPUTY_CHANGE_GROUP_INFO:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing deputies to change group info`;
            break;

        case NOTIFICATION_TYPE.DEPUTY_DEMOTE_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are allowing deputies to demote members`;
            break;

        case NOTIFICATION_TYPE.DEPUTY_INVITE_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing deputies to invite members`;
            break;

        case NOTIFICATION_TYPE.DEPUTY_PROMOTE_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing deputies to promote members`;
            break;
        case NOTIFICATION_TYPE.DEPUTY_REMOVE_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are  ${
                message.content === "true" ? "" : "not"
            } allowing deputies to remove members`;
            break;

        case NOTIFICATION_TYPE.DEPUTY_SEND_MESSAGES:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing deputies to send messages`;
            break;

        case NOTIFICATION_TYPE.GRANT_DEPUTY:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are granting ${
                message.target_user_id &&
                message.target_user_id[0]?.user_id === userId
                    ? "you"
                    : message.target_user_id?.[0]?.name
            } as a deputy`;
            break;

        case NOTIFICATION_TYPE.JOIN_BY_LINK:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true"
                    ? "waiting to join the group"
                    : "join the group by link"
            }`;
            break;

        case NOTIFICATION_TYPE.LEAVE_GROUP:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are leaving the group`;
            break;

        case NOTIFICATION_TYPE.MEMBER_CHANGE_GROUP_INFO:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing members to change group info`;
            break;

        case NOTIFICATION_TYPE.MEMBER_INVITE_MEMBER:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are ${
                message.content === "true" ? "" : "not"
            } allowing members to invite members`;
            break;

        case NOTIFICATION_TYPE.MEMBER_PIN_MESSAGE:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } allowing ${
                message.content === "true" ? "" : "not"
            } members pinned a message`;
            break;

        case NOTIFICATION_TYPE.REMOVE_MEMBER:
            const removedMembers = (message.target_user_id ?? []).map(
                (member) =>
                    (member.user_id === userId ? "You" : member.name).concat(
                        (message.target_user_id ?? []).indexOf(member) ===
                            (message.target_user_id ?? []).length - 1
                            ? ""
                            : ", "
                    )
            );
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are removing ${removedMembers} from the group`;
            break;

        case NOTIFICATION_TYPE.RESTRICTED_MESSAGING:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are turning ${
                message.content === "true" ? "on" : "off"
            } the restricted messaging feature`;
            break;

        case NOTIFICATION_TYPE.REVOKE_DEPUTY:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "You"
                    : message.user_detail.name
            } are revoking ${
                message.target_user_id?.[0].user_id === userId
                    ? "You"
                    : message.target_user_id?.[0].name
            } as a deputy`;
            break;

        case NOTIFICATION_TYPE.UPDATE_GROUP_SETTINGS:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "you"
                    : message.user_detail.name
            } are updating group settings`;
            break;

        case NOTIFICATION_TYPE.UPDATE_LINK_TO_JOIN_GROUP:
            formattedMessage = `${
                message.user_detail.user_id === userId
                    ? "you"
                    : message.user_detail.name
            } are updating the link to join group`;
            break;

        default:
            formattedMessage = "Unsupported notification type";
            break;
    }
    return formattedMessage;
}
