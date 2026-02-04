const MorningRoutine = ({ routine, setRoutine }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempRoutine, setTempRoutine] = useState(routine);
  
    const handleSave = () => {
      setRoutine(tempRoutine);
      localStorage.setItem("morningRoutine", tempRoutine);
      setIsEditing(false);
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
        <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2"><Coffee size={20} className="text-brown-500" /> 아침 루틴 활동</span>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition"
          >
            {isEditing ? "저장" : "수정"}
          </button>
        </h2>
        
        {isEditing ? (
          <textarea
            value={tempRoutine}
            onChange={(e) => setTempRoutine(e.target.value)}
            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            placeholder="예: 독서 10분, 사물함 정리..."
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="w-full h-32 p-4 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition flex items-center justify-center text-center"
          >
            <p className="text-slate-700 font-medium text-lg whitespace-pre-wrap">
              {routine || "아침 활동 내용을 입력해주세요."}
            </p>
          </div>
        )}
      </div>
    );
  };