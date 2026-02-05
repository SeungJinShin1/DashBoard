import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// 날씨 상태를 우리말(초등학생용)로 변환하는 함수
const getSimpleWeatherName = (id) => {
  const code = parseInt(id);
  // 2xx: 천둥번개, 3xx: 이슬비, 5xx: 비, 6xx: 눈, 7xx: 안개/황사, 800: 맑음, 80x: 구름
  if (code === 800) return "맑음";
  if (code > 800 && code <= 802) return "구름조금";
  if (code > 802 && code <= 804) return "흐림";
  if (code >= 300 && code < 600) return "비";
  if (code >= 600 && code < 700) return "눈";
  if (code >= 200 && code < 300) return "천둥번개";
  if (code >= 700 && code < 800) return "안개";
  return "흐림";
};

const fetchWeatherData = async (lat, lon, apiKey) => {
  if (!apiKey) return { temp: 20, desc: "맑음", icon: "01d", pm10: 30, pm2_5: 15, location: "서울" };

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
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();
    
    let locationName = "위치 확인 중";
    if (geoData && geoData.length > 0) {
      // 한국어 이름이 있으면 가져옴
      const rawName = geoData[0].local_names?.ko || geoData[0].name;
      
      // [위치명 정제 로직] 
      // "천안시청 식당동" -> "천안시", "예산군청" -> "예산군" 처럼 '시'나 '군'을 찾아 추출
      // 정규식: 한글로 시작해서 '시' 또는 '군'으로 끝나는 덩어리를 찾음
      const match = rawName.match(/([가-힣]+(시|군))/);
      
      if (match) {
        locationName = match[0]; // "천안시" or "예산군"
      } else {
        // 매칭 안되면 공백 기준 첫 단어만 사용 (예: "서울", "제주")
        locationName = rawName.split(' ')[0];
      }
    }

    return {
      temp: Math.round(weatherData.main.temp),
      desc: getSimpleWeatherName(weatherData.weather[0].id), // 알기 쉬운 날씨 용어로 변환
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
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const data = await fetchWeatherData(pos.coords.latitude, pos.coords.longitude, weatherApiKey);
        setWeather(data);
        setLoading(false);
      },
      (err) => {
        console.warn("위치 정보 권한 거부됨");
        fetchWeatherData(37.5665, 126.9780, weatherApiKey).then(data => { 
          setWeather({...data, location: "서울 (기본값)"}); 
          setLoading(false); 
        });
      }
    );
  }, [weatherApiKey]);

  if (loading) return <div className="text-sm text-slate-400">날씨 확인 중...</div>;
  if (!weather) return null;

  // 한국 환경부 기준 미세먼지 등급 (PM10 / PM2.5)
  const getDustStatus = (val, type) => {
    let color = "text-blue-600 bg-blue-50"; // 좋음
    
    if (type === 'pm10') {
      if (val <= 30) color = "text-blue-600 bg-blue-50";
      else if (val <= 80) color = "text-green-600 bg-green-50";
      else if (val <= 150) color = "text-orange-600 bg-orange-50";
      else color = "text-red-600 bg-red-50";
    } else {
      if (val <= 15) color = "text-blue-600 bg-blue-50";
      else if (val <= 35) color = "text-green-600 bg-green-50";
      else if (val <= 75) color = "text-orange-600 bg-orange-50";
      else color = "text-red-600 bg-red-50";
    }
    return color;
  };

  const pm10Color = getDustStatus(weather.pm10, 'pm10');
  const pm25Color = getDustStatus(weather.pm2_5, 'pm25');

  return (
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm min-w-fit">
      {/* 1. 날씨 아이콘 & 온도 & 설명 */}
      <div className="flex items-center gap-3">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
          alt="weather" 
          className="w-14 h-14 -my-3" 
        />
        <div className="flex flex-col justify-center items-start">
          <span className="text-2xl font-bold text-slate-800 leading-none">{weather.temp}°</span>
          {/* 줄바꿈 방지: whitespace-nowrap */}
          <span className="text-sm font-medium text-slate-500 mt-1 whitespace-nowrap">{weather.desc}</span>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 mx-1"></div>

      {/* 2. 미세먼지 정보 (줄바꿈 방지 & 정확한 용어) */}
      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-2 text-xs font-medium whitespace-nowrap">
          <span className="text-slate-400 w-16 text-right">미세먼지</span>
          <span className={`px-2 py-0.5 rounded ${pm10Color} min-w-[3rem] text-center font-bold`}>
            {Math.round(weather.pm10)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium whitespace-nowrap">
          <span className="text-slate-400 w-16 text-right">초미세먼지</span>
          <span className={`px-2 py-0.5 rounded ${pm25Color} min-w-[3rem] text-center font-bold`}>
            {Math.round(weather.pm2_5)}
          </span>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 mx-1"></div>

      {/* 3. 위치 정보 */}
      <div className="flex items-center gap-1 text-slate-500 text-sm font-semibold whitespace-nowrap">
        <MapPin size={16} className="text-orange-500"/>
        <span>{weather.location}</span>
      </div>
    </div>
  );
};

export default WeatherBadge;