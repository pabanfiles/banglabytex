export function buildFaqJsonLd(groups) {
  const all = groups.flatMap((g) => g.items)
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
}
export default function FaqSection({ groups }) {
  return (
    <section>
      <h2>Frequently asked questions</h2>
      {groups.map((g) => (
        <div key={g.heading}>
          <h3>{g.heading}</h3>
          {g.items.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid #e7e5e4', padding: '12px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{f.q}</summary>
              <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{f.a}</p>
            </details>
          ))}
        </div>
      ))}
    </section>
  )
}