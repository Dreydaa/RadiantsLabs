import { PDFViewer } from '@react-pdf/renderer';
import Documentation from '../components/Documentation';

function GenerateDocumentation() {
  return (
    <div className="w-full h-screen">
      <PDFViewer className="w-full h-full">
        <Documentation />
      </PDFViewer>
    </div>
  );
}

export default GenerateDocumentation;