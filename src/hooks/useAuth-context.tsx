import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types/chat.ts';

interface AuthContextType {
    user: User | null,
    setLogin: (data: {user: User, token: string}) => void,
    setLogout: () => void;
};

interface AuthProviderProps {
    children: ReactNode
};

const AuthContext = createContext<AuthContextType | undefined >(undefined);

export const AuthProvider = ({children} : AuthProviderProps) => {
    const [user, setUser] = useState<User | null >(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const setLogin = (data: {user: User, token: string}) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token',data.token);
        setUser(data.user);
    };

    const setLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };
    
    return(
        <AuthContext.Provider value = {{ user, setLogin, setLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => useContext(AuthContext);