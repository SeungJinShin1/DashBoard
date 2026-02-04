import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const fetchWeatherData = async (lat, lon, apiKey) => {
  // API 키가 없거나 위치를 못 찾았을 때의 기본값
  if (!apiKey) return { temp: 22, desc: "맑음", icon: "01d", pm10: 25, pm2_5: 12, location: "서울시 중구" };

  try {
    // 1. 날씨 데이터 조회
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
    );
    const weatherData = await weatherRes.json();

    // 2. 대기질 데이터 조회
    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const airData = await airRes.json();
    const components = airData.list?.[0]?.components || {};

    // 3. 주소 데이터 조회 (Reverse Geocoding)
    // 주의: http -> https로 변경 (배포 시 보안 문제 방지)
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    
    let locationName = "위치 확인 중";
    if (geoData && geoData.length > 0) {
      // 한국어 이름이 있으면 사용, 없으면 영어 이름 사용
      // 예: "Cheonan-si" -> "천안시"
      const city = geoData[0].local_names?.ko || geoData[0].name;
      locationName = city; 
    }

    return {
      temp: Math.round(weatherData.main.temp),
      desc: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      pm10: components.pm10 || 0,
      pm2_5: components.pm2_5 || 0,
      location: locationName
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
};

const WeatherBadge = ({ weatherApiKey }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 브라우저의 위치 정보 요청 (권한 허용 팝업이 뜹니다)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // 허용 시: 사용자의 현재 위치(위도, 경도)로 날씨 조회
        const data = await fetchWeatherData(pos.coords.latitude, pos.coords.longitude, weatherApiKey);
        setWeather(data);
        setLoading(false);
      },
      (err) => {
        // 거부 또는 에러 시: 기본 위치(서울)로 조회 및 안내
        console.warn("위치 정보 권한이 거부되었습니다. 기본 위치로 설정합니다.");
        fetchWeatherData(37.5665, 126.9780, weatherApiKey).then(data => { 
          setWeather({...data, location: "서울 (기본값)"}); 
          setLoading(false); 
        });
      }
    );
  }, [weatherApiKey]);

  if (loading) return <div className="text-sm text-slate-400">날씨 로딩 중...</div>;
  if (!weather) return null;

  const getDustStatus = (val, type) => {
    let color = "text-blue-600 bg-blue-100";
    if (type === 'pm10') {
      if (val > 80) color = "text-orange-600 bg-orange-100";
      if (val > 150) color = "text-red-600 bg-red-100";
    } else {
      if (val > 35) color = "text-orange-600 bg-orange-100";
      if (val > 75) color = "text-red-600 bg-red-100";
    }
    return color;
  };

  return (
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
      {/* 아이콘 & 온도 */}
      <div className="flex items-center gap-2">
        <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="weather" className="w-10 h-10 -my-2" />
        <div>
          <span className="text-xl font-bold text-slate-800">{weather.temp}°</span>
          <span className="text-xs text-slate-500 block">{weather.desc}</span>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200"></div>

      {/* 미세먼지 */}
      <div className="flex flex-col text-[10px] font-medium gap-1">
        <span className={`px-1.5 rounded ${getDustStatus(weather.pm10, 'pm10')}`}>미세 {Math.round(weather.pm10)}</span>
        <span className={`px-1.5 rounded ${getDustStatus(weather.pm2_5, 'pm25')}`}>초미세 {Math.round(weather.pm2_5)}</span>
      </div>

      <div className="w-px h-8 bg-slate-200"></div>

      {/* 위치 정보 (우리 지역) */}
      <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
        <MapPin size={14} className="text-orange-500"/>
        <span>{weather.location}</span>
      </div>
    </div>
  );
};

export default WeatherBadge;