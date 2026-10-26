import { useState } from 'react'
import { Download, User, Briefcase, GraduationCap, Phone, Mail, MapPin } from 'lucide-react'

export default function CvMaker() {
  const [data, setData] = useState({
    name: 'John Doe',
    role: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+880 1234567890',
    address: 'Dhaka, Bangladesh',
    about: 'Passionate developer with 5 years of experience building web applications.',
    experience: 'Tech Corp (2020 - Present)\n- Led a team of 5 developers\n- Built scalable React applications',
    education: 'BSc in Computer Science\nUniversity of Dhaka (2015-2019)',
    skills: 'JavaScript, React, Node.js, Python, SQL'
  })

  const [style, setStyle] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  // ৫টি ভিন্ন স্টাইলের রেন্ডারিং ফাংশন
  const renderTemplate = () => {
    switch(style) {
      case 1: // Modern Sidebar
        return (
          <div className="flex h-full bg-white text-slate-800">
            <div className="w-1/3 bg-slate-900 text-white p-6">
              <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
              <p className="text-emerald-400 mb-6">{data.role}</p>
              
              <div className="space-y-3 text-sm mb-8">
                <p className="flex items-center gap-2"><Mail size={14}/> {data.email}</p>
                <p className="flex items-center gap-2"><Phone size={14}/> {data.phone}</p>
                <p className="flex items-center gap-2"><MapPin size={14}/> {data.address}</p>
              </div>

              <h2 className="text-lg font-bold border-b border-slate-700 pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {data.skills.split(',').map((s, i) => (
                  <span key={i} className="bg-slate-800 px-2 py-1 rounded">{s.trim()}</span>
                ))}
              </div>
            </div>
            <div className="w-2/3 p-8">
              <h2 className="text-xl font-bold border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2"><User size={18}/> About Me</h2>
              <p className="text-sm text-slate-600 mb-6 whitespace-pre-wrap">{data.about}</p>
              
              <h2 className="text-xl font-bold border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2"><Briefcase size={18}/> Experience</h2>
              <p className="text-sm text-slate-600 mb-6 whitespace-pre-wrap">{data.experience}</p>
              
              <h2 className="text-xl font-bold border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2"><GraduationCap size={18}/> Education</h2>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.education}</p>
            </div>
          </div>
        )
      case 2: // Classic Minimal
        return (
          <div className="h-full bg-white text-slate-800 p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-1">{data.name}</h1>
              <p className="text-lg text-slate-500">{data.role}</p>
              <div className="flex justify-center gap-4 text-xs text-slate-400 mt-2">
                <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.address}</span>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Summary</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.about}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Experience</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.experience}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Education</h3>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.education}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Skills</h3>
                <p className="text-sm text-slate-600">{data.skills}</p>
              </div>
            </div>
          </div>
        )
      case 3: // Bold Header
        return (
          <div className="h-full bg-white text-slate-800">
            <div className="bg-emerald-600 text-white p-8 text-center">
              <h1 className="text-3xl font-black mb-1">{data.name}</h1>
              <p className="text-emerald-100">{data.role}</p>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-emerald-600 mb-2">Contact</h3>
                <div className="text-xs space-y-1 mb-6">
                  <p>{data.email}</p>
                  <p>{data.phone}</p>
                  <p>{data.address}</p>
                </div>
                <h3 className="font-bold text-emerald-600 mb-2">Skills</h3>
                <ul className="text-xs list-disc pl-4">
                  {data.skills.split(',').map((s, i) => <li key={i}>{s.trim()}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-emerald-600 mb-2">About</h3>
                <p className="text-xs mb-6 whitespace-pre-wrap">{data.about}</p>
                <h3 className="font-bold text-emerald-600 mb-2">Experience</h3>
                <p className="text-xs whitespace-pre-wrap mb-4">{data.experience}</p>
                <h3 className="font-bold text-emerald-600 mb-2">Education</h3>
                <p className="text-xs whitespace-pre-wrap">{data.education}</p>
              </div>
            </div>
          </div>
        )
      case 4: // Creative Timeline
        return (
          <div className="h-full bg-slate-50 text-slate-800 p-8 border-t-8 border-emerald-500">
            <h1 className="text-3xl font-extrabold">{data.name}</h1>
            <p className="text-emerald-500 font-medium mb-4">{data.role}</p>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold border-l-4 border-emerald-500 pl-2">Profile</h3>
                  <p className="text-sm pl-3 whitespace-pre-wrap">{data.about}</p>
                </div>
                <div>
                  <h3 className="font-bold border-l-4 border-emerald-500 pl-2">Experience</h3>
                  <p className="text-sm pl-3 whitespace-pre-wrap">{data.experience}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-bold border-l-4 border-emerald-500 pl-2">Contact</h3>
                  <p className="pl-3 text-xs truncate">{data.email}</p>
                  <p className="pl-3 text-xs">{data.phone}</p>
                </div>
                <div>
                  <h3 className="font-bold border-l-4 border-emerald-500 pl-2">Education</h3>
                  <p className="pl-3 text-xs whitespace-pre-wrap">{data.education}</p>
                </div>
                <div>
                  <h3 className="font-bold border-l-4 border-emerald-500 pl-2">Skills</h3>
                  <p className="pl-3 text-xs">{data.skills}</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 5: // Elegant Dark
        return (
          <div className="h-full bg-slate-800 text-slate-200 p-10">
            <div className="border-b border-slate-600 pb-4 mb-6">
              <h1 className="text-4xl font-light text-white">{data.name}</h1>
              <p className="text-emerald-400 tracking-widest uppercase text-sm mt-1">{data.role}</p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1/4 text-right text-xs text-slate-400 uppercase tracking-wider">About</div>
                <div className="w-3/4 text-sm whitespace-pre-wrap">{data.about}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/4 text-right text-xs text-slate-400 uppercase tracking-wider">Experience</div>
                <div className="w-3/4 text-sm whitespace-pre-wrap">{data.experience}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/4 text-right text-xs text-slate-400 uppercase tracking-wider">Education</div>
                <div className="w-3/4 text-sm whitespace-pre-wrap">{data.education}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/4 text-right text-xs text-slate-400 uppercase tracking-wider">Skills</div>
                <div className="w-3/4 text-sm">{data.skills}</div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Editor Form */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4">CV Details</h2>
          
          <div className="space-y-3">
            <input name="name" value={data.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded-xl" />
            <input name="role" value={data.role} onChange={handleChange} placeholder="Job Title" className="w-full p-3 border rounded-xl" />
            <input name="email" value={data.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-xl" />
            <input name="phone" value={data.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded-xl" />
            <input name="address" value={data.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded-xl" />
            <textarea name="about" value={data.about} onChange={handleChange} placeholder="About Me" rows={3} className="w-full p-3 border rounded-xl" />
            <textarea name="experience" value={data.experience} onChange={handleChange} placeholder="Experience" rows={4} className="w-full p-3 border rounded-xl" />
            <textarea name="education" value={data.education} onChange={handleChange} placeholder="Education" rows={3} className="w-full p-3 border rounded-xl" />
            <input name="skills" value={data.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full p-3 border rounded-xl" />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-2/3">
        <div className="sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${style === s ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}>
                  Style {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white shadow-2xl rounded-sm overflow-hidden aspect-[1/1.414] max-h-[800px] w-full border">
            {renderTemplate()}
          </div>
          
          <button onClick={() => window.print()} className="mt-6 w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
            <Download size={20} /> Download / Print CV
          </button>
        </div>
      </div>
    </div>
  )
}