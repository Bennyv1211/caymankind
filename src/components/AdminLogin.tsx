import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";

interface AdminLoginProps {
    onLogin: (isAdmin: boolean) => void;
    onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(true);  // Call the onLogin function when successful
            onClose();  // Close the login modal
        } catch (error: unknown) {  // Changed from 'any' to 'unknown'
            if (error instanceof Error) {
                console.error("Login Error:", error.name, error.message);
                setErrorMessage(`Error: ${error.name} - ${error.message}`);
            } else {
                console.error("An unexpected error occurred.");
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default AdminLogin;
