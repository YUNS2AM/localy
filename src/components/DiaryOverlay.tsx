import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Home, UtensilsCrossed, Target, BookOpen } from 'lucide-react';
import { ScheduleTab } from './diary-tabs/ScheduleTab';
import { AccommodationTab } from './diary-tabs/AccommodationTab';
import { FoodTab } from './diary-tabs/FoodTab';
import { MissionsTab } from './diary-tabs/MissionsTab';
import { EndingTab } from './diary-tabs/EndingTab';

interface DiaryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'schedule' | 'accommodation' | 'food' | 'missions' | 'ending';

const tabs = [
  { id: 'schedule' as TabType, label: 'Schedule', icon: Calendar, color: '#FF6B6B' },
  { id: 'accommodation' as TabType, label: 'Accommodation', icon: Home, color: '#4ECDC4' },
  { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed, color: '#FFE66D' },
  { id: 'missions' as TabType, label: 'Missions', icon: Target, color: '#95E1D3' },
  { id: 'ending' as TabType, label: 'Ending', icon: BookOpen, color: '#C7CEEA' },
];

export function DiaryOverlay({ isOpen, onClose }: DiaryOverlayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Blurred background */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1763044758925-a5b9f52af5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXNoJTIwZ3JlZW4lMjBtZWFkb3clMjBncmFzc3xlbnwxfHx8fDE3NjM5NjgwNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px) brightness(0.9)',
            }}
            onClick={onClose}
          />

          {/* Diary book */}
          <motion.div
            className="relative z-10 max-w-6xl w-full"
            initial={{ scale: 0.8, rotateX: -15, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotateX: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ perspective: '2000px' }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute -top-4 -right-4 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center hover:bg-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-700" />
            </motion.button>

            {/* Book container with 3D effect */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Book shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[95%] h-8 bg-black/30 blur-2xl rounded-full" />

              {/* Opened book */}
              <div className="relative bg-[#8B4513] rounded-2xl p-4 shadow-2xl">
                {/* Book spine */}
                <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-[#6B3410] via-[#8B4513] to-[#6B3410] shadow-inner" />

                {/* Pages container */}
                <div className="relative flex gap-4">
                  {/* Left page */}
                  <motion.div
                    className="flex-1 bg-[#F5F5DC] rounded-lg p-8 shadow-lg relative overflow-hidden"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #F5F5DC 0%, #FAFAEB 100%),
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 2rem,
                          rgba(139, 69, 19, 0.05) 2rem,
                          rgba(139, 69, 19, 0.05) calc(2rem + 1px)
                        )
                      `,
                    }}
                  >
                    {/* Paper texture */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4" /%3E%3C/svg%3E")',
                    }} />

                    {/* Bookmarks */}
                    <div className="absolute -right-2 top-8 flex flex-col gap-2">
                      {tabs.map((tab, index) => (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className="relative group"
                          whileHover={{ x: -8 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div
                            className={`w-16 h-12 rounded-r-lg shadow-lg flex items-center justify-center transition-all ${
                              activeTab === tab.id ? 'w-20' : 'hover:w-18'
                            }`}
                            style={{
                              backgroundColor: tab.color,
                              transform: activeTab === tab.id ? 'translateX(-4px)' : '',
                            }}
                          >
                            <tab.icon className="w-5 h-5 text-white drop-shadow-md" />
                          </div>
                          
                          {/* Tooltip */}
                          <motion.div
                            className="absolute right-20 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                            initial={{ x: 10 }}
                            whileHover={{ x: 0 }}
                          >
                            {tab.label}
                          </motion.div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                      <AnimatePresence mode="wait">
                        {activeTab === 'schedule' && <ScheduleTab key="schedule" />}
                        {activeTab === 'accommodation' && <AccommodationTab key="accommodation" />}
                        {activeTab === 'food' && <FoodTab key="food" />}
                        {activeTab === 'missions' && <MissionsTab key="missions" />}
                        {activeTab === 'ending' && <EndingTab key="ending" />}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Right page (decorative) */}
                  <motion.div
                    className="flex-1 bg-[#F5F5DC] rounded-lg p-8 shadow-lg relative overflow-hidden"
                    style={{
                      backgroundImage: `
                        linear-gradient(to left, #F5F5DC 0%, #FAFAEB 100%),
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 2rem,
                          rgba(139, 69, 19, 0.05) 2rem,
                          rgba(139, 69, 19, 0.05) calc(2rem + 1px)
                        )
                      `,
                    }}
                  >
                    {/* Paper texture */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulance type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4" /%3E%3C/svg%3E")',
                    }} />

                    <div className="relative z-10">
                      <DiaryDecorations />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DiaryDecorations() {
  return (
    <div className="space-y-8">
      {/* Polaroid photos */}
      <motion.div
        className="bg-white p-3 shadow-lg transform rotate-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-full h-48 bg-gradient-to-br from-[#90EE90] to-[#87CEEB] rounded" />
        <p className="mt-2 text-center text-gray-600" style={{ fontFamily: 'cursive', fontSize: '0.875rem' }}>
          Summer memories
        </p>
      </motion.div>

      {/* Pressed flowers illustration */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg viewBox="0 0 200 150" className="w-full">
          {/* Flower stems */}
          <path d="M 50 100 Q 55 70 60 50" stroke="#90EE90" strokeWidth="2" fill="none" />
          <path d="M 100 120 Q 95 90 90 60" stroke="#90EE90" strokeWidth="2" fill="none" />
          <path d="M 150 110 Q 145 80 140 55" stroke="#90EE90" strokeWidth="2" fill="none" />
          
          {/* Flower petals */}
          <circle cx="60" cy="45" r="8" fill="#FFE66D" opacity="0.8" />
          <circle cx="55" cy="50" r="6" fill="#FFE66D" opacity="0.8" />
          <circle cx="65" cy="50" r="6" fill="#FFE66D" opacity="0.8" />
          <circle cx="60" cy="52" r="4" fill="#FFA500" />
          
          <circle cx="90" cy="55" r="7" fill="#FF6B6B" opacity="0.8" />
          <circle cx="85" cy="60" r="5" fill="#FF6B6B" opacity="0.8" />
          <circle cx="95" cy="60" r="5" fill="#FF6B6B" opacity="0.8" />
          <circle cx="90" cy="63" r="3" fill="#C7365F" />
          
          <circle cx="140" cy="50" r="9" fill="#C7CEEA" opacity="0.8" />
          <circle cx="134" cy="55" r="6" fill="#C7CEEA" opacity="0.8" />
          <circle cx="146" cy="55" r="6" fill="#C7CEEA" opacity="0.8" />
          <circle cx="140" cy="58" r="4" fill="#9B9FD4" />
        </svg>
      </motion.div>

      {/* Handwritten note */}
      <motion.div
        className="border-l-4 border-[#87CEEB] pl-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-gray-600 italic" style={{ fontFamily: 'cursive', fontSize: '0.875rem', lineHeight: '1.8' }}>
          "The sound of the train whistle,
          <br />
          the green fields passing by,
          <br />
          and the warmth of summer...
          <br />
          <br />
          This journey will become
          <br />
          a cherished memory."
        </p>
      </motion.div>

      {/* Washi tape decoration */}
      <div className="space-y-2">
        <div className="h-6 bg-gradient-to-r from-transparent via-[#FFE66D]/30 to-transparent border-t border-b border-[#FFE66D]/50" />
        <div className="h-6 bg-gradient-to-r from-transparent via-[#4ECDC4]/30 to-transparent border-t border-b border-[#4ECDC4]/50" />
      </div>
    </div>
  );
}
