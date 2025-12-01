import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

interface AddressSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (zipcode: string, address: string) => void;
}

export function AddressSearchModal({ isOpen, onClose, onSelectAddress }: AddressSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Array<{ zipcode: string; address: string }>>([]);

    const handleSearch = () => {
        // TODO: 실제 주소 검색 API 연동 (예: Kakao 주소 검색 API)
        // 현재는 더미 데이터
        setResults([
            { zipcode: '06234', address: '서울 강남구 테헤란로 123' },
            { zipcode: '06235', address: '서울 강남구 테헤란로 125' },
            { zipcode: '06236', address: '서울 강남구 테헤란로 127' },
        ]);
    };

    const handleSelectAddress = (zipcode: string, address: string) => {
        onSelectAddress(zipcode, address);
        setSearchQuery('');
        setResults([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* 모달 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '90%',
                                maxWidth: '500px',
                                maxHeight: '600px',
                                background: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* 헤더 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#2D8B5F',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <MapPin size={24} />
                                    우편번호 찾기
                                </h3>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: '#666'
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* 검색창 */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="도로명, 건물명 또는 지번을 입력하세요"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: '2px solid rgba(45, 139, 95, 0.2)',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <motion.button
                                        onClick={handleSearch}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #2D8B5F 0%, #3BA474 100%)',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        검색
                                    </motion.button>
                                </div>
                            </div>

                            {/* 검색 결과 */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                border: '1px solid rgba(45, 139, 95, 0.1)',
                                borderRadius: '12px',
                                padding: '12px'
                            }}>
                                {results.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: '#999'
                                    }}>
                                        주소를 검색해주세요
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {results.map((result, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ backgroundColor: 'rgba(45, 139, 95, 0.05)' }}
                                                onClick={() => handleSelectAddress(result.zipcode, result.address)}
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(45, 139, 95, 0.1)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#2D8B5F',
                                                    fontWeight: '600',
                                                    marginBottom: '4px'
                                                }}>
                                                    [{result.zipcode}]
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#333' }}>
                                                    {result.address}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
