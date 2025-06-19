import { useState, useEffect, useCallback, useContext, createContext } from 'react';

type NetworkContextType = {
    isOnline: boolean
}

type childrenType = {
    children: React.ReactNode;
}

export const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider = ({ children }: childrenType) => {
    const [isOnline, setIsOnline] = useState<Boolean>((): Boolean => navigator.onLine);

    const handleSetIsOnline = () => {
        setIsOnline(true);
      //  window.location.reload();
    };

    const handleSetIsOffline = () => {
        setIsOnline(false);
    };

    useEffect(() => {
        window.addEventListener('online', handleSetIsOnline);
        window.addEventListener('offline', handleSetIsOffline);

        return () => {
            window.removeEventListener('online', handleSetIsOnline);
            window.removeEventListener('offline', handleSetIsOffline);
        }
    }, []);

    return (
        <NetworkContext.Provider value={{isOnline}} >
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetworkCheck = () => {
    const context = useContext(NetworkContext);
    if (!!!context) {
        throw Error("useNetworkCheck must be used inside of NetworkProvider");
    }
    return context;
};