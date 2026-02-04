import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react'; 

// 분리된 컴포넌트 불러오기
import Header from './components/Header';
import SchoolSearch from './components/SchoolSearch';
import MealWidget from './components/MealWidget';
import MorningRoutine from './components/MorningRoutine';
import Timetable from './components/Timetable';
import QuickLinks from './components/QuickLinks';
import AIBriefing from './components/AIBriefing';
import QuizWidget from './components/QuizWidget';

const App = () => {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [routine, setRoutine] = useState("");
  
  // 1. 환경 변수 설정
  // import.meta.env 접근 시 발생할 수 있는 호환성 경고를 방지하기 위해 직접 접근합니다.
  // 로컬 Vite 환경에서는 정상 작동합니다.
  const GEMINI_API_KEY = (import.meta && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || "";
  const NEIS_API_KEY = (import.meta && import.meta.env && import.meta.env.VITE_NEIS_API_KEY) || "";
  const WEATHER_API_KEY = (import.meta && import.meta.env && import.meta.env.VITE_WEATHER_API_KEY) || "";

  // 2. 초기 데이터 로드
  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem("mySchool");
      if (savedSchool) setSchoolInfo(JSON.parse(savedSchool));
    } catch (e) {
      console.error("학교 정보 로드 실패", e);
    }

    const savedRoutine = localStorage.getItem("morningRoutine");
    if (savedRoutine) setRoutine(savedRoutine);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* 헤더 */}
        <Header weatherApiKey={WEATHER_API_KEY} />

        {/* 메인 그리드 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1열: 학교 설정 및 급식 */}
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

          {/* 2열: 오늘의 시간표 */}
          <div className="h-80">
            <Timetable schoolInfo={schoolInfo} neisKey={NEIS_API_KEY} />
          </div>

          {/* 3열: 아침 루틴 */}
          <div className="h-80">
            <MorningRoutine routine={routine} setRoutine={setRoutine} />
          </div>

          {/* 4열: 퀵 링크 */}
          <div className="h-80">
            <QuickLinks />
          </div>

          {/* 5열: AI 아침 브리핑 (2칸 차지) */}
          <AIBriefing 
            schoolInfo={schoolInfo} 
            routine={routine} 
            geminiKey={GEMINI_API_KEY} 
            neisKey={NEIS_API_KEY}
          />
          
          {/* 6열: AI 틈새 퀴즈 */}
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