import { Facebook, Youtube, Instagram, Send } from 'lucide-react'

export default function SocialLinks() {
  const links = [
    { name: 'Facebook', url: 'https://www.facebook.com/ppmcreator', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'YouTube', url: 'https://www.youtube.com/@ppmcreator', icon: Youtube, color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Instagram', url: 'https://www.instagram.com/ppmcreator', icon: Instagram, color: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90' },
    { name: 'Telegram', url: 'https://t.me/ppmcreator', icon: Send, color: 'bg-sky-500 hover:bg-sky-600' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-6 py-3 ${link.color} text-white rounded-full font-semibold transition-all shadow-lg hover:-translate-y-1`}
          >
            <Icon size={20} />
            {link.name}
          </a>
        )
      })}
    </div>
  )
}