const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const callGeminiApi = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");
  
  try {
    const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "AI 응답을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서버와 통신 중 오류가 발생했습니다.";
  }
};

const generateMorningSpeech = async (meal, routine, apiKey) => {
  const prompt = `
    당신은 쾌활하고 다정한 초등학교 선생님입니다.
    오늘의 급식 메뉴는 [${meal}]이고, 아침 활동 루틴은 [${routine}]입니다.
    
    이 정보를 바탕으로 학생들에게 해줄 3~4문장의 "활기찬 아침 조회 멘트"를 작성해주세요.
    
    조건:
    1. 한국어로 작성하세요.
    2. 반말(친근하게)과 존댓말(다정하게) 중 하나를 랜덤하게 선택해서 작성하세요.
    3. 이모지를 적절히 사용하여 아이들이 좋아하게 만들어주세요.
  `;
  return callGeminiApi(prompt, apiKey);
};

const generateQuiz = async (topic, apiKey) => {
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
  return callGeminiApi(prompt, apiKey);
};