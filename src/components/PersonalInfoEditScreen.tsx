import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { validateName, validateNickname } from '../utils/validation';

const myUrl = window.location.protocol + "//" + window.location.hostname + ":8000";

declare global {
    interface Window {
        daum: any;
    }
}

interface PersonalInfoEditScreenProps {
    onClose: () => void;
}

export function PersonalInfoEditScreen({ onClose }: PersonalInfoEditScreenProps) {
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

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserInfo(prev => ({
                    ...prev,
                    ...user
                }));
                setOriginalNickname(user.user_nickname || '');
            } catch (e) {
                console.error('사용자 정보 로딩 실패:', e);
            }
        }

        // Load Daum Postcode script
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate name and nickname
        const nameValidation = validateName(userInfo.user_name);
        const nicknameValidation = validateNickname(userInfo.user_nickname);

        if (!nameValidation.isValid) {
            alert(nameValidation.errorMessage);
            return;
        }

        if (!nicknameValidation.isValid) {
            alert(nicknameValidation.errorMessage);
            return;
        }

        // Check if nickname changed and if duplicate check was done
        if (userInfo.user_nickname !== originalNickname) {
            if (!isNicknameChecked || !isNicknameAvailable) {
                alert('닉네임 중복확인을 완료해주세요.');
                return;
            }
        }

        const userStr = localStorage.getItem('user');

        if (userStr) {
            try {
                const currentUser = JSON.parse(userStr);
                const updatedUser = { ...currentUser, ...userInfo };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('개인정보가 수정되었습니다.');
                onClose();
            } catch (e) {
                console.error('저장 실패:', e);
                alert('저장에 실패했습니다.');
            }
        }
    };

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
                backgroundColor: 'white',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
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

            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                <form onSubmit={handleSubmit}>

                    {/* 아이디 (수정 불가) */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>아이디</label>
                        <input
                            type="text"
                            value={userInfo.user_id}
                            disabled
                            readOnly
                            style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#999', cursor: 'not-allowed' }}
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
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setUserInfo({ ...userInfo, user_name: val });
                                    const validation = validateName(val);
                                    setNameError(validation.isValid ? '' : validation.errorMessage || '');
                                }}
                                placeholder="이름 (한글만)"
                                style={{ ...inputStyle, border: nameError ? '2px solid #e74c3c' : '1px solid #e0e0e0' }}
                            />
                        </div>
                        {nameError && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{nameError}</p>}
                    </div>

                    {/* 닉네임 */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>닉네임</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    value={userInfo.user_nickname}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setUserInfo({ ...userInfo, user_nickname: val });
                                        if (val !== originalNickname) {
                                            setIsNicknameChecked(false);
                                        } else {
                                            setIsNicknameChecked(true);
                                            setIsNicknameAvailable(true);
                                        }
                                        const validation = validateNickname(val);
                                        setNicknameError(validation.isValid ? '' : validation.errorMessage || '');
                                    }}
                                    placeholder="닉네임"
                                    style={{ ...inputStyle, border: nicknameError ? '2px solid #e74c3c' : '1px solid #e0e0e0' }}
                                />
                            </div>
                            <motion.button
                                type="button"
                                onClick={handleCheckNickname}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!nicknameChanged}
                                style={{
                                    padding: '0 20px',
                                    height: '52px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: nicknameChanged ? 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)' : '#ccc',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: nicknameChanged ? 'pointer' : 'not-allowed',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                중복확인
                            </motion.button>
                        </div>
                        {nicknameError && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{nicknameError}</p>}
                        {nicknameChanged && isNicknameChecked && isNicknameAvailable && <p style={{ color: '#27ae60', fontSize: '12px', marginTop: '4px' }}>✓ 사용 가능한 닉네임입니다.</p>}
                    </div>

                    {/* 이메일 (수정 불가) */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>이메일</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={iconStyle} />
                            <input
                                type="email"
                                value={userInfo.user_email}
                                disabled
                                readOnly
                                style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#999', cursor: 'not-allowed' }}
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

                    {/* 저장 버튼 */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!!nameError || !!nicknameError || (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable))}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: (nameError || nicknameError || (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable))) ? '#ccc' : 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: (nameError || nicknameError || (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable))) ? 'not-allowed' : 'pointer',
                            boxShadow: (nameError || nicknameError || (nicknameChanged && (!isNicknameChecked || !isNicknameAvailable))) ? 'none' : '0 4px 12px rgba(45, 139, 95, 0.3)'
                        }}
                    >
                        수정 완료
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 14px 14px 44px',
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