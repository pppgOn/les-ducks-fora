import React, { useEffect } from 'react';
import tokenService from '../logic/token.service.jsx';  // Replace with the correct path

const LogoutPage = () => {

    useEffect(() => {
        const performLogout = async () => {
            try {
                await tokenService.removeUser();
                await tokenService.removeToken();

                // Redirect the user to the login page or any other page after logging out
                window.location.href = '/home';
            } catch (error) {
                console.error('Logout error:', error.message);
                // Handle the error, display a message, or redirect as needed
            }
        };

        // Call the performLogout function when the component mounts
        performLogout().then(r =>  console.log('Logout successful'));
    }, []);

    return (
        <div>
            <h2>Logout Page</h2>
            <p>Logging out...</p>
        </div>
    );
};

export default LogoutPage;
