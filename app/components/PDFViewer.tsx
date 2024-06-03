"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import jsQR from "jsqr";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const PDFViewer: React.FC = () => {
  const [pdfData, setPdfData] = useState<string | ArrayBuffer | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pages, setPages] = useState<ImageData[]>([]);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  const onFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPdfData(reader.result);
      reader.readAsArrayBuffer(file);
    }
    const reader = new FileReader();
    console.log("PDF", reader);
    reader.onload = async () => {
      const arrayBuffer = reader?.result;
      if (!arrayBuffer) return;
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const pdfPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context!,
          viewport: viewport,
        }).promise;

        const imageData = context!.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        pdfPages.push(imageData);
      }
      setPages(pdfPages);
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  const scanForQRCode = (imageData: ImageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      setQRCodeData(code.data); // Set detected QR code data
    }
  };

  useEffect(() => {
    pages.forEach((page) => {
      scanForQRCode(page);
    });
  }, [pages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <input type="file" accept=".pdf" onChange={onFileLoad} />

      {pdfData && (
        <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      )}

      {pdfData && (
        <p>
          Page {pageNumber} of {numPages}
        </p>
      )}

      {qrCodeData && ( // Render detected QR code data
        <div>
          <p>Detected QR Code:</p>
          <p>{qrCodeData}</p>
        </div>
      )}
    </>
  );
};

export default PDFViewer;
