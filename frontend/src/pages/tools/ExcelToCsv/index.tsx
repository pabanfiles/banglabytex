import ConverterPage from '../ConverterPage'
export default function ExcelToCsv() {
  return <ConverterPage 
    slug="excel-to-csv" 
    defaultTitle="Excel to CSV" 
    defaultDesc="Convert Excel to CSV format." 
    accept=".xls,.xlsx" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}