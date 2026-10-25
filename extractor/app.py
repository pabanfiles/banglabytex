import asyncio
import re
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import requests

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

# yt-dlp options
YDL_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
    "socket_timeout": 15,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

def extract_hashtags(text: str) -> list[str]:
    return list(set(re.findall(r"#(\w+)", text or "")))

def extract_youtube(url: str) -> dict:
    with yt_dlp.YoutubeDL(YDL_OPTS) as ydl:
        info = ydl.extract_info(url, download=False)
    video_id = info.get("id", "")
    return {
        "platform": "youtube",
        "type": "video",
        "title": info.get("title", ""),
        "author": info.get("uploader", ""),
        "thumbnail": f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
        "duration": info.get("duration", 0),
        "caption": (info.get("description") or "")[:500],
        "hashtags": extract_hashtags(info.get("description", "")),
        "formats": [],
        "watchUrl": f"https://www.youtube.com/watch?v={video_id}",
    }

def extract_generic(url: str, platform: str) -> dict:
    # Some platforms need specific extractors
    opts = YDL_OPTS.copy()
    if platform == "instagram":
        opts["extractor_args"] = {"instagram": {"include": ["reel", "story"]}}
    
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = []
    seen = set()
    
    # Prioritize mp4 format with audio
    for f in info.get("formats", []):
        if not f.get("url"): continue
        ext = f.get("ext", "mp4")
        height = f.get("height")
        if f.get("vcodec") != "none" and height:
            quality = f"{height}p"
            key = f"{quality}-{ext}"
            if key in seen: continue
            seen.add(key)
            formats.append({
                "id": f.get("format_id", key),
                "quality": quality,
                "ext": ext,
                "size": f.get("filesize") or f.get("filesize_approx") or 0,
                "url": f["url"],
                "type": "video",
            })
    
    # If no formats with height, try all
    if not formats:
        for f in info.get("formats", []):
            if not f.get("url"): continue
            formats.append({
                "id": str(f.get("format_id", "0")),
                "quality": "Default",
                "ext": f.get("ext", "mp4"),
                "size": f.get("filesize") or f.get("filesize_approx") or 0,
                "url": f["url"],
                "type": "video",
            })

    def sort_key(x):
        v = x["quality"].rstrip("p")
        return int(v) if v.isdigit() else 0
    formats.sort(key=sort_key, reverse=True)

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
    }

@app.post("/extract")
async def extract(req: ExtractRequest):
    url = req.url.strip()
    platform = req.platform or "unknown"
    try:
        if platform == "youtube":
            result = await asyncio.to_thread(extract_youtube, url)
        else:
            result = await asyncio.to_thread(extract_generic, url, platform)
        return result
    except yt_dlp.utils.DownloadError as e:
        msg = str(e)
        if "private" in msg.lower() or "login" in msg.lower():
            raise HTTPException(403, "Private content — login required")
        raise HTTPException(400, f"Extraction failed: {msg[:200]}")
    except Exception as e:
        raise HTTPException(500, f"Server error: {str(e)[:200]}")

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"service": "BanglaByteX Extractor"}