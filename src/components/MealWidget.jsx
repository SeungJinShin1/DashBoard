import React, { useState, useEffect } from 'react';
import { Utensils, RefreshCw } from 'lucide-react'; // 새로고침 아이콘(RefreshCw) 추가

const NEIS_BASE_URL = "https://open.neis.go.kr/hub";

// 날짜 구하는 함수
const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (1 + date.getMonth())).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
  // return "20241224"; // 방학 중 테스트용 날짜 (필요시 주석 해제)
};

// 급식 정보 가져오는 함수
const getMealInfo = async (officeCode, schoolCode, apiKey) => {
  if (!officeCode || !schoolCode) return "학교 정보가 부족합니다.";

  const dateStr = getTodayString();
  const keyParam = apiKey ? `&KEY=${apiKey}` : '';
  
  try {
    const url = `${NEIS_BASE_URL}/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${dateStr}${keyParam}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.mealServiceDietInfo) {
      return data.mealServiceDietInfo[1].row[0].DDISH_NM
        .replace(/<br\/>/g, ", ")
        .replace(/[0-9]+\./g, "")
        .replace(/\./g, "");
    }
    return "오늘은 급식이 없습니다. (방학/휴일)";
  } catch (error) {
    console.error("Meal Error:", error);
    return "급식 정보를 불러오지 못했습니다.";
  }
};

const MealWidget = ({ schoolInfo, neisKey }) => {
  const [meal, setMeal] = useState("로딩 중...");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 데이터 로드 함수 (재사용을 위해 분리)
  const loadData = async () => {
    if (schoolInfo && schoolInfo.office && schoolInfo.code) {
      setIsRefreshing(true); // 로딩 상태 시작 (아이콘 회전)
      
      // 사용자에게 다시 시도 중임을 알림 (너무 빠르면 안 보일 수 있으므로)
      if (meal === "급식 정보를 불러오지 못했습니다.") {
        setMeal("다시 불러오는 중...");
      }

      const data = await getMealInfo(schoolInfo.office, schoolInfo.code, neisKey);
      setMeal(data);
      setIsRefreshing(false); // 로딩 상태 종료
    }
  };

  useEffect(() => {
    loadData();
  }, [schoolInfo, neisKey]);

  if (!schoolInfo) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col relative group">
      {/* 헤더 영역: 제목 + 새로고침 버튼 */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Utensils size={20} className="text-green-500" /> 오늘의 맛있는 급식
        </h2>
        
        {/* 새로고침 버튼 */}
        <button 
          onClick={loadData}
          disabled={isRefreshing}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-green-600 transition-all active:scale-95"
          title="급식 정보 새로고침"
        >
          <RefreshCw 
            size={16} 
            className={isRefreshing ? "animate-spin text-green-600" : ""} 
          />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-green-50 rounded-xl p-4">
        <div className="text-center w-full">
          <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
            {meal}
          </p>
          
          {/* 에러 상태일 때 재시도 유도 메시지 추가 */}
          {meal === "급식 정보를 불러오지 못했습니다." && (
            <button 
              onClick={loadData}
              className="mt-3 text-xs text-green-600 underline hover:text-green-800"
            >
              다시 시도하기
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-right text-slate-400 mt-2">{schoolInfo.name}</p>
    </div>
  );
};

export default MealWidget;