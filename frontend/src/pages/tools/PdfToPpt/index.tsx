import ConverterPage from '../ConverterPage'
export default function PdfToPpt() {
  return <ConverterPage 
    slug="pdf-to-ppt" 
    defaultTitle="PDF to PowerPoint" 
    defaultDesc="Convert PDF pages to PPT." 
    accept=".pdf" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}