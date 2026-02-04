import React, { useState, useEffect } from 'react';
import { CalendarDays, Settings, Save, RefreshCw, X, Edit3 } from 'lucide-react';

const Timetable = ({ schoolInfo, neisKey }) => {
  // 상태 관리
  const [classInfo, setClassInfo] = useState({ grade: "", classNm: "" }); // 학년/반
  const [schedule, setSchedule] = useState(Array(6).fill("")); // 1~6교시 데이터
  const [isSetting, setIsSetting] = useState(false); // 설정 모드 (학년/반)
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 (과목명)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 오늘 날짜 정보 계산 (YYYYMMDD, 학년도, 학기)
  const getDateInfo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    
    // YYYYMMDD
    const ymd = `${year}${String(month).padStart(2, '0')}${String(date).padStart(2, '0')}`;
    
    // 학년도(AY) 및 학기(SEM) 계산
    // 2월까지는 전년도 2학기임.
    let ay = year;
    let sem = 1;
    
    if (month === 1 || month === 2) {
      ay = year - 1;
      sem = 2;
    } else if (month >= 8) {
      sem = 2;
    }

    return { ymd, ay, sem };
  };

  // 초기 로드: 저장된 학년/반 정보 & 시간표 불러오기
  useEffect(() => {
    const savedClass = localStorage.getItem("myClassInfo");
    if (savedClass) setClassInfo(JSON.parse(savedClass));

    // 오늘 날짜에 저장된 수동 시간표가 있는지 확인
    const { ymd } = getDateInfo();
    const savedSchedule = localStorage.getItem(`schedule_${ymd}`);
    
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
      setMessage("저장된 시간표를 불러왔습니다.");
    } else if (savedClass && schoolInfo) {
      // 저장된게 없으면 API 호출 시도
      fetchTimetable(JSON.parse(savedClass));
    }
  }, [schoolInfo]);

  // NEIS API 시간표 조회
  const fetchTimetable = async (currentClassInfo) => {
    if (!schoolInfo || !currentClassInfo.grade || !currentClassInfo.classNm) return;
    
    setLoading(true);
    setMessage("");
    const { ymd, ay, sem } = getDateInfo();
    const keyParam = neisKey ? `&KEY=${neisKey}` : '';

    try {
      const url = `https://open.neis.go.kr/hub/elsTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${schoolInfo.office}&SD_SCHUL_CODE=${schoolInfo.code}&AY=${ay}&SEM=${sem}&ALL_TI_YMD=${ymd}&GRADE=${currentClassInfo.grade}&CLASS_NM=${currentClassInfo.classNm}${keyParam}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.elsTimetable) {
        // API 데이터 매핑 (PERIO: 교시, ITRT_CNTNT: 수업내용)
        const apiSchedule = Array(6).fill("");
        data.elsTimetable[1].row.forEach(item => {
          const period = parseInt(item.PERIO) - 1; // 0-based index
          if (period >= 0 && period < 6) {
            // 특수문자 제거 후 저장
            apiSchedule[period] = item.ITRT_CNTNT.replace(/[-_]/g, '');
          }
        });
        setSchedule(apiSchedule);
        setMessage("");
      } else {
        // 데이터가 없는 경우 (방학, 주말 등)
        setMessage("나이스 시간표 정보가 없습니다. 직접 입력해주세요.");
        // 기존 schedule 유지 (초기화 하지 않음)
      }
    } catch (error) {
      console.error("Timetable Error:", error);
      setMessage("시간표를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 학년/반 저장 핸들러
  const saveClassInfo = () => {
    localStorage.setItem("myClassInfo", JSON.stringify(classInfo));
    setIsSetting(false);
    fetchTimetable(classInfo); // 설정 변경 시 바로 API 호출
  };

  // 시간표 내용 저장 핸들러 (수동 수정)
  const saveSchedule = () => {
    const { ymd } = getDateInfo();
    localStorage.setItem(`schedule_${ymd}`, JSON.stringify(schedule));
    setIsEditing(false);
    setMessage("시간표가 저장되었습니다.");
  };

  const handleSubjectChange = (index, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = value;
    setSchedule(newSchedule);
  };

  // 주말 체크
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  if (!schoolInfo) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-slate-400">
        <CalendarDays size={40} className="mb-2 opacity-50" />
        <p className="text-sm">학교를 먼저 설정해주세요.</p>
      </div>
    );
  }

  // 주말 화면
  if (isWeekend() && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
          <CalendarDays size={20} className="text-indigo-500" /> 오늘의 시간표
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-indigo-400">
          <CalendarDays size={48} className="mb-3" />
          <p className="font-bold text-lg text-slate-600">즐거운 주말입니다!</p>
          <p className="text-sm mt-1">푹 쉬고 월요일에 만나요 👋</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col relative group">
      
      {/* 헤더: 제목 + 버튼들 */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <CalendarDays size={20} className="text-indigo-500" /> 시간표
          {classInfo.grade && <span className="text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{classInfo.grade}-{classInfo.classNm}</span>}
        </h2>
        
        <div className="flex gap-1">
          {/* 수정 모드 전환 버튼 */}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
              title="시간표 직접 수정"
            >
              <Edit3 size={16} />
            </button>
          )}
          {/* 설정(학년반) 버튼 */}
          <button 
            onClick={() => setIsSetting(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"
            title="학년/반 설정"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* 메시지 표시 (방학 등) */}
      {message && !isEditing && (
        <div className="text-xs text-center text-orange-500 bg-orange-50 py-1 px-2 rounded mb-2 animate-pulse">
          {message}
        </div>
      )}

      {/* 시간표 리스트 (2열 6행 구조: 교시 | 과목) */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-2">
          {schedule.map((subject, idx) => (
            <div key={idx} className="flex items-stretch h-10">
              {/* 1열: 교시 (고정) */}
              <div className="w-12 flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-sm rounded-l-lg border-y border-l border-slate-200">
                {idx + 1}
              </div>
              
              {/* 2열: 과목 (표시 or 수정) */}
              <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-r-lg px-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(idx, e.target.value)}
                    className="w-full text-sm font-medium text-slate-700 outline-none bg-transparent placeholder-slate-300"
                    placeholder="과목 입력"
                  />
                ) : (
                  <span className={`text-sm font-semibold ${subject ? 'text-slate-700' : 'text-slate-300'}`}>
                    {subject || "(없음)"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 수정 모드 하단 버튼 (저장/취소) */}
      {isEditing && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100">
          <button 
            onClick={() => { setIsEditing(false); fetchTimetable(classInfo); }} 
            className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            취소
          </button>
          <button 
            onClick={saveSchedule} 
            className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1"
          >
            <Save size={14} /> 저장하기
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 학년/반 설정 모달 */}
      {/* ---------------------------------------------------------- */}
      {isSetting && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">학년 / 반 설정</h3>
          <div className="flex gap-2 w-full mb-4">
            <input 
              type="number" 
              value={classInfo.grade}
              onChange={(e) => setClassInfo({...classInfo, grade: e.target.value})}
              placeholder="학년"
              className="flex-1 p-2 border rounded text-center outline-none focus:border-indigo-500"
            />
            <input 
              type="number" 
              value={classInfo.classNm}
              onChange={(e) => setClassInfo({...classInfo, classNm: e.target.value})}
              placeholder="반"
              className="flex-1 p-2 border rounded text-center outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={() => setIsSetting(false)} className="flex-1 py-2 text-slate-500 bg-slate-100 rounded hover:bg-slate-200 font-bold text-sm">취소</button>
            <button onClick={saveClassInfo} className="flex-1 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 font-bold text-sm">확인</button>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            나이스(NEIS) 정보를 불러오기 위해<br/>정확한 학년/반을 입력해주세요.
          </p>
        </div>
      )}

    </div>
  );
};

export default Timetable;