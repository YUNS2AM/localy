import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Mail, MapPin, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PersonalInfoEditScreenProps {
    onClose: () => void;
}

// Import validation functions if they exist
// @ts-ignore
const validateName = (name: string) => {
    if (!name) return { isValid: false, errorMessage: '이름을 입력해주세요.' };
    if (!/^[가-힣]+$/.test(name)) return { isValid: false, errorMessage: '이름은 한글만 입력 가능합니다.' };
    return { isValid: true };
};

// @ts-ignore
const validateNickname = (nickname: string) => {
    if (!nickname) return { isValid: false, errorMessage: '닉네임을 입력해주세요.' };
    if (nickname.length < 2) return { isValid: false, errorMessage: '닉네임은 2자 이상이어야 합니다.' };
    if (nickname.length > 10) return { isValid: false, errorMessage: '닉네임은 10자 이하여야 합니다.' };
    return { isValid: true };
};

const myUrl = 'http://localhost:8000'; // Adjust as needed

export function PersonalInfoEditScreen({ onClose }: PersonalInfoEditScreenProps) {
    // 1. 회원가입 때 썼던 필드들과 동일하게 상태 관리
    const [userInfo, setUserInfo] = useState({
        user_id: '',
        user_name: '',
        user_nickname: '',
        user_email: '',
        user_phone: '',
        user_post: '',
        user_addr1: '',
        user_addr2: '',
        user_birth: '',
        user_gender: ''
    });

    // Validation errors
    const [nameError, setNameError] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    // Nickname duplicate check
    const [originalNickname, setOriginalNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(true);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);

    // Address modal state
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // 2. 화면이 열리면 localStorage에서 내 정보 가져오기
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserInfo(prev => ({
                    ...prev,
                    ...user // 저장된 정보로 덮어쓰기
                }));
                setOriginalNickname(user.user_nickname || '');
            } catch (e) {
                console.error('사용자 정보 로딩 실패:', e);
            } ``
        }
    }, []);

    // Open address modal and init Daum Postcode
    useEffect(() => {
        if (isAddressModalOpen && window.daum) {
            new window.daum.Postcode({
                oncomplete: function (data: any) {
                    setUserInfo(prev => ({
                        ...prev,
                        user_post: data.zonecode,
                        user_addr1: data.roadAddress
                    }));
                    setIsAddressModalOpen(false);
                },
                width: '100%',
                height: '100%'
            }).embed(document.getElementById('daum-postcode-container-edit'));
        }
    }, [isAddressModalOpen]);

    const handleCheckNickname = async () => {
        const validation = validateNickname(userInfo.user_nickname);
        if (!validation.isValid) {
            setNicknameError(validation.errorMessage || '');
            alert(validation.errorMessage);
            return;
        }

        try {
            const response = await fetch(`${myUrl}/auth/check-nickname/${encodeURIComponent(userInfo.user_nickname)}`);
            const data = await response.json();

            setIsNicknameChecked(true);
            setIsNicknameAvailable(data.available);

            if (data.available) {
                setNicknameError('');
                alert('사용 가능한 닉네임입니다.');
            } else {
                setNicknameError('이미 사용 중인 닉네임입니다.');
                alert('이미 사용 중인 닉네임입니다.');
            }
        } catch (error) {
            console.error('Nickname check error:', error);
            alert('서버 연결에 실패했습니다.');
        }
    };

    // 3. 수정된 정보 저장하기
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userStr = localStorage.getItem('user');

        if (userStr) {
            try {
                const currentUser = JSON.parse(userStr);
                // 기존 정보에 수정된 정보 합치기
                const updatedUser = { ...currentUser, ...userInfo };

                // localStorage 업데이트
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // TODO: 여기서 백엔드 서버로도 전송해야 완벽합니다.
                // fetch('http://localhost:8000/auth/update', { ... })

                alert('개인정보가 수정되었습니다.');
                onClose();
            } catch (e) {
                console.error('저장 실패:', e);
                alert('저장에 실패했습니다.');
            }
        }
    };

    // 우편번호 찾기 (Daum Postcode) - SignUpForm과 동일하게 사용
    const handleSearchAddress = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data: any) {
                    setUserInfo(prev => ({
                        ...prev,
                        user_post: data.zonecode,
                        user_addr1: data.roadAddress
                    }));
                }
            }).open();
        } else {
            alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const nicknameChanged = userInfo.user_nickname !== originalNickname;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '100vh',
                    backgroundColor: 'white',
                    zIndex: 1200,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* 헤더 */}
                <div style={{
                    padding: '20px 30px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={20} color="#666" />
                    </motion.button>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#2D8B5F',
                        margin: 0
                    }}>
                        개인정보 수정
                    </h2>
                </div>

                {/* 입력 폼 영역 */}
                <div style={{ flex: 1, overflowY: 'scroll', padding: '30px', paddingBottom: '100px' }}>
                    <form onSubmit={handleSubmit}>

                        {/* 아이디 (수정 불가) */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>아이디</label>
                            <input
                                type="text"
                                value={userInfo.user_id}
                                disabled
                                style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#999' }}
                            />
                        </div>

                        {/* 이름 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>이름</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    value={userInfo.user_name}
                                    onChange={(e) => setUserInfo({ ...userInfo, user_name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* 닉네임 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>닉네임</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    value={userInfo.user_nickname}
                                    onChange={(e) => setUserInfo({ ...userInfo, user_nickname: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* 이메일 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>이메일</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={iconStyle} />
                                <input
                                    type="email"
                                    value={userInfo.user_email}
                                    onChange={(e) => setUserInfo({ ...userInfo, user_email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* 주소 (우편번호 검색) */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>주소</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    value={userInfo.user_post}
                                    placeholder="우편번호"
                                    readOnly
                                    style={{ ...inputStyle, width: '100px', paddingLeft: '14px' }}
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleSearchAddress}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '0 20px',
                                        borderRadius: '12px',
                                        border: '1px solid #2D8B5F',
                                        backgroundColor: 'white',
                                        color: '#2D8B5F',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    검색
                                </motion.button>
                            </div>
                            <div style={{ position: 'relative', marginBottom: '8px' }}>
                                <MapPin size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    value={userInfo.user_addr1}
                                    placeholder="기본 주소"
                                    readOnly
                                    style={inputStyle}
                                />
                            </div>
                            <input
                                type="text"
                                value={userInfo.user_addr2}
                                onChange={(e) => setUserInfo({ ...userInfo, user_addr2: e.target.value })}
                                placeholder="상세 주소를 입력하세요"
                                style={{ ...inputStyle, paddingLeft: '14px' }}
                            />
                        </div>

                        {/* 생년월일 */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>생년월일</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={iconStyle} />
                                <input
                                    type="date"
                                    value={userInfo.user_birth}
                                    onChange={(e) => setUserInfo({ ...userInfo, user_birth: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* 수정 버튼 */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={nicknameChanged && (!isNicknameChecked || !isNicknameAvailable) || !!nameError || !!nicknameError}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable) || nameError || nicknameError)
                                    ? '#ccc'
                                    : 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable) || nameError || nicknameError)
                                    ? 'not-allowed'
                                    : 'pointer',
                                boxShadow: (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable) || nameError || nicknameError)
                                    ? 'none'
                                    : '0 4px 12px rgba(45, 139, 95, 0.3)'
                            }}
                        >
                            수정 완료
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            {/* Address Search Modal */}
            <AnimatePresence>
                {isAddressModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                                height: '600px',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '20px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>주소 검색</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsAddressModalOpen(false)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        backgroundColor: '#f8f9fa',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <X size={18} />
                                </motion.button>
                            </div>

                            {/* Daum Postcode Container */}
                            <div
                                id="daum-postcode-container-edit"
                                style={{
                                    width: '100%',
                                    height: 'calc(100% - 60px)'
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// 스타일 객체들
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 14px 14px 44px', // 아이콘 공간 확보
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none'
};

const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#2D8B5F',
    opacity: 0.6,
    pointerEvents: 'none'
};