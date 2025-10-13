import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ExamProctoring.tsx
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../supabaseClient';
const ExamProctoring = ({ attemptId }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [cheatAttempts, setCheatAttempts] = useState(0);
    const [isMonitoring, setIsMonitoring] = useState(false);
    useEffect(() => {
        initializeProctoring();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    const initializeProctoring = async () => {
        try {
            console.log('Initializing proctoring...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
            setPermissionGranted(true);
            setIsMonitoring(true);
            // Start monitoring
            startProctoringMonitoring();
            // Log successful initialization
            await logProctoringEvent('proctoring_started');
        }
        catch (error) {
            console.error('Error accessing camera/microphone:', error);
            await logProctoringEvent('proctoring_failed', 'Failed to access camera/microphone');
        }
    };
    const startProctoringMonitoring = () => {
        // Monitor tab visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        // Monitor fullscreen changes
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        // Monitor context menu (right-click)
        document.addEventListener('contextmenu', handleContextMenu);
        // Monitor keyboard events
        document.addEventListener('keydown', handleKeyDown);
        // Periodic monitoring
        const monitoringInterval = setInterval(async () => {
            if (!isMonitoring)
                return;
            await performPeriodicCheck();
        }, 30000); // Check every 30 seconds
        return () => {
            clearInterval(monitoringInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    };
    const handleVisibilityChange = async () => {
        if (document.hidden) {
            await logProctoringEvent('tab_switch_detected', 'User switched tabs/windows');
            incrementCheatAttempts();
        }
    };
    const handleFullscreenChange = async () => {
        if (!document.fullscreenElement) {
            await logProctoringEvent('fullscreen_exit', 'User exited fullscreen mode');
            incrementCheatAttempts();
        }
    };
    const handleContextMenu = async (e) => {
        e.preventDefault();
        await logProctoringEvent('context_menu_blocked', 'Right-click context menu was blocked');
        incrementCheatAttempts();
        return false;
    };
    const handleKeyDown = async (e) => {
        // Block function keys and some combinations
        if (e.ctrlKey || e.metaKey || e.altKey) {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                await logProctoringEvent('refresh_blocked', 'Page refresh was blocked');
                incrementCheatAttempts();
            }
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
                e.preventDefault();
                await logProctoringEvent('devtools_blocked', 'Developer tools access was blocked');
                incrementCheatAttempts();
            }
        }
        // Block print screen
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            await logProctoringEvent('screenshot_blocked', 'Print screen was blocked');
            incrementCheatAttempts();
        }
    };
    const performPeriodicCheck = async () => {
        try {
            // Check if camera is still active
            if (stream && videoRef.current) {
                const video = videoRef.current;
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    await logProctoringEvent('periodic_check_ok', 'Camera and audio monitoring active');
                }
                else {
                    await logProctoringEvent('camera_inactive', 'Camera feed appears to be inactive');
                    incrementCheatAttempts();
                }
            }
        }
        catch (error) {
            console.error('Periodic check error:', error);
            await logProctoringEvent('monitoring_error', 'Error during periodic check');
        }
    };
    const incrementCheatAttempts = async () => {
        const newAttempts = cheatAttempts + 1;
        setCheatAttempts(newAttempts);
        try {
            await supabase
                .from('exam_attempts')
                .update({ cheat_attempts: newAttempts })
                .eq('id', attemptId);
        }
        catch (error) {
            console.error('Error updating cheat attempts:', error);
        }
    };
    const logProctoringEvent = async (eventType, details) => {
        try {
            console.log('Proctoring event:', eventType, details);
            const { error } = await supabase
                .from('proctoring_logs')
                .insert([{
                    attempt_id: attemptId,
                    event_type: eventType,
                    details: details,
                    timestamp: new Date().toISOString()
                }]);
            if (error) {
                console.error('Error logging proctoring event:', error);
            }
        }
        catch (error) {
            console.error('Failed to log proctoring event:', error);
        }
    };
    const captureScreenshot = async () => {
        try {
            if (!videoRef.current)
                return null;
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return null;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.7);
        }
        catch (error) {
            console.error('Error capturing screenshot:', error);
            return null;
        }
    };
    if (!permissionGranted) {
        return (_jsx("div", { className: "fixed top-4 right-4 bg-red-100 border border-red-400 p-4 rounded-lg max-w-sm z-50", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-red-800", children: "Proctoring Required" }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: "Camera and microphone access is required to continue the exam." })] })] }) }));
    }
    return (_jsxs("div", { className: "fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50", children: [_jsxs("div", { className: "text-center mb-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-1" }), _jsx("span", { className: "text-xs text-gray-600 font-medium", children: "Live Proctoring Active" })] }), _jsx("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true, className: "w-32 h-24 object-cover rounded border-2 border-green-500" }), _jsxs("div", { className: "mt-2 text-xs text-center space-y-1", children: [_jsxs("div", { className: `font-medium ${cheatAttempts > 0 ? 'text-red-600' : 'text-green-600'}`, children: ["Status: ", cheatAttempts > 0 ? 'Monitoring Issues' : 'All Systems Normal'] }), cheatAttempts > 0 && (_jsxs("div", { className: "text-red-500", children: ["Warnings: ", cheatAttempts] })), _jsx("div", { className: "text-gray-500", children: "Camera & Audio: Active" })] })] }));
};
export default ExamProctoring;
