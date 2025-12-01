import { motion } from "motion/react";
import { MessageSquare, Users, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

interface Post {
    id: number;
    category: string;
    categoryBg: string; // Tailwind 색상 대신 직접 Hex코드나 색상명 사용
    categoryText: string;
    title: string;
    author: string;
    date: string;
    comments: number;
    isHot?: boolean;
}

const posts: Post[] = [
    { id: 1, category: "여행정보", categoryBg: "#87CEEB", categoryText: "#ffffff", title: "이번 주말 강릉 날씨 어떤가요?", author: "여름바다", date: "2025.11.25", comments: 23, isHot: true },
    { id: 2, category: "추천", categoryBg: "#90EE90", categoryText: "#ffffff", title: "혼자 여행하기 좋은 곳 추천 좀요!", author: "혼자여행러", date: "2025.11.25", comments: 45, isHot: true },
    { id: 3, category: "후기", categoryBg: "#F5F5DC", categoryText: "#8B4513", title: "제주도 3박4일 기차+렌터카 여행 후기", author: "감성여행가", date: "2025.11.24", comments: 67, isHot: true },
    { id: 4, category: "질문", categoryBg: "#FFB6C1", categoryText: "#ffffff", title: "KTX 할인 받는 방법 있나요?", author: "대학생95", date: "2025.11.24", comments: 18 },
    { id: 5, category: "여행정보", categoryBg: "#87CEEB", categoryText: "#ffffff", title: "부산 해운대 근처 숙소 추천 부탁드려요", author: "부산가자", date: "2025.11.23", comments: 31 },
    { id: 6, category: "동행", categoryBg: "#DDA0DD", categoryText: "#ffffff", title: "12월 경주 여행 같이 가실 분 구해요", author: "경주러버", date: "2025.11.23", comments: 12 }
];

export function CommunityBoard() {
    return (
        <section style={{ padding: '80px 20px', backgroundColor: '#fff' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* 헤더 */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2E4A3D', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Users color="#8BC34A" size={32} />
                        여행자 게시판
                    </h2>
                    <p style={{ color: '#557F6A' }}>여행의 모든 이야기를 함께 나눠요</p>
                </div>

                {/* 통계 박스 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
                    {[
                        { label: "전체 게시글", value: "1,234", icon: MessageSquare },
                        { label: "활동 회원", value: "5,678", icon: Users },
                        { label: "이번 달", value: "+234", icon: TrendingUp }
                    ].map((stat, i) => (
                        <div key={i} style={{ border: '1px solid #E8F5E9', borderRadius: '12px', padding: '16px', textAlign: 'center', backgroundColor: '#fff' }}>
                            <stat.icon color="#6B9D7A" size={20} style={{ margin: '0 auto 8px auto' }} />
                            <div style={{ fontSize: '0.8rem', color: '#557F6A' }}>{stat.label}</div>
                            <div style={{ fontWeight: 'bold', color: '#2E4A3D' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* 게시판 테이블 */}
                <div style={{ border: '1px solid #E8F5E9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(107,157,122,0.1)' }}>
                    {/* 테이블 헤더 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 50px', padding: '16px', backgroundColor: '#F0FFF0', borderBottom: '1px solid #E8F5E9', fontWeight: 'bold', color: '#557F6A', textAlign: 'center' }}>
                        <div>분류</div>
                        <div style={{ textAlign: 'left', paddingLeft: '10px' }}>제목</div>
                        <div>작성자</div>
                        <div>날짜</div>
                        <div>💬</div>
                    </div>

                    {/* 리스트 */}
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr 100px 100px 50px',
                                padding: '16px',
                                borderBottom: '1px solid #E8F5E9',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                            whileHover={{ backgroundColor: '#fafafa' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <span style={{ backgroundColor: post.categoryBg, color: post.categoryText, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {post.category}
                                </span>
                            </div>
                            <div style={{ textAlign: 'left', paddingLeft: '10px', color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {post.isHot && <TrendingUp size={14} color="#F4A300" />}
                                {post.title}
                            </div>
                            <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>{post.author}</div>
                            <div style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>{post.date}</div>
                            <div style={{ textAlign: 'center', color: '#6B9D7A', fontWeight: 'bold', fontSize: '0.9rem' }}>{post.comments}</div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button style={{ padding: '10px 24px', borderRadius: '99px', border: '1px solid #6B9D7A', backgroundColor: 'white', color: '#2E4A3D', cursor: 'pointer', fontSize: '0.9rem' }}>
                        게시판 전체 보기
                    </button>
                </div>
            </div>
        </section>
    );
}