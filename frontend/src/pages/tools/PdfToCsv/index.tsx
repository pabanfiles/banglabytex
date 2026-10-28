import ConverterPage from '../ConverterPage'
export default function PdfToCsv() {
  return <ConverterPage 
    slug="pdf-to-csv" 
    defaultTitle="PDF to CSV" 
    defaultDesc="Extract PDF tables to CSV." 
    accept=".pdf" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}