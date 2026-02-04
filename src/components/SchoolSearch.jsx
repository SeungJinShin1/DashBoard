import React, { useState } from 'react';
import { Search } from 'lucide-react';

const NEIS_BASE_URL = "https://open.neis.go.kr/hub";

const searchSchool = async (schoolName, apiKey) => {
  if (!schoolName) return [];
  // KEY 파라미터는 있으면 넣고, 없으면 뺍니다. (없어도 기본 호출은 가능)
  const keyParam = apiKey ? `&KEY=${apiKey}` : '';
  
  try {
    const url = `${NEIS_BASE_URL}/schoolInfo?Type=json&pIndex=1&pSize=10&SCHUL_NM=${encodeURIComponent(schoolName)}${keyParam}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // NEIS API 에러 처리 (결과 없음 등)
    if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
      console.log("검색 결과 없음:", data.RESULT.MESSAGE);
      return [];
    }

    if (data.schoolInfo && data.schoolInfo[1]) {
      return data.schoolInfo[1].row;
    }
    return [];
  } catch (error) {
    console.error("School Search Error:", error);
    return [];
  }
};

const SchoolSearch = ({ setSchoolInfo, neisKey }) => {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleSearch = async (e) => { 
    e.preventDefault(); 
    if(!query.trim()) return;

    setIsSearching(true);
    setMessage("");
    const data = await searchSchool(query, neisKey);
    setList(data);
    if(data.length === 0) setMessage("검색 결과가 없습니다.");
    setIsSearching(false);
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Search size={20} className="text-blue-500" /> 학교 설정
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="학교명 (예: 서울초등)" 
          className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 rounded-lg text-sm hover:bg-blue-600 transition"
          disabled={isSearching}
        >
          {isSearching ? "..." : "검색"}
        </button>
      </form>
      
      <div className="overflow-y-auto flex-1 space-y-2 max-h-60">
        {message && <p className="text-center text-sm text-slate-400 py-4">{message}</p>}
        
        {list.map(s => (
          <div 
            key={s.SD_SCHUL_CODE} 
            onClick={() => { 
              const info = { name: s.SCHUL_NM, code: s.SD_SCHUL_CODE, office: s.ATPT_OFCDC_SC_CODE };
              setSchoolInfo(info); 
              localStorage.setItem("mySchool", JSON.stringify(info)); 
              setList([]); 
            }} 
            className="p-3 hover:bg-slate-50 cursor-pointer border border-slate-100 rounded-lg text-sm transition"
          >
            <div className="font-bold text-slate-800">{s.SCHUL_NM}</div>
            <div className="text-xs text-slate-500 mt-1">{s.ORG_RDNMA}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolSearch;