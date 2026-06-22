'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
    readTerms: string[];
    bookmarkedTerms: string[];
    toggleRead: (id: string) => void;
    toggleBookmark: (id: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const [readTerms, setReadTerms] = useState<string[]>([]);
    const [bookmarkedTerms, setBookmarkedTerms] = useState<string[]>([]);

    useEffect(() => {
        const storedRead = localStorage.getItem('readTerms');
        const storedBookmarks = localStorage.getItem('bookmarkedTerms');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (storedRead) setReadTerms(JSON.parse(storedRead));
         
        if (storedBookmarks) setBookmarkedTerms(JSON.parse(storedBookmarks));
    }, []);

    const toggleRead = (id: string) => {
        setReadTerms(prev => {
            const newRead = prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id];
            localStorage.setItem('readTerms', JSON.stringify(newRead));
            return newRead;
        });
    };

    const toggleBookmark = (id: string) => {
        setBookmarkedTerms(prev => {
            const newBookmarks = prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id];
            localStorage.setItem('bookmarkedTerms', JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    return (
        <ProgressContext.Provider value={{ readTerms, bookmarkedTerms, toggleRead, toggleBookmark }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}
