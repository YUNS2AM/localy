import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, MapPin, Calendar, Users, ArrowRight, ChevronLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { MapScreen } from './MapScreen';

interface Place {
    id: number;
    day: number;
    name: string;
    category: string;
    address: string;
    lat: number;
    lng: number;
}

interface TravelData {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    participants: number;
    places: Place[];
}

interface TravelScheduleEditorProps {
    onClose: () => void;
    onComplete: (data: TravelData) => void;
    initialData?: Partial<TravelData>;
}

export function TravelScheduleEditor({ onClose, onComplete, initialData }: TravelScheduleEditorProps) {
    const [step, setStep] = useState(1);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(1);

    // Basic Info State
    const [destination, setDestination] = useState(initialData?.destination || '');
    const [startDate, setStartDate] = useState(initialData?.startDate || '');
    const [endDate, setEndDate] = useState(initialData?.endDate || '');
    const [participants, setParticipants] = useState(initialData?.participants || 1);

    // Schedule State
    const [places, setPlaces] = useState<Place[]>(initialData?.places || []);

    // Calculate days
    const getDaysArray = () => {
        if (!startDate || !endDate) return [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Array.from({ length: diffDays }, (_, i) => i + 1);
    };

    const days = getDaysArray();

    const handleNextStep = () => {
        if (!destination || !startDate || !endDate) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        setStep(2);
    };

    const handleAddPlace = (dayNum: number) => {
        setSelectedDay(dayNum);
        setIsMapOpen(true);
    };

    const handlePlaceSelect = (location: any) => {
        const newPlace: Place = {
            id: Date.now(),
            day: selectedDay,
            name: location.name || '선택한 장소',
            category: location.category || '기타',
            address: location.address || '',
            lat: location.lat,
            lng: location.lng
        };
        setPlaces([...places, newPlace]);
        setIsMapOpen(false);
    };

    const handleSave = () => {
        const travelData: TravelData = {
            title: `${destination} 여행`,
            destination,
            startDate,
            endDate,
            participants,
            places
        };
        onComplete(travelData);
    };

    const getPlacesForDay = (dayNum: number) => {
        return places.filter(p => p.day === dayNum);
    };

    const formatDate = (dayNumber: number) => {
        if (!startDate) return '';
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber - 1);
        return `${date.getMonth() + 1}.${date.getDate()}/${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 2000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: '90vh',
                    background: '#F8F9FA',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    background: 'white',
                    borderBottom: '1px solid #E9ECEF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {step === 2 && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setStep(1)}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <ChevronLeft size={24} color="#495057" />
                            </motion.button>
                        )}
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                            {step === 1 ? '여행 기본 정보' : '상세 일정 편집'}
                        </h2>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        style={{
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            background: '#F1F3F5',
                            border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={18} color="#495057" />
                    </motion.button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                            >
                                {/* Destination */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                        어디로 떠나시나요?
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ADB5BD' }} />
                                        <input
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="예: 부산, 제주도, 강릉..."
                                            style={{
                                                width: '100%',
                                                padding: '16px 16px 16px 48px',
                                                borderRadius: '16px',
                                                border: '1px solid #DEE2E6',
                                                fontSize: '16px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                        언제 가시나요?
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <Calendar size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ADB5BD' }} />
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px 16px 16px 48px',
                                                    borderRadius: '16px',
                                                    border: '1px solid #DEE2E6',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <Calendar size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ADB5BD' }} />
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                min={startDate}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px 16px 16px 48px',
                                                    borderRadius: '16px',
                                                    border: '1px solid #DEE2E6',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Participants */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                                        몇 명이서 가나요?
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #DEE2E6'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Users size={20} color="#ADB5BD" />
                                            <span style={{ fontSize: '16px', fontWeight: '500' }}>{participants}명</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setParticipants(Math.max(1, participants - 1))}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #DEE2E6',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => setParticipants(participants + 1)}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #DEE2E6',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNextStep}
                                    style={{
                                        marginTop: 'auto',
                                        padding: '16px',
                                        background: '#2D8B5F',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    일정 만들기 시작
                                    <ArrowRight size={20} />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ marginBottom: '24px' }}>
                                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{destination} 여행</h1>
                                    <p style={{ color: '#868E96', fontSize: '14px' }}>
                                        {startDate} - {endDate} · {participants}명
                                    </p>
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {days.map((dayNum, index) => {
                                        const dayPlaces = getPlacesForDay(dayNum);
                                        return (
                                            <div key={dayNum} style={{ marginBottom: '32px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Day {dayNum}</h3>
                                                    <span style={{ fontSize: '14px', color: '#868E96' }}>{formatDate(dayNum)}</span>
                                                </div>

                                                <div style={{ paddingLeft: '16px', borderLeft: '2px solid #E9ECEF', marginLeft: '8px' }}>
                                                    {dayPlaces.map((place, idx) => (
                                                        <motion.div
                                                            key={place.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            style={{
                                                                background: 'white',
                                                                padding: '16px',
                                                                borderRadius: '16px',
                                                                marginBottom: '12px',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px'
                                                            }}
                                                        >
                                                            <div style={{
                                                                width: '24px', height: '24px',
                                                                borderRadius: '50%',
                                                                background: '#2D8B5F',
                                                                color: 'white',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '12px', fontWeight: 'bold',
                                                                flexShrink: 0
                                                            }}>
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '600', marginBottom: '2px' }}>{place.name}</div>
                                                                <div style={{ fontSize: '12px', color: '#868E96' }}>{place.category}</div>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleAddPlace(dayNum)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px',
                                                            borderRadius: '12px',
                                                            border: '1px dashed #ADB5BD',
                                                            background: 'white',
                                                            color: '#495057',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                            marginTop: '8px'
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                        장소 추가
                                                    </motion.button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    style={{
                                        marginTop: '16px',
                                        padding: '16px',
                                        background: '#2D8B5F',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '16px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 12px rgba(45, 139, 95, 0.3)'
                                    }}
                                >
                                    <Save size={20} />
                                    여행 저장 완료
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <AnimatePresence>
                {isMapOpen && (
                    <MapScreen
                        onClose={() => setIsMapOpen(false)}
                        onSelect={handlePlaceSelect}
                        tripData={{
                            destination,
                            participants,
                            startDate,
                            endDate
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
