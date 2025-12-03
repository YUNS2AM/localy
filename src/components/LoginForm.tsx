import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';

const myUrl = window.location.protocol + "//" + window.location.hostname + ":8000";

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onLoginSuccess: () => void;
    onBack: () => void;
}

export function LoginForm({ onSwitchToSignup, onLoginSuccess, onBack }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(false); // 자동 로그인 체크박스 상태

    // 컴포넌트 마운트 시 자동 로그인 체크
    useEffect(() => {
        const savedAutoLogin = localStorage.getItem('autoLogin');
        if (savedAutoLogin === 'true') {
            const savedUsername = localStorage.getItem('savedUsername');
            const savedPassword = localStorage.getItem('savedPassword');

            if (savedUsername && savedPassword) {
                console.log('자동 로그인 정보 발견, 자동 로그인 시도 중...');
                setUsername(savedUsername);
                setPassword(savedPassword);
                setAutoLogin(true);

                // 자동으로 로그인 실행
                attemptAutoLogin(savedUsername, savedPassword);
            }
        }
    }, []);

    // 자동 로그인 시도 함수
    const attemptAutoLogin = async (user: string, pass: string) => {
        try {
            const response = await fetch(`${myUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user,
                    user_pw: pass
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
                console.log('자동 로그인 성공!');
                onLoginSuccess();
            } else {
                // 자동 로그인 실패 시 저장된 정보 삭제
                console.log('자동 로그인 실패, 저장된 정보 삭제');
                localStorage.removeItem('autoLogin');
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
                setAutoLogin(false);
            }
        } catch (error) {
            console.error('자동 로그인 에러:', error);
            localStorage.removeItem('autoLogin');
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
            setAutoLogin(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('로그인 버튼 클릭됨! username:', username, 'password:', password);

        try {
            console.log('API 요청 시작...');
            const response = await fetch(`${myUrl}/auth/login`, {
                method: 'POST',  // 👈 이게 꼭 있어야 합니다! (없으면 405 에러 남)
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: username,
                    user_pw: password
                })
            });

            console.log('API 응답 받음:', response.status);

            if (!response.ok) {
                const error = await response.json();
                alert(error.detail || '로그인에 실패했습니다.');
                return;
            }

            const data = await response.json(); // 서버에서 준 모든 정보(data)를 받음
            console.log('Login success:', data);

            // [수정됨] 서버가 준 모든 정보를 통째로 저장!
            // 이제 user_addr1, user_birth 등 모든 정보가 들어갑니다.
            localStorage.setItem('user', JSON.stringify(data));

            // 자동 로그인 체크되어 있으면 아이디/비밀번호 저장
            if (autoLogin) {
                localStorage.setItem('autoLogin', 'true');
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
                console.log('자동 로그인 정보 저장 완료');
            } else {
                // 체크 해제되어 있으면 저장된 정보 삭제
                localStorage.removeItem('autoLogin');
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
            }

            onLoginSuccess();
        } catch (error) {
            console.error('Login error:', error);
            alert('서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rg ba(45, 139, 95, 0.2)',
                border: '1px solid rgba(45, 139, 95, 0.1)'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#2D8B5F',
                    marginBottom: '8px'
                }}>
                    어서오세요
                </h2>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    계정에 로그인하세요
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* 아이디 입력 */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#2D8B5F',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        아이디
                    </label>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#2D8B5F',
                            opacity: 0.6
                        }} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 44px',
                                borderRadius: '12px',
                                border: '2px solid rgba(45, 139, 95, 0.2)',
                                fontSize: '14px',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2D8B5F'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(45, 139, 95, 0.2)'}
                        />
                    </div>
                </div>

                {/* 비밀번호 입력 */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: '#2D8B5F',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        비밀번호
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#2D8B5F',
                            opacity: 0.6
                        }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 44px',
                                borderRadius: '12px',
                                border: '2px solid rgba(45, 139, 95, 0.2)',
                                fontSize: '14px',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2D8B5F'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(45, 139, 95, 0.2)'}
                        />
                    </div>
                </div>

                {/* 자동 로그인 체크박스 */}
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        id="autoLogin"
                        checked={autoLogin}
                        onChange={(e) => setAutoLogin(e.target.checked)}
                        style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#2D8B5F'
                        }}
                    />
                    <label
                        htmlFor="autoLogin"
                        style={{
                            color: '#666',
                            fontSize: '14px',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        자동 로그인
                    </label>
                </div>

                {/* 버튼들 - 돌아가기와 로그인 버튼을 나란히 배치 */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <motion.button
                        type="button"
                        onClick={onBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: '2px solid #2D8B5F',
                            background: 'white',
                            color: '#2D8B5F',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        돌아가기
                    </motion.button>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(45, 139, 95, 0.3)'
                        }}
                    >
                        로그인
                    </motion.button>
                </div>

                {/* 회원가입 링크 */}
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>계정이 없으신가요? </span>
                    <button
                        type="button"
                        onClick={onSwitchToSignup}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2D8B5F',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        회원가입
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
