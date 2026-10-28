import ConverterPage from '../ConverterPage'
export default function PptToPdf() {
  return <ConverterPage 
    slug="ppt-to-pdf" 
    defaultTitle="PPT to PDF" 
    defaultDesc="Convert PowerPoint to PDF." 
    accept=".ppt,.pptx" 
    endpoint={"/api/convert/office-to-pdf"} 
    comingSoon={false} 
  />
}