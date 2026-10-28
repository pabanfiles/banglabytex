import ConverterPage from '../ConverterPage'
export default function ExcelToWord() {
  return <ConverterPage 
    slug="excel-to-word" 
    defaultTitle="Excel to Word" 
    defaultDesc="Convert Excel tables to Word." 
    accept=".xls,.xlsx" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}