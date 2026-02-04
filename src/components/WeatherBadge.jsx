import React, { useState, useEffect } from 'react';

// 1. 날씨 데이터를 가져오는 함수
const fetchWeatherData = async (lat, lon, apiKey) => {
  // API 키가 없으면 데모 데이터 반환
  if (!apiKey) {
    return { temp: 22, desc: "맑음", icon: "01d", pm10: 25, pm2_5: 12 };
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
    );
    const weatherData = await weatherRes.json();

    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const airData = await airRes.json();
    
    const components = airData.list?.[0]?.components || {};

    return {
      temp: Math.round(weatherData.main.temp),
      desc: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      pm10: components.pm10 || 0,
      pm2_5: components.pm2_5 || 0
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    // 에러 발생 시 데모 데이터 반환 (화면이 깨지지 않게)
    return { temp: 20, desc: "정보없음", icon: "03d", pm10: 0, pm2_5: 0 };
  }
};

const WeatherBadge = ({ weatherApiKey }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 기본 날씨 로드 함수 (서울 기준)
    const loadDefaultWeather = async () => {
      const data = await fetchWeatherData(37.5665, 126.9780, weatherApiKey);
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    };

    // 1. 위치 정보 요청 (5초 타임아웃 설정)
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("위치 정보 응답 지연. 기본 지역으로 설정합니다.");
        loadDefaultWeather();
      }
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId); // 위치 찾으면 타임아웃 취소
        if (!isMounted) return;
        const data = await fetchWeatherData(position.coords.latitude, position.coords.longitude, weatherApiKey);
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("위치 정보 동의 필요:", error);
        loadDefaultWeather(); // 동의 거부 시 기본 지역 로드
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [weatherApiKey]);

  if (loading) return <div className="text-sm text-slate-400">날씨 불러오는 중...</div>;
  if (!weather) return null;

  const getDustStatus = (value, type) => {
    let color = "text-blue-600 bg-blue-100";
    let status = "좋음";

    if (type === 'pm10') {
      if (value <= 30) { status = "좋음"; color = "text-blue-600 bg-blue-100"; }
      else if (value <= 80) { status = "보통"; color = "text-green-600 bg-green-100"; }
      else if (value <= 150) { status = "나쁨"; color = "text-orange-600 bg-orange-100"; }
      else { status = "최악"; color = "text-red-600 bg-red-100"; }
    } else {
      if (value <= 15) { status = "좋음"; color = "text-blue-600 bg-blue-100"; }
      else if (value <= 35) { status = "보통"; color = "text-green-600 bg-green-100"; }
      else if (value <= 75) { status = "나쁨"; color = "text-orange-600 bg-orange-100"; }
      else { status = "최악"; color = "text-red-600 bg-red-100"; }
    }
    return { status, color };
  };

  const pm10Stat = getDustStatus(weather.pm10, 'pm10');
  const pm25Stat = getDustStatus(weather.pm2_5, 'pm25');

  return (
    <div className="flex items-center gap-5 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
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

      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 font-semibold w-12">미세</span>
          <span className={`px-2 py-0.5 rounded ${pm10Stat.color} font-bold min-w-[3rem] text-center`}>
            {pm10Stat.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 font-semibold w-12">초미세</span>
          <span className={`px-2 py-0.5 rounded ${pm25Stat.color} font-bold min-w-[3rem] text-center`}>
            {pm25Stat.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherBadge;