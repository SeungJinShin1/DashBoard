import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const callGeminiApi = async (prompt, apiKey) => {
  // API 키가 없는 경우 명확한 에러 메시지
  if (!apiKey) return "설정된 API 키가 없습니다. .env 파일을 확인해주세요.";
  
  try {
    const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    
    // API 에러 응답 처리
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `오류가 발생했습니다: ${data.error.message}`;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 응답을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini Network Error:", error);
    return "네트워크 오류가 발생했습니다.";
  }
};

const generateQuiz = async (topic, apiKey) => {
  const prompt = `초등학생을 위한 [${topic}] 관련 퀴즈 3문제를 만들어주세요. 형식: Q1. 문제... A. 보기... 정답: 정답.`;
  return callGeminiApi(prompt, apiKey);
};

const QuizWidget = ({ geminiKey }) => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGen = async () => { 
    if (!topic) return; 
    setLoading(true); 
    setQuiz(""); // 기존 내용 초기화
    const res = await generateQuiz(topic, geminiKey); 
    setQuiz(res); 
    setLoading(false); 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
        <BrainCircuit className="text-pink-500" size={20} /> AI 틈새 퀴즈
      </h2>
      <div className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={topic} 
          onChange={e => setTopic(e.target.value)} 
          placeholder="주제 (예: 구구단, 한국사)" 
          className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-400" 
          onKeyPress={(e) => e.key === 'Enter' && handleGen()}
        />
        <button 
          onClick={handleGen} 
          disabled={loading} 
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 rounded-lg text-sm transition disabled:bg-pink-300"
        >
          {loading ? "..." : "생성"}
        </button>
      </div>
      <div className="flex-1 bg-pink-50 rounded-xl p-4 overflow-y-auto max-h-40 border border-pink-100">
        <pre className="whitespace-pre-wrap text-slate-700 text-sm font-medium font-sans">
          {quiz || "자투리 시간에 아이들과 퀴즈를 풀어보세요!"}
        </pre>
      </div>
    </div>
  );
};

export default QuizWidget;