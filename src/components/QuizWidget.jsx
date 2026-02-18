import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { generateQuiz } from '../services/gemini'; // Correct import

const QuizWidget = () => { // Removed geminiKey prop
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGen = async () => { 
    if (!topic) return; 
    setLoading(true); 
    setQuiz(""); // 기존 내용 초기화
    const res = await generateQuiz(topic); // Call without apiKey argument
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