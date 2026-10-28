import ConverterPage from '../ConverterPage'
export default function WordToExcel() {
  return <ConverterPage 
    slug="word-to-excel" 
    defaultTitle="Word to Excel" 
    defaultDesc="Convert Word tables to Excel." 
    accept=".doc,.docx" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}