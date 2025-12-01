import { motion, AnimatePresence } from 'motion/react';
import { Menu, Plus, Bell, Calendar, Users, Newspaper, Settings, ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { MapScreen } from './MapScreen';
import { TravelChatBot } from './TravelChatBot';

interface TravelItem {
    id: number;
    title: string;
    image: string;
    startDate: string;
    endDate: string;
    participants: number;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

const sampleTravels: TravelItem[] = [
    {
        id: 1,
        title: '제주도 힐링 여행',
        image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        startDate: '2024-12-15',
        endDate: '2024-12-18',
        participants: 4
    },
    {
        id: 2,
        title: '강원도 겨울 여행',
        image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        startDate: '2024-12-20',
        endDate: '2024-12-23',
        participants: 2
    },
    {
        id: 3,
        title: '부산 식도락 여행',
        image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        startDate: '2025-01-05',
        endDate: '2025-01-07',
        participants: 3
    }
];

const sampleNotifications: Notification[] = [
    {
        id: 1,
        title: '새로운 축제 소식',
        message: '제주 동백꽃 축제가 다음 주에 시작됩니다!',
        time: '5분 전',
        isRead: false
    }
];

interface TravelDashboardProps {
    onLogoClick?: () => void;
}

export function TravelDashboard({ onLogoClick }: TravelDashboardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNewsExpanded, setIsNewsExpanded] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notifications] = useState<Notification[]>(sampleNotifications);
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

    // localStorage에서 사용자 정보 가져오기
    const getUserName = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.user_nickname || "사용자";
            } catch (e) {
                return "사용자";
            }
        }
        return "사용자";
    };

    const userName = getUserName();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const formatDateRange = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
    };

    const menuItems = [
        { icon: Calendar, label: '일정', color: '#2D8B5F' },
        {
            icon: Newspaper,
            label: '뉴스',
            color: '#4A90E2',
            hasSubMenu: true,
            subItems: [
                { label: '공지사항', color: '#4A90E2' },
                { label: '이벤트', color: '#4A90E2' },
                { label: '축제', color: '#4A90E2' }
            ]
        },
        { icon: Settings, label: '설정', color: '#666' }
    ];

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={onLogoClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '20px' }}>🌏</span>
                    </div>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#2D8B5F'
                    }}>
                        Localy
                    </span>
                </motion.div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsNotificationOpen(true)}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                    >
                        <Bell size={20} color="#666" />
                        {unreadCount > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#E84A5F',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {unreadCount}
                            </div>
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Menu size={20} color="#666" />
                    </motion.button>
                </div>
            </motion.header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '30px',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto'
            }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '40px'
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(45, 139, 95, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsChatBotOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '16px 32px',
                            borderRadius: '50px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(45, 139, 95, 0.3)'
                        }}
                    >
                        <Plus size={24} strokeWidth={3} />
                        새 여행 추가하기
                    </motion.button>
                </motion.div>

                {/* Travel List */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {sampleTravels.map((travel) => (
                        <motion.div
                            key={travel.id}
                            whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '200px',
                                background: travel.image,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />
                            <div style={{ padding: '20px' }}>
                                <h3 style={{
                                    margin: '0 0 12px 0',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#333'
                                }}>
                                    {travel.title}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginTop: '12px',
                                    fontSize: '14px',
                                    color: '#666'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={16} />
                                        {formatDateRange(travel.startDate, travel.endDate)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={16} />
                                        {travel.participants}명
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Chat Bot */}
            <AnimatePresence>
                {isChatBotOpen && (
                    <TravelChatBot
                        onClose={() => setIsChatBotOpen(false)}
                        onComplete={(data) => {
                            console.log('Travel data:', data);
                            setIsChatBotOpen(false);
                        }}
                        onMapSelect={(location) => {
                            setSelectedLocation(location);
                            setIsMapOpen(true);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Notification Panel */}
            <AnimatePresence>
                {isNotificationOpen && (
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
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            padding: '20px 30px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2D8B5F',
                                margin: 0
                            }}>
                                알림
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsNotificationOpen(false)}
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
                                <X size={20} color="#666" />
                            </motion.button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: notification.isRead ? 'white' : '#f0f9f5',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            {notification.title}
                                        </h3>
                                        <span style={{ fontSize: '12px', color: '#999' }}>
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#666',
                                        lineHeight: '1.5'
                                    }}>
                                        {notification.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Panel */}
            <AnimatePresence>
                {isSettingsOpen && (
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
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            padding: '20px 30px',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#2D8B5F',
                                margin: 0
                            }}>
                                설정
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSettingsOpen(false)}
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
                                <X size={20} color="#666" />
                            </motion.button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                            {/* 인사말 헤더 */}
                            <div style={{
                                padding: '30px 20px',
                                backgroundColor: '#FFF5E6',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '32px' }}>🐾</span>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#2D8B5F'
                                }}>
                                    {userName}님 반가워요!
                                </h3>
                            </div>

                            {/* 스크롤 가능한 컨텐츠 영역 */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                                {/* 앱 설정 섹션 */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h4 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#999',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        앱 설정
                                    </h4>

                                    {/* 푸시 알림 */}
                                    <div style={{
                                        padding: '16px 20px',
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <span style={{ fontSize: '16px', color: '#333' }}>푸시 알림</span>
                                        <button
                                            onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
                                            style={{
                                                width: '50px',
                                                height: '28px',
                                                borderRadius: '14px',
                                                border: 'none',
                                                backgroundColor: isNotificationEnabled ? '#2D8B5F' : '#ccc',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                position: 'absolute',
                                                top: '2px',
                                                left: isNotificationEnabled ? '24px' : '2px',
                                                transition: 'left 0.3s'
                                            }} />
                                        </button>
                                    </div>

                                    {/* 캐시 삭제 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>캐시 삭제</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>›</span>
                                    </motion.button>

                                    {/* 라이선스 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>라이선스</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>›</span>
                                    </motion.button>

                                    {/* 약관 및 이용동의 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>약관 및 이용동의</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>›</span>
                                    </motion.button>

                                    {/* 버전 정보 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>버전 정보</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>v1.0.0</span>
                                    </motion.button>

                                    {/* 계정 관리 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>계정 관리</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>›</span>
                                    </motion.button>

                                    {/* 고객센터 */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: 'none',
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px', color: '#333' }}>고객센터</span>
                                        <span style={{ fontSize: '14px', color: '#999' }}>›</span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* 하단 버튼들 */}
                            <div style={{
                                padding: '20px',
                                borderTop: '1px solid #eee',
                                backgroundColor: 'white'
                            }}>
                                {/* 로그아웃 버튼 */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        backgroundColor: '#f8f9fa',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    로그아웃
                                </motion.button>

                                {/* 회원탈퇴 버튼 */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        backgroundColor: '#FFEBEE',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#D32F2F',
                                        cursor: 'pointer'
                                    }}
                                >
                                    회원탈퇴
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 999
                            }}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                width: '300px',
                                height: '100%',
                                backgroundColor: 'white',
                                boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '30px 20px'
                            }}
                        >
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{
                                    margin: '0 0 20px 0',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#2D8B5F'
                                }}>
                                    안녕하세요, {userName}님!
                                </h3>
                            </div>

                            {menuItems.map((item, index) => (
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (item.label === '설정') {
                                                setIsSettingsOpen(true);
                                                setIsMenuOpen(false);
                                            } else if (item.hasSubMenu) {
                                                setIsNewsExpanded(!isNewsExpanded);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            backgroundColor: '#f8f9fa',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <item.icon size={20} color={item.color} />
                                            <span style={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                color: '#333'
                                            }}>
                                                {item.label}
                                            </span>
                                        </div>
                                        {item.hasSubMenu && (
                                            isNewsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />
                                        )}
                                    </motion.button>

                                    {item.hasSubMenu && isNewsExpanded && item.subItems && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginTop: '8px', marginLeft: '20px' }}
                                        >
                                            {item.subItems.map((subItem, subIndex) => (
                                                <motion.button
                                                    key={subIndex}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '4px',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#666'
                                                    }}>
                                                        {subItem.label}
                                                    </span>
                                                    <ChevronRight size={16} color="#999" />
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Map Screen */}
            <AnimatePresence>
                {isMapOpen && (
                    <MapScreen
                        onClose={() => {
                            setIsMapOpen(false);
                            setSelectedLocation(null);
                        }}
                        tripData={{
                            destination: selectedLocation?.name || '',
                            participants: 1,
                            startDate: '',
                            endDate: ''
                        }}
                        initialLocation={selectedLocation}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
