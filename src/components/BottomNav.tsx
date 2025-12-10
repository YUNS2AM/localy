import { motion, AnimatePresence } from 'motion/react';
import { Home, Bell, Plus, Backpack, LogIn, Sparkles, CalendarPlus, X } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
    onHomeClick?: () => void;
    onNotificationClick?: () => void;
    onAIScheduleClick?: () => void;  // Speed Dial - AI 일정
    onManualScheduleClick?: () => void;  // Speed Dial - 직접 추가
    onMyTravelsClick?: () => void;
    onLoginClick?: () => void;
    activeTab?: 'home' | 'notification' | 'myTravels' | 'login';
}

export function BottomNav({
    onHomeClick,
    onNotificationClick,
    onAIScheduleClick,
    onManualScheduleClick,
    onMyTravelsClick,
    onLoginClick,
    activeTab = 'home'
}: BottomNavProps) {
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

    const navItems = [
        { id: 'home', label: '홈', icon: Home, onClick: onHomeClick },
        { id: 'notification', label: '알림', icon: Bell, onClick: onNotificationClick },
        { id: 'center', label: '', icon: null, onClick: null }, // 중앙 빈 공간
        { id: 'myTravels', label: '내 여행', icon: Backpack, onClick: onMyTravelsClick },
        { id: 'login', label: '로그인', icon: LogIn, onClick: onLoginClick }
    ];

    const speedDialItems = [
        {
            id: 'ai',
            label: 'AI와 일정 짜기',
            icon: Sparkles,
            onClick: onAIScheduleClick,
            color: '#FFE9A0',
            offset: 85
        },
        {
            id: 'manual',
            label: '직접 일정 추가',
            icon: CalendarPlus,
            onClick: onManualScheduleClick,
            color: '#B8D4E8',
            offset: 145
        }
    ];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                height: '85px',
                backgroundColor: 'rgba(248, 252, 232, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.08)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 20px'
            }}
        >
            {/* 네비게이션 아이템들 */}
            {navItems.map((item) => {
                if (item.id === 'center') {
                    // 중앙 버튼을 위한 빈 공간
                    return <div key={item.id} style={{ width: '70px' }} />;
                }

                const Icon = item.icon!;
                const isActive = activeTab === item.id;

                return (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={item.onClick || undefined}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <Icon
                            size={24}
                            color={isActive ? '#89C765' : '#999'}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: isActive ? '600' : '400',
                                color: isActive ? '#89C765' : '#999'
                            }}
                        >
                            {item.label}
                        </span>
                    </motion.button>
                );
            })}

            {/* Speed Dial 서브 버튼들 */}
            <AnimatePresence>
                {isSpeedDialOpen && speedDialItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0, y: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                y: -item.offset,
                                opacity: 1
                            }}
                            exit={{
                                scale: 0,
                                y: -20,
                                opacity: 0
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: index * 0.05
                            }}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                bottom: '42px',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    item.onClick?.();
                                    setIsSpeedDialOpen(false);
                                }}
                                style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                                    boxShadow: `0 4px 16px ${item.color}60`,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Icon size={24} color="white" strokeWidth={2.5} />
                            </motion.button>
                            <span
                                style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#666',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                {item.label}
                            </span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* 중앙 Floating Action Button - 초정밀 중앙 정렬 */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                animate={{ rotate: isSpeedDialOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: 'fixed',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '50px',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #89C765 0%, #6FB558 100%)',
                    boxShadow: '0 6px 24px rgba(137, 199, 101, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 101
                }}
            >
                {isSpeedDialOpen ? (
                    <X size={36} color="white" strokeWidth={3} />
                ) : (
                    <Plus size={36} color="white" strokeWidth={3} />
                )}
            </motion.button>
        </div>
    );
}
