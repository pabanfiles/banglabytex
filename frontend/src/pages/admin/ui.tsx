export const card = { background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 16, marginBottom: 14 } as const
export const h2 = { fontSize: 17, margin: '0 0 12px', fontWeight: 600 } as const
export const btn = { border: '1px solid #e7e5e4', background: '#fff', color: '#1c1917', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', font: 'inherit', fontSize: 13 } as const
export const btnP = { ...btn, background: '#F97316', borderColor: '#F97316', color: '#fff', fontWeight: 500 } as const
export const btnSm = { ...btn, padding: '4px 9px', fontSize: 12 } as const
export const btnSmP = { ...btnP, padding: '4px 9px', fontSize: 12 } as const
export const btnDel = { ...btn, color: '#B91C1C' } as const
export const input = { width: '100%', padding: '9px 11px', border: '1px solid #e7e5e4', borderRadius: 8, font: 'inherit', background: '#fff', color: '#1c1917', marginTop: 4, fontSize: 14 } as const
export const label = { display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 12 } as const
export const pill = { display: 'inline-block', fontSize: 12, padding: '2px 9px', borderRadius: 99, border: '1px solid #e7e5e4', color: '#6b7280' } as const
export const note = { fontSize: 12, color: '#6b7280', background: '#FFF7ED', borderRadius: 8, padding: '9px 11px', marginTop: 8 } as const
export function scoreColour(s: number) { return s >= 80 ? '#15803D' : s >= 50 ? '#B45309' : '#B91C1C' }