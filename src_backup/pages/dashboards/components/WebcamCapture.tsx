import React, { useRef, useEffect, useState } from "react";


interface Props {
  onPhotoCaptured: (data: string, sequence: number) => void;
  captureInterval?: number;
  hidden?: boolean;
}

const WebcamCapture: React.FC<Props> = ({
  onPhotoCaptured,
  captureInterval = 120000,
  hidden = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sequenceRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const initializedRef = useRef(false); // ✅ prevents double init

  useEffect(() => {
    if (initializedRef.current) return; // already initialized
    initializedRef.current = true;

    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;

        video.onloadedmetadata = async () => {
          try {
            await video.play();
          } catch (err) {
            console.warn("Video play interrupted:", err);
          }

          intervalRef.current = setInterval(() => {
            const canvas = canvasRef.current;
            if (!canvas || !video.videoWidth || !video.videoHeight) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL("image/jpeg");
              sequenceRef.current += 1;
              onPhotoCaptured(dataUrl, sequenceRef.current);
            }
          }, captureInterval);
        };
      } catch (err) {
        console.error("Webcam init failed", err);
      }
    };

    initWebcam();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [captureInterval, onPhotoCaptured]);

  return (
    <>
      <video
        ref={videoRef}
        style={{ display: hidden ? "none" : "block", width: "100%", height: "100%" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default WebcamCapture;
