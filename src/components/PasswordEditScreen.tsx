import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface PasswordEditScreenProps {
    onClose: () => void;
}

export function PasswordEditScreen({ onClose }: PasswordEditScreenProps) {
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
                    비밀번호 수정
                </h2>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('비밀번호가 수정되었습니다.'); }}>
                    {/* 현재 비밀번호 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            현재 비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="현재 비밀번호를 입력하세요"
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

                    {/* 새 비밀번호 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            새 비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
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

                    {/* 새 비밀번호 확인 */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            새 비밀번호 확인
                        </label>
                        <input
                            type="password"
                            placeholder="새 비밀번호를 다시 입력하세요"
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
                        비밀번호 수정
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
