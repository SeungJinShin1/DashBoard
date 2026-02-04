const SchoolSearch = ({ setSchoolInfo, neisKey }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleSearch = async (e) => {
      e.preventDefault();
      setLoading(true);
      const data = await searchSchool(query, neisKey);
      setResults(data);
      setLoading(false);
    };
  
    const selectSchool = (school) => {
      const info = {
        name: school.SCHUL_NM,
        code: school.SD_SCHUL_CODE,
        office: school.ATPT_OFCDC_SC_CODE,
        address: school.ORG_RDNMA
      };
      setSchoolInfo(info);
      localStorage.setItem("mySchool", JSON.stringify(info));
      setResults([]);
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Search size={20} className="text-blue-500" /> 학교 설정
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="학교명을 입력하세요 (예: 서울초등)"
            className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "검색" : "검색"}
          </button>
        </form>
        
        <div className="overflow-y-auto max-h-60">
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((school) => (
                <li 
                  key={school.SD_SCHUL_CODE}
                  onClick={() => selectSchool(school)}
                  className="p-3 bg-slate-50 hover:bg-blue-50 cursor-pointer rounded-lg transition border border-slate-100"
                >
                  <div className="font-semibold text-slate-800">{school.SCHUL_NM}</div>
                  <div className="text-xs text-slate-500">{school.ORG_RDNMA}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center text-sm py-4">학교를 검색하여 등록해주세요.</p>
          )}
        </div>
      </div>
    );
  };

  export default SchoolSearch;