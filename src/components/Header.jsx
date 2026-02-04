const Header = ({ weatherApiKey }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
  
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
      return date.toLocaleDateString('ko-KR', options);
    };
  
    return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm p-6 rounded-2xl mb-6 border border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* 1. 왼쪽: 날씨 */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start order-2 md:order-1">
            <WeatherBadge weatherApiKey={weatherApiKey} />
          </div>
  
          {/* 2. 중앙: 타이틀 */}
          <div className="w-full md:w-1/3 text-center order-1 md:order-2">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 whitespace-nowrap">
              <Sun className="text-orange-500 w-8 h-8" /> 슬기로운 교실 생활
            </h1>
            <p className="text-slate-500 text-base mt-2">선생님과 우리 반을 위한 스마트 대시보드</p>
          </div>
  
          {/* 3. 오른쪽: 시계 */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right order-3">
            <p className="text-lg font-bold text-indigo-600">{formatDate(currentTime)}</p>
            <p className="text-4xl font-extrabold text-slate-700 font-mono mt-1 tracking-tight">
              {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
            </p>
          </div>
  
        </div>
      </header>
    );
  };