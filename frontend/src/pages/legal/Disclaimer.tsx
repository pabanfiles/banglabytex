import Seo from '../../components/Seo'
export default function Disclaimer() {
  return (
    <>
      <Seo title='Disclaimer | PPM Creator' description='How PPM Creator tools work, what they do not guarantee, and how to use them responsibly.' path='/disclaimer' />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px', lineHeight: 1.7 }}>
        <h1>Disclaimer</h1>
        <p>PPM Creator provides free online tools for images, PDFs, text and everyday calculations. The tools are provided as-is. We do not guarantee any specific result, file size or outcome.</p>
        <h2>No guarantee of outcome</h2>
        <p>Compression, conversion and calculation results depend on the input file and your device. Always check important output before using it for a form, submission or publication.</p>
        <h2>Not professional advice</h2>
        <p>Nothing on this site is legal, financial, medical or government advice. For official form sizes, fees or deadlines, always check the official instructions published by the relevant authority.</p>
        <h2>Third-party links</h2>
        <p>Some pages link to external sites. We are not responsible for their content or privacy practices.</p>
        <h2>Contact</h2>
        <p>Questions? Email hello@ppmcreator.com.</p>
      </main>
    </>
  )
}