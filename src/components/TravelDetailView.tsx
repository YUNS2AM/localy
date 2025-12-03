import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Users, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface TravelDetailViewProps {
    travel: {
        id: number;
        title: string;
        image: string;
        startDate: string;
        endDate: string;
        participants: number;
        destination: string;
        places: any[];
    };
    onClose: () => void;
    onDelete: (travelId: number) => void;
}

export function TravelDetailView({ travel, onClose, onDelete }: TravelDetailViewProps) {
    // 카테고리 색상 매핑
    const categoryColors: { [key: string]: string } = {
        lodging: '#667eea',
        restaurant: '#f093fb',
        tourist_attraction: '#4facfe',
        cafe: '#43e97b',
        shopping_mall: '#fa709a'
    };

    const categoryLabels: { [key: string]: string } = {
        lodging: '숙소',
        restaurant: '맛집',
        tourist_attraction: '랜드마크',
        cafe: '카페',
        shopping_mall: '쇼핑'
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return createPortal(
        <>
            {/* 전체 viewport를 덮는 배경 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 3999,
                    backdropFilter: 'blur(8px)'
                }}
                onClick={onClose}
            />

            {/* 중앙 정렬을 위한 고정 컨테이너 */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '430px',
                    height: '100vh',
                    zIndex: 4000,
                    pointerEvents: 'none'
                }}
            >
                {/* 슬라이드 애니메이션이 적용되는 내부 컨테이너 */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 0 60px rgba(0, 0, 0, 0.5)',
                        pointerEvents: 'auto'
                    }}
                >
                    {/* 헤더 */}
                    <div style={{
                        padding: '16px 20px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
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
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D8B5F', margin: 0 }}>
                                    {travel.title}
                                </h2>
                                <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0 0' }}>
                                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                    {formatDate(travel.startDate)} - {formatDate(travel.endDate)} · {travel.participants}명
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 여행 정보 및 장소 목록 */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* 대표 이미지 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                width: '100%',
                                height: '200px',
                                borderRadius: '16px',
                                marginBottom: '20px',
                                overflow: 'hidden',
                                background: travel.image.startsWith('linear-gradient')
                                    ? travel.image
                                    : `url(${travel.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* 여행 정보 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '20px',
                                marginBottom: '20px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', margin: '0 0 16px 0' }}>
                                여행 정보
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={16} color="#2D8B5F" />
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#999' }}>목적지</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{travel.destination}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Users size={16} color="#f093fb" />
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#999' }}>인원</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{travel.participants}명</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 선택한 장소 목록 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' }}>
                                선택한 장소 ({travel.places.length}개)
                            </h3>
                            {travel.places.map((place, index) => (
                                <motion.div
                                    key={place.place_id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                        borderLeft: `4px solid ${categoryColors[place.category] || '#2D8B5F'}`,
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: '-8px',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: categoryColors[place.category] || '#2D8B5F',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ marginLeft: '8px' }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            backgroundColor: `${categoryColors[place.category] || '#2D8B5F'}15`,
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            color: categoryColors[place.category] || '#2D8B5F',
                                            marginBottom: '6px'
                                        }}>
                                            {categoryLabels[place.category] || '장소'}
                                        </div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#333', margin: '0 0 4px 0' }}>
                                            {place.name}
                                        </h4>
                                        {place.vicinity && (
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#666',
                                                margin: '0 0 8px 0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <MapPin size={10} />
                                                {place.vicinity}
                                            </p>
                                        )}
                                        {place.rating && (
                                            <div style={{ fontSize: '12px', color: '#fa709a' }}>
                                                ⭐ {place.rating}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* 삭제하기 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
                                    onDelete(travel.id);
                                    onClose();
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                backgroundColor: '#FFE5E5',
                                color: '#E84A5F',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: '20px'
                            }}
                        >
                            <Trash2 size={18} />
                            삭제하기
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </>,
        document.body
    );
}
