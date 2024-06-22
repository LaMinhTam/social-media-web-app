import CallType from "@/types/callType";
import React from "react";

const CallContext = React.createContext<CallType>({} as CallType);

export function CallProvider(
    props: JSX.IntrinsicAttributes & React.ProviderProps<CallType>
) {
    const contextValues = {};

    return (
        <CallContext.Provider
            {...props}
            value={contextValues}
        ></CallContext.Provider>
    );
}

export function useCall() {
    const context = React.useContext(CallContext);
    if (typeof context === "undefined")
        throw new Error("useCall must be used within CallProvider");
    return context;
}
