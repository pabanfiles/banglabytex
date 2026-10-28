import ConverterPage from '../ConverterPage'
export default function WordToPpt() {
  return <ConverterPage 
    slug="word-to-ppt" 
    defaultTitle="Word to PowerPoint" 
    defaultDesc="Convert Word to slides." 
    accept=".doc,.docx" 
    endpoint={undefined} 
    comingSoon={true} 
  />
}