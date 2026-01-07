import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, signOut } from 'aws-amplify/auth';
import './login.css';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState('AUTH'); // AUTH or CONFIRM
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                await signUp({ username: email, password });
                setStep('CONFIRM');
            } else {
                await signIn({ username: email, password });
                setUserEmail(email);
                setIsLoggedIn(true);
                // Reset form
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            alert("Account Confirmed! You can now login.");
            setStep('AUTH');
            setIsSignUp(false);
            setEmail('');
            setPassword('');
            setCode('');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            setIsLoggedIn(false);
            setUserEmail('');
        } catch (error) {
            alert(error.message);
        }
    };

    // Dashboard/Sign-in Success Page
    if (isLoggedIn) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-card">
                    <h1>Welcome!</h1>
                    <div className="user-info">
                        <p>You are signed in as:</p>
                        <p className="user-email">{userEmail}</p>
                    </div>
                    <div className="dashboard-content">
                        <p>You have successfully logged in to your account.</p>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // Login/Signup Page
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{step === 'CONFIRM' ? 'Verify' : isSignUp ? 'Create Account' : 'Login'}</h2>
                <form className="auth-form" onSubmit={step === 'CONFIRM' ? handleConfirm : handleAuth}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {step === 'AUTH' ? (
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    ) : (
                        <input 
                            type="text" 
                            placeholder="Confirmation Code" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)} 
                            required 
                        />
                    )}
                    <button className="auth-button" type="submit">
                        {step === 'CONFIRM' ? 'Confirm' : isSignUp ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                {step === 'AUTH' && (
                    <p className="toggle-text">
                        {isSignUp ? "Already have an account?" : "New here?"}
                        <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? " Login" : " Sign Up"}
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Auth;