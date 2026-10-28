import ConverterPage from '../ConverterPage'
export default function WordToHtml() {
  return <ConverterPage 
    slug="word-to-html" 
    defaultTitle="Word to HTML" 
    defaultDesc="Convert Word to web page." 
    accept=".doc,.docx" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}