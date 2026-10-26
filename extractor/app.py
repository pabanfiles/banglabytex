import asyncio
import re
import os
import tempfile
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI(title="BanglaByteX Extractor")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractRequest(BaseModel):
    url: str
    platform: Optional[str] = None

COOKIE_FILE_PATH = None
cookies_env = os.environ.get("COOKIES_CONTENT")
if cookies_env:
    try:
        temp_cookie = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt')
        temp_cookie.write(cookies_env)
        temp_cookie.close()
        COOKIE_FILE_PATH = temp_cookie.name
    except Exception:
        pass

YDL_OPTS = {
    "quiet": True, 
    "no_warnings": True, 
    "skip_download": True,
    "noplaylist": True, 
    "socket_timeout": 10, # টাইমআউট কমানো হয়েছে দ্রুত ফেইল করার জন্য
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "cachedir": False, # ক্যাশে বন্ধ করা হয়েছে মেমোরি বাঁচানোর জন্য
}
if COOKIE_FILE_PATH:
    YDL_OPTS["cookiefile"] = COOKIE_FILE_PATH

def extract_hashtags(text: str) -> list[str]:
    return list(set(re.findall(r"#(\w+)", text or "")))

def extract_generic(url: str, platform: str) -> dict:
    opts = YDL_OPTS.copy()
    opts["format"] = "bestvideo+bestaudio/best"
    
    if platform == "instagram":
        opts["extractor_args"] = {"instagram": {"include": ["reel", "story", "photo"]}}
    
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = []
    audio_formats = []
    seen = set()
    seen_audio = set()

    best_audio_url = None
    for f in info.get("formats", []):
        if f.get("acodec") != "none" and f.get("vcodec") == "none":
            if not best_audio_url:
                best_audio_url = f.get("url")

    for f in info.get("formats", []):
        if not f.get("url"): continue
        
        if f.get("vcodec") != "none" and f.get("height"):
            ext = f.get("ext", "mp4")
            quality = f"{f.get('height')}p"
            key = f"{quality}-{ext}"
            if key not in seen:
                seen.add(key)
                has_audio = f.get("acodec") != "none"
                audio_url = f["url"] if has_audio else best_audio_url
                
                formats.append({
                    "id": f.get("format_id", key),
                    "quality": quality,
                    "ext": ext,
                    "size": f.get("filesize") or f.get("filesize_approx") or 0,
                    "url": f["url"],
                    "audio_url": audio_url,
                    "type": "video",
                    "has_audio": has_audio
                })
        
        if f.get("acodec") != "none" and f.get("vcodec") == "none":
            ext = f.get("ext", "m4a")
            abr = f.get("abr") or f.get("tbr") or 0
            quality = f"{int(abr)}kbps" if abr else "audio"
            key = f"{quality}-{ext}"
            if key not in seen_audio:
                seen_audio.add(key)
                audio_formats.append({
                    "id": f.get("format_id", key),
                    "quality": quality,
                    "ext": ext,
                    "size": f.get("filesize") or f.get("filesize_approx") or 0,
                    "url": f["url"],
                    "type": "audio",
                })

    def sort_key(x):
        v = x["quality"].replace("p", "").replace("kbps", "")
        return int(v) if v.isdigit() else 0
    formats.sort(key=sort_key, reverse=True)
    audio_formats.sort(key=sort_key, reverse=True)

    caption = info.get("description") or info.get("title") or ""
    return {
        "platform": platform,
        "type": "video",
        "title": info.get("title", ""),
        "author": info.get("uploader") or info.get("channel"),
        "thumbnail": info.get("thumbnail"),
        "duration": info.get("duration", 0),
        "caption": caption[:500],
        "hashtags": extract_hashtags(caption),
        "formats": formats[:10],
        "audioFormats": audio_formats[:3],
    }

@app.post("/extract")
async def extract(req: ExtractRequest):
    url = req.url.strip()
    platform = req.platform or "unknown"
    try:
        result = await asyncio.to_thread(extract_generic, url, platform)
        return result
    except yt_dlp.utils.DownloadError as e:
        msg = str(e)
        raise HTTPException(400, f"Extraction failed: {msg[:200]}")
    except Exception as e:
        raise HTTPException(500, f"Server error: {str(e)[:200]}")

@app.get("/health")
def health():
    return {"ok": True, "cookies_loaded": bool(COOKIE_FILE_PATH)}