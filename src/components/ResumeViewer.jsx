import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ResumeViewer({ pdfUrl }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      style={{ height: "600px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <Worker workerUrl={`/pdfjs-dist/build/pdf.worker.min.js`}>
        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}
