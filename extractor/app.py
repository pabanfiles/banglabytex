import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

class Req(BaseModel):
    url: str

YDL_OPTS = { "quiet": True, "skip_download": True, "noplaylist": True, "socket_timeout": 15 }

def do_extract(url: str):
    with yt_dlp.YoutubeDL(YDL_OPTS) as ydl:
        info = ydl.extract_info(url, download=False)
        
    formats = []
    for f in info.get("formats", []):
        if f.get("vcodec") != "none" and f.get("height"):
            formats.append({
                "id": str(f.get("format_id")), "quality": f'{f.get("height")}p', 
                "ext": f.get("ext", "mp4"), "size": f.get("filesize") or 0, 
                "url": f["url"], "type": "video"
            })
            
    return {
        "platform": info.get("extractor_key", "unknown"),
        "title": info.get("title", ""),
        "author": info.get("uploader", ""),
        "thumbnail": info.get("thumbnail", ""),
        "formats": formats[:5]
    }

@app.post("/extract")
async def extract(req: Req):
    try:
        return await asyncio.to_thread(do_extract, req.url)
    except Exception as e:
        raise HTTPException(400, str(e)[:100])

@app.get("/health")
def health(): return {"ok": True}