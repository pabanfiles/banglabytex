import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function WordCounter() {
  const [text, setText] = useState('')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = (text.match(/[.!?]+/g) || []).length
  const paragraphs = text.split(/\n{2,}/).filter(Boolean).length
  const readMin = Math.ceil(words / 200)

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It counts words, characters, sentences and paragraphs in the text you paste. It also shows a rough reading time at 200 words per minute.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my text uploaded?', a: 'No. The counting runs in your browser. Nothing is sent anywhere.' },
    ]},
    { heading: 'Counting', items: [
      { q: 'How are words counted?', a: 'Words are groups of characters separated by spaces, tabs or line breaks. This matches how most word processors count words.' },
      { q: 'Why do different tools give slightly different counts?', a: 'Some tools count numbers as words, some do not. Some split hyphenated terms. This tool uses a simple space-separated count.' },
      { q: 'What is the reading time based on?', a: 'A rough average of 200 words per minute. Actual time depends on the reader and the content.' },
    ]},
    { heading: 'Uses', items: [
      { q: 'Can I use it for a school essay?', a: 'Yes. Many essay limits are word counts, and this tool gives a quick check. Confirm the limit with your teacher or the exam instructions.' },
      { q: 'Can I use it for a tweet or a meta description?', a: 'Yes. The character count at the top helps you stay under a limit. For a meta description, aim for around 155 characters.' },
      { q: 'Does it count emoji?', a: 'An emoji is usually counted as one word if it is space-separated, and as one character. Different tools may count it differently.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to use the word counter</h2>
      <ol>
        <li>Paste or type your text.</li>
        <li>The counts update as you type.</li>
        <li>Copy the numbers where you need them.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>A quick way to check a length limit for an essay, a tweet, a meta description or a blog post. Everything runs locally, so nothing is uploaded.</p>
      <h2>Privacy and data</h2>
      <p>Your text stays in your browser. Nothing is stored or uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Word Counter Online Free | PPM Creator"
      description="Count words, characters, sentences and paragraphs. Runs in your browser."
      path="/word-counter"
      crumb={[{ label: 'Text Tools', to: '/calculators' }]}
      h1="Word Counter: Count Words and Characters"
      lead="Paste text to see word count, character count, sentences and reading time."
      faqGroups={faqGroups}
      related={[
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text to upper, lower or title case' },
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags from text' },
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV data to JSON' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Keeping a blog post under a word limit' },
        { title: 'Word count vs character count' },
        { title: 'Writing a meta description that fits' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste or type your text here" style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginTop: 12 }}>
          {[['Words', words], ['Characters', chars], ['No spaces', charsNoSpace], ['Sentences', sentences], ['Paragraphs', paragraphs], ['Read time', readMin + ' min']].map(([label, value]) => (
            <div key={String(label)} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
              <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>{label}</small>
              <b style={{ fontSize: 20, fontWeight: 600 }}>{value}</b>
            </div>
          ))}
        </div>
      </section>
    </ToolShell>
  )
}