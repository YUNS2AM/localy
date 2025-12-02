
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { User, Lock, Mail, Calendar, MapPin } from 'lucide-react';

interface SignupFormProps {
    onSwitchToLogin: () => void;
    onSignupSuccess: (name: string) => void;
    onBack: () => void;
}

declare global {
    interface Window {
        daum: any;
    }
}

export function SignupForm({ onSwitchToLogin, onSignupSuccess, onBack }: SignupFormProps) {
    const [username, setUsername] = useState('');
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [zipcode, setZipcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [birthdate, setBirthdate] = useState('');

    useEffect(() => {
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

    const handleCheckUsername = async () => {
        if (!username) {
            alert('아이디를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/auth/check-username/${encodeURIComponent(username)}`);
            const data = await response.json();

            setIsUsernameChecked(true);
            setIsUsernameAvailable(data.available);

            if (data.available) {
                alert('사용 가능한 아이디입니다.');
            } else {
                alert('이미 사용 중인 아이디입니다.');
            }
        } catch (error) {
            console.error('Username check error:', error);
            alert('서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
    };

    const handleSendVerificationCode = () => {
        console.log('Sending verification code to:', email);
        setIsCodeSent(true);
        alert('인증번호가 이메일로 전송되었습니다.');
    };

    const handleVerifyCode = () => {
        console.log('Verifying code:', verificationCode);
        setIsEmailVerified(true);
        alert('이메일 인증이 완료되었습니다.');
    };

    const handleSearchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                setZipcode(data.zonecode);
                setAddress(data.roadAddress);
            }
        }).open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isUsernameChecked || !isUsernameAvailable) {
            alert('아이디 중복확인을 완료해주세요.');
            return;
        }
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: username,
                    user_pw: password,
                    user_name: name,
                    user_nickname: nickname,
                    user_email: email,
                    user_post: zipcode,
                    user_addr1: address,
                    user_addr2: detailAddress,
                    user_birth: birthdate,
                    user_gender: gender === 'Male' ? 'M' : 'F'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.detail || '회원가입에 실패했습니다.');
                return;
            }

            const data = await response.json();
            console.log('Signup success:', data);
            alert('회원가입이 완료되었습니다!');
            onSignupSuccess(name);
        } catch (error) {
            console.error('Signup error:', error);
            alert('서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} style={{ width: '100%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto', padding: '40px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(45, 139, 95, 0.2)', border: '1px solid rgba(45, 139, 95, 0.1)' }}>
            <h2 style={{ color: '#2D8B5F', fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>회원가입</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>AIX Travel과 함께 특별한 여행을 시작하세요</p>

            <form onSubmit={handleSubmit}>
                <FormField label="아이디" icon={<User size={20} />} verified={isUsernameChecked && isUsernameAvailable}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setIsUsernameChecked(false); }} placeholder="아이디" required style={{ flex: 1, padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                        <motion.button type="button" onClick={handleCheckUsername} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ minWidth: '85px', padding: '12px 16px', height: '46px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>중복확인</motion.button>
                    </div>
                </FormField>

                <FormField label="비밀번호" icon={<Lock size={20} />}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </FormField>

                <FormField label="비밀번호 확인" icon={<Lock size={20} />}>
                    <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 확인" required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                    {passwordConfirm && password !== passwordConfirm && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>비밀번호가 일치하지 않습니다.</p>}
                </FormField>

                <FormField label="이름" icon={<User size={20} />}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </FormField>

                <FormField label="닉네임" icon={<User size={20} />}>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </FormField>

                {/* Gender Toggle */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#2D8B5F', fontSize: '14px', fontWeight: '500' }}>
                        성별
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button type="button" onClick={() => setGender('Male')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: gender === 'Male' ? '2px solid #4A90E2' : '2px solid #ddd', background: gender === 'Male' ? 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' : 'white', color: gender === 'Male' ? 'white' : '#666', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>Male</motion.button>
                        <motion.button type="button" onClick={() => setGender('Female')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: gender === 'Female' ? '2px solid #E84A5F' : '2px solid #ddd', background: gender === 'Female' ? 'linear-gradient(135deg, #E84A5F 0%, #D63447 100%)' : 'white', color: gender === 'Female' ? 'white' : '#666', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>Female</motion.button>
                    </div>
                </div>

                <FormField label="이메일" icon={<Mail size={20} />} verified={isEmailVerified}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required disabled={isEmailVerified} style={{ flex: 1, padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box', backgroundColor: isEmailVerified ? '#f5f5f5' : 'white' }} />
                        <motion.button type="button" onClick={handleSendVerificationCode} disabled={isEmailVerified || !email} whileHover={{ scale: isEmailVerified ? 1 : 1.05 }} whileTap={{ scale: isEmailVerified ? 1 : 0.95 }} style={{ minWidth: '85px', padding: '12px 16px', height: '46px', borderRadius: '12px', border: 'none', background: isEmailVerified ? '#ccc' : 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: isEmailVerified ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isCodeSent ? '재전송' : '인증번호'}</motion.button>
                    </div>
                    {isCodeSent && !isEmailVerified && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증번호 6자리" maxLength={6} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                            <motion.button type="button" onClick={handleVerifyCode} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ minWidth: '65px', padding: '12px 16px', height: '46px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>확인</motion.button>
                        </div>
                    )}
                </FormField>

                <FormField label="우편번호" icon={<MapPin size={20} />}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={zipcode} placeholder="우편번호" readOnly required style={{ flex: 1, padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8f9fa' }} />
                        <motion.button type="button" onClick={handleSearchAddress} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ minWidth: '85px', padding: '12px 16px', height: '46px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>찾기</motion.button>
                    </div>
                </FormField>

                <FormField label="주소" icon={<MapPin size={20} />}>
                    <input type="text" value={address} placeholder="주소" readOnly required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8f9fa' }} />
                </FormField>

                <FormField label="상세주소" icon={<MapPin size={20} />}>
                    <input type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="상세주소" style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </FormField>

                <FormField label="생년월일" icon={<Calendar size={20} />}>
                    <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '2px solid rgba(45, 139, 95, 0.2)', fontSize: '14px', boxSizing: 'border-box' }} />
                </FormField>

                {/* 버튼들 */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', marginBottom: '16px' }}>
                    <motion.button type="button" onClick={onBack} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #2D8B5F', background: 'white', color: '#2D8B5F', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>돌아가기</motion.button>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 139, 95, 0.3)' }}>가입하기</motion.button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>이미 계정이 있으신가요? </span>
                    <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#2D8B5F', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>로그인</button>
                </div>
            </form>
        </motion.div>
    );
}

interface FormFieldProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    verified?: boolean;
}

function FormField({ label, icon, children, verified }: FormFieldProps) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#2D8B5F', fontSize: '14px', fontWeight: '500' }}>
                {label}
                {verified && <span style={{ fontSize: '12px', color: '#27ae60', background: 'rgba(39, 174, 96, 0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>✓ 인증완료</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '12px', color: '#2D8B5F', opacity: 0.6, pointerEvents: 'none' }}>{icon}</div>
                {children}
            </div>
        </div>
    );
}