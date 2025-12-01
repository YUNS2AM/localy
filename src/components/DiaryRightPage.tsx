import { motion } from 'motion/react';
import { MapPin, Camera, Star, Heart } from 'lucide-react';

export function DiaryRightPage() {
  return (
    <div className="relative h-full overflow-y-auto custom-scrollbar pr-2">
      {/* Hand-drawn style map */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Map background */}
          <rect x="0" y="0" width="400" height="300" fill="#FAFAEB" rx="8" />
          
          {/* Decorative border */}
          <rect x="5" y="5" width="390" height="290" fill="none" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" opacity="0.3" />
          
          {/* Route path - hand-drawn style */}
          <path
            d="M 50 250 Q 100 200, 150 220 T 250 180 T 350 150"
            stroke="#FF6B6B"
            strokeWidth="3"
            strokeDasharray="8,4"
            fill="none"
            opacity="0.6"
          />
          
          {/* Location markers */}
          <g>
            {/* Station 1 */}
            <circle cx="50" cy="250" r="8" fill="#FF6B6B" />
            <text x="50" y="275" textAnchor="middle" fill="#8B4513" fontSize="12" fontFamily="cursive">
              Tokyo
            </text>
            
            {/* Station 2 */}
            <circle cx="150" cy="220" r="8" fill="#4ECDC4" />
            <text x="150" y="245" textAnchor="middle" fill="#8B4513" fontSize="12" fontFamily="cursive">
              Kyoto
            </text>
            
            {/* Station 3 */}
            <circle cx="250" cy="180" r="8" fill="#FFE66D" />
            <text x="250" y="205" textAnchor="middle" fill="#8B4513" fontSize="12" fontFamily="cursive">
              Nara
            </text>
            
            {/* Station 4 */}
            <circle cx="350" cy="150" r="8" fill="#95E1D3" />
            <text x="350" y="175" textAnchor="middle" fill="#8B4513" fontSize="12" fontFamily="cursive">
              Osaka
            </text>
          </g>
          
          {/* Decorative elements - mountains */}
          <g opacity="0.4">
            <path d="M 80 120 L 110 60 L 140 120 Z" fill="#90EE90" />
            <path d="M 120 130 L 155 70 L 190 130 Z" fill="#90EE90" />
            <path d="M 280 100 L 310 50 L 340 100 Z" fill="#87CEEB" />
          </g>
          
          {/* Trees */}
          <g opacity="0.5">
            <circle cx="200" cy="115" r="6" fill="#90EE90" />
            <rect x="198" y="115" width="4" height="12" fill="#8B4513" />
            
            <circle cx="220" cy="125" r="5" fill="#90EE90" />
            <rect x="218" y="125" width="4" height="10" fill="#8B4513" />
          </g>
          
          {/* Water/river */}
          <path
            d="M 0 200 Q 100 190, 200 200 T 400 190"
            fill="none"
            stroke="#87CEEB"
            strokeWidth="15"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Polaroid photos pinned to map */}
      <div className="space-y-4 mb-6">
        {/* Polaroid 1 */}
        <motion.div
          className="inline-block bg-white p-3 shadow-lg transform rotate-2 ml-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <div className="w-48 h-36 bg-gradient-to-br from-[#FFE66D]/30 to-[#FF6B6B]/30 rounded flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="mt-2 text-center text-gray-600" style={{ fontFamily: 'cursive', fontSize: '0.75rem' }}>
            Kyoto Temple
          </p>
        </motion.div>

        {/* Polaroid 2 */}
        <motion.div
          className="inline-block bg-white p-3 shadow-lg transform -rotate-3 float-right mr-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05, rotate: -5 }}
        >
          <div className="w-48 h-36 bg-gradient-to-br from-[#87CEEB]/30 to-[#90EE90]/30 rounded flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="mt-2 text-center text-gray-600" style={{ fontFamily: 'cursive', fontSize: '0.75rem' }}>
            Cherry Blossoms
          </p>
        </motion.div>
      </div>

      {/* Travel stickers */}
      <div className="flex flex-wrap gap-3 mb-6 clear-both">
        <motion.div
          className="px-3 py-2 bg-[#FF6B6B] text-white rounded-full shadow-md transform -rotate-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{ fontSize: '0.75rem' }}
        >
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            Must Visit
          </div>
        </motion.div>

        <motion.div
          className="px-3 py-2 bg-[#4ECDC4] text-white rounded-full shadow-md transform rotate-3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          style={{ fontSize: '0.75rem' }}
        >
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 fill-white" />
            Loved It
          </div>
        </motion.div>

        <motion.div
          className="px-3 py-2 bg-[#FFE66D] text-gray-700 rounded-full shadow-md transform -rotate-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          style={{ fontSize: '0.75rem' }}
        >
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Explored
          </div>
        </motion.div>
      </div>

      {/* Handwritten notes */}
      <motion.div
        className="border-l-4 border-[#87CEEB] pl-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-gray-600 mb-2" style={{ fontFamily: 'cursive', fontSize: '0.875rem', lineHeight: '1.8' }}>
          "The train journey from Tokyo to Kyoto was absolutely breathtaking..."
        </p>
        <p className="text-gray-500 italic" style={{ fontFamily: 'cursive', fontSize: '0.75rem' }}>
          - Day 2, July 15th
        </p>
      </motion.div>

      {/* Washi tape decorations */}
      <motion.div
        className="space-y-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div className="h-6 bg-gradient-to-r from-transparent via-[#FFE66D]/30 to-transparent border-t border-b border-[#FFE66D]/50 transform -rotate-1" />
        <div className="h-6 bg-gradient-to-r from-transparent via-[#FF6B6B]/30 to-transparent border-t border-b border-[#FF6B6B]/50 transform rotate-1" />
      </motion.div>

      {/* Pressed flowers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <svg viewBox="0 0 200 100" className="w-full">
          {/* Flower stems */}
          <path d="M 50 80 Q 55 60 60 40" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 100 90 Q 95 70 90 50" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 150 85 Q 145 65 140 45" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.6" />
          
          {/* Flower petals */}
          <g opacity="0.7">
            <circle cx="60" cy="35" r="6" fill="#FFE66D" />
            <circle cx="55" cy="40" r="4" fill="#FFE66D" />
            <circle cx="65" cy="40" r="4" fill="#FFE66D" />
            <circle cx="60" cy="42" r="3" fill="#FFA500" />
            
            <circle cx="90" cy="45" r="5" fill="#FF6B6B" />
            <circle cx="85" cy="50" r="3" fill="#FF6B6B" />
            <circle cx="95" cy="50" r="3" fill="#FF6B6B" />
            
            <circle cx="140" cy="40" r="6" fill="#C7CEEA" />
            <circle cx="134" cy="45" r="4" fill="#C7CEEA" />
            <circle cx="146" cy="45" r="4" fill="#C7CEEA" />
          </g>
        </svg>
      </motion.div>

      {/* Additional Polaroid at bottom */}
      <motion.div
        className="inline-block bg-white p-3 shadow-lg transform rotate-1 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        whileHover={{ scale: 1.05, rotate: 3 }}
      >
        <div className="w-48 h-36 bg-gradient-to-br from-[#95E1D3]/30 to-[#4ECDC4]/30 rounded flex items-center justify-center">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
        <p className="mt-2 text-center text-gray-600" style={{ fontFamily: 'cursive', fontSize: '0.75rem' }}>
          Local Market
        </p>
      </motion.div>

      {/* Final handwritten note */}
      <motion.div
        className="mt-6 p-4 border-2 border-dashed border-[#8B4513]/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <p className="text-gray-600 italic text-center" style={{ fontFamily: 'cursive', fontSize: '0.875rem', lineHeight: '1.8' }}>
          "Every corner has a story,
          <br />
          every moment a memory to keep..."
        </p>
      </motion.div>
    </div>
  );
}
