export const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid AI JSON:", text);
    return null;
  }
};