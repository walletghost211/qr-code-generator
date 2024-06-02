"use client";
import React, { useState } from "react";
import jsQR from "jsqr";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./PDFGenerator";

const QrCodeUploader: React.FC = () => {
  const [decodedText, setDecodedText] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(
              0,
              0,
              image.width,
              image.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );
            if (code) {
              setDecodedText(code.data);
            } else {
              alert("No QR code found.");
            }
          }
        };
        if (e.target?.result) {
          image.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>QR Code Uploader</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {decodedText && (
        <div>
          <h3>Decoded Text:</h3>
          <p>{decodedText}</p>
        </div>
      )}
      <PDFViewer>
        <MyDocument />
      </PDFViewer>
    </div>
  );
};

export default QrCodeUploader;
