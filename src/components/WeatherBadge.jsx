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
      // 한국어 이름 우선 사용
      let city = geoData[0].local_names?.ko || geoData[0].name;
      
      // "~동"이나 상세 주소가 나오면 떼어내고 시/군 단위만 남기려는 시도
      // (API가 동 단위를 줄 때가 있어 완벽하진 않지만, 최대한 깔끔하게)
      if (city.includes("-si")) city = city.replace("-si", "시");
      if (city.includes("-gun")) city = city.replace("-gun", "군");
      if (city.includes("-gu")) city = city.replace("-gu", "구");
      
      locationName = city; 
    }

    return {
      temp: Math.round(weatherData.main.temp),
      desc: getSimpleWeatherName(weatherData.weather[0].id), // 수정된 함수 사용
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
  // 좋음(파랑), 보통(초록), 나쁨(주황), 매우나쁨(빨강)
  const getDustStatus = (val, type) => {
    let color = "text-blue-600 bg-blue-50"; // 기본: 좋음
    
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
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
      {/* 1. 날씨 아이콘 & 온도 */}
      <div className="flex items-center gap-3">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
          alt="weather" 
          className="w-14 h-14 -my-3" 
        />
        <div className="flex flex-col justify-center">
          <span className="text-2xl font-bold text-slate-800 leading-none">{weather.temp}°</span>
          <span className="text-sm font-medium text-slate-500 mt-1">{weather.desc}</span>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 mx-1"></div>

      {/* 2. 미세먼지 정보 */}
      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`px-2 py-0.5 rounded ${pm10Color} min-w-[3.5rem] text-center font-bold`}>
            미세 {Math.round(weather.pm10)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`px-2 py-0.5 rounded ${pm25Color} min-w-[3.5rem] text-center font-bold`}>
            초미세 {Math.round(weather.pm2_5)}
          </span>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 mx-1"></div>

      {/* 3. 위치 정보 */}
      <div className="flex items-center gap-1 text-slate-500 text-sm font-semibold">
        <MapPin size={16} className="text-orange-500"/>
        <span>{weather.location}</span>
      </div>
    </div>
  );
};

export default WeatherBadge;