import React, { useEffect, useRef, useState } from 'react';
import AdminLogin from './AdminLogin';
import { db, setDoc, doc, getDoc } from '../firebase';

interface DrawingCanvasProps {
    isAdmin: boolean;
    setIsDrawing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isAdmin }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [timer, setTimer] = useState<number | null>(null);
    const [color, setColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(2);
    const [isEraser, setIsEraser] = useState(false);
    const [adminLoggedIn, setAdminLoggedIn] = useState(isAdmin);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [userDrawingAllowed, setUserDrawingAllowed] = useState(true);
    const [textMode, setTextMode] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctxRef.current = ctx;

        const loadDrawing = async () => {
            const docSnap = await getDoc(doc(db, 'drawings', 'current'));
            if (docSnap.exists()) {
                const data = docSnap.data();
                const canvasImage = data.canvasImage;

                if (canvasImage) {
                    const img = new Image();
                    img.src = canvasImage;
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                    };
                }
            }
        };

        loadDrawing();

        if (!isAdmin) {
            setTimeout(() => {
                setShowWelcomeModal(true);
            }, 500);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (timer !== null && !adminLoggedIn) {
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        setIsDrawing(false);
                        setUserDrawingAllowed(false);
                        alert('Time’s up! Thank you for participating.');
                        return null;
                    }
                    return prev! - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [timer, adminLoggedIn]);

    useEffect(() => {
        const interval = setInterval(async () => {
            await saveDrawing();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (textMode) {
            placeText(e);
            return;
        }

        if ((timer !== null || adminLoggedIn) && userDrawingAllowed) {
            const { offsetX, offsetY } = e.nativeEvent;
            setIsDrawing(true);
            ctxRef.current?.beginPath();
            ctxRef.current?.moveTo(offsetX, offsetY);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctxRef.current?.beginPath();
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !userDrawingAllowed || textMode) return;

        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = ctxRef.current!;

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isEraser ? 'white' : color;

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const placeText = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = ctxRef.current!;
        ctx.font = '20px Arial';
        ctx.fillStyle = color;
        ctx.fillText(textInput, offsetX, offsetY);
        setTextMode(false);
        setTextInput('');
    };

    const saveDrawing = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasImage = canvas.toDataURL('image/png');

        await setDoc(doc(db, 'drawings', 'current'), {
            canvasImage,
        });
    };

    const clearCanvas = () => {
        const ctx = ctxRef.current!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        saveDrawing();
    };

    const downloadCanvasAsJPEG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = 'caymankind_art.jpeg';
        link.href = tempCanvas.toDataURL('image/jpeg', 1.0);
        link.click();
    };

    const handleAdminLogin = (isAdmin: boolean) => {
        setAdminLoggedIn(isAdmin);
    };

    const closeWelcomeModal = () => {
        setShowWelcomeModal(false);
        setTimer(120);
    };

    return (
        <div style={{ overflow: 'scroll', width: '100%', height: '80vh' }}>
            <h2>Collaborative Drawing</h2>

            {!adminLoggedIn && timer !== null && <p>Time Left: {timer} seconds</p>}
            {!adminLoggedIn && timer === null && <p>Your time is up! Thank you for participating.</p>}

            {showWelcomeModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '80%',
                        maxWidth: '600px',
                        textAlign: 'center',
                        color: '#000',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        <h2>Welcome to the #CaymanKind Community Art Project! 🎨✨</h2>
                        <p>Join us in creating a collaborative masterpiece that reflects the spirit of kindness, creativity, and unity in our beautiful Cayman community.</p>
                        <p>Please ensure your contributions are positive and respectful—any inappropriate language or images will be removed by the admin.</p>
                        <p>This is a shared canvas where every stroke counts. Let’s inspire and uplift one another with our creativity!</p>
                        <p><strong>You have 2 minutes to leave your mark. Thank you for being part of this #CaymanKind journey!</strong></p>
                        <button onClick={closeWelcomeModal} style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>Start Drawing</button>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={6000}
                height={5000}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                style={{ border: '1px solid black', backgroundColor: '#ffffff' }}
            ></canvas>

            {/* User Tools (Visible to Everyone) */}
            <div>
                <label>
                    Color:
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </label>
                <label>
                    Line Size:
                    <input
                        type="range"
                        min="1"
                        max="3"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Math.min(Number(e.target.value), 3))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Text:
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your text here"
                    />
                </label>
                <button onClick={() => setTextMode(true)}>Place Text</button>
            </div>

            {/* Admin Tools (Only for Admin) */}
            {adminLoggedIn && (
                <div>
                    <h3>Admin Tools</h3>
                    <button onClick={downloadCanvasAsJPEG}>Download as JPEG</button>
                    <button onClick={clearCanvas}>Clear Canvas</button>
                    <button onClick={() => setIsEraser(!isEraser)}>
                        {isEraser ? 'Switch to Pen' : 'Eraser'}
                    </button>
                    <button onClick={() => setAdminLoggedIn(false)}>Logout</button>
                </div>
            )}

            {/* Admin Login Button (Visible to All Users) */}
            {!adminLoggedIn && (
                <button style={{ marginTop: '20px' }} onClick={() => setShowAdminLogin(true)}>
                    Admin Login
                </button>
            )}

            {/* Admin Login Modal */}
            {showAdminLogin && <AdminLogin onLogin={handleAdminLogin} onClose={() => setShowAdminLogin(false)} />}
        </div>
    );
};

export default DrawingCanvas;
