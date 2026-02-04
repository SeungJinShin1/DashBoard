import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react'; // 아이콘 import 필수!
import WeatherBadge from './WeatherBadge'; // 분리한 WeatherBadge 파일 불러오기

const Header = ({ weatherApiKey }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 rounded-2xl mb-6 border border-slate-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* 1. 날씨 */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start order-2 md:order-1">
          <WeatherBadge weatherApiKey={weatherApiKey} />
        </div>

        {/* 2. 타이틀 */}
        <div className="w-full md:w-1/3 text-center order-1 md:order-2">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 whitespace-nowrap">
            <Sun className="text-orange-500" /> 슬기로운 교실 생활
          </h1>
          <p className="text-slate-500 text-xs mt-1">우리 반 스마트 대시보드</p>
        </div>

        {/* 3. 시간 */}
        <div className="w-full md:w-1/3 text-center md:text-right order-3">
          <p className="text-sm font-bold text-indigo-600">
            {time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
          <p className="text-3xl font-extrabold text-slate-700 font-mono leading-none mt-1">
            {time.toLocaleTimeString('ko-KR', { hour12: false })}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;