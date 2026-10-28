import ConverterPage from '../ConverterPage'
export default function WordToPdf() {
  return <ConverterPage 
    slug="word-to-pdf" 
    defaultTitle="Word to PDF" 
    defaultDesc="Convert Word docs to PDF." 
    accept=".doc,.docx" 
    endpoint={"/api/convert/office-to-pdf"} 
    comingSoon={false} 
  />
}