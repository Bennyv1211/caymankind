import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Correct import path
import reportWebVitals from './reportWebVitals';  // Ensure this file exists

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();
