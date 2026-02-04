const MealWidget = ({ schoolInfo, neisKey }) => {
    const [meal, setMeal] = useState("로딩 중...");
  
    useEffect(() => {
      if (schoolInfo) {
        getMealInfo(schoolInfo.office, schoolInfo.code, neisKey).then(setMeal);
      }
    }, [schoolInfo, neisKey]);
  
    if (!schoolInfo) return null;
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
        <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Utensils size={20} className="text-green-500" /> 오늘의 맛있는 급식
        </h2>
        <div className="flex-1 flex items-center justify-center bg-green-50 rounded-xl p-4">
          <p className="text-slate-700 font-medium text-center leading-relaxed">
            {meal}
          </p>
        </div>
        <p className="text-xs text-right text-slate-400 mt-2">{schoolInfo.name}</p>
      </div>
    );
  };

  export default MealWidget;