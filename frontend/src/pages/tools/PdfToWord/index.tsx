import ConverterPage from '../ConverterPage'
export default function PdfToWord() {
  return <ConverterPage 
    slug="pdf-to-word" 
    defaultTitle="PDF to Word" 
    defaultDesc="Convert PDF to editable Word document." 
    accept=".pdf" 
    endpoint={"/api/convert/pdf-to-docx"} 
    comingSoon={false} 
  />
}