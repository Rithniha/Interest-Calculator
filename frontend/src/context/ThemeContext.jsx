import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('userRole') || 'Borrower');

    const toggleRole = () => {
        const newRole = role === 'Borrower' ? 'Investor' : 'Borrower';
        setRole(newRole);
        localStorage.setItem('userRole', newRole);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', role.toLowerCase());
    }, [role]);

    return (
        <ThemeContext.Provider value={{ role, toggleRole }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
