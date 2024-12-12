# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from routers import data_response
from fastapi.responses import FileResponse
import os 
import uvicorn


app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 경로 설정
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 라우터 등록
app.include_router(data_response.router)

# 루트 경로에서 index.html 반환
@app.get("/", response_class=HTMLResponse)
async def get_home():
    with open("static/index.html", encoding="utf-8") as f:
        return HTMLResponse(content=f.read(), status_code=200)
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
