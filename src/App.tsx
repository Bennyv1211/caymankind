import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import DrawingCanvas from './components/DrawingCanvas';
import './App.css';

const App: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    return (
        <div className="App">
            {isAdmin ? (
                <>
                    <h1>Admin Panel</h1>
                    <button onClick={() => setIsAdmin(false)}>Logout</button>
                    <DrawingCanvas isAdmin={true} />
                </>
            ) : (
                <>
                    <h1>Welcome to CaymanKind Collaborative Drawing!</h1>
                    <DrawingCanvas isAdmin={false} setIsDrawing={setIsDrawing} />
                </>
            )}
        </div>
    );
};

export default App;
