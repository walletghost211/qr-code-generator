"use client";

import React, { useState } from "react";
import QRCode from "qrcode";

const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateQrCode = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(text);
      setQrCode(qrCodeDataUrl);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to generate QR code"
      />
      <button onClick={generateQrCode}>Generate QR Code</button>
      {qrCode && (
        <div>
          <h3>Your QR Code:</h3>
          <img src={qrCode} alt="Generated QR Code" />
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
