import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Home, UtensilsCrossed, Target, BookOpen } from 'lucide-react';
import { ScheduleTab } from './diary-tabs/ScheduleTab';
import { AccommodationTab } from './diary-tabs/AccommodationTab';
import { FoodTab } from './diary-tabs/FoodTab';
import { MissionsTab } from './diary-tabs/MissionsTab';
import { EndingTab } from './diary-tabs/EndingTab';
import { DiaryRightPage } from './DiaryRightPage';

type TabType = 'schedule' | 'accommodation' | 'food' | 'missions' | 'ending';

const tabs = [
  { id: 'schedule' as TabType, label: 'Schedule', icon: Calendar, color: '#FF6B6B' },
  { id: 'accommodation' as TabType, label: 'Accommodation', icon: Home, color: '#4ECDC4' },
  { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed, color: '#FFE66D' },
  { id: 'missions' as TabType, label: 'Missions', icon: Target, color: '#95E1D3' },
  { id: 'ending' as TabType, label: 'Ending', icon: BookOpen, color: '#C7CEEA' },
];

export function DiaryWorkspace() {
  const [activeTab, setActiveTab] = useState<TabType>('accommodation');

  return (
    // 중요: overflow-visible이어야 탭이 안 잘림!
    <div className="relative w-full max-w-6xl aspect-[1.6/1] flex items-center justify-center overflow-visible">

      {/* 1. 책 표지 (갈색 박스) */}
      <motion.div
        className="relative w-full h-full bg-[#8B4513] rounded-3xl p-3 lg:p-4 shadow-2xl flex z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 가죽 질감 */}
        <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")` }}
        />

        {/* 2. 책 속지 */}
        <div className="relative flex-1 flex gap-0 rounded-2xl overflow-hidden bg-[#F5F5DC] shadow-inner z-20">

          {/* [왼쪽 페이지] */}
          <div className="flex-1 relative bg-[#F5F5DC] p-6 lg:p-8 overflow-hidden border-r border-gray-200/50">
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl lg:text-3xl font-serif text-[#8B4513] mb-4 lg:mb-6 flex items-center gap-3">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  <div className="p-2 rounded-full bg-[#F5F5DC] border-2 border-[#8B4513]/20">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)!.icon;
                      return <Icon className="w-5 h-5 lg:w-6 lg:h-6" color={tabs.find(t => t.id === activeTab)!.color} />;
                    })()}
                  </div>
                )}
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                  {activeTab === 'schedule' && <ScheduleTab key="schedule" />}
                  {activeTab === 'accommodation' && <AccommodationTab key="accommodation" />}
                  {activeTab === 'food' && <FoodTab key="food" />}
                  {activeTab === 'missions' && <MissionsTab key="missions" />}
                  {activeTab === 'ending' && <EndingTab key="ending" />}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* [중앙 바인딩] */}
          <div className="w-8 lg:w-12 h-full bg-gradient-to-r from-[#e3e3c6] via-[#dcdcc0] to-[#e3e3c6] shadow-inner flex-shrink-0 relative">
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/5" />
          </div>

          {/* [오른쪽 페이지] */}
          <div className="flex-1 relative bg-[#F5F5DC] p-6 lg:p-8 overflow-hidden border-l border-gray-200/50 hidden lg:block">
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
            <div className="relative z-10 h-full">
              <DiaryRightPage />
            </div>
          </div>
        </div>

        {/* 3. 인덱스 탭 (책 오른쪽 바깥으로 이동) */}
        {/* absolute -right-12: 책 바깥으로 뺌 */}
        <div className="absolute -right-12 lg:-right-14 top-8 flex flex-col gap-3 lg:gap-4 z-0">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative group flex items-center justify-start focus:outline-none"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`h-12 lg:h-14 rounded-r-xl shadow-md flex items-center justify-center transition-all duration-300 ${activeTab === tab.id
                    ? 'w-14 lg:w-16 brightness-110 translate-x-[-2px] shadow-lg'
                    : 'w-12 lg:w-14 brightness-95 hover:brightness-105'
                  }`}
                style={{ backgroundColor: tab.color }}
              >
                <tab.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-md" />
              </div>
            </motion.button>
          ))}
        </div>

      </motion.div>
    </div>
  );
}