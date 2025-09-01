import jsPDF from "jspdf";

(jsPDF as any).API.events.push([
  "addFonts",
  () => {
    const doc: any = jsPDF.prototype;
    doc.addFileToVFS("Roboto-Regular.ttf", "...");
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  }
]);
