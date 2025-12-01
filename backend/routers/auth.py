from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db  # DB 세션 의존성 (구현 필요)
from models import User
from schemas.user import UserCreate, UserLogin, UserResponse
from core.security import get_password_hash, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

# 0. 아이디 중복 확인 API
@router.get("/check-username/{username}")
async def check_username(username: str, db: Session = Depends(get_db)):
    """아이디 중복 확인"""
    db_user = db.query(User).filter(User.user_id == username).first()
    if db_user:
        return {"available": False, "message": "이미 사용 중인 아이디입니다."}
    return {"available": True, "message": "사용 가능한 아이디입니다."}

# 1. 회원가입 API
@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # ID 중복 체크
    db_user = db.query(User).filter(User.user_id == user.user_id).first()
    if db_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")
    
    # 이메일 중복 체크
    db_email = db.query(User).filter(User.user_email == user.user_email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")

    # 비밀번호 암호화 후 저장
    hashed_password = get_password_hash(user.user_pw)
    
    new_user = User(
        user_id=user.user_id,
        user_pw=hashed_password, # [cite: 3] 암호화해서 저장
        user_name=user.user_name,
        user_nickname=user.user_nickname,
        user_email=user.user_email,
        user_post=user.user_post,
        user_addr1=user.user_addr1,
        user_addr2=user.user_addr2,
        user_birth=user.user_birth,
        user_gender=user.user_gender
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# 2. 로그인 API
@router.post("/login")
async def login(user_req: UserLogin, db: Session = Depends(get_db)):
    # ID로 유저 찾기
    user = db.query(User).filter(User.user_id == user_req.user_id).first()
    
    # 유저가 없거나 비밀번호가 틀리면 에러
    if not user or not verify_password(user_req.user_pw, user.user_pw):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 잘못되었습니다.",
        )
    
    # 성공 시 간단한 메시지 또는 토큰 반환 (나중에 JWT 적용 예정)
    return {
        "message": "로그인 성공!",
        "user_nickname": user.user_nickname,
        "user_id": user.user_id
    }
