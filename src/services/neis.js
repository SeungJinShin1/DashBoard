const NEIS_BASE_URL = "https://open.neis.go.kr/hub";

const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (1 + date.getMonth())).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
};

export const searchSchool = async (schoolName, apiKey) => {
  if (!schoolName) return [];
  const keyParam = apiKey ? `&KEY=${apiKey}` : '';
  
  try {
    const response = await fetch(
      `${NEIS_BASE_URL}/schoolInfo?Type=json&pIndex=1&pSize=10&SCHUL_NM=${encodeURIComponent(schoolName)}${keyParam}`
    );
    const data = await response.json();
    if (data.schoolInfo) {
      return data.schoolInfo[1].row;
    }
    return [];
  } catch (error) {
    console.error("NEIS School Search Error:", error);
    return [];
  }
};

export const getMealInfo = async (officeCode, schoolCode, apiKey) => {
  const dateStr = getTodayString();
  const keyParam = apiKey ? `&KEY=${apiKey}` : '';

  try {
    const response = await fetch(
      `${NEIS_BASE_URL}/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${dateStr}${keyParam}`
    );
    const data = await response.json();
    
    if (data.mealServiceDietInfo) {
      const rawMenu = data.mealServiceDietInfo[1].row[0].DDISH_NM;
      const cleanMenu = rawMenu
        .replace(/<br\/>/g, ", ")
        .replace(/[0-9]+\./g, "") 
        .replace(/\./g, "");      
      return cleanMenu;
    }
    return "오늘 급식 정보가 없습니다.";
  } catch (error) {
    console.error("NEIS Meal Error:", error);
    return "급식 정보를 불러올 수 없습니다.";
  }
};