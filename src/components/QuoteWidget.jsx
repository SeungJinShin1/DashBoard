import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const QuoteWidget = ({ geminiKey }) => {
  const [quote, setQuote] = useState({ 
    text: "오늘의 명언을 불러오는 중입니다...", 
    author: "AI 명언봇" 
  });
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    if (!geminiKey) {
      setQuote({ text: "API 키가 설정되지 않았습니다.", author: "시스템 알림" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${GEMINI_BASE_URL}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "초등학생들에게 꿈과 희망, 교훈을 줄 수 있는 짧은 명언이나 사자성어 1개를 추천해줘. 답변은 잡담 없이 오직 JSON 형식으로만 해줘: {\"text\": \"명언 내용\", \"author\": \"인물 또는 출처\"}"
            }]
          }]
        }),
      });

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // JSON 파싱 시도 (마크다운 코드블럭 제거)
      const jsonText = rawText.replace(/```json|```/g, "").trim();
      const parsedQuote = JSON.parse(jsonText);

      setQuote(parsedQuote);
    } catch (error) {
      console.error("Quote API Error:", error);
      // 에러 시 기본 명언 중 하나 랜덤 표시
      const fallbacks = [
        { text: "천 리 길도 한 걸음부터.", author: "노자" },
        { text: "실패는 성공의 어머니이다.", author: "에디슨" },
        { text: "중요한 것은 꺾이지 않는 마음.", author: "알려진 명언" }
      ];
      setQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [geminiKey]);

  return (
    <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-6 rounded-2xl shadow-lg text-white h-full flex flex-col justify-between relative overflow-hidden group">
      
      {/* 헤더: 아이콘 + 제목 + 새로고침 버튼 */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2 mb-2">
          <Quote size={24} className="opacity-80" />
          <h2 className="text-lg font-bold">오늘의 한마디</h2>
        </div>
        <button 
          onClick={fetchQuote} 
          disabled={loading}
          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition opacity-0 group-hover:opacity-100"
          title="새로운 명언 보기"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 px-2">
        <p className="text-xl font-bold leading-relaxed break-keep drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
          "{quote.text}"
        </p>
        <p className="text-sm mt-3 opacity-90 font-medium bg-white/20 px-3 py-1 rounded-full animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          - {quote.author} -
        </p>
      </div>

      {/* 장식용 배경 원 */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
};

export default QuoteWidget;