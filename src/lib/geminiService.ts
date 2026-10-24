/**
 * Google Gemini Multimodal Vision Service for NetMetrik AI
 * Configured for gemini-3.8-flash with auto-migration retry.
 */

export interface GeminiResponse {
  success: boolean;
  text: string;
  error?: string;
  usedModel?: string;
  suggestion?: {
    type: 'task' | 'vault';
    title: string;
    subject: string;
    details: string;
  };
}

export function getGeminiApiKey(): string {
  const localKey = localStorage.getItem('netmetrik_gemini_api_key');
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

export function setGeminiApiKey(key: string): void {
  localStorage.setItem('netmetrik_gemini_api_key', key.trim());
  localStorage.removeItem('netmetrik_gemini_working_model');
}

export function removeGeminiApiKey(): void {
  localStorage.removeItem('netmetrik_gemini_api_key');
  localStorage.removeItem('netmetrik_gemini_working_model');
}

export function getCachedWorkingModel(): string {
  const cached = localStorage.getItem('netmetrik_gemini_working_model') || '';
  // Avoid deprecated 2.5
  if (cached.includes('gemini-2.5-flash')) {
    localStorage.removeItem('netmetrik_gemini_working_model');
    return '';
  }
  return cached;
}

export function setCachedWorkingModel(model: string): void {
  localStorage.setItem('netmetrik_gemini_working_model', model);
}

/**
 * Dynamically queries Google's ModelService to list supported generateContent models for this API key.
 */
export async function discoverAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.models)) return [];

    return data.models
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => m.name.replace(/^models\//, ''));
  } catch {
    return [];
  }
}

/**
 * Resolves the best available model for the user's API key.
 * Prioritizes gemini-3.8-flash as recommended by Google.
 */
export async function resolveBestModel(apiKey: string): Promise<string> {
  const cached = getCachedWorkingModel();
  if (cached) return cached;

  const discovered = await discoverAvailableModels(apiKey);
  if (discovered.length === 0) {
    // Default to Google's recommended gemini-3.8-flash
    return 'gemini-3.8-flash';
  }

  // Priority ranking for YKS question solving:
  // Google recommends gemini-3.8-flash for new users
  const priorityKeywords = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.0-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash'
  ];

  for (const prio of priorityKeywords) {
    const found = discovered.find(
      (m) => (m === prio || m.includes(prio)) && !m.toLowerCase().includes('tts') && !m.includes('2.5')
    );
    if (found) {
      setCachedWorkingModel(found);
      return found;
    }
  }

  // Pick first non-TTS and non-deprecated model
  const nonTts = discovered.find((m) => !m.toLowerCase().includes('tts') && !m.includes('2.5'));
  const choice = nonTts || 'gemini-3.8-flash';
  setCachedWorkingModel(choice);
  return choice;
}

/**
 * Sends prompt and optional image base64 to Gemini Vision API with automatic fallback.
 */
export async function askGeminiVision({
  prompt,
  imageDataUrl,
  studentName = 'Öğrenci',
  forcedModel
}: {
  prompt: string;
  imageDataUrl?: string | null;
  studentName?: string;
  forcedModel?: string;
}): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      text: '',
      error: 'NO_API_KEY'
    };
  }

  // System instructions tailored for YKS (TYT / AYT)
  const systemPrompt = `Sen NetMetrik AI'sın; YKS (TYT ve AYT) sınavına hazırlanan Türk öğrencilerine rehberlik eden, cana yakın, son derece bilgili ve uzman bir şampiyon YKS koçu ve öğretmenisin. Öğrencinin adı: ${studentName}.

GÖREVLERİN:
${
  imageDataUrl
    ? `1. GÖRSEL ANALİZİ (OCR & ŞEKİL): Görseldeki soruyu, şekilleri, grafikleri, formülleri ve şıkları dikkatle oku ve incele.
2. DERS & KONU: Sorunun hangi derse (örn. TYT Matematik, AYT Fizik, AYT Biyoloji, Geometri) ve hangi konuya ait olduğunu ilk satırda belirt.
3. ADIM ADIM ÇÖZÜM: Soruyu bir öğrencinin en rahat anlayacağı şekilde adım adım çöz. Formülleri LaTeX biçiminde ($$...$$ veya $...$) yaz.
4. DOĞRU CEVAP: Çözümün sonunda doğru şıkkı net ve kalın harflerle belirt (Örn: **Doğru Cevap: C Şıkkı**).
5. PÜF NOKTASI & ÇELDİRİCİ: ÖSYM tarzı bu soruda düşülebilecek çeldiriciyi veya soruyu 10 saniyede çözecek kestirme pratik taktiği ver.
6. HATA DEFTERİ ÖNERİSİ: Bu sorunun hata defterine eklenmeye değer olup olmadığını söyle.`
    : `1. Öğrencinin sorusunu veya çalışma talebini net, motive edici ve akademik olarak kusursuz bir şekilde yanıtla.
2. Matematik/Fen formüllerinde LaTeX formatını ($$...$$ veya $...$) kullan.
3. Yanıtında pratik YKS çalışma taktikleri, soru hedefi veya tekrar önerisi sun.`
}

Lütfen yanıtını temiz, okunaklı Markdown formatında ve Türkçe olarak ver.`;

  const parts: any[] = [{ text: `${systemPrompt}\n\nÖğrencinin Mesajı: ${prompt || (imageDataUrl ? 'Bu soruyu adım adım çözer misin?' : 'Merhaba')}` }];

  if (imageDataUrl) {
    const match = imageDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }
  }

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      topP: 0.95
    }
  };

  let modelToUse = forcedModel || (await resolveBestModel(apiKey));

  const executeCall = async (modelName: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  };

  try {
    let response = await executeCall(modelToUse);

    if (response.ok) {
      const data = await response.json();
      const candidate = data.candidates?.[0];
      const generatedText = candidate?.content?.parts?.map((p: any) => p.text).join('\n') || '';

      if (generatedText) {
        setCachedWorkingModel(modelToUse);

        let suggestion: GeminiResponse['suggestion'] = undefined;
        const textLower = generatedText.toLowerCase();

        if (imageDataUrl) {
          suggestion = {
            type: 'vault',
            title: 'Görsel Soru Çözümü',
            subject: textLower.includes('fizik')
              ? 'AYT Fizik'
              : textLower.includes('kimya')
              ? 'AYT Kimya'
              : textLower.includes('biyoloji')
              ? 'AYT Biyoloji'
              : textLower.includes('geometri')
              ? 'Geometri'
              : 'TYT/AYT Matematik',
            details: 'Gemini AI tarafından çözülen bu soruyu tekrar etmek üzere kaydet.'
          };
        } else if (textLower.includes('çöz') || textLower.includes('hedef') || textLower.includes('soru')) {
          suggestion = {
            type: 'task',
            title: 'Önerilen AI Çalışması',
            subject: textLower.includes('paragraf')
              ? 'TYT Türkçe'
              : textLower.includes('fizik')
              ? 'AYT Fizik'
              : 'TYT Matematik',
            details: 'Günün çalışma programına ekle.'
          };
        }

        return {
          success: true,
          text: generatedText,
          usedModel: modelToUse,
          suggestion
        };
      }
    }

    const errJson = await response.json().catch(() => ({}));
    const errMsg = errJson?.error?.message || `HTTP ${response.status}`;

    // Auto-migrate if Google explicitly suggests a model (like gemini-3.8-flash)
    if (errMsg.includes('use models/')) {
      const match = errMsg.match(/use models\/([a-zA-Z0-9.-]+)/);
      if (match && match[1] && match[1] !== modelToUse) {
        const recommendedModel = match[1];
        setCachedWorkingModel(recommendedModel);
        const retryRes = await executeCall(recommendedModel);
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          const candidate = retryData.candidates?.[0];
          const text = candidate?.content?.parts?.map((p: any) => p.text).join('\n') || '';
          if (text) {
            return {
              success: true,
              text,
              usedModel: recommendedModel
            };
          }
        }
      }
    }

    if (response.status === 429) {
      return {
        success: false,
        text: '',
        error: `Google Ücretsiz Plan İstek Sınırı (Rate Limit): Ücretsiz hesaplarda dakikalık soru sınırı (3 RPM) bulunur. Lütfen 15-20 saniye bekleyip tekrar deneyin.`
      };
    } else if (response.status === 400 || response.status === 403) {
      return {
        success: false,
        text: '',
        error: `API Yanıtı (${modelToUse}): ${errMsg}`
      };
    }

    return {
      success: false,
      text: '',
      error: `Gemini API Hatası (${modelToUse}): ${errMsg}`
    };
  } catch (err: any) {
    return {
      success: false,
      text: '',
      error: err?.message || 'İnternet bağlantısı veya API erişim hatası'
    };
  }
}
