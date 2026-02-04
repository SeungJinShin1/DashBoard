const QuizWidget = ({ geminiKey }) => {
    const [topic, setTopic] = useState("");
    const [quiz, setQuiz] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleCreateQuiz = async () => {
      if (!topic) return;
      setLoading(true);
      const result = await generateQuiz(topic, geminiKey);
      setQuiz(result);
      setLoading(false);
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
        <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
          <BrainCircuit size={20} className="text-pink-500" /> AI 틈새 퀴즈
        </h2>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="주제 (예: 5학년 역사, 구구단)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateQuiz()}
            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
          />
          <button 
            onClick={handleCreateQuiz}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 rounded-lg text-sm transition"
          >
            {loading ? "..." : "생성"}
          </button>
        </div>
        <div className="flex-1 bg-pink-50 rounded-xl p-4 overflow-y-auto max-h-60 text-sm whitespace-pre-wrap text-slate-700 border border-pink-100">
          {quiz || (
            <div className="text-slate-400 text-center mt-4">
              <p>자투리 시간이 남았나요?</p>
              <p>주제를 입력하면 퀴즈를 만들어드려요!</p>
            </div>
          )}
        </div>
      </div>
    );
  };