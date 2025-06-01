// WebSocketContext.js
import React, {createContext, useContext, useEffect, useRef} from 'react';

const WebSocketContext = createContext(null);

export function WebSocketProvider({children, url}) {
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({message: 'Web Socket Connected'}));
        };

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            // if (data.voucher) {
            //     saveCurrentVoucherMMKV(data.voucher)
            //     router.push(`homeCustomer/cardsView/voucher`);
            //     // console.log("voucher created ", JSON.parse(e.data).voucher.business_user_profile);
            //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // } else if (data.collector) {
            //     saveCurrentCollectorMMKV(data.collector)
            //     router.push(`homeCustomer/cardsView/collector`);
            //     // console.log("collector updated ", JSON.parse(e.data).collector.business_user_profile);
            //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            // else if (data.message) {
            //     console.log(JSON.parse(e.data).message);
            // }
        };

        // handle error/close similarly
        return () => {
            ws.current.close();
        };
    }, [url]);

    // Provide any API you want
    const send = (msg) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(msg);
        }
    };

    const contextValue = {
        ws: ws.current,
        send,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext() {
    return useContext(WebSocketContext);
}