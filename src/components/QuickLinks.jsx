const QuickLinks = () => {
    const [portalUrl, setPortalUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);
  
    useEffect(() => {
      const saved = localStorage.getItem("portalUrl");
      if (saved) setPortalUrl(saved);
    }, []);
  
    const saveUrl = () => {
      let url = portalUrl;
      if (url && !url.startsWith('http')) url = 'https://' + url;
      localStorage.setItem("portalUrl", url);
      setPortalUrl(url);
      setIsEditing(false);
    };
  
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white h-full flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white/90">
            <LinkIcon size={20} /> 빠른 바로가기
          </h2>
          
          <div className="relative group">
            <a 
              href={portalUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => !portalUrl && e.preventDefault()}
              className={`block w-full text-center py-4 rounded-xl font-bold text-lg mb-2 transition shadow-md
                ${portalUrl ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-white/20 text-white/50 cursor-not-allowed'}
              `}
            >
              {portalUrl ? "업무포털 접속하기" : "주소를 설정해주세요"}
            </a>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-500 bg-transparent rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Settings size={16} />
            </button>
          </div>
  
          {isEditing && (
            <div className="mb-4 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <input 
                type="text" 
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                placeholder="https://neis.cne.go.kr"
                className="w-full p-2 text-sm rounded text-slate-800 mb-2"
              />
              <button onClick={saveUrl} className="w-full py-1 bg-indigo-800 hover:bg-indigo-900 rounded text-sm transition">
                저장
              </button>
            </div>
          )}
        </div>
  
        <div className="grid grid-cols-2 gap-2 mt-2">
          <a href="https://www.i-scream.co.kr" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition backdrop-blur-sm">
             <ExternalLink size={14} /> 아이스크림
          </a>
          <a href="https://www.indischool.com" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition backdrop-blur-sm">
             <BookOpen size={14} /> 인디스쿨
          </a>
        </div>
      </div>
    );
  };

  export default QuickLinks;