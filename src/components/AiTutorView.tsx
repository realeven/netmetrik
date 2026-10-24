import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Flame,
  History,
  Plus,
  Paperclip,
  PenTool,
  Mic,
  MicOff,
  Send,
  X,
  Copy,
  Check,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Bot,
  Key,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../lib/sound';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  removeGeminiApiKey,
  askGeminiVision,
  getCachedWorkingModel
} from '../lib/geminiService';
import type { StudentProfile } from '../data/seedData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionableSuggestion?: {
    type: 'task' | 'vault';
    title: string;
    subject: string;
    details: string;
  };
  attachedImageUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

const DEFAULT_INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Türev ve Geometrik Yorum',
    date: 'Dün 23:45',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        text: 'Türevde teğetin eğimi ile normalin eğimi arasındaki ilişki neydi?',
        timestamp: '23:45'
      },
      {
        id: 'm-2',
        sender: 'ai',
        text: 'Harika bir soru! 📐 Bir fonksiyonun x = a noktasındaki teğetinin eğimi **m_t = f\'(a)** değerine eşittir.\n\nTeğet ve normal doğruları birbirine **dik** olduğu için eğimleri çarpımı -1\'dir:\n\n$$\\mathbf{m_t \\cdot m_n = -1} \\implies \\mathbf{m_n = -\\frac{1}{m_t}}$$\n\nÖSYM AYT Matematik\'te teğet denklemi sorularında bu kural her yıl garanti 1 soru getirir!',
        timestamp: '23:46'
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'Paragraf Hız ve Tempo Taktikleri',
    date: '18 Eki',
    messages: [
      {
        id: 'm-3',
        sender: 'user',
        text: 'TYT Türkçe paragrafta süre yetiştiremiyorum, ne yapmalıyım?',
        timestamp: '15:20'
      },
      {
        id: 'm-4',
        sender: 'ai',
        text: 'Paragraf kondisyonu için en kritik 3 kural:\n\n1. **Önce Soru Kökü:** Soru kökünü ve altı çizili ifadeyi okuyup beynini neyi arayacağına şartla.\n2. **Kendi Fikrini Katma:** Metinde yazmayan hiçbir bilgiye doğru muamelesi yapma.\n3. **Hız Antrenmanı:** Her gün 20 soruyu kronometreyle (soru başına 60-65 sn) blok çöz!',
        timestamp: '15:21'
      }
    ]
  }
];

export function AiTutorScreenView({
  profile,
  onAddTask,
  onAddVaultItem,
  isDesktop
}: {
  profile: StudentProfile;
  onAddTask?: (subjectCode: string, subjectName: string, topic: string, count: number, minutes: number) => void;
  onAddVaultItem?: (questionText: string, subjectName: string, topicName: string, correctSolution: string) => void;
  isDesktop?: boolean;
}) {
  // Chat Sessions in LocalStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('netmetrik_ai_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [energy, setEnergy] = useState<number>(() => {
    const saved = localStorage.getItem('netmetrik_ai_energy');
    return saved !== null ? Number(saved) : 46;
  });
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showMathPopover, setShowMathPopover] = useState(false);
  const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);

  // Real Google Gemini API Key State
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => getGeminiApiKey());
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [apiTestStatus, setApiTestStatus] = useState<{ loading: boolean; msg?: string; success?: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('netmetrik_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('netmetrik_ai_energy', String(energy));
  }, [energy]);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setGeminiApiKeyState(apiKeyInput.trim());
    sounds.playSuccess();
    setShowApiKeyModal(false);
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleRemoveApiKey = () => {
    removeGeminiApiKey();
    setGeminiApiKeyState('');
    setApiKeyInput('');
    setApiTestStatus(null);
    sounds.playClick();
  };

  const handleTestApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setApiTestStatus({ loading: true });
    setGeminiApiKey(apiKeyInput.trim());
    const res = await askGeminiVision({
      prompt: 'Merhaba, 1+1 kaç? Sadece cevabı ver.'
    });
    if (res.success) {
      setGeminiApiKeyState(apiKeyInput.trim());
      setApiTestStatus({ loading: false, success: true, msg: `Bağlantı başarılı! ${res.usedModel || 'Gemini 2.0 Flash'} aktif.` });
      sounds.playSuccess();
    } else {
      setApiTestStatus({ loading: false, success: false, msg: res.error || 'Bağlantı kurulamadı.' });
    }
  };

  // Current session messages
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const currentMessages = activeSession ? activeSession.messages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isThinking]);

  // Greeting based on time of day (Matches user's Knowunity screenshot!)
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.name ? profile.name.split(' ')[0] : 'Öğrenci';
    if (hour >= 23 || hour < 5) {
      return `Gece geç saatte ders mi ${name}? Hadi başlayalım.`;
    } else if (hour >= 5 && hour < 12) {
      return `Günaydın ${name}! Bugün hangi konuyu hallediyoruz?`;
    } else if (hour >= 12 && hour < 18) {
      return `İyi çalışmalar ${name}! Hangi dersten soru çözelim?`;
    } else {
      return `İyi akşamlar ${name}! Akşam hedeflerini tamamlayalım mı?`;
    }
  };

  const handleStartNewChat = () => {
    sounds.playClick();
    setActiveSessionId(null);
    setInputText('');
    setAttachedImagePreview(null);
  };

  const handleSelectSession = (id: string) => {
    sounds.playTabSwitch();
    setActiveSessionId(id);
    setShowHistoryDrawer(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  // Generate realistic YKS AI response
  const generateAiResponse = (query: string, hasImage: boolean): { text: string; suggestion?: ChatMessage['actionableSuggestion'] } => {
    const qLower = query.toLowerCase();

    if (hasImage) {
      return {
        text: `📸 **Görsel Algılandı ve İncelendi!**\n\n**Soru Özeti:** Görseldeki geometri üçgen sorusunda açıortay ve kenar oranları verilmiş.\n\n**Adım Adım Çözüm:**\n1. İç Açıortay Teoremi gereği: $\\frac{AB}{AC} = \\frac{BD}{DC}$\n2. Verilen oranları yerine yazarsak: $\\frac{6}{8} = \\frac{3}{x} \\implies 6x = 24$\n3. Buradan **x = 4 cm** olarak bulunur.\n\n**Cevap: B şıkkı (4)**\n\n> 💡 İpucu: Bu soruyu unutmamak için doğrudan Hata Defterine ekleyebilirsin!`,
        suggestion: {
          type: 'vault',
          title: 'İç Açıortay Kenar Bağıntısı',
          subject: 'Geometri',
          details: 'İç açıortay kenarları ayırdığı parçalarla orantılı böler.'
        }
      };
    }

    if (qLower.includes('türev') || qLower.includes('limit') || qLower.includes('integral')) {
      return {
        text: `📐 **AYT Matematik Çözümü:**\n\n**Kritik Kural:**\n$$f(x) = x^n \\implies f'(x) = n \\cdot x^{n-1}$$\n$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$\n\nÖnemli Püf Nokta: Çarpımın türevinde birinci türevi çarpı ikinci + birinci çarpı ikincinin türevi kuralını asla unutma!\n$$[u \\cdot v]' = u'v + uv'$$`,
        suggestion: {
          type: 'task',
          title: 'Türev Alma Kuralları',
          subject: 'AYT Matematik',
          details: 'Türevden 25 soru hız testi yap.'
        }
      };
    }

    if (qLower.includes('fizik') || qLower.includes('vektör') || qLower.includes('kuvvet')) {
      return {
        text: `⚡ **AYT Fizik Analizi:**\n\nVektörler bileşenlerine ayrılırken açıya komşu olan bileşen daima **Kosinüs** ile, karşı bileşen ise **Sinüs** ile çarpılır:\n\n$$F_x = F \\cdot \\cos(\\alpha)$$\n$$F_y = F \\cdot \\sin(\\alpha)$$\n\nÖSYM Bağıl Hareket sorularında formül: $$\\vec{V}_{bağıl} = \\vec{V}_{gözlenen} - \\vec{V}_{gözlemci}$$\n("Bakan göz çıkarılır!" kuralını aklında tut).`,
        suggestion: {
          type: 'task',
          title: 'Vektörler ve Bağıl Hareket',
          subject: 'AYT Fizik',
          details: 'Bileşenlere ayırma ve bağıl hız testleri.'
        }
      };
    }

    if (qLower.includes('program') || qLower.includes('plan') || qLower.includes('saat')) {
      return {
        text: `📅 **Senin İçin Hazırlanan Özel 2 Saatlik Çalışma Bloğu:**\n\n- **1. Blok (50 dk):** TYT Matematik Problemler (25 Soru Odaklanma)\n- **Mola (10 dk):** Ekrandan uzaklaş, su iç ve gözlerini dinlendir.\n- **2. Blok (50 dk):** AYT Fizik / Kimya Konu Tekrarı + Soru Çözümü (20 Soru)\n- **Kapanış (10 dk):** Yanlış çözülen 2 soruyu Hata Defterine not al.\n\nBu programı günlük görev listene eklemek ister misin?`,
        suggestion: {
          type: 'task',
          title: 'Özel 2 Saatlik AI Odaklanma Seansı',
          subject: 'TYT Matematik',
          details: '2 blok x 50 dk odaklanma çalışması.'
        }
      };
    }

    if (qLower.includes('moral') || qLower.includes('motivasyon') || qLower.includes('yoruldum')) {
      return {
        text: `🔥 **Unutma ${profile?.name || 'Şampiyon'}:**\n\nEn zorlandığın, masadan kalkmak istediğin anlar aslında rakiplerinle arayı en çok açtığın anlardır.\n\nŞu an gösterdiğin sabır ve çözdüğün her tek soru, sınav günü hayal ettiğin üniversitenin amfisinde otururken sana "İyi ki pes etmemişim" dedirtecek.\n\nDerin bir nefes al, hedefini hatırla ve sadece sıradaki soruya odaklan. Sen bunu başaracak güçtesin! 💪`
      };
    }

    return {
      text: `💡 **NetMetrik AI Yanıtı:**\n\n"${query}" konulu sorun için pratik çözüm yöntemi:\n\n1. Soru kökünü dikkatlice oku ve verilen parametreleri kenara not et.\n2. Formülü uygulamadan önce birim uyumuna dikkat et.\n3. Yanlış yaptığın noktayı tespit ettiğinde Hata Defteri aralıklı tekrar algoritmasına ekle!\n\nBaşka bir soruyu çözmemi veya konu anlatmamı ister misin?`
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    const currentImg = attachedImagePreview;
    if (!text && !currentImg) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || 'Görseldeki soruyu adım adım çözer misin?',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      attachedImageUrl: currentImg || undefined
    };

    let targetSessionId = activeSessionId;
    if (!targetSessionId) {
      const newId = `chat-${Date.now()}`;
      const newSessionTitle = text.slice(0, 30) || (currentImg ? 'Görsel Soru Çözümü' : 'YKS Koçluk');
      const newSession: ChatSession = {
        id: newId,
        title: newSessionTitle,
        date: 'Bugün',
        messages: [userMsg]
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newId);
      targetSessionId = newId;
    } else {
      setSessions((prev) =>
        prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, userMsg] } : s))
      );
    }

    setInputText('');
    setAttachedImagePreview(null);
    setIsThinking(true);
    setEnergy((prev) => Math.max(0, prev - 1));

    const apiKey = getGeminiApiKey();

    if (apiKey) {
      try {
        const studentName = profile?.name ? profile.name.split(' ')[0] : 'Öğrenci';
        const res = await askGeminiVision({
          prompt: text,
          imageDataUrl: currentImg,
          studentName
        });

        if (res.success) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: res.text,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            actionableSuggestion: res.suggestion
          };
          setSessions((prev) =>
            prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
          );
        } else {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ **Google Gemini API Yanıtı:**\n\n${res.error}\n\nLütfen sağ üstteki **Gemini Key** butonuna tıklayarak API anahtarını kontrol et veya yenile.`,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          };
          setSessions((prev) =>
            prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
          );
        }
      } catch (err: any) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Bağlantı Hatası:** ${err?.message || 'İstek gönderilemedi.'}`,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        setSessions((prev) =>
          prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
        );
      } finally {
        setIsThinking(false);
        sounds.playSuccess();
      }
    } else {
      // No API key configured
      setTimeout(() => {
        let responseText = '';
        if (currentImg) {
          responseText = `📸 **Soru Görseli Alındı!**\n\nYüklediğin soru fotoğrafının üzerindeki yazıları, şekilleri ve şıkları **Google Gemini 1.5 Flash Vision** ile sıfır hatayla okuyup çözebilmem için ücretsiz Gemini API anahtarı eklemen gerekiyor.\n\n🔑 **Nasıl Alınır? (30 Saniye & %100 Ücretsiz):**\n1. [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/app/apikey) sayfasına git.\n2. **"Create API Key"** butonuna bas ve anahtarını kopyala.\n3. Sağ üstteki **🔑 Gemini Key** butonuna tıklayıp yapıştır!\n\n*(Anahtarın yalnızca senin tarayıcında saklanır ve ücretsiz kotası YKS hazırlığı için fazlasıyla yeterlidir).*`;
        } else {
          responseText = generateAiResponse(text, false).text;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          actionableSuggestion: currentImg ? undefined : generateAiResponse(text, false).suggestion
        };

        setSessions((prev) =>
          prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
        );
        setIsThinking(false);
        sounds.playSuccess();

        if (currentImg) {
          setShowApiKeyModal(true);
        }
      }, 900);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    sounds.playClick();
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Voice Query Simulator
  const handleToggleVoice = () => {
    if (isVoiceListening) {
      setIsVoiceListening(false);
    } else {
      sounds.playClick();
      setIsVoiceListening(true);
      // Simulated voice recognition transcription after 2.5s
      setTimeout(() => {
        setIsVoiceListening(false);
        setInputText('TYT Matematik problemlerinde hızlanmak için ne yapmalıyım?');
        sounds.playSuccess();
      }, 2500);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImagePreview(event.target?.result as string);
        sounds.playClick();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop ? 'calc(100vh - 110px)' : 'calc(100vh - 120px)',
        position: 'relative',
        background: '#0D0E12',
        color: '#FFFFFF',
        overflow: 'hidden',
        borderRadius: isDesktop ? 20 : 0,
        border: isDesktop ? '1px solid var(--color-border)' : 'none'
      }}
    >
      {/* --------------------------------------------------------------------
          1. Header matching Knowunity AI (NetMetrik AI)
      -------------------------------------------------------------------- */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid #1E2028',
          background: '#111217',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.3,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>NetMetrik AI</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 99,
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(0, 240, 255, 0.25) 100%)',
                color: '#C084FC',
                border: '1px solid rgba(192, 132, 252, 0.35)'
              }}
            >
              YKS ASİSTAN
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Energy / Tokens pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#181A23',
              border: '1px solid #2B2E3D',
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 12.5,
              fontWeight: 800,
              color: '#38BDF8'
            }}
            title="Kalan AI Soru Çözme Kredisi"
          >
            <span>{energy}</span>
            <Zap size={14} color="#38BDF8" fill="#38BDF8" />
          </div>

          {/* Streak pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#181A23',
              border: '1px solid #2B2E3D',
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 12.5,
              fontWeight: 800,
              color: '#FFB800'
            }}
            title="Aktif Çalışma Serisi"
          >
            <span>{profile.currentStreak}</span>
            <Flame size={14} color="#FF9900" fill="#FF9900" />
          </div>

          {/* Gemini API Key Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowApiKeyModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: geminiApiKey ? 'rgba(0, 240, 255, 0.12)' : 'rgba(192, 132, 252, 0.15)',
              border: geminiApiKey ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid rgba(192, 132, 252, 0.4)',
              padding: '6px 13px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 800,
              color: geminiApiKey ? '#00F0FF' : '#C084FC',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Google Gemini 1.5 Flash Vision API Ayarları"
          >
            <Key size={13} />
            <span>{geminiApiKey ? '⚡ Gemini Aktif' : '🔑 Gemini Key'}</span>
          </button>

          {/* Chat History Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowHistoryDrawer(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#1E202B',
              border: '1px solid #2F3345',
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            <History size={14} color="#EF4444" />
            <span>Sohbet geçmişi</span>
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          2. Main Chat Workspace / Hero Mascot View
      -------------------------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: isDesktop ? '24px 36px' : '16px 16px',
          gap: 16
        }}
      >
        {currentMessages.length === 0 ? (
          /* Empty State: Knowunity Mascot & Personalized Greeting */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px 10px',
              maxWidth: 720,
              margin: '0 auto',
              animation: 'fadeIn 0.4s ease'
            }}
          >
            {/* Animated Purple Mascot Creature (Knowunity Style) */}
            <div
              style={{
                width: 140,
                height: 140,
                marginBottom: 20,
                position: 'relative',
                animation: 'mascotFloat 3.5s ease-in-out infinite'
              }}
            >
              <svg viewBox="0 0 160 160" width="100%" height="100%">
                <defs>
                  <linearGradient id="mascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333EA" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#7C3AED" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Mascot Body with pointy ears and cute arms */}
                <path
                  d="M 45 45 
                     C 42 20, 52 16, 58 35 
                     C 68 30, 92 30, 102 35 
                     C 108 16, 118 20, 115 45 
                     C 135 60, 142 85, 138 112 
                     C 134 135, 120 148, 108 138 
                     C 100 132, 94 136, 88 138 
                     C 80 140, 72 138, 68 134 
                     C 58 145, 38 140, 24 120 
                     C 18 95, 25 65, 45 45 Z"
                  fill="url(#mascotGrad)"
                  filter="url(#mascotGlow)"
                />

                {/* Little Feet / Drops */}
                <circle cx="45" cy="136" r="10" fill="#6D28D9" />
                <circle cx="115" cy="136" r="10" fill="#6D28D9" />

                {/* Big Expressive Cartoon Eyes */}
                {/* Left Eye */}
                <ellipse cx="62" cy="78" rx="14" ry="17" fill="#FFFFFF" />
                <ellipse cx="64" cy="74" rx="7.5" ry="9" fill="#111827" />
                <circle cx="67" cy="71" r="3.5" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="98" cy="78" rx="14" ry="17" fill="#FFFFFF" />
                <ellipse cx="100" cy="74" rx="7.5" ry="9" fill="#111827" />
                <circle cx="103" cy="71" r="3.5" fill="#FFFFFF" />

                {/* Cute Smile */}
                <path d="M 75 98 Q 80 104 85 98" stroke="#3730A3" strokeWidth="3" fill="transparent" strokeLinecap="round" />
              </svg>
            </div>

            {/* Time-Aware Headline */}
            <h2
              style={{
                fontSize: isDesktop ? 26 : 21,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: -0.5,
                lineHeight: 1.3,
                marginBottom: 20
              }}
            >
              {getGreeting()}
            </h2>

            {/* Quick Prompt Chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 8,
                maxWidth: 620
              }}
            >
              {[
                '📐 TYT Matematik Problem taktiği ver',
                '⚡ AYT Fizik Vektör ve Bağıl Hız özeti',
                '📅 Bugün için 2 saatlik odaklanma planı yap',
                '🔥 Moralim bozuk, bana motivasyon ver',
                '📖 Paragrafta hızlanmak için ne yapmalıyım?'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  style={{
                    background: '#161821',
                    border: '1px solid #272A38',
                    color: '#E2E8F0',
                    borderRadius: 99,
                    padding: '8px 16px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C084FC';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = '#202230';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#272A38';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#161821';
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div style={{ maxWidth: 840, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    maxWidth: isDesktop ? '78%' : '90%',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  {/* Sender Avatar */}
                  {msg.sender === 'ai' ? (
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 12px rgba(147, 51, 234, 0.4)'
                      }}
                    >
                      <Bot size={18} color="#FFFFFF" />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, #0099FF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontWeight: 900,
                        fontSize: 13,
                        flexShrink: 0
                      }}
                    >
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    style={{
                      background: msg.sender === 'user' ? 'rgba(0, 240, 255, 0.12)' : '#171922',
                      border: msg.sender === 'user' ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid #262938',
                      borderRadius: 18,
                      padding: '14px 18px',
                      color: '#F8FAFC',
                      fontSize: 14,
                      lineHeight: 1.6,
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {/* Attached Image if any */}
                    {msg.attachedImageUrl && (
                      <div style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid #333' }}>
                        <img src={msg.attachedImageUrl} alt="Yüklenen Soru" style={{ maxWidth: '100%', maxHeight: 220, display: 'block' }} />
                      </div>
                    )}

                    {msg.text}

                    {/* Actionable Suggestions (Task / Vault integration) */}
                    {msg.actionableSuggestion && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: 12,
                          borderRadius: 14,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--color-accent-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-accent)' }}>
                            {msg.actionableSuggestion.type === 'task' ? '🎯 ÖNERİLEN GÖREV' : '📖 HATA DEFTERİ KAYDI'}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginTop: 2 }}>
                            {msg.actionableSuggestion.title} ({msg.actionableSuggestion.subject})
                          </div>
                        </div>

                        {msg.actionableSuggestion.type === 'task' ? (
                          <button
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 11 }}
                            onClick={() => {
                              if (onAddTask && msg.actionableSuggestion) {
                                onAddTask(
                                  'genel',
                                  msg.actionableSuggestion.subject,
                                  msg.actionableSuggestion.title,
                                  25,
                                  45
                                );
                                confetti({ particleCount: 40, spread: 50 });
                                alert('Görev başarıyla Günlük Planınıza eklendi!');
                              }
                            }}
                          >
                            <Calendar size={13} />
                            <span>Planına Ekle</span>
                          </button>
                        ) : (
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: 11, borderColor: '#FFB800', color: '#FFB800' }}
                            onClick={() => {
                              if (onAddVaultItem && msg.actionableSuggestion) {
                                onAddVaultItem(
                                  msg.actionableSuggestion.title,
                                  msg.actionableSuggestion.subject,
                                  'Önemli Soru Tipi',
                                  msg.actionableSuggestion.details
                                );
                                confetti({ particleCount: 40, spread: 50 });
                                alert('Soru Hata Defterine eklendi!');
                              }
                            }}
                          >
                            <BookOpen size={13} />
                            <span>Hata Defterine Ekle</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Copy and Timestamp bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 8,
                        fontSize: 10.5,
                        color: 'var(--color-text-dim)'
                      }}
                    >
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedMsgId === msg.id ? 'var(--color-accent)' : 'var(--color-text-dim)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                        title="Metni Kopyala"
                      >
                        {copiedMsgId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedMsgId === msg.id ? 'Kopyalandı' : 'Kopyala'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AI Thinking Animation */}
            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot size={18} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    background: '#171922',
                    border: '1px solid #262938',
                    borderRadius: 18,
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: 13, color: '#C084FC', fontWeight: 600 }}>NetMetrik AI çözüyor</span>
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------
          3. Bottom Input Bar Matching Knowunity AI
      -------------------------------------------------------------------- */}
      <div
        style={{
          padding: isDesktop ? '14px 36px 20px 36px' : '10px 14px 16px 14px',
          background: 'linear-gradient(180deg, rgba(13, 14, 18, 0) 0%, rgba(13, 14, 18, 0.95) 30%, #0D0E12 100%)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: '0 auto',
            position: 'relative'
          }}
        >
          {/* Image Preview badge if attached */}
          {attachedImagePreview && (
            <div
              style={{
                marginBottom: 8,
                padding: '6px 12px',
                borderRadius: 12,
                background: '#1E202B',
                border: '1px solid #2F3345',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12
              }}
            >
              <ImageIcon size={14} color="var(--color-accent)" />
              <span>Soru Fotoğrafı Eklendi</span>
              <button
                onClick={() => setAttachedImagePreview(null)}
                style={{ background: 'transparent', border: 'none', color: '#FF5050', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Quick Math Symbols Popover */}
          {showMathPopover && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 10,
                marginBottom: 8,
                background: '#191B24',
                border: '1px solid #2E3244',
                borderRadius: 14,
                padding: 10,
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                maxWidth: 320,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                zIndex: 60
              }}
            >
              {['√', 'π', '∫', '∑', 'Δ', 'α', 'β', 'θ', '²', '³', '≤', '≥', '≠', '∞'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    setInputText((prev) => prev + sym);
                    setShowMathPopover(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#252836',
                    border: '1px solid #363B4E',
                    color: '#FFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sym}
                </button>
              ))}
            </div>
          )}

          {/* Knowunity Rounded Pill Container */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(22, 26, 36, 0.92) 0%, rgba(14, 17, 24, 0.98) 100%)',
              border: isVoiceListening ? '1.5px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 24,
              padding: '8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: isVoiceListening
                ? '0 0 20px rgba(239, 68, 68, 0.35)'
                : '0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'border-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out)'
            }}
          >
            {/* Input Row */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder={isVoiceListening ? '🎙️ Seni dinliyorum... Konuş...' : 'Her şeyi sorabilirsin...'}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 500,
                padding: '6px 4px'
              }}
            />

            {/* Bottom Actions Row (+, 📎, ✍️, √x, 🎙️ Konuş, Send) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
              {/* Left Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* New Chat (+) */}
                <button
                  onClick={handleStartNewChat}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Yeni Sohbet Başlat"
                >
                  <Plus size={18} />
                </button>

                {/* Upload Image / Question (📎) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    color: attachedImagePreview ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Soru Görseli / Fotoğraf Yükle"
                >
                  <Paperclip size={17} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {/* Formula Symbol Popover (√x) */}
                <button
                  onClick={() => setShowMathPopover(!showMathPopover)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: showMathPopover ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                    border: 'none',
                    color: showMathPopover ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800
                  }}
                  title="Matematik Sembolleri Ekle"
                >
                  √
                </button>

                {/* Scribble / Note icon (〰️) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    alert('Karalama ve formül tahtası modu aktif!');
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Karalama Tahtası"
                >
                  <PenTool size={16} />
                </button>
              </div>

              {/* Right Side: "Konuş 🎙️" and Send button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Voice Input Button */}
                <button
                  onClick={handleToggleVoice}
                  style={{
                    background: isVoiceListening ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                    border: isVoiceListening ? '1px solid #EF4444' : 'none',
                    color: isVoiceListening ? '#EF4444' : 'var(--color-text-muted)',
                    borderRadius: 99,
                    padding: '6px 12px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Konuş</span>
                  {isVoiceListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() && !attachedImagePreview}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: inputText.trim() || attachedImagePreview
                      ? 'linear-gradient(135deg, #A855F7 0%, #00F0FF 100%)'
                      : '#242735',
                    border: 'none',
                    color: inputText.trim() || attachedImagePreview ? '#000' : 'var(--color-text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputText.trim() || attachedImagePreview ? 'pointer' : 'default',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: inputText.trim() || attachedImagePreview ? '0 0 14px rgba(168, 85, 247, 0.5)' : 'none'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          4. "Sohbet Geçmişi" Drawer (Sliding Sidebar)
      -------------------------------------------------------------------- */}
      {showHistoryDrawer && (
        <div
          className="modal-overlay"
          onClick={() => setShowHistoryDrawer(false)}
          style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isDesktop ? 380 : '100%',
              height: '100%',
              background: '#13141C',
              borderLeft: '1px solid #282B3A',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
              animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={18} color="#C084FC" />
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#FFF' }}>Sohbet Geçmişi</h3>
              </div>
              <button
                onClick={() => setShowHistoryDrawer(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* New Chat Button */}
            <button
              onClick={() => {
                handleStartNewChat();
                setShowHistoryDrawer(false);
              }}
              className="btn-primary"
              style={{ width: '100%', marginBottom: 16, padding: '11px', fontSize: 13 }}
            >
              <Plus size={16} />
              <span>Yeni Sohbet Başlat</span>
            </button>

            {/* Sessions List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 40 }}>
                  Henüz kayıtlı bir sohbet yok.
                </div>
              ) : (
                sessions.map((s) => {
                  const isCurrent = s.id === activeSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 14,
                        background: isCurrent ? 'rgba(168, 85, 247, 0.15)' : '#1A1C26',
                        border: isCurrent ? '1px solid #A855F7' : '1px solid #282B3A',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#FFF',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {s.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {s.date} • {s.messages.length} mesaj
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-dim)',
                          cursor: 'pointer',
                          padding: 4
                        }}
                        title="Sohbeti Sil"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          5. Google Gemini API Settings Modal
      -------------------------------------------------------------------- */}
      {showApiKeyModal && (
        <div className="modal-overlay" onClick={() => setShowApiKeyModal(false)}>
          <div
            className="app-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: isDesktop ? 520 : '92%',
              maxWidth: 540,
              background: '#13141C',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: 22,
              padding: 24,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              animation: 'slideUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(0, 240, 255, 0.25) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(192, 132, 252, 0.3)'
                  }}
                >
                  <Key size={18} color="#C084FC" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#FFF' }}>Google Gemini Vision Ayarları</h3>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Gerçek Soru Fotoğrafı Analizi & OCR Çözümü</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  padding: 6
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Explanation */}
            <div
              style={{
                background: '#191B26',
                border: '1px solid #282C3D',
                borderRadius: 14,
                padding: 14,
                marginBottom: 18,
                fontSize: 12,
                lineHeight: 1.5,
                color: '#CBD5E1'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#38BDF8', marginBottom: 6 }}>
                <ShieldCheck size={16} />
                <span>Neden Google Gemini API?</span>
              </div>
              <p style={{ margin: 0 }}>
                Google'ın <strong>Gemini 1.5 Flash Vision</strong> modeli, Türkçe YKS denemelerindeki şekilli matematik, geometri ve fizik sorularını hatasız okuma ve adım adım çözmede dünyanın en başarılı görme modellerindendir.
              </p>
            </div>

            {/* How to get API Key */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FFF', marginBottom: 6 }}>
                Ücretsiz API Anahtarı Nasıl Alınır? (30 Saniye)
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: 12,
                  color: '#00F0FF',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                <span>1. Google AI Studio'dan Ücretsiz Key Al</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Key Input */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-dim)' }}>
                  GEMINI API KEY (AIzaSy...)
                </label>
                {getCachedWorkingModel() && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
                    Aktif Model: {getCachedWorkingModel()}
                  </span>
                )}
              </div>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                style={{
                  width: '100%',
                  background: '#0D0E14',
                  border: '1px solid #2B2F40',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Test Status feedback */}
            {apiTestStatus && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 16,
                  background: apiTestStatus.success ? 'rgba(0, 229, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: apiTestStatus.success ? '1px solid #00E599' : '1px solid #EF4444',
                  color: apiTestStatus.success ? '#00E599' : '#EF4444'
                }}
              >
                {apiTestStatus.loading ? '⏳ Google Gemini bağlantısı test ediliyor...' : apiTestStatus.msg}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {geminiApiKey && (
                <button
                  type="button"
                  onClick={handleRemoveApiKey}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3F4458',
                    color: '#EF4444',
                    borderRadius: 12,
                    padding: '10px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Anahtarı Sil
                </button>
              )}

              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={!apiKeyInput.trim() || apiTestStatus?.loading}
                style={{
                  background: '#1F2230',
                  border: '1px solid #363B50',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  padding: '10px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: apiKeyInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: apiKeyInput.trim() ? 1 : 0.5
                }}
              >
                Test Et
              </button>

              <button
                type="button"
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #00F0FF 100%)',
                  border: 'none',
                  color: '#080B10',
                  borderRadius: 12,
                  padding: '10px 20px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: apiKeyInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: apiKeyInput.trim() ? 1 : 0.5
                }}
              >
                Kaydet & Aktif Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
