// ThemeSelector.js
import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeSelector = () => {
    const { setMode } = useTheme();

    const handleModeChange = (mode) => {
        setMode(mode);
    };

    return (
        <div>
            <label>
                <input
                    type="radio"
                    value="basic"
                    onChange={() => handleModeChange('basic')}
                />
                Basic
            </label>
            <label>
                <input
                    type="radio"
                    value="dark"
                    onChange={() => handleModeChange('dark')}
                />
                Dark
            </label>
            <label>
                <input
                    type="radio"
                    value="hacker"
                    onChange={() => handleModeChange('hacker')}
                />
                Hacker
            </label>
        </div>
    );
};

export default ThemeSelector;
