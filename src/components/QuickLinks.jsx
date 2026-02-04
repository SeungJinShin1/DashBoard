import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Settings, Plus, Trash2, X, ExternalLink } from 'lucide-react';

const QuickLinks = () => {
  // 1. 업무포털 메인 버튼 상태
  const [portalUrl, setPortalUrl] = useState("");
  const [isEditingPortal, setIsEditingPortal] = useState(false);

  // 2. 커스텀 링크 그리드 상태
  const [links, setLinks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", url: "" });

  // 초기 데이터 로드
  useEffect(() => {
    // 업무포털 주소 불러오기
    const savedPortal = localStorage.getItem("portalUrl");
    if (savedPortal) setPortalUrl(savedPortal);

    // 커스텀 링크 불러오기
    const savedLinks = localStorage.getItem("customLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      // 초기값이 없을 때 기본 추천 링크 제공
      const defaults = [
        { id: 1, name: "아이스크림", url: "https://www.i-scream.co.kr" },
        { id: 2, name: "인디스쿨", url: "https://www.indischool.com" }
      ];
      setLinks(defaults);
      // 저장하지는 않음 (사용자가 지우고 싶을 수 있으므로 state에만 반영하고, 수정 발생 시 저장)
    }
  }, []);

  // --- 업무포털 관련 함수 ---
  const savePortal = () => {
    let u = portalUrl.trim();
    if (u && !u.startsWith('http')) u = 'https://' + u;
    localStorage.setItem("portalUrl", u);
    setPortalUrl(u);
    setIsEditingPortal(false);
  };

  const handleMainClick = (e) => {
    if (!portalUrl) {
      e.preventDefault();
      setIsEditingPortal(true);
    }
  };

  // --- 커스텀 링크 CRUD 함수 ---
  
  // 링크 추가 (Create)
  const addLink = () => {
    if (!newLink.name || !newLink.url) return alert("이름과 주소를 모두 입력해주세요.");
    
    let u = newLink.url.trim();
    if (u && !u.startsWith('http')) u = 'https://' + u;

    const updatedLinks = [
      ...links, 
      { id: Date.now(), name: newLink.name, url: u }
    ];

    setLinks(updatedLinks);
    localStorage.setItem("customLinks", JSON.stringify(updatedLinks));
    
    setNewLink({ name: "", url: "" });
    setIsAdding(false);
  };

  // 링크 삭제 (Delete)
  const deleteLink = (e, id) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation();
    
    if (window.confirm("이 바로가기를 삭제하시겠습니까?")) {
      const updatedLinks = links.filter(link => link.id !== id);
      setLinks(updatedLinks);
      localStorage.setItem("customLinks", JSON.stringify(updatedLinks));
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white h-full flex flex-col">
      {/* 타이틀 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <LinkIcon size={20} /> 빠른 바로가기
        </h2>
        {/* 링크 추가 버튼 (최대 4개 제한) */}
        {links.length < 4 && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition"
          >
            <Plus size={12} /> 추가
          </button>
        )}
      </div>
      
      {/* 1. 업무포털 메인 버튼 (가장 큰 버튼) */}
      <div className="relative group mb-4">
        <a 
          href={portalUrl || "#"} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleMainClick}
          className={`block w-full text-center py-3 rounded-xl font-bold shadow-md transition border-2 border-transparent
            ${portalUrl 
              ? 'bg-white text-indigo-600 hover:bg-indigo-50' 
              : 'bg-white/10 text-white border-dashed border-white/40 cursor-pointer hover:bg-white/20'
            }
          `}
        >
          {portalUrl ? "업무포털 접속하기" : "+ 업무포털 주소 설정"}
        </a>
        
        {/* 설정 버튼 */}
        <button 
          onClick={() => setIsEditingPortal(!isEditingPortal)} 
          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-indigo-600 bg-transparent hover:bg-white rounded-full transition opacity-0 group-hover:opacity-100"
          title="주소 수정"
        >
          <Settings size={14}/>
        </button>

        {/* 업무포털 주소 입력창 */}
        {isEditingPortal && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white p-3 rounded-lg shadow-xl z-10 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-slate-500 mb-1">업무포털 주소 (예: neis.go.kr)</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={portalUrl} 
                onChange={e => setPortalUrl(e.target.value)} 
                className="flex-1 p-2 text-sm border rounded outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="https://..." 
              />
              <button onClick={savePortal} className="bg-indigo-600 text-white px-3 rounded text-sm hover:bg-indigo-700">저장</button>
            </div>
          </div>
        )}
      </div>

      {/* 2. 커스텀 링크 그리드 (최대 4개) */}
      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {links.map(link => (
          <a 
            key={link.id}
            href={link.url} 
            target="_blank" 
            rel="noreferrer" 
            className="relative flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition group backdrop-blur-sm border border-white/5 hover:border-white/20"
          >
            <ExternalLink size={16} className="mb-1 opacity-70" />
            <span className="text-sm font-medium truncate w-full text-center">{link.name}</span>
            
            {/* 삭제 버튼 (호버 시 표시) */}
            <button 
              onClick={(e) => deleteLink(e, link.id)}
              className="absolute top-1 right-1 p-1 text-white/40 hover:text-red-300 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition"
              title="삭제"
            >
              <Trash2 size={12} />
            </button>
          </a>
        ))}

        {/* 링크 추가 폼 (isAdding 상태일 때만 보임) */}
        {isAdding && (
          <div className="col-span-2 bg-white/95 p-3 rounded-xl text-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-indigo-600">새 바로가기 추가</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
            </div>
            <input 
              type="text" 
              placeholder="이름 (예: 구글)" 
              value={newLink.name}
              onChange={e => setNewLink({...newLink, name: e.target.value})}
              className="w-full p-1.5 text-xs border rounded mb-1.5 outline-none focus:border-indigo-500"
            />
            <input 
              type="text" 
              placeholder="URL (예: google.com)" 
              value={newLink.url}
              onChange={e => setNewLink({...newLink, url: e.target.value})}
              className="w-full p-1.5 text-xs border rounded mb-2 outline-none focus:border-indigo-500"
            />
            <button onClick={addLink} className="w-full py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 font-bold">
              등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickLinks;