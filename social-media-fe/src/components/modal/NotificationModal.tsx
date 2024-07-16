import { RootState } from "@/store/configureStore";
import { PopupState } from "material-ui-popup-state/hooks";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const NotificationModal = ({ popupState }: { popupState: PopupState }) => {
    const notifications = useSelector(
        (state: RootState) => state.common.notifications
    );
    return (
        <div className="w-[360px] h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-lg font-semibold">Notifications</h1>
                <button
                    onClick={popupState.close}
                    className="text-sm font-semibold text-blue-500"
                >
                    Close
                </button>
            </div>
            <div className="p-4">
                {notifications &&
                    notifications.length > 0 &&
                    notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between mb-4"
                        >
                            <div className="flex items-center space-x-2">
                                <Image
                                    width={12}
                                    height={12}
                                    src={notification.user.image_url}
                                    alt="profile"
                                    className="object-cover w-12 h-12 rounded-full"
                                ></Image>
                                <div>
                                    <p className="font-semibold">
                                        {notification.user.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default NotificationModal;
