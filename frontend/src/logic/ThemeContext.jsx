import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const nav = {
    basic: {},
    dark: { backgroundColor: '#120D16', color: '#ffffff' },
    noel: { backgroundColor: '#d41616', color: '#bb051f' },
    deuteranopie: { backgroundColor: '#0000FF', color: '#00ff00' },
    tritanopie: { backgroundColor: '#FF0000', color: '#ff0000' },
    hacker: { backgroundColor: '#008000', color: '#9ccc9c' },
};

const main = {
    basic: {},
    dark: { backgroundColor: '#1a1a1a', color: '#000000' },
    noel: { backgroundColor: '#173305', color: '#ff0000' },
    deuteranopie: { backgroundColor: '#FFFF00', color: '#00ff00' },
    tritanopie: { backgroundColor: '#FFC0CB', color: '#ff0000' },
    hacker: { backgroundColor: '#0f0f0f', color: '#00ff00' },
};

const footer = {
    basic: {},
    dark: { backgroundColor: '#808080', color: '#ffffff' },
    noel: { backgroundColor: '#3f8f29', color: '#056517' },
    deuteranopie: { backgroundColor: '#808080', color: '#00ff00' },
    tritanopie: { backgroundColor: '#800080', color: '#ff0000' },
    hacker: { backgroundColor: '#2b5329', color: '#9ccc9c' },
};


const Mode = {nav:nav,main:main,footer:footer};
export const ThemeProvider = ({ children }) => {
    const [currentMode, setCurrentMode] = useState('basic');


    const setMode = (mode) => {
        setCurrentMode(mode);
    };

    const getMode = (etat) => {
        if (etat == 'nav'){
            return Mode.nav[currentMode];
        }
        if(etat == 'footer'){
            return Mode.footer[currentMode];
        }
        if(etat == 'main'){
            return Mode.main[currentMode];
        }
    };


    return (
        <ThemeContext.Provider value={{ setMode, getMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
