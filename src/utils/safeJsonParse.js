export const safeJsonParse = (text) => {
  if (!text || typeof text !== 'string') return null;
  
  try {
    return JSON.parse(text);
  } catch (error) {
    try {
      // Extract the JSON object or array from the markdown-wrapped or messy text
      const firstBrace = text.indexOf('{');
      const firstBracket = text.indexOf('[');
      
      let startIdx = firstBrace;
      if (firstBrace === -1) startIdx = firstBracket;
      else if (firstBracket !== -1 && firstBracket < firstBrace) startIdx = firstBracket;

      if (startIdx !== -1) {
        const lastBrace = text.lastIndexOf('}');
        const lastBracket = text.lastIndexOf(']');
        
        let endIdx = lastBrace;
        if (lastBrace === -1) endIdx = lastBracket;
        else if (lastBracket !== -1 && lastBracket > lastBrace) endIdx = lastBracket;

        if (endIdx !== -1 && endIdx > startIdx) {
          const jsonString = text.substring(startIdx, endIdx + 1);
          // Also handle cases where AI might include literal unescaped control characters
          // which JSON.parse rejects natively.
          const sanitizedString = jsonString
            .replace(/[\u0000-\u0019]+/g, ''); // Remove most unescaped control chars if any

          return JSON.parse(sanitizedString);
        }
      }
      throw new Error("Could not find valid JSON boundaries");
    } catch (innerError) {
      console.error("Invalid AI JSON:", text);
      return null;
    }
  }
};