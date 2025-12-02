import { motion, AnimatePresence } from 'motion/react';
import { Settings, Bell, MapPin, Plus, Calendar, Users, X } from 'lucide-react';
import { TravelChatBot } from './TravelChatBot';
import { MapScreen } from './MapScreen';
import { TravelDetailView } from './TravelDetailView';
import { PasswordEditScreen } from './PasswordEditScreen';
import { PersonalInfoEditScreen } from './PersonalInfoEditScreen';
import { PersonaEditScreen } from './PersonaEditScreen';
import { useState } from 'react';

interface TravelItem {
    id: number;
    title: string;
    image: string;
    startDate: string;
    endDate: string;
    participants: number;
    destination?: string;
    places?: any[];
}

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

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
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAccountManagementOpen, setIsAccountManagementOpen] = useState(false);
    const [isPasswordEditOpen, setIsPasswordEditOpen] = useState(false);
    const [isPersonalInfoEditOpen, setIsPersonalInfoEditOpen] = useState(false);
    const [isPersonaEditOpen, setIsPersonaEditOpen] = useState(false);
    const [notifications] = useState<Notification[]>(sampleNotifications);
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const [tripData, setTripData] = useState<{ participants: number; startDate: string; endDate: string; region: string } | null>(null);
    const [selectedTravel, setSelectedTravel] = useState<TravelItem | null>(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

    // 현재 로그인한 사용자 ID 가져오기
    const getUserId = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.user_id || 'guest';
            } catch (e) {
                return 'guest';
            }
        }
        return 'guest';
    };

    // localStorage에서 사용자별 travels 상태 초기화
    const [travels, setTravels] = useState<TravelItem[]>(() => {
        const userId = getUserId();
        const saved = localStorage.getItem(`travels_${userId}`);
        return saved ? JSON.parse(saved) : [];
    });

    // 일정 저장 핸들러 (중복 방지)
    const handleScheduleSave = (newTravel: TravelItem) => {
        // 중복 확인: 같은 destination과 날짜가 있는지 체크
        const isDuplicate = travels.some(travel =>
            travel.destination === newTravel.destination &&
            travel.startDate === newTravel.startDate &&
            travel.endDate === newTravel.endDate
        );

        if (isDuplicate) {
            alert('이미 동일한 일정이 저장되어 있습니다.');
            return;
        }

        const userId = getUserId();
        const updatedTravels = [...travels, newTravel];
        setTravels(updatedTravels);
        localStorage.setItem(`travels_${userId}`, JSON.stringify(updatedTravels));

        // 저장 후 맵 닫기
        setIsMapOpen(false);
    };

    // 일정 삭제 핸들러
    const handleScheduleDelete = (travelId: number) => {
        const userId = getUserId();
        const updatedTravels = travels.filter(travel => travel.id !== travelId);
        setTravels(updatedTravels);
        localStorage.setItem(`travels_${userId}`, JSON.stringify(updatedTravels));
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    };

    // 회원탈퇴 핸들러
    const handleWithdraw = () => {
        if (window.confirm('정말로 회원탈퇴 하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

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
        if (!start || !end) return 'N/A';
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'N/A';
        return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
    };

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
                        onClick={() => setIsSettingsOpen(true)}
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
                        <Settings size={20} color="#666" />
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
                    {travels.map((travel) => (
                        <motion.div
                            key={travel.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -4 }}
                            onClick={() => {
                                setSelectedTravel(travel);
                                setIsDetailViewOpen(true);
                            }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '200px',
                                background: travel.image.startsWith('linear-gradient') ? travel.image : `url(${travel.image})`,
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
                            console.log('Travel data received:', data);
                            setTripData(data);
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

                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {/* 환영 메시지 */}
                            <div style={{
                                backgroundColor: '#FFF5E6',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '32px' }}>👋</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#2D8B5F'
                                }}>
                                    {userName}님 반가워요!
                                </span>
                            </div>

                            {/* 앱 설정 */}
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#999'
                            }}>
                                앱 설정
                            </h3>

                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                marginBottom: '30px',
                                overflow: 'hidden'
                            }}>
                                {/* 푸시 알림 */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <span style={{ fontSize: '15px', color: '#333' }}>
                                        푸시 알림
                                    </span>
                                    <button
                                        onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
                                        style={{
                                            width: '48px',
                                            height: '28px',
                                            borderRadius: '14px',
                                            border: 'none',
                                            background: isNotificationEnabled ? '#2D8B5F' : '#ccc',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            top: '4px',
                                            left: isNotificationEnabled ? '24px' : '4px',
                                            transition: 'left 0.3s'
                                        }} />
                                    </button>
                                </div>

                                {/* 캐시 삭제 */}
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    캐시 삭제
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>

                                {/* 라이센스 */}
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    라이센스
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>

                                {/* 약관 및 이용동의 */}
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    border: 'none',
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    약관 및 이용동의
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>

                                {/* 버전 정보 */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px'
                                }}>
                                    <span style={{ fontSize: '15px', color: '#333' }}>
                                        버전 정보
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#999' }}>
                                        v1.0.0
                                    </span>
                                </div>
                            </div>

                            {/* 계정 관리 */}
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#999'
                            }}>
                                계정 관리
                            </h3>

                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                marginBottom: '30px',
                                overflow: 'hidden'
                            }}>
                                {/* 계정 관리 */}
                                <button
                                    onClick={() => setIsAccountManagementOpen(true)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 20px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        color: '#333',
                                        textAlign: 'left'
                                    }}
                                >
                                    계정 관리
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>
                            </div>

                            {/* 고객센터 */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 20px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    고객센터
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>
                            </div>

                            {/* 로그아웃 버튼 */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginBottom: '12px'
                                }}
                            >
                                로그아웃
                            </motion.button>

                            {/* 회원탈퇴 버튼 */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleWithdraw}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: '#FFE5E5',
                                    color: '#E84A5F',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                회원탈퇴
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Account Management Panel */}
            <AnimatePresence>
                {isAccountManagementOpen && (
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
                            zIndex: 1100,
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
                                계정 관리
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAccountManagementOpen(false)}
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
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                {/* 비밀번호 수정 */}
                                <button
                                    onClick={() => {
                                        setIsAccountManagementOpen(false);
                                        setIsPasswordEditOpen(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 20px',
                                        border: 'none',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        color: '#333',
                                        textAlign: 'left'
                                    }}
                                >
                                    비밀번호 수정
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>

                                {/* 개인정보 수정 */}
                                <button
                                    onClick={() => {
                                        setIsAccountManagementOpen(false);
                                        setIsPersonalInfoEditOpen(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 20px',
                                        border: 'none',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        color: '#333',
                                        textAlign: 'left'
                                    }}
                                >
                                    개인정보 수정
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>

                                {/* 페르소나 수정 */}
                                <button
                                    onClick={() => {
                                        setIsAccountManagementOpen(false);
                                        setIsPersonaEditOpen(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 20px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        color: '#333',
                                        textAlign: 'left'
                                    }}
                                >
                                    페르소나 수정
                                    <span style={{ color: '#ccc' }}>›</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
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
                            destination: selectedLocation?.name || tripData?.region || '',
                            participants: tripData?.participants || 1,
                            startDate: tripData?.startDate || '',
                            endDate: tripData?.endDate || ''
                        }}
                        initialLocation={selectedLocation}
                        onScheduleSave={handleScheduleSave}
                    />
                )}
            </AnimatePresence>

            {/* Travel Detail View */}
            <AnimatePresence>
                {isDetailViewOpen && selectedTravel && (
                    <TravelDetailView
                        travel={selectedTravel}
                        onClose={() => {
                            setIsDetailViewOpen(false);
                            setSelectedTravel(null);
                        }}
                        onDelete={handleScheduleDelete}
                    />
                )}
            </AnimatePresence>

            {/* Password Edit Screen */}
            <AnimatePresence>
                {isPasswordEditOpen && (
                    <PasswordEditScreen
                        onClose={() => setIsPasswordEditOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Personal Info Edit Screen */}
            <AnimatePresence>
                {isPersonalInfoEditOpen && (
                    <PersonalInfoEditScreen
                        onClose={() => setIsPersonalInfoEditOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Persona Edit Screen */}
            <AnimatePresence>
                {isPersonaEditOpen && (
                    <PersonaEditScreen
                        onClose={() => setIsPersonaEditOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
