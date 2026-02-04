import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Settings, ExternalLink, BookOpen } from 'lucide-react';

const QuickLinks = () => {
  const [url, setUrl] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => { 
    const s = localStorage.getItem("portalUrl"); 
    if (s) setUrl(s); 
  }, []);

  const save = () => { 
    let u = url.trim();
    if (u && !u.startsWith('http')) u = 'https://' + u; 
    localStorage.setItem("portalUrl", u); 
    setUrl(u); 
    setEdit(false); 
  };

  const handleMainClick = (e) => {
    if (!url) {
      e.preventDefault();
      setEdit(true); // URL 없으면 설정창 열기
      alert("먼저 업무포털 주소를 설정해주세요!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <LinkIcon size={20} /> 빠른 바로가기
        </h2>
        
        <div className="relative group">
          <a 
            href={url || "#"} 
            target="_blank" 
            rel="noreferrer" 
            onClick={handleMainClick}
            className={`block w-full text-center py-4 rounded-xl font-bold mb-2 shadow-md transition
              ${url ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-white/20 text-white cursor-pointer hover:bg-white/30'}
            `}
          >
            {url ? "업무포털 접속" : "주소를 설정해주세요"}
          </a>
          
          {/* 설정 버튼 (항상 보이게 수정) */}
          <button 
            onClick={() => setEdit(!edit)} 
            className="absolute top-2 right-2 p-1.5 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition"
            title="주소 설정"
          >
            <Settings size={16}/>
          </button>
        </div>

        {edit && (
          <div className="mb-2 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">업무포털 주소 입력:</p>
            <input 
              type="text" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              className="w-full p-2 text-sm rounded text-slate-800 mb-2 border-none outline-none" 
              placeholder="예: neis.go.kr" 
            />
            <button onClick={save} className="w-full py-1.5 bg-indigo-800 hover:bg-indigo-900 rounded text-sm transition font-medium">
              저장하기
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <a href="https://www.i-scream.co.kr" target="_blank" rel="noreferrer" className="flex justify-center gap-2 p-3 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"><ExternalLink size={14}/> 아이스크림</a>
        <a href="https://www.indischool.com" target="_blank" rel="noreferrer" className="flex justify-center gap-2 p-3 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"><BookOpen size={14}/> 인디스쿨</a>
      </div>
    </div>
  );
};

export default QuickLinks;