from sqlalchemy import Column, Integer, String, Date, DateTime, func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    # 기본키, 자동 증가
    user_seq_no = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # 유저 아이디 (중복 불가)
    user_id = Column(String(20), unique=True, nullable=False)
    
    # 비밀번호 (암호화되어 저장됨)
    user_pw = Column(String(100), nullable=False)
    
    # 비밀번호 체크 여부 (기본값 Y)
    user_pw_check = Column(String(1), default='Y', nullable=False)
    
    # 유저 이름
    user_name = Column(String(10), nullable=False)
    
    # 유저 닉네임
    user_nickname = Column(String(20), nullable=False)
    
    # 이메일 (중복 불가)
    user_email = Column(String(50), unique=True, nullable=False)
    
    # 주소 정보
    user_post = Column(String(5), nullable=False)
    user_addr1 = Column(String(100), nullable=False)
    user_addr2 = Column(String(100), nullable=True) # 상세주소는 없을 수도 있음 (NULL 허용)
    
    # 생년월일 및 성별
    user_birth = Column(Date, default="2000-01-01", nullable=False)
    user_gender = Column(String(1), nullable=False)
    
    # 관리 정보 (자동 생성)
    user_create_date = Column(DateTime, default=func.now(), nullable=False)
    user_update_date = Column(DateTime, default=func.now(), onupdate=func.now())
    user_delete_date = Column(DateTime, nullable=True)
    user_delete_check = Column(String(1), default="N", nullable=False)