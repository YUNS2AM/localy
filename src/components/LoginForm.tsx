import { motion } from 'motion/react';
import { useState } from 'react';
import { User, Lock } from 'lucide-react';

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onLoginSuccess: () => void;
    onBack: () => void;
}

export function LoginForm({ onSwitchToSignup, onLoginSuccess, onBack }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                // ... (기존 코드와 동일)
            });

            if (!response.ok) {
                // ... (에러 처리)
                return;
            }

            const data = await response.json(); // 서버에서 준 모든 정보(data)를 받음
            console.log('Login success:', data);

            // [수정됨] 서버가 준 모든 정보를 통째로 저장!
            // 이제 user_addr1, user_birth 등 모든 정보가 들어갑니다.
            localStorage.setItem('user', JSON.stringify(data));

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
                boxShadow: '0 8px 32px rgba(45, 139, 95, 0.2)',
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
                <div style={{ marginBottom: '24px' }}>
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
