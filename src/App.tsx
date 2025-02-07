import React, { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';

const App: React.FC = () => {
    // Define the drawing state to control UI components
    const [ ,setIsDrawing] = useState<boolean>(false);

    return (
        <div>
            {/* Pass setIsDrawing to DrawingCanvas */}
            <DrawingCanvas isAdmin={false} setIsDrawing={setIsDrawing} />
        </div>
    );
};

export default App;
