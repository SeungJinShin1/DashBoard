const callGeminiApi = async (prompt) => {
  try {
    // Vercel 배포 환경에서는 같은 도메인의 /api/gemini를 사용합니다.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${backendUrl}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API Proxy Error:", data.error);
      return `Proxy Error: ${data.error.message || data.error}`;
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "AI 응답을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Call Error:", error);
    return "AI 서버와 통신 중 오류가 발생했습니다.";
  }
};

export const generateMorningSpeech = async (meal, routine) => {
  const prompt = `
    당신은 쾌활하고 다정한 초등학교 선생님입니다.
    오늘의 급식 메뉴는 [${meal}]이고, 아침 활동 루틴은 [${routine}]입니다.
    
    이 정보를 바탕으로 학생들에게 해줄 3~4문장의 "활기찬 아침 조회 멘트"를 작성해주세요.
    
    조건:
    1. 한국어로 작성하세요.
    2. 반말(친근하게)과 존댓말(다정하게) 중 하나를 랜덤하게 선택해서 작성하세요.
    3. 이모지를 적절히 사용하여 아이들이 좋아하게 만들어주세요.
  `;
  return callGeminiApi(prompt);
};

export const generateQuiz = async (topic) => {
  const prompt = `
    초등학생을 위한 [${topic}] 관련 퀴즈 3문제를 만들어주세요.
    
    형식:
    Q1. [문제]
    A. [보기1]  B. [보기2]  C. [보기3]
    정답: [정답]

    조건:
    1. 아이들이 흥미를 가질 만한 내용이어야 합니다.
    2. 3지선다형 객관식이나 OX 퀴즈로 섞어서 내주세요.
    3. 정답은 문제 바로 아래에 표시해주세요.
    4. 한국어로 작성하세요.
  `;
  return callGeminiApi(prompt);
};

export const generateQuote = async () => {
  const prompt = `초등학생들에게 꿈과 희망, 교훈을 줄 수 있는 짧은 명언이나 사자성어 1개를 추천해줘. 답변은 잡담 없이 오직 JSON 형식으로만 해줘: {"text": "명언 내용", "author": "인물 또는 출처"}`;
  return callGeminiApi(prompt);
};