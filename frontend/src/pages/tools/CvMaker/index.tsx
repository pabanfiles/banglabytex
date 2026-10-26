import { useState, useRef } from 'react'
import { Download, Plus, Trash2, Camera, Upload } from 'lucide-react'

export default function CvMaker() {
  const [style, setStyle] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ডাইনামিক ডেটা স্ট্রাকচার
  const [data, setData] = useState({
    name: 'Jay Sharma',
    role: 'Bachelor of Commerce (B.Com) Graduate',
    email: 'info@domain.com',
    phone: '+91 9999999999',
    address: 'New Delhi, India',
    about: 'Motivated and detail-oriented B.Com graduate seeking an entry-level position in finance. Possesses a strong understanding of business principles, Excel, and communication skills. Eager to learn, contribute, and grow with a reputable organization.',
    experience: 'Operations Intern at Tech Solutions (May 2024 - July 2024)\n- Assisted in managing daily operations and customer interactions.\n- Supported senior staff with data entry and reporting.\n- Collaborated with team members to improve workflow efficiency.',
    education: 'Bachelor of Commerce (B.Com) - University of Delhi (2021-2024)\nClass XII (CBSE) - Delhi Public School (2021)\nClass X (CBSE) - Delhi Public School (2019)',
    skills: 'Excel, QuickBooks, Tally ERP 9, Financial Analysis, Teamwork, Communication, Problem Solving, Adaptability'
  })

  // কাস্টম সেকশন (User Add করতে পারবে)
  const [customSections, setCustomSections] = useState([
    { id: 1, title: 'Certifications', content: 'Advanced Excel Certification | 2024\nBusiness Analytics Fundamentals | 2023' }
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImage(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addCustomSection = () => {
    setCustomSections([...customSections, { id: Date.now(), title: 'New Section', content: 'Click to edit...' }])
  }

  const updateCustomSection = (id: number, field: 'title' | 'content', value: string) => {
    setCustomSections(customSections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec))
  }

  const removeCustomSection = (id: number) => {
    setCustomSections(customSections.filter(sec => sec.id !== id))
  }

  // ─── STYLE 1: Blue Modern (আপনার দেওয়া ছবির মতো) ───
  const Style1 = () => (
    <div className="flex h-full bg-white text-slate-800 font-sans w-full aspect-[1/1.414]">
      {/* Left Sidebar (Blue) */}
      <div className="w-[35%] bg-[#0f172a] text-white p-6 flex flex-col items-center">
        {/* Profile Pic */}
        <div className="w-28 h-28 rounded-full border-4 border-[#1e293b] overflow-hidden mb-4 bg-slate-700 flex items-center justify-center relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {image ? <img src={image} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="text-slate-400" size={32} />}
        </div>

        {/* Contact */}
        <div className="w-full mt-4">
          <h3 className="text-sm font-bold text-emerald-400 border-b border-slate-600 pb-1 mb-3 uppercase tracking-wider">Contact</h3>
          <div className="text-xs space-y-2 break-words">
            <p className="flex items-start gap-2"><span>📧</span> {data.email}</p>
            <p className="flex items-start gap-2"><span>📱</span> {data.phone}</p>
            <p className="flex items-start gap-2"><span>📍</span> {data.address}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="w-full mt-6">
          <h3 className="text-sm font-bold text-emerald-400 border-b border-slate-600 pb-1 mb-3 uppercase tracking-wider">Skills</h3>
          <div className="text-xs space-y-1">
            {data.skills.split(',').map((s, i) => (
              <p key={i} className="flex items-center gap-1">• {s.trim()}</p>
            ))}
          </div>
        </div>

        {/* Custom Sections in Sidebar */}
        {customSections.map(sec => (
          <div key={sec.id} className="w-full mt-6">
            <h3 className="text-sm font-bold text-emerald-400 border-b border-slate-600 pb-1 mb-3 uppercase tracking-wider">{sec.title}</h3>
            <div className="text-xs space-y-1 whitespace-pre-wrap">{sec.content}</div>
          </div>
        ))}
      </div>

      {/* Right Content */}
      <div className="w-[65%] p-8">
        <div className="mb-6 border-b-2 border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">{data.name}</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">{data.role}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Profile
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed text-justify">{data.about}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Education
          </h3>
          <div className="text-xs text-slate-600 space-y-2 whitespace-pre-wrap">{data.education}</div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Experience
          </h3>
          <div className="text-xs text-slate-600 space-y-2 whitespace-pre-wrap">{data.experience}</div>
        </div>
      </div>
    </div>
  )

  // ─── STYLE 2: Simple Clean ───
  const Style2 = () => (
    <div className="h-full bg-white text-slate-800 p-10 w-full aspect-[1/1.414]">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 bg-slate-100 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {image ? <img src={image} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="text-slate-400" size={24} />}
        </div>
        <h1 className="text-4xl font-serif font-bold mb-1">{data.name}</h1>
        <p className="text-lg text-slate-500">{data.role}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-400 mt-2">
          <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.address}</span>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b pb-1 mb-2">Profile</h3>
          <p className="text-sm text-slate-600 text-justify">{data.about}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b pb-1 mb-2">Experience</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.experience}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b pb-1 mb-2">Education</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.education}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b pb-1 mb-2">Skills</h3>
          <p className="text-sm text-slate-600">{data.skills}</p>
        </div>
        {customSections.map(sec => (
          <div key={sec.id}>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b pb-1 mb-2">{sec.title}</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Editor Form */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-white pb-2 z-10">Edit CV</h2>
          
          <div className="space-y-4">
            {/* Image Upload Button */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-emerald-800">Profile Picture</p>
                <p className="text-xs text-emerald-600">Upload a photo</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                <Upload size={18} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input name="name" value={data.name} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Job Title / Role</label>
              <input name="role" value={data.role} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-500">Email</label>
                <input name="email" value={data.email} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Phone</label>
                <input name="phone" value={data.phone} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Address</label>
              <input name="address" value={data.address} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Profile / About</label>
              <textarea name="about" value={data.about} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Experience</label>
              <textarea name="experience" value={data.experience} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Education</label>
              <textarea name="education" value={data.education} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Skills (Comma separated)</label>
              <textarea name="skills" value={data.skills} onChange={handleChange} rows={2} className="w-full p-2 border rounded-lg text-sm" />
            </div>

            {/* Custom Sections Area */}
            <div className="pt-4 border-t">
              <h3 className="font-bold text-slate-800 mb-3">Custom Sections</h3>
              {customSections.map((sec, i) => (
                <div key={sec.id} className="bg-slate-50 p-3 rounded-xl mb-3 relative border">
                  <button onClick={() => removeCustomSection(sec.id)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded">
                    <Trash2 size={14} />
                  </button>
                  <input 
                    value={sec.title} 
                    onChange={(e) => updateCustomSection(sec.id, 'title', e.target.value)} 
                    className="font-bold text-sm bg-transparent border-b mb-2 w-[80%] focus:outline-none" 
                    placeholder="Section Title"
                  />
                  <textarea 
                    value={sec.content} 
                    onChange={(e) => updateCustomSection(sec.id, 'content', e.target.value)} 
                    className="w-full text-xs bg-transparent border-none focus:outline-none resize-none" 
                    rows={2} 
                    placeholder="Section content..."
                  />
                </div>
              ))}
              <button onClick={addCustomSection} className="w-full py-2 border-2 border-dashed border-emerald-300 text-emerald-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition">
                <Plus size={16} /> Add New Section
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-2/3">
        <div className="sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button onClick={() => setStyle(1)} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${style === 1 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border'}`}>Style 1 (Modern)</button>
              <button onClick={() => setStyle(2)} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${style === 2 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border'}`}>Style 2 (Simple)</button>
            </div>
          </div>
          
          <div className="bg-white shadow-2xl rounded-sm overflow-hidden max-h-[850px] overflow-y-auto">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            {style === 1 ? <Style1 /> : <Style2 />}
          </div>
          
          <button onClick={() => window.print()} className="mt-6 w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
            <Download size={20} /> Download / Print CV
          </button>
        </div>
      </div>
    </div>
  )
}