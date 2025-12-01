import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, MapPin } from 'lucide-react';
import catImage from '../assets/cat.jpg';

interface TravelChatBotProps {
    onClose: () => void;
    onComplete: (data: TravelData) => void;
    onMapSelect?: (location: { lat: number; lng: number; name: string }) => void;
}

interface TravelData {
    participants: number;
    startDate: string;
    endDate: string;
    region: string;
}

interface Message {
    type: 'cat' | 'user';
    content: string | React.ReactNode;
    timestamp: Date;
}

type Step = 'participants' | 'dates' | 'region' | 'recommendations' | 'complete';

// 지역별 추천 여행지
const regionRecommendations: Record<string, Array<{ name: string; address: string; lat: number; lng: number }>> = {
    "부산": [
        { name: "해운대 해수욕장", address: "부산광역시 해운대구 중동", lat: 35.1586, lng: 129.1603 },
        { name: "광안리 해변", address: "부산광역시 수영구 광안동", lat: 35.1532, lng: 129.1189 },
        { name: "태종대", address: "부산광역시 영도구 동삼동", lat: 35.0513, lng: 129.0853 },
        { name: "감천문화마을", address: "부산광역시 사하구 감천동", lat: 35.0978, lng: 129.0107 }
    ],
    "경기": [
        { name: "에버랜드", address: "경기도 용인시 처인구 포곡읍", lat: 37.2941, lng: 127.2019 },
        { name: "남이섬", address: "강원도 춘천시 남산면", lat: 37.7911, lng: 127.5258 },
        { name: "아침고요수목원", address: "경기도 가평군 상면", lat: 37.7456, lng: 127.3543 },
        { name: "가평 자라섬", address: "경기도 가평군 가평읍", lat: 37.7484, lng: 127.5097 }
    ],
    "경기도": [
        { name: "에버랜드", address: "경기도 용인시 처인구 포곡읍", lat: 37.2941, lng: 127.2019 },
        { name: "남이섬", address: "강원도 춘천시 남산면", lat: 37.7911, lng: 127.5258 },
        { name: "아침고요수목원", address: "경기도 가평군 상면", lat: 37.7456, lng: 127.3543 },
        { name: "가평 자라섬", address: "경기도 가평군 가평읍", lat: 37.7484, lng: 127.5097 }
    ],
    "전라": [
        { name: "군산 시간여행", address: "전라북도 군산시 장미동", lat: 35.9782, lng: 126.7009 },
        { name: "전주 한옥마을", address: "전라북도 전주시 완산구 풍남동", lat: 35.8151, lng: 127.1526 },
        { name: "순천만 습지", address: "전라남도 순천시 순천만길", lat: 34.8869, lng: 127.5096 },
        { name: "담양 죽녹원", address: "전라남도 담양군 담양읍", lat: 35.3258, lng: 126.9899 }
    ],
    "전라도": [
        { name: "군산 시간여행", address: "전라북도 군산시 장미동", lat: 35.9782, lng: 126.7009 },
        { name: "전주 한옥마을", address: "전라북도 전주시 완산구 풍남동", lat: 35.8151, lng: 127.1526 },
        { name: "순천만 습지", address: "전라남도 순천시 순천만길", lat: 34.8869, lng: 127.5096 },
        { name: "담양 죽녹원", address: "전라남도 담양군 담양읍", lat: 35.3258, lng: 126.9899 }
    ],
    "제주": [
        { name: "성산일출봉", address: "제주특별자치도 서귀포시 성산읍", lat: 33.4608, lng: 126.9423 },
        { name: "한라산", address: "제주특별자치도 제주시 1100로", lat: 33.3617, lng: 126.5292 },
        { name: "우도", address: "제주특별자치도 제주시 우도면", lat: 33.5005, lng: 126.9526 },
        { name: "협재 해수욕장", address: "제주특별자치도 제주시 한림읍", lat: 33.3941, lng: 126.2395 }
    ],
    "제주도": [
        { name: "성산일출봉", address: "제주특별자치도 서귀포시 성산읍", lat: 33.4608, lng: 126.9423 },
        { name: "한라산", address: "제주특별자치도 제주시 1100로", lat: 33.3617, lng: 126.5292 },
        { name: "우도", address: "제주특별자치도 제주시 우도면", lat: 33.5005, lng: 126.9526 },
        { name: "협재 해수욕장", address: "제주특별자치도 제주시 한림읍", lat: 33.3941, lng: 126.2395 }
    ],
    "강원": [
        { name: "속초 해변", address: "강원도 속초시 조양동", lat: 38.2070, lng: 128.5918 },
        { name: "강릉 경포대", address: "강원도 강릉시 저동", lat: 37.7958, lng: 128.8962 },
        { name: "평창 대관령", address: "강원도 평창군 대관령면", lat: 37.6773, lng: 128.7184 },
        { name: "춘천 남이섬", address: "강원도 춘천시 남산면", lat: 37.7911, lng: 127.5258 }
    ],
    "강원도": [
        { name: "속초 해변", address: "강원도 속초시 조양동", lat: 38.2070, lng: 128.5918 },
        { name: "강릉 경포대", address: "강원도 강릉시 저동", lat: 37.7958, lng: 128.8962 },
        { name: "평창 대관령", address: "강원도 평창군 대관령면", lat: 37.6773, lng: 128.7184 },
        { name: "춘천 남이섬", address: "강원도 춘천시 남산면", lat: 37.7911, lng: 127.5258 }
    ]
};

export function TravelChatBot({ onClose, onComplete, onMapSelect }: TravelChatBotProps) {
    const [step, setStep] = useState<Step>('participants');
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'cat',
            content: '안녕하세요! 😸\n저는 여행 도우미 냥이에요!',
            timestamp: new Date()
        },
        {
            type: 'cat',
            content: '몇 명이서 여행하시나요?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [travelData, setTravelData] = useState<Partial<TravelData>>({});
    const [selectedDestination, setSelectedDestination] = useState<{ name: string; address: string; lat: number; lng: number } | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (type: 'cat' | 'user', content: string | React.ReactNode) => {
        setMessages(prev => [...prev, { type, content, timestamp: new Date() }]);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        addMessage('user', input);
        const userInput = input.trim();
        setInput('');

        setTimeout(() => {
            if (step === 'participants') {
                const participants = parseInt(userInput);
                if (isNaN(participants) || participants < 1) {
                    addMessage('cat', '죄송해요, 올바른 인원수를 입력해주세요! (숫자만 입력해주세요)');
                    return;
                }
                setTravelData(prev => ({ ...prev, participants }));
                addMessage('cat', `${participants}명이시군요! 좋아요! 😊`);
                setTimeout(() => {
                    addMessage('cat', '언제부터 언제까지 여행하시나요?\n아래 캘린더에서 날짜를 선택해주세요! 📅');
                    setStep('dates');
                }, 800);

            } else if (step === 'region') {
                const region = userInput;
                setTravelData(prev => ({ ...prev, region }));

                // 지역에서 추천 검색
                const matchedRegion = Object.keys(regionRecommendations).find(key =>
                    region.includes(key) || key.includes(region)
                );

                if (matchedRegion) {
                    const recommendations = regionRecommendations[matchedRegion];
                    addMessage('cat', `${region} 여행이시군요! 좋은 선택이에요! 🎉`);
                    setTimeout(() => {
                        addMessage('cat',
                            <div>
                                <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
                                    {region} 지역의 추천 여행지를 찾았어요!
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {recommendations.map((dest, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedDestination(dest)}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: '12px',
                                                border: '2px solid #2D8B5F',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px'
                                            }}
                                        >
                                            <MapPin size={20} color="#2D8B5F" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                                    {dest.name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                                                    {dest.address}
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        );
                        setStep('recommendations');
                    }, 800);
                } else {
                    addMessage('cat', `${region}... 아직 제가 정보를 가지고 있지 않은 지역이에요. 😿\n다른 지역을 말씀해주시겠어요?`);
                }
            }
        }, 500);
    };

    const handleDateConfirm = () => {
        if (!startDate || !endDate) {
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            return;
        }

        addMessage('user', `${startDate} ~ ${endDate}`);
        setTravelData(prev => ({ ...prev, startDate, endDate }));

        setTimeout(() => {
            addMessage('cat', `${startDate}부터 ${endDate}까지이군요! 🗓️`);
            setTimeout(() => {
                addMessage('cat', '어디로 여행 가시나요?\n(예: 부산, 경기도, 제주 등)');
                setStep('region');
            }, 800);
        }, 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#FFF5E6',
                zIndex: 4000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* 노트 아이콘 - 우측 상단 */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <FileText size={24} color="#8B6914" />
            </motion.button>

            {/* 고양이 이미지 영역 */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    padding: '0',
                    textAlign: 'center',
                    background: 'transparent'
                }}
            >
                <motion.img
                    src={catImage}
                    alt="Travel Cat"
                    animate={{
                        y: [0, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '100%',
                        height: '280px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                    }}
                />
            </motion.div>

            {/* 채팅 영역 */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px'
            }}>
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                alignSelf: message.type === 'cat' ? 'flex-start' : 'flex-end',
                                maxWidth: '80%'
                            }}
                        >
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: message.type === 'cat' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                                backgroundColor: message.type === 'cat' ? 'white' : '#2D8B5F',
                                color: message.type === 'cat' ? '#333' : 'white',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {message.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* 지도 미리보기 */}
            <AnimatePresence>
                {selectedDestination && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'absolute',
                            bottom: 80,
                            left: 0,
                            right: 0,
                            height: '400px',
                            backgroundColor: 'white',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 200
                        }}
                    >
                        {/* 헤더 */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                                {selectedDestination.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                                {selectedDestination.address}
                            </p>
                        </div>

                        {/* 지도 */}
                        <div style={{ flex: 1, padding: '12px' }}>
                            <iframe
                                src={`https://www.google.com/maps?q=${selectedDestination.lat},${selectedDestination.lng}&hl=ko&z=14&output=embed`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '12px'
                                }}
                            />
                        </div>

                        {/* 버튼들 */}
                        <div style={{
                            padding: '12px 16px 16px',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedDestination(null)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}
                            >
                                닫기
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (onMapSelect) {
                                        onMapSelect({
                                            lat: selectedDestination.lat,
                                            lng: selectedDestination.lng,
                                            name: selectedDestination.name
                                        });
                                    }
                                    onClose();
                                }}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    boxShadow: '0 2px 8px rgba(45, 139, 95, 0.3)'
                                }}
                            >
                                선택
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 입력 필드 / 날짜 선택 UI */}
            <div style={{
                padding: '16px 20px',
                backgroundColor: 'white',
                borderTop: '1px solid #eee'
            }}>
                {step === 'dates' ? (
                    // 날짜 선택 UI
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {/* 시작일 */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}>
                                    시작일
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '2px solid #eee',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>

                            {/* 종료일 */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}>
                                    종료일
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '2px solid #eee',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>

                        {/* 확인 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDateConfirm}
                            disabled={!startDate || !endDate}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: startDate && endDate
                                    ? 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)'
                                    : '#e0e0e0',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                                boxShadow: startDate && endDate ? '0 2px 8px rgba(45, 139, 95, 0.3)' : 'none'
                            }}
                        >
                            날짜 확인
                        </motion.button>
                    </div>
                ) : (
                    // 일반 텍스트 입력 UI
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="메시지를 입력하세요..."
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '24px',
                                border: '2px solid #eee',
                                fontSize: '14px',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: '#2D8B5F',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Send size={20} color="white" />
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
