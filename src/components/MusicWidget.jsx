import React, { useState } from 'react';
import { Music, Play, ListMusic } from 'lucide-react';

const MusicWidget = () => {
  // 기본값: 지브리 스튜디오 OST (안정적인 ID 사용)
  const [videoSrc, setVideoSrc] = useState("https://www.youtube.com/embed/ByXbDNG2JRg");
  const [inputUrl, setInputUrl] = useState("");

  // 프리셋 목록 (선생님들이 자주 쓰는 추천 영상)
  const presets = [
    { name: "🎵 아침 클래식", id: "k1-TrCufqXY" }, // 쇼팽
    { name: "☕ 스타벅스 Jazz", id: "Dx5qFachd3A" },
    { name: "📚 집중 Lofi", id: "jfKfPfyJRdk" },
    { name: "🎹 지브리 OST", id: "ByXbDNG2JRg" }
  ];

  // 유튜브 URL에서 영상 ID 추출하는 함수
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePlay = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(inputUrl);
    if (videoId) {
      setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
      setInputUrl(""); // 입력창 초기화
    } else {
      alert("올바른 유튜브 주소를 입력해주세요.\n(예: https://www.youtube.com/watch?v=...)");
    }
  };

  const playPreset = (id) => {
    setVideoSrc(`https://www.youtube.com/embed/${id}?autoplay=1`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
        <Music className="text-rose-500" size={20} /> DJ 선생님
      </h2>
      
      {/* 1. 주소 입력창 */}
      <form onSubmit={handlePlay} className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="유튜브 링크(URL)를 붙여넣으세요" 
          className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          className="bg-rose-500 hover:bg-rose-600 text-white px-3 rounded-lg transition flex items-center gap-1"
        >
          <Play size={14} fill="currentColor" /> 재생
        </button>
      </form>

      {/* 2. 프리셋 버튼들 */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => playPreset(preset.id)}
            className="flex-none px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-full transition whitespace-nowrap border border-rose-100"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* 3. 플레이어 화면 */}
      <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
        <iframe 
          width="100%" 
          height="100%" 
          src={videoSrc} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
};

export default MusicWidget;