import MoviesComponent from "./components/Movies";
import PDFViewer from "./components/PDFViewer";
import QrCodeGenerator from "./components/QrCodeGenerator";
import QrCodeUploader from "./components/QrCodeUploader";

export default function Home() {
  return (
    <main>
      <QrCodeGenerator />
      <PDFViewer />
      <MoviesComponent />
    </main>
  );
}
