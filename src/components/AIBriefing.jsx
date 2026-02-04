import React, { useState } from 'react';

const AIBriefing = ({ schoolInfo, routine, geminiKey, neisKey }) => {
    const [briefing, setBriefing] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleGenerate = async () => {
      if (!schoolInfo) return alert("먼저 학교를 설정해주세요!");
      
      setLoading(true);
      setBriefing("");
      
      const meal = await getMealInfo(schoolInfo.office, schoolInfo.code, neisKey);
      const text = await generateMorningSpeech(meal, routine, geminiKey);
      
      let i = 0;
      const interval = setInterval(() => {
        setBriefing((prev) => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      
      setLoading(false);
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" /> AI 아침 조회 도우미
          </h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition
              ${loading ? 'bg-slate-400' : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200'}
            `}
          >
            {loading ? "생성 중..." : "오늘의 멘트 생성 ✨"}
          </button>
        </div>
  
        <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 min-h-[150px] overflow-y-auto">
          {briefing ? (
            <p className="text-slate-700 leading-8 text-lg whitespace-pre-line font-medium">
              {briefing}
            </p>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Sparkles size={40} className="mb-2 opacity-20" />
              <p>버튼을 누르면 급식과 루틴을 분석해 아침 조회 멘트를 만들어드려요!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default AIBriefing;