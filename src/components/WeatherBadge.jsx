import React, { useState, useEffect } from 'react';
import { CloudSun } from 'lucide-react';

const WeatherBadge = ({ weatherApiKey }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherData(latitude, longitude, weatherApiKey);
          setWeather(data);
          setLoading(false);
        },
        (error) => {
          console.error("위치 정보 동의 필요:", error);
          // 권한 거부 시 서울 기준 데모 호출
          fetchWeatherData(37.5665, 126.9780, weatherApiKey).then((data) => {
            setWeather(data);
            setLoading(false);
          });
        }
      );
    }, [weatherApiKey]);
  
    if (loading) return <div className="text-sm text-slate-400">날씨 로딩 중...</div>;
    if (!weather) return null;
  
    // 미세먼지 상태 함수
    const getDustStatus = (value, type) => {
      let status = "좋음";
      let color = "text-blue-600";
      let bg = "bg-blue-100";
  
      if (type === 'pm10') {
        if (value <= 30) { status = "좋음"; color = "text-blue-600"; bg = "bg-blue-100"; }
        else if (value <= 80) { status = "보통"; color = "text-green-600"; bg = "bg-green-100"; }
        else if (value <= 150) { status = "나쁨"; color = "text-orange-600"; bg = "bg-orange-100"; }
        else { status = "최악"; color = "text-red-600"; bg = "bg-red-100"; }
      } else {
        if (value <= 15) { status = "좋음"; color = "text-blue-600"; bg = "bg-blue-100"; }
        else if (value <= 35) { status = "보통"; color = "text-green-600"; bg = "bg-green-100"; }
        else if (value <= 75) { status = "나쁨"; color = "text-orange-600"; bg = "bg-orange-100"; }
        else { status = "최악"; color = "text-red-600"; bg = "bg-red-100"; }
      }
      return { status, color, bg };
    };
  
    const pm10Stat = getDustStatus(weather.pm10, 'pm10');
    const pm25Stat = getDustStatus(weather.pm2_5, 'pm25');
  
    return (
      <div className="flex items-center gap-5 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* 날씨 정보 (크게) */}
        <div className="flex items-center gap-3">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt="icon" 
            className="w-16 h-16 -my-4" 
          />
          <div className="flex flex-col justify-center">
            <span className="text-3xl font-bold text-slate-800 leading-none">{weather.temp}°</span>
            <span className="text-sm font-medium text-slate-500 mt-1">{weather.desc}</span>
          </div>
        </div>
  
        <div className="w-px h-10 bg-slate-200 mx-1"></div>
  
        {/* 미세먼지/초미세먼지 정보 */}
        <div className="flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 font-semibold w-12">미세</span>
            <span className={`px-2 py-0.5 rounded ${pm10Stat.bg} ${pm10Stat.color} font-bold min-w-[3rem] text-center`}>
              {pm10Stat.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 font-semibold w-12">초미세</span>
            <span className={`px-2 py-0.5 rounded ${pm25Stat.bg} ${pm25Stat.color} font-bold min-w-[3rem] text-center`}>
              {pm25Stat.status}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default WeatherBadge;