import React from 'react';
import ReactDOM from 'react-dom/client';
import App from ".//src/App.tsx";  // Ensure this matches the filename (App.tsx)
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
