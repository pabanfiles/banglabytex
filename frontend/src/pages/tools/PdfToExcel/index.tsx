import ConverterPage from '../ConverterPage'
export default function PdfToExcel() {
  return <ConverterPage 
    slug="pdf-to-excel" 
    defaultTitle="PDF to Excel" 
    defaultDesc="Convert PDF tables to Excel." 
    accept=".pdf" 
    endpoint={"/api/convert/pdf-to-xlsx"} 
    comingSoon={false} 
  />
}