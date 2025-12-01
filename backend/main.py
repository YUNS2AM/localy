from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from core.database import engine, Base  # 1. engine과 Base 가져오기
from models import User  # 2. 모델을 가져와야 테이블이 생성됨 (중요!)

# 3. 서버 시작 때 테이블 생성 (없으면 만들고, 있으면 넘어감)
Base.metadata.create_all(bind=engine)

# 앱 초기화
app = FastAPI(
    title="AIX Random Travel Platform",
    description="AI 기반 랜덤 즉흥 여행 엔터테인먼트 플랫폼 API",
    version="1.1"
)

# CORS 설정 (리액트 연동용)
# 리액트 기본 포트인 3000번을 허용해줍니다.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 라우터 예시 (나중에 파일 분리 시 routers 폴더로 이동) ---
@app.get("/")
def read_root():
    return {"message": "AIX Travel Platform API Server Running!"}

# 문서에 명시된 기본 헬스 체크용
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "version": "1.1"}

# 라우터 등록
app.include_router(auth.router)



# --- 여기에 추후 도메인별 라우터를 include 하게 됩니다 ---
# from app.routers import auth, trips, agents
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
# app.include_router(trips.router, prefix="/api/v1/trips", tags=["Trips"])