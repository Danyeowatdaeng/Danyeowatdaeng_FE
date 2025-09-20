// hooks/useCamera.ts
import { useEffect, useRef, useState } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setActive(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stop = () => {
    const tracks = (videoRef.current?.srcObject as MediaStream | null)?.getTracks() ?? [];
    tracks.forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  };

  useEffect(() => () => stop(), []);
  return { videoRef, start, stop, active };
}