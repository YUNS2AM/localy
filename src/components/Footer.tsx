import { motion } from "motion/react";
import { Train, Instagram, Youtube, Facebook, Mail } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ position: 'relative', padding: '60px 20px', backgroundColor: '#F1F8E9' }}>
            {/* 상단 웨이브 패턴 (SVG) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', overflow: 'hidden' }}>
                <svg viewBox="0 0 1200 20" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                    <path d="M0,10 Q300,0 600,10 T1200,10 L1200,20 L0,20 Z" fill="#6B9D7A" opacity="0.3" />
                </svg>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // 반응형 그리드
                    gap: '40px',
                    marginBottom: '40px'
                }}>
                    {/* 1. 브랜드 정보 */}
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px' }}>
                                <Train color="#6B9D7A" size={24} />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2E4A3D' }}>감성 기차 여행</span>
                        </div>
                        <p style={{ color: '#557F6A', lineHeight: '1.6' }}>
                            여름의 추억을 담아<br />특별한 여행을 만들어갑니다.
                        </p>
                    </div>

                    {/* 2. 링크 목록 */}
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2E4A3D', marginBottom: '16px' }}>서비스</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {["이용약관", "개인정보처리방침", "여행 가이드", "고객센터"].map((item, i) => (
                                <li key={i} style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{ textDecoration: 'none', color: '#557F6A' }}>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. 연락처 및 소셜 */}
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2E4A3D', marginBottom: '16px' }}>문의하기</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px', color: '#557F6A' }}>
                            <Mail size={16} />
                            <span>contact@example.com</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            {[Instagram, Youtube, Facebook].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '40px', height: '40px',
                                        backgroundColor: 'white', borderRadius: '50%',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}
                                    whileHover={{ y: -3 }}
                                >
                                    <Icon size={20} color="#557F6A" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 하단 구분선 및 저작권 */}
                <div style={{ height: '1px', backgroundColor: 'rgba(107,157,122,0.3)', margin: '30px 0' }}></div>

                <div style={{ textAlign: 'center', color: '#6B9D7A', fontSize: '0.85rem' }}>
                    © {currentYear} 감성 기차 여행. All rights reserved.
                </div>
            </div>
        </footer>
    );
}