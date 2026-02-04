import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Utensils, 
  Sun, 
  Link as LinkIcon, 
  Settings, 
  Sparkles, 
  Coffee, 
  ExternalLink,
  BookOpen,
  Calendar,
  BrainCircuit,
  MessageCircleQuestion,
  GraduationCap,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  MapPin
} from 'lucide-react';

const App = () => {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [routine, setRoutine] = useState("");
  
  // NOTE: 로컬 Vite 환경에서 .env 파일을 사용하려면 아래 주석을 해제하고,
  // 다음 줄의 빈 문자열 할당을 제거하세요.
  // const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  // const NEIS_API_KEY = import.meta.env.VITE_NEIS_API_KEY || "";
  // const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";
  
  // 캔버스 환경에서는 직접 입력하거나 빈 문자열 사용 (빈 문자열 시 데모 데이터)
  const GEMINI_API_KEY = "";
  const NEIS_API_KEY = "";
  const WEATHER_API_KEY = ""; // 여기에 OpenWeatherMap API 키를 입력하면 실제 데이터가 나옵니다.

  useEffect(() => {
    const savedSchool = localStorage.getItem("mySchool");
    if (savedSchool) setSchoolInfo(JSON.parse(savedSchool));

    const savedRoutine = localStorage.getItem("morningRoutine");
    if (savedRoutine) setRoutine(savedRoutine);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <Header weatherApiKey={WEATHER_API_KEY} />

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Row 1 */}
          <div className="h-80">
            {!schoolInfo ? (
              <SchoolSearch setSchoolInfo={setSchoolInfo} neisKey={NEIS_API_KEY} />
            ) : (
              <div className="h-full relative group">
                 <MealWidget schoolInfo={schoolInfo} neisKey={NEIS_API_KEY} />
                 <button 
                   onClick={() => {
                     if(window.confirm('학교 설정을 초기화하시겠습니까?')) {
                       setSchoolInfo(null);
                       localStorage.removeItem("mySchool");
                     }
                   }}
                   className="absolute top-4 right-4 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                 >
                   <Settings size={16} />
                 </button>
              </div>
            )}
          </div>

          <div className="h-80">
            <MorningRoutine routine={routine} setRoutine={setRoutine} />
          </div>

          <div className="h-80">
            <QuickLinks />
          </div>

          {/* Row 2: AI Features */}
          <AIBriefing 
            schoolInfo={schoolInfo} 
            routine={routine} 
            geminiKey={GEMINI_API_KEY} 
            neisKey={NEIS_API_KEY}
          />
          
          {/* New Widgets split the last column space or wrap to next row depending on screen */}
          <div className="h-auto min-h-[300px] flex flex-col gap-6 lg:col-span-1 md:col-span-2">
            <div className="flex-1">
               <QuizWidget geminiKey={GEMINI_API_KEY} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;