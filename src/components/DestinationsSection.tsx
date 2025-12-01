import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Destination {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

const destinations: Destination[] = [
    {
        id: 1,
        title: "여름의 제주",
        description: "푸른 바다와 싱그러운 녹차밭이 어우러진 힐링 여행지",
        imageUrl: "https://images.unsplash.com/photo-1633839202556-cf6ec22e95f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWp1JTIwaXNsYW5kJTIwc3VtbWVyfGVufDF8fHx8MTc2NDAzMTgzMnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
        id: 2,
        title: "경주 야경",
        description: "천년 고도의 밤, 별빛과 함께하는 역사 속 산책",
        imageUrl: "https://images.unsplash.com/photo-1762246280136-f716157bef10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneWVvbmdqdSUyMG5pZ2h0JTIwdGVtcGxlfGVufDF8fHx8MTc2NDAzMTgzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
        id: 3,
        title: "강릉 해변",
        description: "시원한 파도와 맛있는 커피 향이 가득한 동해안 여행",
        imageUrl: "https://images.unsplash.com/photo-1669303215070-151cc2e5887e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW5nbmV1bmclMjBiZWFjaCUyMG9jZWFufGVufDF8fHx8MTc2NDAzMTgzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
        id: 4,
        title: "서울 야경",
        description: "빛나는 도심 속 특별한 순간을 담아가세요",
        imageUrl: "https://images.unsplash.com/photo-1651836170547-a411ee7f89d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW91bCUyMHRvd2VyJTIwY2l0eXxlbnwxfHx8fDE3NjQwMzE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
];

export function DestinationsSection() {
    return (
        <section style={{
            padding: '80px 20px',
            backgroundColor: '#F8FDF8', // 아주 연한 배경색
            position: 'relative'
        }}>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
            }}>
                {/* 섹션 제목 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#2E4A3D',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <MapPin size={32} color="#6B9D7A" />
                        추천 여행지
                    </h2>
                    <p style={{ color: '#557F6A', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        이번 여름, 기차를 타고 떠나는 감성 여행지를 추천합니다
                    </p>
                </motion.div>

                {/* 여기가 핵심: CSS Grid로 가로 정렬 강제 적용 */}
                <div style={{
                    display: 'grid',
                    // 화면 크기에 따라 자동으로 열 개수 조절 (최소 250px)
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px'
                }}>
                    {destinations.map((destination, index) => (
                        <motion.div
                            key={destination.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid #E8F5E9',
                                boxShadow: '0 4px 15px rgba(107,157,122,0.15)', // 부드러운 초록색 그림자
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>

                                {/* 이미지 영역 (높이 200px 고정) */}
                                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                                    <ImageWithFallback
                                        src={destination.imageUrl}
                                        alt={destination.title}
                                        className="" // className 비움
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover' // 이미지 비율 유지하며 꽉 채우기
                                        }}
                                    />
                                    {/* 이미지 위 살짝 어두운 효과 */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(46,74,61,0.4), transparent)'
                                    }} />
                                </div>

                                {/* 텍스트 영역 */}
                                <div style={{ padding: '24px', flex: 1, backgroundColor: 'white' }}>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        color: '#2E4A3D',
                                        marginBottom: '8px'
                                    }}>
                                        {destination.title}
                                    </h3>
                                    <p style={{
                                        color: '#557F6A',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6'
                                    }}>
                                        {destination.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}