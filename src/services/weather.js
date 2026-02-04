const fetchWeatherData = async (lat, lon, apiKey) => {
    // 키가 없으면 데모 데이터 반환
    if (!apiKey) {
      return {
        temp: 22,
        desc: "맑음",
        icon: "01d",
        pm10: 25,   // 미세먼지 수치
        pm2_5: 12   // 초미세먼지 수치
      };
    }
  
    try {
      // 1. 날씨 조회 (현재 날씨)
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
      );
      const weatherData = await weatherRes.json();
  
      // 2. 대기질(미세먼지) 조회
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
      return null;
    }
  };