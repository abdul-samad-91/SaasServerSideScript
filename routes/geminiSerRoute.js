const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyCwHvqQw5JKrNZHBp_kWU5pe15k7g74a_k" });

const blockedKeywords = ["harassment", "violence", "hack", "self-harm", "abuse", "love"];

function containsBlockedKeyword(input) {
  const lowerInput = input.toLowerCase();
  return blockedKeywords.some(keyword => lowerInput.includes(keyword));
}

async function geminiResponse(userQuery, restrictQuery = "answer all type of question") {
  try {
    if (containsBlockedKeyword(userQuery)) {
      return "Sorry, I'm not allowed to answer that question.";
    }

    const prompt = `You have to answer only questions related to: "${restrictQuery}". 
If the question is unrelated to ${restrictQuery}, respond: "This question is not related to ${restrictQuery}, so I cannot answer it."
Now answer briefly (in 3 lines max): ${userQuery}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanText = text
      .replace(/\n/g, " ")
      .replace(/\*/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
  }
}

module.exports = { geminiResponse };
