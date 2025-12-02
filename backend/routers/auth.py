from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db  # DB 세션 의존성 (구현 필요)
from models import User
from schemas.user import UserCreate, UserLogin, UserResponse
from core.security import get_password_hash, verify_password
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import string
from datetime import datetime, timedelta
from jose import JWTError, jwt

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


# 토큰 설정 (실제 배포할 땐 아주 복잡한 비밀번호로 환경변수에 숨겨야 함)
SECRET_KEY = "localy_secret_key_very_secure" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24시간 유지

# 토큰 생성 함수
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 이메일 인증번호 임시 저장소 (실제로는 Redis 또는 DB 사용 권장)
verification_codes = {}

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationCheck(BaseModel):
    email: EmailStr
    code: str


# 이메일 인증번호 발송 API
@router.post("/send-verification")
async def send_verification_code(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    """
    이메일로 6자리 인증번호를 발송합니다.
    Gmail SMTP를 사용합니다.
    """
    # 이메일 중복 체크
    existing_user = db.query(User).filter(User.user_email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 사용 중인 이메일입니다.")
    
    # 6자리 랜덤 인증번호 생성
    verification_code = ''.join(random.choices(string.digits, k=6))
    
    # 인증번호 저장 (5분 유효)
    expiry_time = datetime.now() + timedelta(minutes=5)
    verification_codes[request.email] = {
        'code': verification_code,
        'expiry': expiry_time
    }
    
    # Gmail SMTP 설정 (환경변수로 관리 권장)
    # TODO: 실제 Gmail 계정 정보로 교체하세요
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "kongdu300@gmail.com"  # 발신자 이메일
    sender_password = "axaq viqu objl kpxl"   # Gmail 앱 비밀번호
    
    try:
        # 이메일 메시지 생성
        message = MIMEMultipart("alternative")
        message["Subject"] = "야옹이 여행 - 이메일 인증번호"
        message["From"] = sender_email
        message["To"] = request.email
        
        # HTML 이메일 본문
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px;">
              <h2 style="color: #2D8B5F;">🐱 야옹이 여행 이메일 인증</h2>
              <p>회원가입을 위한 인증번호입니다.</p>
              <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h1 style="color: #2D8B5F; letter-spacing: 5px;">{verification_code}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">이 인증번호는 5분간 유효합니다.</p>
              <p style="color: #999; font-size: 12px;">본인이 요청하지 않았다면 이 이메일을 무시하세요.</p>
            </div>
          </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)
        
        # SMTP 서버 연결 및 이메일 발송
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, request.email, message.as_string())
        
        return {"message": "인증번호가 이메일로 전송되었습니다."}
    
    except Exception as e:
        # 실제 이메일 발송 실패시 콘솔에 인증번호 출력 (개발용)
        print(f"[개발용] 이메일 발송 실패. 인증번호: {verification_code}")
        print(f"에러: {str(e)}")
        # 개발 환경에서는 인증번호를 반환 (프로덕션에서는 제거)
        return {"message": "인증번호가 이메일로 전송되었습니다.", "dev_code": verification_code}

# 이메일 인증번호 확인 API
@router.post("/verify-email")
async def verify_email_code(request: EmailVerificationCheck):
    """
    이메일 인증번호를 확인합니다.
    """
    # 저장된 인증번호 확인
    if request.email not in verification_codes:
        raise HTTPException(status_code=400, detail="인증번호가 발송되지 않았습니다.")
    
    stored_data = verification_codes[request.email]
    
    # 유효기간 확인
    if datetime.now() > stored_data['expiry']:
        del verification_codes[request.email]
        raise HTTPException(status_code=400, detail="인증번호가 만료되었습니다.")
    
    # 인증번호 확인
    if stored_data['code'] != request.code:
        raise HTTPException(status_code=400, detail="인증번호가 올바르지 않습니다.")
    
    # 인증 성공 - 저장소에서 삭제
    del verification_codes[request.email]
    
    return {"message": "이메일 인증이 완료되었습니다."}

# 0. 아이디 중복 확인 API
@router.get("/check-username/{user_id}")
async def check_username(user_id: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user:
        return {"available": False, "message": "이미 사용 중인 아이디입니다."}
    return {"available": True, "message": "사용 가능한 아이디입니다."}

# 닉네임 중복 확인 API
@router.get("/check-nickname/{nickname}")
async def check_nickname(nickname: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_nickname == nickname).first()
    if db_user:
        return {"available": False, "message": "이미 사용 중인 닉네임입니다."}
    return {"available": True, "message": "사용 가능한 닉네임입니다."}

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
    # 1. ID로 유저 찾기
    user = db.query(User).filter(User.user_id == user_req.user_id).first()
    
    # 2. 유저가 없거나 비밀번호가 틀리면 에러
    if not user or not verify_password(user_req.user_pw, user.user_pw):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 잘못되었습니다.",
        )
    
    # 3. [추가됨] 토큰(자유이용권) 발급!
    access_token = create_access_token(data={"sub": user.user_id})
    
    # 4. 토큰과 유저 정보를 같이 반환
    return {
        "message": "로그인 성공!",
        "access_token": access_token, # <-- 이게 핵심!
        "token_type": "bearer",
        "user_id": user.user_id,
        "user_name": user.user_name,
        "user_nickname": user.user_nickname,
        "user_email": user.user_email,
        "user_phone": user.user_phone if hasattr(user, "user_phone") else "",
        "user_post": user.user_post,
        "user_addr1": user.user_addr1,
        "user_addr2": user.user_addr2,
        "user_birth": str(user.user_birth) if user.user_birth else "",
        "user_gender": user.user_gender
    }


# -----------------------------------------------------------
# [추가] 비밀번호 변경 기능
# -----------------------------------------------------------

# 1. 비밀번호 변경 요청에 사용할 데이터 틀
class PasswordChangeRequest(BaseModel):
    user_id: str          # 누구의 비밀번호를 바꿀지 알아야 함
    current_password: str # 현재 비밀번호 (확인용)
    new_password: str     # 바꿀 비밀번호

@router.put("/change-password")
async def change_password(request: PasswordChangeRequest, db: Session = Depends(get_db)):
    """
    로그인한 사용자의 비밀번호를 변경합니다.
    """
    # 1. 사용자 찾기 (DB에서 user_id로 조회)
    user = db.query(User).filter(User.user_id == request.user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    # 2. 현재 비밀번호가 맞는지 확인
    if not verify_password(request.current_password, user.user_pw):
        raise HTTPException(status_code=400, detail="현재 비밀번호가 일치하지 않습니다.")

    # 3. 새 비밀번호 암호화해서 저장
    user.user_pw = get_password_hash(request.new_password)
    
    db.add(user)
    db.commit() # 저장 확정
    
    return {"message": "비밀번호가 성공적으로 변경되었습니다."}


# -----------------------------------------------------------
# [추가] 회원탈퇴 기능
# -----------------------------------------------------------

@router.delete("/withdraw/{user_id}")
async def withdraw_user(user_id: str, db: Session = Depends(get_db)):
    """
    회원 탈퇴: DB에서 사용자 정보를 영구 삭제합니다.
    """
    # 1. 삭제할 유저 찾기
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    # 2. 유저 삭제 (주의: 연관된 여행 정보가 있다면 DB 설정에 따라 같이 삭제되거나 에러가 날 수 있음)
    db.delete(user)
    db.commit()
    
    return {"message": "회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다."}