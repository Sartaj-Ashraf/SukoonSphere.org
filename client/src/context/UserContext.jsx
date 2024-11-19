import React, { createContext, useContext, useReducer, useEffect } from 'react';
import customFetch from '@/utils/customFetch';

const UserContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isLoading: false,
            };
        case 'REMOVE_USER':
            return {
                ...state,
                user: null,
                isLoading: false,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('user');
        }
    }, [state.user]);

    // User actions
    const login = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { data } = await customFetch.post('/auth/login', userData);
            dispatch({ type: 'SET_USER', payload: data.user });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.msg || 'Login failed' });
            return { error: error.response?.data?.msg || 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await customFetch.get('/auth/logout');
            dispatch({ type: 'REMOVE_USER' });
            localStorage.removeItem('user'); // Clear localStorage on logout
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const updateUser = async (updates) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { data } = await customFetch.patch('/user/change-profile', updates, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Add this header for file uploads
                }
            });

            // Only update the specific fields that changed, preserving other user data
            dispatch({
                type: 'SET_USER',
                payload: {
                    ...state.user,
                    ...data.user
                }
            });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.msg || 'Update failed' });
            return { error: error.response?.data?.msg || 'Update failed' };
        }
    };

    return (
        <UserContext.Provider value={{
            ...state,
            login,
            logout,
            updateUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for using the user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
