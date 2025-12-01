import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PersonalInfoEditScreenProps {
    onClose: () => void;
}

declare global {
    interface Window {
        daum: any;
    }
}

export function PersonalInfoEditScreen({ onClose }: PersonalInfoEditScreenProps) {
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        user_nickname: '',
        user_gender: '',
        user_postcode: '',
        user_address: '',
        user_detail_address: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserInfo({
                    user_name: user.user_name || '',
                    user_nickname: user.user_nickname || '',
                    user_gender: user.user_gender || '',
                    user_postcode: user.user_postcode || '',
                    user_address: user.user_address || '',
                    user_detail_address: user.user_detail_address || ''
                });
            } catch (e) {
                console.error('Error loading user info:', e);
            }
        }

        // Daum 우편번호 스크립트 로드
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

    const handlePostcodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                setUserInfo(prev => ({
                    ...prev,
                    user_postcode: data.zonecode,
                    user_address: data.roadAddress
                }));
            }
        }).open();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const updatedUser = { ...user, ...userInfo };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('개인정보가 수정되었습니다.');
                onClose();
            } catch (e) {
                console.error('Error saving user info:', e);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            {/* Header */}
            <div style={{
                padding: '20px 30px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
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

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                    {/* 이름 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            이름
                        </label>
                        <input
                            type="text"
                            value={userInfo.user_name}
                            onChange={(e) => setUserInfo({ ...userInfo, user_name: e.target.value })}
                            placeholder="이름을 입력하세요"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* 닉네임 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            닉네임
                        </label>
                        <input
                            type="text"
                            value={userInfo.user_nickname}
                            onChange={(e) => setUserInfo({ ...userInfo, user_nickname: e.target.value })}
                            placeholder="닉네임을 입력하세요"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* 성별 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            성별
                        </label>
                        <select
                            value={userInfo.user_gender}
                            onChange={(e) => setUserInfo({ ...userInfo, user_gender: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="">선택하세요</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    {/* 우편번호 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            우편번호
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={userInfo.user_postcode}
                                placeholder="우편번호"
                                readOnly
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handlePostcodeSearch}
                                style={{
                                    padding: '14px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#2D8B5F',
                                    color: 'white',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                찾기
                            </motion.button>
                        </div>
                    </div>

                    {/* 주소 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            주소
                        </label>
                        <input
                            type="text"
                            value={userInfo.user_address}
                            placeholder="주소"
                            readOnly
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                backgroundColor: '#f8f9fa'
                            }}
                        />
                    </div>

                    {/* 상세주소 */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            상세주소
                        </label>
                        <input
                            type="text"
                            value={userInfo.user_detail_address}
                            onChange={(e) => setUserInfo({ ...userInfo, user_detail_address: e.target.value })}
                            placeholder="상세주소를 입력하세요"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* 수정 버튼 */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        개인정보 수정
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
