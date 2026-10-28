import ConverterPage from '../ConverterPage'
export default function ExcelToPdf() {
  return <ConverterPage 
    slug="excel-to-pdf" 
    defaultTitle="Excel to PDF" 
    defaultDesc="Convert Excel sheets to PDF." 
    accept=".xls,.xlsx" 
    endpoint={"/api/convert/office-to-pdf"} 
    comingSoon={false} 
  />
}