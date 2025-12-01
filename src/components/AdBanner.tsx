import { motion } from "motion/react";
import { Ticket, Sparkles } from "lucide-react";

export function AdBanner() {
    return (
        <section style={{
            position: 'relative',
            padding: '80px 20px',
            overflow: 'hidden'
        }}>
            {/* 배경 애니메이션 (Framer Motion 사용) */}
            <motion.div
                style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                animate={{
                    background: [
                        "linear-gradient(135deg, #FFF9C4 0%, #C8E6C9 100%)",
                        "linear-gradient(135deg, #C8E6C9 0%, #FFF9C4 100%)",
                        "linear-gradient(135deg, #FFF9C4 0%, #C8E6C9 100%)",
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* 메인 컨텐츠 */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap', // 화면 작으면 줄바꿈
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '40px'
            }}>
                {/* 왼쪽 텍스트 영역 */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <motion.div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '9999px',
                            border: '1px solid rgba(107,157,122,0.3)',
                            marginBottom: '16px',
                            backdropFilter: 'blur(4px)'
                        }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles size={16} color="#F4A300" />
                        <span style={{ color: '#2E4A3D', fontWeight: 'bold', fontSize: '0.9rem' }}>특별 이벤트</span>
                    </motion.div>

                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E4A3D', marginBottom: '16px' }}>
                        여름 휴가, 지금 떠나세요!
                    </h2>
                    <p style={{ color: '#557F6A', fontSize: '1.1rem', marginBottom: '32px' }}>
                        기차 여행 패키지 최대 30% 할인 + 무료 여행 다이어리 증정
                    </p>

                    <motion.button
                        style={{
                            padding: '12px 32px',
                            borderRadius: '9999px',
                            backgroundColor: '#2E4A3D',
                            color: 'white',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: '#3D5F4C' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        지금 바로 예약하기
                    </motion.button>
                </div>

                {/* 오른쪽 일러스트 영역 */}
                <motion.div
                    style={{ flexShrink: 0 }}
                    animate={{ rotate: [-2, 2, -2], y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div style={{ position: 'relative', width: '250px', height: '250px' }}>
                        {/* 티켓 SVG (Tailwind 클래스 제거하고 직접 스타일링) */}
                        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>
                            <rect x="20" y="60" width="160" height="80" rx="8" fill="white" opacity="0.98" />
                            <line x1="100" y1="60" x2="100" y2="140" stroke="#ddd" strokeWidth="2" strokeDasharray="4,4" />

                            <text x="35" y="85" fill="#6B9D7A" fontSize="10" fontWeight="bold">출발</text>
                            <text x="35" y="105" fill="#2E4A3D" fontSize="14" fontWeight="bold">서울역</text>
                            <text x="35" y="125" fill="#557F6A" fontSize="9">2025.07.01</text>

                            <text x="115" y="85" fill="#8BC34A" fontSize="10" fontWeight="bold">도착</text>
                            <text x="115" y="105" fill="#2E4A3D" fontSize="14" fontWeight="bold">부산역</text>
                            <text x="115" y="125" fill="#557F6A" fontSize="9">14:30</text>

                            <circle cx="100" cy="60" r="4" fill="#F5F5DC" />
                            <circle cx="100" cy="140" r="4" fill="#F5F5DC" />
                        </svg>

                        {/* 티켓 아이콘 */}
                        <div style={{ position: 'absolute', right: '40px', top: '90px' }}>
                            <Ticket color="#6B9D7A" size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}