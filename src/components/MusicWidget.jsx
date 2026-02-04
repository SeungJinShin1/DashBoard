import React, { useState } from 'react';
import { Music, Search } from 'lucide-react';

const MusicWidget = () => {
  // 기본값: 아침에 듣기 좋은 클래식 검색 결과
  const [keyword, setKeyword] = useState("아침에 듣기 좋은 클래식");
  const [videoSrc, setVideoSrc] = useState("https://www.youtube.com/embed?listType=search&list=아침에 듣기 좋은 클래식");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    // 유튜브 검색 결과 리스트 임베드 URL 생성
    setVideoSrc(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
        <Music className="text-rose-500" size={20} /> DJ 선생님
      </h2>
      
      {/* 검색창 */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="듣고 싶은 노래 검색" 
          className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button 
          type="submit" 
          className="bg-rose-500 hover:bg-rose-600 text-white px-3 rounded-lg transition"
        >
          <Search size={16} />
        </button>
      </form>

      {/* 유튜브 플레이어 (iframe) */}
      <div className="flex-1 rounded-xl overflow-hidden bg-black border border-slate-200">
        <iframe 
          width="100%" 
          height="100%" 
          src={videoSrc} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MusicWidget;