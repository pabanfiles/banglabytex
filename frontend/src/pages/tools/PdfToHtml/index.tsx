import ConverterPage from '../ConverterPage'
export default function PdfToHtml() {
  return <ConverterPage 
    slug="pdf-to-html" 
    defaultTitle="PDF to HTML" 
    defaultDesc="Convert PDF to web page." 
    accept=".pdf" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}