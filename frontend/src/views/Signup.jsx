import React, { useState } from 'react';
import AuthService from '../logic/AuthService'; // Import your authentication service
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();

        // Perform basic validation
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Call the signup method from your AuthService to register the user
        try {
            setError('');
            const response = await AuthService.signup(email, password);
            //redirect to signin
            window.location.href = '/signin';

        }catch (error){
            if(error.response.status === 400){
                setError("Already register");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <main>
            <div class="logContainer">
            <div class="logPage">
            <h2>Registration Page</h2>
            <form onSubmit={handleRegistration}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            </div>
            </main>
            <Footer/>
        </div>
    );
};

export default RegistrationPage;
