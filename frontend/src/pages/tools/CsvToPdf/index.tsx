import ConverterPage from '../ConverterPage'
export default function CsvToPdf() {
  return <ConverterPage 
    slug="csv-to-pdf" 
    defaultTitle="CSV to PDF" 
    defaultDesc="Convert CSV data to PDF." 
    accept=".csv" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}