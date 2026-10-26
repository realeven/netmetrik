import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ModernSlider } from './ModernSlider';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sliders,
  Settings,
  Maximize,
  Minimize,
  Flame,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Coffee,
  CloudRain,
  Waves,
  Trees,
  Radio,
  Music,
  X,
  Palette,
  Wand2,
  Music2,
  PenLine,
  Clock,
  Timer,
  BarChart2,
  MessageSquareQuote,
  PartyPopper,
  User,
  HelpCircle,
  Rocket,
  Zap,
  Flag
} from 'lucide-react';
import { ambientEngine } from '../lib/ambientSoundEngine';
import { sounds } from '../lib/sound';
import type { DailyTask, StudentProfile, QuestionLog } from '../data/seedData';

export type FlocusMode = 'focus' | 'stopwatch' | 'clock' | 'ambient';
export type TimerSubMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'animedoro';
export type PomodoroPhase = 'work' | 'short_break' | 'long_break';

export interface LiveFocusActivity {
  isPomodoroRunning: boolean;
  pomodoroTimeLeft: number;
  pomodoroPhase: PomodoroPhase;
  pomodoroGoal: string;
  isStopwatchRunning: boolean;
  stopwatchSeconds: number;
  stopwatchGoal: string;
  activeMode: FlocusMode;
  onTogglePomodoro?: () => void;
  onToggleStopwatch?: () => void;
}

export type ClockFontStyle =
  | 'default-bold'
  | 'default-light'
  | 'soft'
  | 'bubble'
  | 'minimal-light'
  | 'minimal'
  | 'serif'
  | 'serif-condensed'
  | 'sporty'
  | 'heavy-wide'
  | 'digital'
  | 'handwritten';

export type TimerWidgetStyle =
  | 'default'
  | 'flip'
  | 'progressbar'
  | 'gauge'
  | 'dots'
  | 'pie';

export type SettingsTab =
  | 'themes'
  | 'clock'
  | 'focustimer'
  | 'stats'
  | 'quotes'
  | 'extras'
  | 'account'
  | 'support'
  | 'whatsnew';

export interface AmbientTrack {
  id: string;
  name: string;
  icon: any;
  volume: number; // 0 to 1
}

export interface FlocusTheme {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  url?: string;
  gradient?: string;
  accent: string;
  clockColor?: string;
  clockGlow?: string;
  category: 'Gradients & Colors' | 'Abstract' | 'Scenic' | 'Nature' | 'Urban' | 'Interior' | 'Animated';
  isPlus?: boolean;
}

const FLOCUS_THEMES: FlocusTheme[] = [
  {
    id: 'fuji-sunset',
    name: 'Fuji Sunset & Sakura (Japonya)',
    type: 'image',
    url: '/themes/fuji-sunset.jpg',
    accent: '#FF9A76',
    clockColor: '#FFF1E6',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 45px rgba(255, 154, 118, 0.45)',
    category: 'Scenic',
    isPlus: true
  },
  {
    id: 'lofi-study-night',
    name: 'Midnight Lo-Fi Study (Gece Masası)',
    type: 'image',
    url: '/themes/lofi-study-night.jpg',
    accent: '#FB923C',
    clockColor: '#FEF3C7',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.75), 0 0 40px rgba(251, 146, 60, 0.4)',
    category: 'Interior',
    isPlus: true
  },
  {
    id: 'night-city-desk',
    name: 'Metropolis Night Balcony (Gece Şehri)',
    type: 'image',
    url: '/themes/night-city-desk.png',
    accent: '#38BDF8',
    clockColor: '#E0F2FE',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 45px rgba(56, 189, 248, 0.45)',
    category: 'Urban',
    isPlus: true
  },
  {
    id: 'green-window-artist',
    name: 'Sunlit Studio & Black Cat (Sanatçı & Kedi)',
    type: 'image',
    url: '/themes/green-window-artist.png',
    accent: '#84CC16',
    clockColor: '#F7FEE7',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.65), 0 0 35px rgba(132, 204, 22, 0.4)',
    category: 'Interior',
    isPlus: true
  },
  {
    id: 'purple-night-cat',
    name: 'Cyber Lo-Fi Kitty (Mor Gece Kedisi)',
    type: 'image',
    url: '/themes/purple-night-cat.jpg',
    accent: '#C084FC',
    clockColor: '#FAF5FF',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 50px rgba(192, 132, 252, 0.55)',
    category: 'Interior',
    isPlus: true
  },
  {
    id: 'cozy-coffee-cat',
    name: 'Cozy Coffee Kitty (Kahveli Kedi)',
    type: 'image',
    url: '/themes/cozy-coffee-cat.jpg',
    accent: '#FB7185',
    clockColor: '#FFF7ED',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(251, 113, 133, 0.35)',
    category: 'Interior',
    isPlus: true
  },
  {
    id: 'jake-reading',
    name: 'Jake Bookworm (Adventure Time)',
    type: 'image',
    url: '/themes/jake-reading.jpg',
    accent: '#FACC15',
    clockColor: '#FEF08A',
    clockGlow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 30px rgba(250, 204, 21, 0.4)',
    category: 'Animated',
    isPlus: true
  },
  {
    id: 'rainy-studio',
    name: 'Rainy Window Studio (Yağmurlu Stüdyo)',
    type: 'image',
    url: '/themes/rainy-studio.png',
    accent: '#2DD4BF',
    clockColor: '#F0FDFA',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 45px rgba(45, 212, 191, 0.45)',
    category: 'Urban',
    isPlus: true
  },
  {
    id: 'penguin-study-desk',
    name: 'Penguin Highway Desk (Kuşbakışı Masa)',
    type: 'image',
    url: '/themes/penguin-study-desk.png',
    accent: '#0EA5E9',
    clockColor: '#FEF9C3',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.75), 0 0 40px rgba(14, 165, 233, 0.4)',
    category: 'Interior',
    isPlus: true
  },
  {
    id: 'ghibli-forest',
    name: 'Büyülü Masal Ormanı (Ghibli)',
    type: 'image',
    url: '/flocus-ghibli-forest.jpg',
    accent: '#00E599',
    clockColor: '#ECFDF5',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 229, 153, 0.45)',
    category: 'Scenic',
    isPlus: true
  },
  {
    id: 'thermal',
    name: 'Thermal',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 40%, #8A2387 100%)',
    accent: '#FF416C',
    clockColor: '#FFE4E6',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 65, 108, 0.4)',
    category: 'Gradients & Colors',
    isPlus: false
  },
  {
    id: 'cotton',
    name: 'Cotton',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #fbc2eb 100%)',
    accent: '#C084FC',
    clockColor: '#EDE9FE',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 35px rgba(192, 132, 252, 0.35)',
    category: 'Gradients & Colors',
    isPlus: true
  },
  {
    id: 'autumn',
    name: 'Autumn',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 40%, #78350f 100%)',
    accent: '#F59E0B',
    clockColor: '#FEF3C7',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.4)',
    category: 'Gradients & Colors',
    isPlus: true
  },
  {
    id: 'obsidian-black',
    name: 'Obsidian OLED',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, #08090C 0%, #040406 100%)',
    accent: '#D4FF00',
    clockColor: '#F7FEE7',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 255, 0, 0.4)',
    category: 'Gradients & Colors',
    isPlus: true
  },
  {
    id: 'fleur',
    name: 'Fleur',
    type: 'gradient',
    gradient: 'radial-gradient(circle at 35% 35%, #FB7185 0%, #C084FC 45%, #1E1B4B 100%)',
    accent: '#FB7185',
    clockColor: '#FCE7F3',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(251, 113, 133, 0.4)',
    category: 'Abstract',
    isPlus: true
  },
  {
    id: 'ripple',
    name: 'Ripple',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 45%, #0369a1 100%)',
    accent: '#38BDF8',
    clockColor: '#E0F2FE',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.4)',
    category: 'Abstract',
    isPlus: true
  },
  {
    id: 'pink-ripple',
    name: 'Pink Ripple',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 45%, #881337 100%)',
    accent: '#F43F5E',
    clockColor: '#FFE4E6',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 35px rgba(244, 63, 94, 0.4)',
    category: 'Abstract',
    isPlus: true
  },
  {
    id: 'cosmic-aurora',
    name: 'Cosmic Aurora',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #1A0B2E 0%, #2A1245 40%, #0E071A 100%)',
    accent: '#E879F9',
    clockColor: '#FDF4FF',
    clockGlow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 40px rgba(232, 121, 249, 0.4)',
    category: 'Abstract',
    isPlus: true
  },
  {
    id: 'lofi-clouds',
    name: 'Lofi Clouds',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, #ec4899 0%, #8b5cf6 40%, #1e1b4b 100%)',
    accent: '#ec4899',
    category: 'Scenic',
    isPlus: false
  },
  {
    id: 'dusk-peak',
    name: 'Dusk Peak',
    type: 'gradient',
    gradient: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 40%, #0f172a 100%)',
    accent: '#60a5fa',
    category: 'Scenic',
    isPlus: true
  },
  {
    id: 'tuscan-village',
    name: 'Tuscan Village',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #431407 100%)',
    accent: '#f97316',
    category: 'Scenic',
    isPlus: true
  },
  {
    id: 'nordic-forest',
    name: 'Sisli İskandinav Ormanı',
    type: 'gradient',
    gradient: 'linear-gradient(160deg, #061912 0%, #0F2D24 50%, #071510 100%)',
    accent: '#00E599',
    category: 'Nature',
    isPlus: false
  },
  {
    id: 'rainy-neon',
    name: 'Yağmurlu Tokyo Neon',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #09131F 0%, #06232F 40%, #001219 100%)',
    accent: '#00F0FF',
    category: 'Nature',
    isPlus: false
  },
  {
    id: 'sunset-beach',
    name: 'Altın Saat Kumsalı',
    type: 'gradient',
    gradient: 'linear-gradient(145deg, #2A111A 0%, #3B1C28 40%, #190912 100%)',
    accent: '#FB7185',
    category: 'Nature',
    isPlus: false
  }
];

export const CLOCK_FONT_STYLES: Record<
  ClockFontStyle,
  {
    name: string;
    isFree?: boolean;
    style: React.CSSProperties;
  }
> = {
  'default-bold': {
    name: 'Default Bold',
    isFree: true,
    style: {
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      fontWeight: 900,
      letterSpacing: '-2px'
    }
  },
  'default-light': {
    name: 'Default Light',
    isFree: true,
    style: {
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      fontWeight: 300,
      letterSpacing: '0px'
    }
  },
  'soft': {
    name: 'Soft',
    style: {
      fontFamily: "'Comfortaa', 'Nunito', 'Quicksand', sans-serif",
      fontWeight: 700,
      letterSpacing: '-1px'
    }
  },
  'bubble': {
    name: 'Bubble',
    style: {
      fontFamily: "'Fredoka', 'Comic Sans MS', cursive, sans-serif",
      fontWeight: 900,
      fontStyle: 'italic',
      letterSpacing: '1px'
    }
  },
  'minimal-light': {
    name: 'Minimal Light',
    style: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 200,
      letterSpacing: '3px'
    }
  },
  'minimal': {
    name: 'Minimal',
    style: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontWeight: 400,
      letterSpacing: '1px'
    }
  },
  'serif': {
    name: 'Serif',
    style: {
      fontFamily: "'Playfair Display', 'Georgia', serif",
      fontWeight: 700,
      letterSpacing: '0px'
    }
  },
  'serif-condensed': {
    name: 'Serif Condensed',
    style: {
      fontFamily: "'Bodoni MT', 'Didot', 'Times New Roman', serif",
      fontWeight: 500,
      letterSpacing: '-1px',
      transform: 'scaleX(0.85)'
    }
  },
  'sporty': {
    name: 'Sporty',
    style: {
      fontFamily: "'Impact', 'Arial Black', sans-serif",
      fontWeight: 900,
      fontStyle: 'italic',
      letterSpacing: '2px'
    }
  },
  'heavy-wide': {
    name: 'Heavy Wide',
    style: {
      fontFamily: "'Arial Black', 'Montserrat', sans-serif",
      fontWeight: 900,
      letterSpacing: '3px',
      transform: 'scaleX(1.15) scaleY(0.95)'
    }
  },
  'digital': {
    name: 'Digital',
    style: {
      fontFamily: "'Courier New', 'Consolas', monospace",
      fontWeight: 700,
      letterSpacing: '3px'
    }
  },
  'handwritten': {
    name: 'Handwritten',
    style: {
      fontFamily: "'Caveat', 'Segoe Script', cursive",
      fontWeight: 700,
      letterSpacing: '1px'
    }
  }
};

const FLOCUS_QUOTES = [
  {
    text: 'Stop saying I wish, start saying I will',
    author: 'NetFocus'
  },
  {
    text: 'Büyük başarılar, her gün tekrarlanan küçük disiplinlerin toplamıdır.',
    author: 'Robert Collier'
  },
  {
    text: 'Zor olanı seç, çünkü kolay olanın taliplisi çoktur.',
    author: 'YKS Motivasyonu'
  },
  {
    text: 'Sessizce çalış, başarın ses getirsin.',
    author: 'Frank Ocean'
  },
  {
    text: 'Bugün döktüğün her damla alın teri, sınav günü tebessümün olacak.',
    author: 'NetMetrik Koç'
  },
  {
    text: 'Engel, yolun kendisidir. Karşılaştığın her zorluk seni daha güçlü yapar.',
    author: 'Marcus Aurelius'
  },
  {
    text: 'Zafer, "Ben bunu başarabilirim" diyenindir.',
    author: 'Mustafa Kemal Atatürk'
  },
  {
    text: 'Dikkatini dağıtan her şeyi 25 dakika sessize al. Sadece bu ana odaklan.',
    author: 'Derin Odak'
  }
];

function FlocusSwitch({
  checked,
  onChange,
  label,
  plus,
  description
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  plus?: boolean;
  description?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '14px 0',
        gap: 16,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF' }}>{label}</span>
          {plus && (
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 900,
                padding: '2px 7px',
                borderRadius: 99,
                background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              ⚡ PLUS
            </span>
          )}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', marginTop: 4, lineHeight: 1.4 }}>
            {description}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 99,
          background: checked ? '#7C3AED' : 'rgba(255, 255, 255, 0.18)',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          flexShrink: 0,
          padding: 2
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#FFFFFF',
            transform: checked ? 'translateX(20px)' : 'translateX(0px)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        />
      </button>
    </div>
  );
}

export function FlocusPomodoroView({
  profile,
  tasks,
  questionLogs = [],
  onToggleTask,
  onLogStudySession,
  onLiveActivityUpdate,
  isDesktop,
  onExit
}: {
  profile: StudentProfile;
  tasks: DailyTask[];
  questionLogs?: QuestionLog[];
  onToggleTask: (id: string) => void;
  onLogStudySession?: (subject: string, minutes: number) => void;
  onLiveActivityUpdate?: (activity: LiveFocusActivity) => void;
  isDesktop?: boolean;
  onExit?: () => void;
}) {
  // 1. Navigation Mode: Focus | Stopwatch | Clock | Ambient
  const [activeMode, setActiveMode] = useState<FlocusMode>('focus');
  const [timerSubMode, setTimerSubMode] = useState<TimerSubMode>('pomodoro');

  // 2. Pomodoro Config & Timing
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [workDuration, setWorkDuration] = useState<number>(30);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [longBreakInterval, setLongBreakInterval] = useState<number>(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(true);
  const [autoStartFocus, setAutoStartFocus] = useState<boolean>(false);
  const [enableTickSound, setEnableTickSound] = useState<boolean>(false);

  // Active Timer state
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [totalFocusedSecondsToday, setTotalFocusedSecondsToday] = useState<number>(0);

  // Serbest Kronometre (Stopwatch) State
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [stopwatchGoal, setStopwatchGoal] = useState<string>('');
  const [isEditingStopwatchGoal, setIsEditingStopwatchGoal] = useState<boolean>(false);
  const [stopwatchLaps, setStopwatchLaps] = useState<{ id: string; lapNumber: number; lapTime: number; totalTime: number }[]>([]);
  const [stopwatchSavedToast, setStopwatchSavedToast] = useState<string | null>(null);

  // 3. Theme & Aesthetics
  const [currentTheme, setCurrentTheme] = useState<FlocusTheme>(() => {
    try {
      const savedThemeId = localStorage.getItem('netfocus_theme_id');
      if (savedThemeId) {
        const found = FLOCUS_THEMES.find((t) => t.id === savedThemeId);
        if (found) return found;
      }
    } catch {}
    return FLOCUS_THEMES[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem('netfocus_theme_id', currentTheme.id);
    } catch {}
  }, [currentTheme.id]);

  const [bgDimmer, setBgDimmer] = useState<number>(15); // subtle 15% so vivid wallpaper pops
  const [bgBlur, setBgBlur] = useState<number>(0); // 0 to 20px
  const [clockFont, setClockFont] = useState<'sans' | 'mono' | 'serif'>('sans');
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('netfocus_is_24hour');
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });
  const [clockTimerSize, setClockTimerSize] = useState<'small' | 'regular' | 'huge'>(() => {
    try {
      const saved = localStorage.getItem('netfocus_clock_timer_size');
      if (saved === 'small' || saved === 'regular' || saved === 'huge') return saved;
    } catch {}
    return 'regular';
  });

  useEffect(() => {
    try {
      localStorage.setItem('netfocus_is_24hour', String(is24Hour));
    } catch {}
  }, [is24Hour]);

  useEffect(() => {
    try {
      localStorage.setItem('netfocus_clock_timer_size', clockTimerSize);
    } catch {}
  }, [clockTimerSize]);

  const [showSeconds, setShowSeconds] = useState<boolean>(true);

  // NetFocus Exact Flocus Settings State (100% Free & Unlocked)
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('clock');
  const [clockStyle, setClockStyle] = useState<ClockFontStyle>('default-bold');
  const [timerWidgetStyle, setTimerWidgetStyle] = useState<TimerWidgetStyle>('default');
  const [showGreetings, setShowGreetings] = useState<boolean>(true);
  const [showTimerProgressBar, setShowTimerProgressBar] = useState<boolean>(true);
  const [showBrowserNotification, setShowBrowserNotification] = useState<boolean>(true);
  const [showStreakCounter, setShowStreakCounter] = useState<boolean>(true);
  const [showTaskInPip, setShowTaskInPip] = useState<boolean>(false);
  const [statsViewMode, setStatsViewMode] = useState<'hours' | 'sessions'>('hours');
  const [statsTimeRange, setStatsTimeRange] = useState<'6months' | '1year'>('6months');
  const [themeCategoryFilter, setThemeCategoryFilter] = useState<string>('All');

  // 4. Modals & Popovers
  const [showMixerPopover, setShowMixerPopover] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showTaskPanel, setShowTaskPanel] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 5. Ambient Sound Mixer Tracks
  const [tracks, setTracks] = useState<AmbientTrack[]>([
    { id: 'rain', name: 'Yağmur', icon: CloudRain, volume: 0 },
    { id: 'waves', name: 'Dalgalar', icon: Waves, volume: 0 },
    { id: 'fire', name: 'Şömine', icon: Flame, volume: 0 },
    { id: 'birds', name: 'Orman & Kuş', icon: Trees, volume: 0 },
    { id: 'cafe', name: 'Sıcak Kafe', icon: Coffee, volume: 0 },
    { id: 'crickets', name: 'Gece Cırcır', icon: Radio, volume: 0 },
    { id: 'noise', name: 'Kahverengi Gürültü', icon: Sparkles, volume: 0 },
    { id: 'lofi', name: 'Lo-Fi Akordu', icon: Music, volume: 0 }
  ]);
  const [masterVolume, setMasterVolume] = useState<number>(0.75);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // 6. Quotes & Tasks
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [mainFocusGoal, setMainFocusGoal] = useState<string>('');
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [newCustomTaskText, setNewCustomTaskText] = useState<string>('');
  const [customTasks, setCustomTasks] = useState<{ id: string; text: string; done: boolean; pomodoros: number }[]>([
    { id: 't-1', text: 'Türev Kuralları 25 Soru Çözümü', done: false, pomodoros: 2 },
    { id: 't-2', text: 'Fizik Bağıl Hareket Formül Tekrarı', done: false, pomodoros: 1 },
    { id: 't-3', text: 'TYT Türkçe 20 Paragraf Hız Antrenmanı', done: true, pomodoros: 1 }
  ]);
  const [taskTab, setTaskTab] = useState<'custom' | 'plan'>('custom');

  // Current real-time clock state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Timer duration when phase or settings change
  useEffect(() => {
    if (!isRunning) {
      if (timerSubMode === 'animedoro') {
        setTimeLeft(pomodoroPhase === 'work' ? 45 * 60 : 20 * 60);
      } else {
        if (pomodoroPhase === 'work') setTimeLeft(workDuration * 60);
        else if (pomodoroPhase === 'short_break') setTimeLeft(shortBreakDuration * 60);
        else setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [pomodoroPhase, workDuration, shortBreakDuration, longBreakDuration, timerSubMode]);

  // Main Pomodoro Timer Countdown Loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          if (enableTickSound && prev % 2 === 0) {
            ambientEngine.playSoftTick();
          }
          if (pomodoroPhase === 'work') {
            setTotalFocusedSecondsToday((sec) => sec + 1);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, pomodoroPhase, enableTickSound]);

  // Serbest Kronometre Interval
  useEffect(() => {
    let interval: any = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => {
          if (enableTickSound && (prev + 1) % 2 === 0) {
            ambientEngine.playSoftTick();
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning, enableTickSound]);

  // Synchronize Live Focus Activity to Parent (App.tsx)
  useEffect(() => {
    if (onLiveActivityUpdate) {
      onLiveActivityUpdate({
        isPomodoroRunning: isRunning,
        pomodoroTimeLeft: timeLeft,
        pomodoroPhase,
        pomodoroGoal: mainFocusGoal,
        isStopwatchRunning,
        stopwatchSeconds,
        stopwatchGoal,
        activeMode,
        onTogglePomodoro: handleToggleTimer,
        onToggleStopwatch: handleToggleStopwatch
      });
    }
  }, [
    isRunning,
    timeLeft,
    pomodoroPhase,
    mainFocusGoal,
    isStopwatchRunning,
    stopwatchSeconds,
    stopwatchGoal,
    activeMode
  ]);


  // Handler on Phase Completion
  const handlePhaseComplete = () => {
    setIsRunning(false);
    ambientEngine.playZenChime();
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });

    if (pomodoroPhase === 'work') {
      const nextRounds = completedRounds + 1;
      setCompletedRounds(nextRounds);

      if (onLogStudySession) {
        onLogStudySession('Pomodoro Seansı', workDuration);
      }

      // Check if long break interval reached
      if (nextRounds % longBreakInterval === 0) {
        setPomodoroPhase('long_break');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setPomodoroPhase('short_break');
        setTimeLeft(shortBreakDuration * 60);
      }

      if (autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1200);
      }
    } else {
      // Break completed, back to work
      setPomodoroPhase('work');
      setTimeLeft(workDuration * 60);

      if (autoStartFocus) {
        setTimeout(() => setIsRunning(true), 1200);
      }
    }
  };

  const handleToggleTimer = () => {
    sounds.playClick();
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    sounds.playClick();
    setIsRunning(false);
    if (pomodoroPhase === 'work') setTimeLeft(workDuration * 60);
    else if (pomodoroPhase === 'short_break') setTimeLeft(shortBreakDuration * 60);
    else setTimeLeft(longBreakDuration * 60);
  };

  const handleSkipPhase = () => {
    sounds.playClick();
    if (pomodoroPhase === 'work') {
      setPomodoroPhase('short_break');
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setPomodoroPhase('work');
      setTimeLeft(workDuration * 60);
    }
    setIsRunning(false);
  };

  // Stopwatch handlers
  const handleToggleStopwatch = () => {
    sounds.playClick();
    setIsStopwatchRunning((prev) => !prev);
  };

  const handleResetStopwatch = () => {
    sounds.playClick();
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
    setStopwatchLaps([]);
  };

  const handleAddLap = () => {
    sounds.playClick();
    if (stopwatchSeconds === 0) return;
    const lastTotal = stopwatchLaps.length > 0 ? stopwatchLaps[0].totalTime : 0;
    const lapTime = stopwatchSeconds - lastTotal;
    const newLap = {
      id: `lap-${Date.now()}-${stopwatchLaps.length + 1}`,
      lapNumber: stopwatchLaps.length + 1,
      lapTime: lapTime > 0 ? lapTime : stopwatchSeconds,
      totalTime: stopwatchSeconds
    };
    setStopwatchLaps((prev) => [newLap, ...prev]);
  };

  const handleSaveStopwatchSession = () => {
    sounds.playSuccess();
    const minutes = Math.max(1, Math.round(stopwatchSeconds / 60));
    const title = stopwatchGoal.trim() || 'Serbest Kronometre';
    if (onLogStudySession) {
      onLogStudySession(title, minutes);
    }
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setStopwatchSavedToast(`✅ ${minutes} dakikalık çalışma başarıyla kaydedildi!`);
    setTimeout(() => setStopwatchSavedToast(null), 3500);
  };

  const formatStopwatch = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const hStr = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';
    const mStr = mins.toString().padStart(2, '0');
    const sStr = secs.toString().padStart(2, '0');
    return {
      hrs,
      mins,
      secs,
      full: `${hStr}${mStr}:${sStr}`
    };
  };

  // Sound mixer adjustments
  const handleTrackVolumeChange = (id: string, vol: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume: vol } : t))
    );
    ambientEngine.setSoundVolume(id, vol);
  };

  const handleToggleMasterMute = () => {
    const muted = ambientEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleMasterVolumeChange = (v: number) => {
    setMasterVolume(v);
    ambientEngine.setMasterVolume(v);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format time helpers
  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  // Clock format
  const getClockFormatted = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (!is24Hour) {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }

    const hStr = hours.toString().padStart(2, '0');
    return {
      main: `${hStr}:${minutes}`,
      seconds,
      ampm
    };
  };

  // Total duration for progress ring
  const currentTotalSeconds =
    pomodoroPhase === 'work'
      ? workDuration * 60
      : pomodoroPhase === 'short_break'
      ? shortBreakDuration * 60
      : longBreakDuration * 60;
  const progressPct = Math.min(
    100,
    Math.max(0, ((currentTotalSeconds - timeLeft) / currentTotalSeconds) * 100)
  );

  const activeSoundCount = tracks.filter((t) => t.volume > 0).length;

  // Timer & Clock font size clamp helper
  const getTimerSizeClamp = (desktopDefault: string, mobileDefault: string) => {
    if (clockTimerSize === 'small') {
      return isDesktop ? 'clamp(5rem, 12vw, 8.5rem)' : 'clamp(3.5rem, 14vw, 5rem)';
    }
    if (clockTimerSize === 'huge') {
      return isDesktop ? 'clamp(10rem, 24vw, 17rem)' : 'clamp(6.5rem, 25vw, 10rem)';
    }
    return isDesktop ? desktopDefault : mobileDefault;
  };

  // Real stats calculation from questionLogs + current active session
  const dailyStatsMap = useMemo(() => {
    const map: Record<string, { minutes: number; sessions: number }> = {};
    (questionLogs || []).forEach((log) => {
      if (!log.date) return;
      if (!map[log.date]) {
        map[log.date] = { minutes: 0, sessions: 0 };
      }
      const mins = log.durationMinutes || 0;
      map[log.date].minutes += mins;
      if (mins > 0 || log.count > 0) {
        map[log.date].sessions += 1;
      }
    });

    // Add current live session minutes for today
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const liveMins = Math.floor(totalFocusedSecondsToday / 60);
    if (liveMins > 0) {
      if (!map[todayStr]) {
        map[todayStr] = { minutes: 0, sessions: 0 };
      }
      map[todayStr].minutes += liveMins;
      if (map[todayStr].sessions === 0) {
        map[todayStr].sessions = 1;
      }
    }

    return map;
  }, [questionLogs, totalFocusedSecondsToday]);

  // Heatmap days generation for 6 months (26 weeks) or 1 year (44 weeks)
  const heatmapDays = useMemo(() => {
    const totalWeeks = statsTimeRange === '1year' ? 44 : 26;
    const totalDays = totalWeeks * 7;
    const daysArr: { dateStr: string; dateObj: Date; minutes: number; sessions: number }[] = [];
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const entry = dailyStatsMap[dateStr] || { minutes: 0, sessions: 0 };
      daysArr.push({
        dateStr,
        dateObj: d,
        minutes: entry.minutes,
        sessions: entry.sessions
      });
    }
    return daysArr;
  }, [dailyStatsMap, statsTimeRange]);

  // Heatmap date range labels in Turkish
  const heatmapDateRange = useMemo(() => {
    if (heatmapDays.length === 0) return { start: '', end: '' };
    const startObj = heatmapDays[0].dateObj;
    const endObj = heatmapDays[heatmapDays.length - 1].dateObj;
    return {
      start: startObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      end: endObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }, [heatmapDays]);

  // Real Trend Points (Last 6 days leading up to today)
  const trendData = useMemo(() => {
    const daysAgoList = [5, 4, 3, 2, 1, 0];
    const points: { cx: number; cy: number; minutes: number; timeLabel: string; dateLabel: string }[] = [];
    
    const rawMinutesList = daysAgoList.map(dAgo => {
      const d = new Date();
      d.setDate(d.getDate() - dAgo);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return dailyStatsMap[dateStr]?.minutes || 0;
    });

    const maxMinutes = Math.max(60, ...rawMinutesList);

    daysAgoList.forEach((dAgo, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - dAgo);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const mins = dailyStatsMap[dateStr]?.minutes || 0;

      const cx = 35 + idx * (530 / 5);
      const cy = Math.round(135 - (mins / maxMinutes) * 105);

      const timeLabel = mins >= 60
        ? `${Math.floor(mins / 60)} sa ${mins % 60 > 0 ? (mins % 60) + ' dk' : ''}`.trim()
        : mins > 0
        ? `${mins} dk`
        : '0 dk';

      const dateLabel = dAgo === 0
        ? 'Bugün'
        : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

      points.push({ cx, cy, minutes: mins, timeLabel, dateLabel });
    });

    // Build Bézier path
    const curvePath = points.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.cx},${pt.cy}`;
      const prev = arr[i - 1];
      const cpx1 = prev.cx + (pt.cx - prev.cx) / 2;
      const cpy1 = prev.cy;
      const cpx2 = prev.cx + (pt.cx - prev.cx) / 2;
      const cpy2 = pt.cy;
      return `${acc} C ${cpx1},${cpy1} ${cpx2},${cpy2} ${pt.cx},${pt.cy}`;
    }, '');

    const areaPath = points.length > 0
      ? `${curvePath} L ${points[points.length - 1].cx},150 L ${points[0].cx},150 Z`
      : '';

    return { points, curvePath, areaPath };
  }, [dailyStatsMap]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        background: currentTheme.url
          ? `url(${currentTheme.url}) center/cover no-repeat`
          : currentTheme.gradient || '#0C0D12',
        color: '#FFFFFF',
        borderRadius: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'background 0.5s ease',
        userSelect: 'none'
      }}
    >
      {/* Dimmer & Blur Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0, 0, 0, ${bgDimmer / 100})`,
          backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'all 0.3s ease'
        }}
      />

      {/* --------------------------------------------------------------------
          1. Flocus Top Bar: Brand Logo & Inspirational Quote (Screenshot matched)
      -------------------------------------------------------------------- */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: isDesktop ? '28px 40px 0' : '20px 20px 0',
          width: '100%'
        }}
      >
        {/* Top-Left: Lowercase netfocus brand & subtle mode switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onExit && (
            <button
              onClick={onExit}
              style={{
                background: 'rgba(15, 20, 25, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 99,
                padding: '7px 14px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 20, 25, 0.6)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="NetMetrik Paneline Geri Dön"
            >
              <span style={{ fontSize: 13, lineHeight: 1 }}>←</span>
              <span>Panele Dön</span>
            </button>
          )}

          <div>
            <div
              style={{
                fontSize: isDesktop ? 34 : 26,
                fontWeight: 800,
                letterSpacing: -1.2,
                color: '#FFFFFF',
                fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                lineHeight: 1,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                cursor: 'default'
              }}
            >
              netfocus
            </div>
            {showGreetings && (
              <div
                style={{
                  fontSize: 11.5,
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontWeight: 600,
                  marginTop: 3,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
                }}
              >
                İyi çalışmalar, {profile?.name ? profile.name.split(' ')[0] : 'Öğrenci'} 👋
              </div>
            )}
          </div>

          {/* Quick mode pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: 'rgba(15, 20, 25, 0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 99,
              padding: 3,
              marginLeft: 4
            }}
          >
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setActiveMode('focus');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 99,
                border: 'none',
                background: activeMode === 'focus' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: '#FFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Odak
            </button>
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setActiveMode('stopwatch');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 99,
                border: 'none',
                background: activeMode === 'stopwatch' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: '#FFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Kronometre
            </button>
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setActiveMode('clock');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 99,
                border: 'none',
                background: activeMode === 'clock' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: '#FFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Saat
            </button>
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setActiveMode('ambient');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 99,
                border: 'none',
                background: activeMode === 'ambient' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: '#FFF',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Ambiyans
            </button>
          </div>
        </div>

        {/* Top-Right: Streak Badge & NetFocus Motivational Quote */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {showStreakCounter && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(15, 20, 25, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 99,
                padding: '4px 10px',
                color: '#FFB800',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
              title="Aktif çalışma serin"
            >
              <Flame size={14} fill="#FFB800" />
              <span>{profile?.currentStreak || 7} gün</span>
            </div>
          )}

          <div
            onClick={() => {
              sounds.playClick();
              setQuoteIndex((prev) => (prev + 1) % FLOCUS_QUOTES.length);
            }}
            style={{
              maxWidth: isDesktop ? 340 : 200,
              textAlign: 'right',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            title="Farklı bir motivasyon sözü görmek için tıkla"
          >
            <div
              style={{
                fontSize: isDesktop ? 15 : 12.5,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.35,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)',
                fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif"
              }}
            >
              &ldquo;{FLOCUS_QUOTES[quoteIndex].text}&rdquo;
            </div>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          2. Main Content Canvas
      -------------------------------------------------------------------- */}
      <main
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 24px'
        }}
      >
        {/* A. FOCUS MODE (Exact Flocus Screenshot Layout) */}
        {activeMode === 'focus' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 720,
              textAlign: 'center'
            }}
          >
            {/* 1. What do you want to focus on? */}
            <div style={{ marginBottom: 18 }}>
              {isEditingGoal ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="What do you want to focus on?"
                  value={mainFocusGoal}
                  onChange={(e) => setMainFocusGoal(e.target.value)}
                  onBlur={() => setIsEditingGoal(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingGoal(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.45)',
                    color: '#FFFFFF',
                    fontSize: isDesktop ? 22 : 18,
                    fontWeight: 600,
                    textAlign: 'center',
                    outline: 'none',
                    minWidth: 280,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
                  }}
                />
              ) : (
                <div
                  onClick={() => setIsEditingGoal(true)}
                  style={{
                    fontSize: isDesktop ? 22 : 17,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)',
                    transition: 'opacity 0.2s ease',
                    opacity: 0.95
                  }}
                  title="Odaklanmak istediğin konuyu yazmak için tıkla"
                >
                  {mainFocusGoal || 'What do you want to focus on?'}
                </div>
              )}
            </div>

            {/* 2. Uppercase Phase Selectors: FOCUS | SHORT BREAK | LONG BREAK */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isDesktop ? 26 : 18,
                marginBottom: 10
              }}
            >
              <button

                onClick={() => {
                  sounds.playClick();
                  setPomodoroPhase('work');
                  setTimeLeft(workDuration * 60);
                  setIsRunning(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: pomodoroPhase === 'work' ? currentTheme.clockColor : 'rgba(255, 255, 255, 0.6)',
                  fontSize: isDesktop ? 13.5 : 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textShadow: pomodoroPhase === 'work' ? `0 0 16px ${currentTheme.accent}` : '0 2px 8px rgba(0, 0, 0, 0.7)',
                  transition: 'all 0.2s ease',
                  padding: '4px 6px'
                }}
              >
                FOCUS
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setPomodoroPhase('short_break');
                  setTimeLeft(shortBreakDuration * 60);
                  setIsRunning(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: pomodoroPhase === 'short_break' ? currentTheme.clockColor : 'rgba(255, 255, 255, 0.6)',
                  fontSize: isDesktop ? 13.5 : 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textShadow: pomodoroPhase === 'short_break' ? `0 0 16px ${currentTheme.accent}` : '0 2px 8px rgba(0, 0, 0, 0.7)',
                  transition: 'all 0.2s ease',
                  padding: '4px 6px'
                }}
              >
                SHORT BREAK
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setPomodoroPhase('long_break');
                  setTimeLeft(longBreakDuration * 60);
                  setIsRunning(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: pomodoroPhase === 'long_break' ? currentTheme.clockColor : 'rgba(255, 255, 255, 0.6)',
                  fontSize: isDesktop ? 13.5 : 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textShadow: pomodoroPhase === 'long_break' ? `0 0 16px ${currentTheme.accent}` : '0 2px 8px rgba(0, 0, 0, 0.7)',
                  transition: 'all 0.2s ease',
                  padding: '4px 6px'
                }}
              >
                LONG BREAK
              </button>
            </div>

            {/* 3. Cycle Dots (4 small dots) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                marginBottom: 16
              }}
            >
              {[1, 2, 3, 4].map((round) => {
                const isDone = (completedRounds % 4) >= round;
                const isCurrent = (completedRounds % 4) + 1 === round;
                return (
                  <div
                    key={round}
                    style={{
                      width: 6.5,
                      height: 6.5,
                      borderRadius: '50%',
                      background: isDone || isCurrent ? currentTheme.accent : 'rgba(255, 255, 255, 0.35)',
                      boxShadow: isCurrent ? `0 0 10px ${currentTheme.accent}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    title={`Tur ${round}/4`}
                  />
                );
              })}
            </div>

            {/* 4. Timer Display (Dynamic by Timer Style & Clock Font Style) */}
            {(() => {
              const formatted = formatTimer(timeLeft);
              const [minStr, secStr] = formatted.split(':');
              const selectedFontStyle = CLOCK_FONT_STYLES[clockStyle]?.style || {};

              if (timerWidgetStyle === 'flip') {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{
                          width: isDesktop ? 70 : 52,
                          height: isDesktop ? 96 : 72,
                          background: '#161720',
                          borderRadius: 14,
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isDesktop ? 56 : 40,
                          fontWeight: 900,
                          color: currentTheme.clockColor,
                          position: 'relative',
                          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.65), 0 0 15px ${currentTheme.accent}33`
                        }}>
                          {minStr[0]}
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0, 0, 0, 0.5)' }} />
                        </div>
                        <div style={{
                          width: isDesktop ? 70 : 52,
                          height: isDesktop ? 96 : 72,
                          background: '#161720',
                          borderRadius: 14,
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isDesktop ? 56 : 40,
                          fontWeight: 900,
                          color: currentTheme.clockColor,
                          position: 'relative',
                          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.65), 0 0 15px ${currentTheme.accent}33`
                        }}>
                          {minStr[1]}
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0, 0, 0, 0.5)' }} />
                        </div>
                      </div>

                      <span style={{ fontSize: isDesktop ? 48 : 34, fontWeight: 900, color: currentTheme.accent, margin: '0 4px', textShadow: `0 0 12px ${currentTheme.accent}` }}>
                        :
                      </span>

                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{
                          width: isDesktop ? 70 : 52,
                          height: isDesktop ? 96 : 72,
                          background: '#161720',
                          borderRadius: 14,
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isDesktop ? 56 : 40,
                          fontWeight: 900,
                          color: currentTheme.clockColor,
                          position: 'relative',
                          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.65), 0 0 15px ${currentTheme.accent}33`
                        }}>
                          {secStr[0]}
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0, 0, 0, 0.5)' }} />
                        </div>
                        <div style={{
                          width: isDesktop ? 70 : 52,
                          height: isDesktop ? 96 : 72,
                          background: '#161720',
                          borderRadius: 14,
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isDesktop ? 56 : 40,
                          fontWeight: 900,
                          color: currentTheme.clockColor,
                          position: 'relative',
                          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.65), 0 0 15px ${currentTheme.accent}33`
                        }}>
                          {secStr[1]}
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0, 0, 0, 0.5)' }} />
                        </div>
                      </div>
                    </div>

                    {showTimerProgressBar && (
                      <div
                        style={{
                          width: '100%',
                          maxWidth: 240,
                          height: 3.5,
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: 99,
                          overflow: 'hidden',
                          marginTop: 18
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPct}%`,
                            height: '100%',
                            background: currentTheme.accent,
                            borderRadius: 99,
                            transition: 'width 0.4s ease',
                            boxShadow: `0 0 10px ${currentTheme.accent}`
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              if (timerWidgetStyle === 'gauge') {
                const radius = isDesktop ? 100 : 76;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (progressPct / 100) * circumference;

                return (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 24px' }}>
                    <svg width={radius * 2 + 36} height={radius * 2 + 36} style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx={radius + 18}
                        cy={radius + 18}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx={radius + 18}
                        cy={radius + 18}
                        r={radius}
                        stroke="#FFFFFF"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        fontSize: isDesktop ? '3.4rem' : '2.4rem',
                        color: currentTheme.clockColor,
                        textShadow: currentTheme.clockGlow,
                        lineHeight: 1,
                        ...selectedFontStyle
                      }}
                    >
                      {formatted}
                    </div>
                  </div>
                );
              }

              if (timerWidgetStyle === 'dots') {
                const totalDots = 24;
                const activeDots = Math.round((progressPct / 100) * totalDots);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(8, 1fr)',
                        gap: 8,
                        marginBottom: 16,
                        background: 'rgba(15, 20, 25, 0.5)',
                        padding: '10px 16px',
                        borderRadius: 14,
                        border: '1px solid rgba(255, 255, 255, 0.12)'
                      }}
                    >
                      {Array.from({ length: totalDots }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: i < activeDots ? currentTheme.accent : 'rgba(255, 255, 255, 0.2)',
                            boxShadow: i < activeDots ? `0 0 8px ${currentTheme.accent}` : 'none',
                            transition: 'background 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: getTimerSizeClamp('clamp(5.5rem, 14vw, 9rem)', 'clamp(4rem, 16vw, 6rem)'),
                        color: currentTheme.clockColor,
                        textShadow: currentTheme.clockGlow,
                        lineHeight: 0.95,
                        ...selectedFontStyle
                      }}
                    >
                      {formatted}
                    </div>
                  </div>
                );
              }

              if (timerWidgetStyle === 'pie') {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `conic-gradient(${currentTheme.accent} ${progressPct}%, rgba(255, 255, 255, 0.15) 0)`,
                        marginBottom: 14,
                        boxShadow: `0 0 20px ${currentTheme.accent}66`
                      }}
                    />
                    <div
                      style={{
                        fontSize: getTimerSizeClamp('clamp(5.5rem, 14vw, 9rem)', 'clamp(4rem, 16vw, 6rem)'),
                        color: currentTheme.clockColor,
                        textShadow: currentTheme.clockGlow,
                        lineHeight: 0.95,
                        ...selectedFontStyle
                      }}
                    >
                      {formatted}
                    </div>
                  </div>
                );
              }

              if (timerWidgetStyle === 'progressbar') {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px', width: '100%' }}>
                    <div
                      style={{
                        fontSize: getTimerSizeClamp('clamp(7rem, 17vw, 12rem)', 'clamp(5rem, 20vw, 7.5rem)'),
                        color: currentTheme.clockColor,
                        textShadow: currentTheme.clockGlow,
                        lineHeight: 0.95,
                        fontVariantNumeric: 'tabular-nums',
                        ...selectedFontStyle
                      }}
                    >
                      {formatted}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 280,
                        height: 7,
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: 99,
                        overflow: 'hidden',
                        marginTop: 18,
                        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${currentTheme.clockColor}, ${currentTheme.accent})`,
                          borderRadius: 99,
                          transition: 'width 0.4s ease',
                          boxShadow: `0 0 12px ${currentTheme.accent}`
                        }}
                      />
                    </div>
                  </div>
                );
              }

              // Default Style
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px' }}>
                  <div
                    style={{
                      fontSize: getTimerSizeClamp('clamp(7.5rem, 18vw, 13.5rem)', 'clamp(5rem, 20vw, 7.8rem)'),
                      color: currentTheme.clockColor,
                      textShadow: currentTheme.clockGlow,
                      lineHeight: 0.95,
                      fontVariantNumeric: 'tabular-nums',
                      ...selectedFontStyle
                    }}
                  >
                    {formatted}
                  </div>

                  {showTimerProgressBar && (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 220,
                        height: 3.5,
                        background: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: 99,
                        overflow: 'hidden',
                        marginTop: 14,
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          background: currentTheme.accent,
                          borderRadius: 99,
                          transition: 'width 0.4s ease',
                          boxShadow: `0 0 10px ${currentTheme.accent}`
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 5. Minimalist Translucent Dark Frosted Buttons [ ⟲ ]  [ ▶ ]  [ ⏭ ] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={handleResetTimer}
                style={{
                  width: 48,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(15, 20, 25, 0.55)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                title="Sıfırla"
              >
                <RotateCcw size={17} />
              </button>

              <button
                onClick={handleToggleTimer}
                style={{
                  width: 58,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(15, 20, 25, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                title={isRunning ? 'Durdur' : 'Başlat'}
              >
                {isRunning ? (
                  <Pause size={20} fill="#FFF" />
                ) : (
                  <Play size={20} fill="#FFF" style={{ marginLeft: 2 }} />
                )}
              </button>

              <button
                onClick={handleSkipPhase}
                style={{
                  width: 48,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(15, 20, 25, 0.55)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                title="Aşamayı Atla"
              >
                <SkipForward size={17} />
              </button>
            </div>
          </div>
        )}

        {/* B. STOPWATCH MODE (Serbest Kronometre & Tur Takibi) */}
        {activeMode === 'stopwatch' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 720,
              textAlign: 'center'
            }}
          >
            {/* 1. Stopwatch Goal / Focus Subject Title */}
            <div style={{ marginBottom: 16 }}>
              {isEditingStopwatchGoal ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="Hangi derse / konuya çalışıyorsun?"
                  value={stopwatchGoal}
                  onChange={(e) => setStopwatchGoal(e.target.value)}
                  onBlur={() => setIsEditingStopwatchGoal(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingStopwatchGoal(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.45)',
                    color: '#FFFFFF',
                    fontSize: isDesktop ? 22 : 18,
                    fontWeight: 600,
                    textAlign: 'center',
                    outline: 'none',
                    minWidth: 280,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
                  }}
                />
              ) : (
                <div
                  onClick={() => setIsEditingStopwatchGoal(true)}
                  style={{
                    fontSize: isDesktop ? 22 : 17,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)',
                    transition: 'opacity 0.2s ease',
                    opacity: 0.95,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  title="Çalışma konusunu belirlemek için tıkla"
                >
                  <span>{stopwatchGoal || 'Serbest Çalışma Hedefi'}</span>
                  <PenLine size={15} style={{ opacity: 0.6 }} />
                </div>
              )}
            </div>

            {/* Sub-label: SERBEST KRONOMETRE */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentTheme.clockColor,
                opacity: 0.75,
                marginBottom: 8,
                textShadow: currentTheme.clockGlow
              }}
            >
              SERBEST KRONOMETRE
            </div>

            {/* Giant Stopwatch Time Display */}
            {(() => {
              const sw = formatStopwatch(stopwatchSeconds);
              const selectedFontStyle = CLOCK_FONT_STYLES[clockStyle]?.style || {};
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 24px' }}>
                  <div
                    style={{
                      fontSize: getTimerSizeClamp('clamp(7.5rem, 18vw, 13rem)', 'clamp(4.8rem, 19vw, 7.5rem)'),
                      color: currentTheme.clockColor,
                      textShadow: currentTheme.clockGlow,
                      lineHeight: 0.95,
                      fontVariantNumeric: 'tabular-nums',
                      ...selectedFontStyle
                    }}
                  >
                    {sw.full}
                  </div>

                  {/* Elapsed / Lap Summary Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 14,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.75)',
                      background: 'rgba(15, 20, 25, 0.45)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '4px 14px',
                      borderRadius: 99
                    }}
                  >
                    <span>⏱️ {Math.floor(stopwatchSeconds / 60)} dakika çalışma</span>
                    {stopwatchLaps.length > 0 && (
                      <>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span style={{ color: currentTheme.accent }}>{stopwatchLaps.length} Tur Kaydedildi</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Success Toast when Saved */}
            {stopwatchSavedToast && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '8px 18px',
                  borderRadius: 99,
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#A7F3D0',
                  fontSize: 13,
                  fontWeight: 800,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                {stopwatchSavedToast}
              </div>
            )}

            {/* Stopwatch Action Controls: [ Sıfırla ] [ Başlat/Durdur ] [ Tur Ekle ] [ Çalışmayı Kaydet ] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Reset */}
              <button
                onClick={handleResetStopwatch}
                disabled={stopwatchSeconds === 0 && !isStopwatchRunning}
                style={{
                  width: 48,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(15, 20, 25, 0.55)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: stopwatchSeconds === 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
                  cursor: stopwatchSeconds === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                title="Sıfırla"
              >
                <RotateCcw size={17} />
              </button>

              {/* Main Play / Pause */}
              <button
                onClick={handleToggleStopwatch}
                style={{
                  minWidth: 64,
                  height: 48,
                  padding: '0 20px',
                  borderRadius: 14,
                  background: isStopwatchRunning ? 'rgba(239, 68, 68, 0.75)' : 'rgba(16, 185, 129, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 800,
                  transition: 'all 0.15s ease',
                  boxShadow: isStopwatchRunning
                    ? '0 8px 24px rgba(239, 68, 68, 0.45)'
                    : '0 8px 24px rgba(16, 185, 129, 0.45)'
                }}
                title={isStopwatchRunning ? 'Durdur' : 'Başlat'}
              >
                {isStopwatchRunning ? (
                  <>
                    <Pause size={18} fill="#FFF" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="#FFF" style={{ marginLeft: 2 }} />
                    <span>Başlat</span>
                  </>
                )}
              </button>

              {/* Lap Button */}
              <button
                onClick={handleAddLap}
                disabled={stopwatchSeconds === 0}
                style={{
                  padding: '0 16px',
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(15, 20, 25, 0.55)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: stopwatchSeconds === 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
                  cursor: stopwatchSeconds === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12.5,
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                title="Tur Kaydet (Lap)"
              >
                <Flag size={15} />
                <span>Tur</span>
              </button>

              {/* Save Study Session to NetMetrik */}
              <button
                onClick={handleSaveStopwatchSession}
                disabled={stopwatchSeconds < 30}
                style={{
                  padding: '0 18px',
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.75), rgba(99, 102, 241, 0.75))',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: stopwatchSeconds < 30 ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF',
                  cursor: stopwatchSeconds < 30 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 12.5,
                  fontWeight: 800,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
                }}
                title="Çalışma süresini günlük soru & çalışma defterine kaydet"
              >
                <CheckCircle2 size={16} />
                <span>Çalışmayı Kaydet</span>
              </button>
            </div>

            {/* Laps List Table */}
            {stopwatchLaps.length > 0 && (
              <div
                style={{
                  marginTop: 24,
                  width: '100%',
                  maxWidth: 420,
                  maxHeight: 180,
                  overflowY: 'auto',
                  background: 'rgba(15, 20, 25, 0.55)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 16,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '12px 16px',
                  boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 8,
                    marginBottom: 8,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}
                >
                  <span>Tur #</span>
                  <span>Tur Süresi</span>
                  <span>Toplam Süre</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stopwatchLaps.map((lap) => (
                    <div
                      key={lap.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: '#FFFFFF'
                      }}
                    >
                      <span style={{ color: currentTheme.accent }}>Tur {lap.lapNumber}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                        +{formatStopwatch(lap.lapTime).full}
                      </span>
                      <span>{formatStopwatch(lap.totalTime).full}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* C. AESTHETIC CLOCK MODE */}
        {activeMode === 'clock' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Dynamic Greeting */}
            <div
              style={{
                fontSize: isDesktop ? 22 : 16,
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: 12,
                letterSpacing: 0.5
              }}
            >
              {currentTime.getHours() < 6
                ? `Gece geç saatte ders mi ${profile.name.split(' ')[0]}?`
                : currentTime.getHours() < 12
                ? `Günaydın ${profile.name.split(' ')[0]}! Güzel bir çalışma günü olsun.`
                : currentTime.getHours() < 18
                ? `İyi çalışmalar ${profile.name.split(' ')[0]}! Odaklanma vakti.`
                : `İyi akşamlar ${profile.name.split(' ')[0]}! Akşam hedeflerini tamamla.`}
            </div>

            {/* Giant Clock */}
            <div
              style={{
                fontSize: getTimerSizeClamp(isDesktop ? '9rem' : '5.5rem', isDesktop ? '9rem' : '5.5rem'),
                fontFamily:
                  clockFont === 'mono'
                    ? 'var(--font-mono)'
                    : clockFont === 'serif'
                    ? 'Georgia, serif'
                    : 'var(--font-sans)',
                fontWeight: 900,
                letterSpacing: -3,
                lineHeight: 1,
                color: currentTheme.clockColor,
                display: 'flex',
                alignItems: 'baseline',
                textShadow: currentTheme.clockGlow
              }}
            >
              <span>{getClockFormatted().main}</span>
              {showSeconds && (
                <span style={{ fontSize: isDesktop ? '3.5rem' : '2.2rem', color: currentTheme.accent, marginLeft: 12 }}>
                  :{getClockFormatted().seconds}
                </span>
              )}
              {getClockFormatted().ampm && (
                <span style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.5)', marginLeft: 10 }}>
                  {getClockFormatted().ampm}
                </span>
              )}
            </div>

            {/* Date Display */}
            <div
              style={{
                fontSize: isDesktop ? 18 : 14,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: 16,
                textTransform: 'capitalize'
              }}
            >
              {currentTime.toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Clock Options Pills */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setIs24Hour(!is24Hour)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {is24Hour ? '24 Saat Formatı' : '12 Saat (AM/PM)'}
              </button>

              <button
                onClick={() => setShowSeconds(!showSeconds)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Saniyeler: {showSeconds ? 'Açık' : 'Kapalı'}
              </button>

              <button
                onClick={() => {
                  const nextFont = clockFont === 'mono' ? 'sans' : clockFont === 'sans' ? 'serif' : 'mono';
                  setClockFont(nextFont);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Font: {clockFont.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {/* C. PURE AMBIENT MODE */}
        {activeMode === 'ambient' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 540
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Trees size={38} color={currentTheme.accent} />
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 10px 0' }}>
              {currentTheme.name}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: 0 }}>
              Sadece sesler ve ortam... Ekrandaki dikkat dağıtıcı tüm öğeler kalktı.
              Rahatça arkana yaslan ve odaklan.
            </p>

            <button
              onClick={() => setShowMixerPopover(true)}
              style={{
                marginTop: 24,
                padding: '12px 28px',
                borderRadius: 99,
                background: currentTheme.accent,
                border: 'none',
                color: '#000',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: `0 0 20px ${currentTheme.accent}60`
              }}
            >
              <Sliders size={16} />
              <span>Ses Mikserini Ayarla</span>
            </button>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------
          3. Flocus Floating Dock (Bottom-Left) & Quick Controls (Bottom-Right)
      -------------------------------------------------------------------- */}
      <footer
        style={{
          position: 'relative',
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isDesktop ? '0 36px 28px' : '0 20px 20px',
          width: '100%'
        }}
      >
        {/* Bottom-Left: Glassy Floating Dock [ 🪄 Theme | 🎵 Audio | ✏️ Tasks ] */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(15, 20, 25, 0.55)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 99,
            padding: '6px 12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)'
          }}
        >
          {/* 1. Theme / Magic Wand */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSettingsTab('themes');
              setShowSettingsModal(true);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'opacity 0.15s ease'
            }}
            title="Arka Plan Teması ve Görseller (Ghibli Ormanı, Lo-Fi, vb.)"
          >
            <Wand2 size={19} />
          </button>

          {/* 2. Audio / Ambient Sound Mixer */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowMixerPopover(!showMixerPopover);
            }}
            style={{
              background: activeSoundCount > 0 ? 'rgba(0, 229, 153, 0.25)' : 'transparent',
              border: 'none',
              color: activeSoundCount > 0 ? '#00E599' : '#FFFFFF',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              position: 'relative',
              transition: 'all 0.15s ease'
            }}
            title="Doğa ve Ambiyans Sesleri Mikseri (Yağmur, Kuşlar, Şömine, Lo-Fi...)"
          >
            <Music2 size={19} />
            {activeSoundCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#00E599',
                  boxShadow: '0 0 6px #00E599'
                }}
              />
            )}
          </button>

          {/* 3. Tasks / Focus List (Pencil icon) */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowTaskPanel(!showTaskPanel);
            }}
            style={{
              background: showTaskPanel ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              position: 'relative',
              transition: 'all 0.15s ease'
            }}
            title="Çalışma Görevleri ve Hedefler"
          >
            <PenLine size={19} />
            {customTasks.filter((t) => !t.done).length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: currentTheme.accent
                }}
              />
            )}
          </button>
        </div>

        {/* Bottom-Right: Settings & Zen Mode (Fullscreen) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSettingsTab('clock');
              setShowSettingsModal(true);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(15, 20, 25, 0.55)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title="Pomodoro Süreleri ve Tercihler"
          >
            <Settings size={17} />
          </button>

          <button
            onClick={handleToggleFullscreen}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(15, 20, 25, 0.55)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Odaklanma Modu (Zen)'}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>
        </div>
      </footer>

      {/* --------------------------------------------------------------------
          4. Collapsible Floating Flocus Task Panel
      -------------------------------------------------------------------- */}
      {showTaskPanel && (
        <div
          style={{
            position: 'absolute',
            bottom: 84,
            left: isDesktop ? 28 : 16,
            width: isDesktop ? 340 : 'calc(100% - 32px)',
            background: 'rgba(18, 20, 28, 0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 20,
            padding: 18,
            zIndex: 30,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            animation: 'slideUpModal 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#FFF' }}>
              Odaklanma Görevleri
            </div>
            <button
              onClick={() => setShowTaskPanel(false)}
              style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Task Source Switcher */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, background: 'rgba(0,0,0,0.3)', padding: 3, borderRadius: 10 }}>
            <button
              onClick={() => setTaskTab('custom')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                background: taskTab === 'custom' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: '#FFF',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Özel ({customTasks.filter(t => !t.done).length})
            </button>
            <button
              onClick={() => setTaskTab('plan')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                background: taskTab === 'plan' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: '#FFF',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Ders Planı ({tasks.filter(t => !t.isCompleted).length})
            </button>
          </div>

          {/* Task list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
            {taskTab === 'custom' ? (
              customTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: t.done ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.07)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setCustomTasks((prev) =>
                        prev.map((item) => (item.id === t.id ? { ...item, done: !item.done } : item))
                      );
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, cursor: 'pointer', overflow: 'hidden' }}
                  >
                    {t.done ? (
                      <CheckCircle2 size={16} color="#00E599" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={16} color="rgba(255, 255, 255, 0.4)" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: 12.5,
                        color: t.done ? 'rgba(255, 255, 255, 0.4)' : '#FFF',
                        textDecoration: t.done ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: currentTheme.accent, fontWeight: 800 }}>
                    🍅 {t.pomodoros}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCustomTasks((prev) => prev.filter((item) => item.id !== t.id));
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      padding: 2,
                      display: 'flex'
                    }}
                    title="Görevi sil"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            ) : (
              tasks.length === 0 ? (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 12 }}>
                  Bugün için planlanan ders görevi yok.
                </div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      sounds.playClick();
                      onToggleTask(t.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: t.isCompleted ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.isCompleted ? (
                      <CheckCircle2 size={16} color="#00E599" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={16} color="rgba(255, 255, 255, 0.4)" style={{ flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: t.isCompleted ? 'rgba(255, 255, 255, 0.4)' : '#FFF',
                          textDecoration: t.isCompleted ? 'line-through' : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {t.topicName}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)' }}>
                        {t.subjectName} • {t.targetMinutes} dk • {t.targetQuestions} soru
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Add custom task */}
          {taskTab === 'custom' && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <input
                type="text"
                placeholder="Yeni çalışma görevi ekle..."
                value={newCustomTaskText}
                onChange={(e) => setNewCustomTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCustomTaskText.trim()) {
                    setCustomTasks((prev) => [
                      ...prev,
                      { id: `t-${Date.now()}`, text: newCustomTaskText.trim(), done: false, pomodoros: 1 }
                    ]);
                    setNewCustomTaskText('');
                    sounds.playSuccess();
                  }
                }}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  color: '#FFF',
                  fontSize: 12,
                  outline: 'none'
                }}
              />
              <button
                onClick={() => {
                  if (newCustomTaskText.trim()) {
                    setCustomTasks((prev) => [
                      ...prev,
                      { id: `t-${Date.now()}`, text: newCustomTaskText.trim(), done: false, pomodoros: 1 }
                    ]);
                    setNewCustomTaskText('');
                    sounds.playSuccess();
                  }
                }}
                style={{
                  background: currentTheme.accent,
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 12px',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 800
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------
          5. Ambient Sound Mixer Popover
      -------------------------------------------------------------------- */}
      {showMixerPopover && (
        <div
          className="modal-overlay"
          onClick={() => setShowMixerPopover(false)}
          style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#13141C',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 22,
              padding: 22,
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Volume2 size={18} color="#00F0FF" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#FFF' }}>
                  Ambiyans Sesleri
                </h3>
              </div>
              <button
                onClick={() => setShowMixerPopover(false)}
                style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Master volume & Mute */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 16
              }}
            >
              <button
                onClick={handleToggleMasterMute}
                style={{
                  background: isAudioMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 240, 255, 0.2)',
                  border: 'none',
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isAudioMuted ? '#EF4444' : '#00F0FF',
                  cursor: 'pointer'
                }}
              >
                {isAudioMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 4 }}>
                  Ana Ses Düzeyi (%{Math.round(masterVolume * 100)})
                </div>
                <ModernSlider
                  min={0}
                  max={1}
                  step={0.05}
                  value={masterVolume}
                  accentColor="#00F0FF"
                  onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Sound list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tracks.map((track) => {
                const IconComp = track.icon;
                const isActive = track.volume > 0;
                return (
                  <div
                    key={track.id}
                    style={{
                      background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: isActive ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#00F0FF' : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      <IconComp size={16} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#FFF' : 'rgba(255, 255, 255, 0.6)' }}>
                          {track.name}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.4)' }}>
                          {Math.round(track.volume * 100)}%
                        </span>
                      </div>
                      <ModernSlider
                        min={0}
                        max={1}
                        step={0.05}
                        value={track.volume}
                        accentColor={currentTheme.accent}
                        onChange={(e) => handleTrackVolumeChange(track.id, parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stop all button */}
            {activeSoundCount > 0 && (
              <button
                onClick={() => {
                  ambientEngine.stopAll();
                  setTracks((prev) => prev.map((t) => ({ ...t, volume: 0 })));
                }}
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: '10px',
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Tüm Sesleri Kapat
              </button>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          6. NetFocus Master Settings Dashboard (Exact Flocus Multi-Tab Modal)
      -------------------------------------------------------------------- */}
      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isDesktop ? 24 : 10
          }}
        >
          <div
            className="app-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 940,
              maxWidth: '100%',
              height: isDesktop ? 620 : '92vh',
              maxHeight: '92vh',
              background: '#0D0E12',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            {/* Left Sidebar */}
            <aside
              style={{
                width: isDesktop ? 220 : 180,
                minWidth: isDesktop ? 220 : 180,
                background: '#090A0D',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px 14px'
              }}
            >
              <div>
                {/* Close Button at top */}
                <button
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    opacity: 0.7,
                    cursor: 'pointer',
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    marginBottom: 16,
                    transition: 'opacity 0.15s ease'
                  }}
                  title="Kapat"
                >
                  <X size={20} />
                </button>

                {/* Navigation Items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { id: 'themes' as const, label: 'Temalar', icon: Palette, badge: 'YENİ' },
                    { id: 'clock' as const, label: 'Saat', icon: Clock, badge: 'YENİ' },
                    { id: 'focustimer' as const, label: 'Odak Zamanlayıcı', icon: Timer },
                    { id: 'stats' as const, label: 'İstatistikler', icon: BarChart2 },
                    { id: 'quotes' as const, label: 'Motivasyon Sözleri', icon: MessageSquareQuote },
                    { id: 'extras' as const, label: 'Ekstralar', icon: PartyPopper },
                    { id: 'account' as const, label: 'Hesap', icon: User },
                    { id: 'support' as const, label: 'Destek', icon: HelpCircle },
                    { id: 'whatsnew' as const, label: 'Yenilikler', icon: Rocket }
                  ].map((item) => {
                    const isActive = activeSettingsTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          sounds.playClick();
                          setActiveSettingsTab(item.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: 12,
                          border: 'none',
                          background: isActive ? 'rgba(124, 58, 237, 0.22)' : 'transparent',
                          color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                          cursor: 'pointer',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: 13.5,
                          transition: 'all 0.15s ease',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Icon size={17} color={isActive ? '#A855F7' : 'currentColor'} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 900,
                              padding: '2px 6px',
                              borderRadius: 6,
                              background: item.badge === 'YENİ' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(168, 85, 247, 0.25)',
                              color: item.badge === 'YENİ' ? '#4ADE80' : '#C084FC',
                              letterSpacing: '0.04em'
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Plus Pill Button */}
              <button
                onClick={() => {
                  sounds.playSuccess();
                  confetti({ particleCount: 70, spread: 70 });
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.45)',
                  transition: 'transform 0.15s ease'
                }}
                title="Tüm NetFocus Plus özellikleri senin için ömür boyu ücretsiz ve aktif!"
              >
                <Zap size={15} fill="#FFF" />
                <span>NetFocus Plus'a Yükselt</span>
              </button>
            </aside>

            {/* Right Scrollable Content Pane */}
            <main
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: isDesktop ? '28px 32px' : '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 22
              }}
            >
              {/* TAB 1: CLOCK SETTINGS (Image 1 Exact) */}
              {activeSettingsTab === 'clock' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Section 1: Clock Format (Image 1 Top Card) */}
                  <div
                    style={{
                      background: '#13141C',
                      borderRadius: 18,
                      padding: 22,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: '0 0 6px', color: '#FFF' }}>
                      Saat Formatı
                    </h3>
                    <div style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 18 }}>
                      12 saat veya 24 saat formatı arasında seçim yapın.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                      {/* 12-hour Clock */}
                      <div
                        onClick={() => {
                          sounds.playClick();
                          setIs24Hour(false);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 110,
                            borderRadius: 16,
                            background: 'radial-gradient(circle at 80% 90%, #F97316 0%, #A855F7 50%, #3B1C68 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: !is24Hour ? '2.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: !is24Hour ? '0 0 24px rgba(255, 255, 255, 0.25)' : 'none',
                            transition: 'all 0.2s ease',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', letterSpacing: -1, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            2:24
                          </span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: !is24Hour ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)', marginTop: 10 }}>
                          12 Saat Formatı
                        </span>
                      </div>

                      {/* 24-hour Clock */}
                      <div
                        onClick={() => {
                          sounds.playClick();
                          setIs24Hour(true);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: 110,
                            borderRadius: 16,
                            background: 'radial-gradient(circle at 80% 90%, #F97316 0%, #A855F7 50%, #3B1C68 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: is24Hour ? '2.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: is24Hour ? '0 0 24px rgba(255, 255, 255, 0.25)' : 'none',
                            transition: 'all 0.2s ease',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', letterSpacing: -1, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                            14:24
                          </span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: is24Hour ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)', marginTop: 10 }}>
                          24 Saat Formatı
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Clock & Timer Size (Image 1 Bottom Card) */}
                  <div
                    style={{
                      background: '#13141C',
                      borderRadius: 18,
                      padding: 22,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                        Saat & Zamanlayıcı Boyutu
                      </h3>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#4ADE80'
                        }}
                      >
                        YENİ
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 18 }}>
                      Saat ve zamanlayıcı ekranına uygulanır.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                      {[
                        { id: 'small' as const, label: 'Küçük', fontSize: 18 },
                        { id: 'regular' as const, label: 'Normal', fontSize: 28 },
                        { id: 'huge' as const, label: 'Büyük', fontSize: 40 }
                      ].map((item) => {
                        const isSelected = clockTimerSize === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              sounds.playClick();
                              setClockTimerSize(item.id);
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: 110,
                                borderRadius: 16,
                                background: 'radial-gradient(circle at 80% 90%, #F97316 0%, #A855F7 50%, #3B1C68 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: isSelected ? '2.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: isSelected ? '0 0 24px rgba(255, 255, 255, 0.25)' : 'none',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                              }}
                            >
                              <span
                                style={{
                                  fontSize: item.fontSize,
                                  fontWeight: 900,
                                  color: '#FFFFFF',
                                  letterSpacing: -1,
                                  textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                }}
                              >
                                2:24
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                                marginTop: 10
                              }}
                            >
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Show Greetings */}
                  <FlocusSwitch
                    checked={showGreetings}
                    onChange={setShowGreetings}
                    label="Selamlama Metnini Göster"
                    plus
                    description="Ana ekrandaki selamlama mesajını gizlemek için kapatın."
                  />

                  {/* Section 4: Clock & Timer Style */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                        Saat & Zamanlayıcı Yazı Tipi
                      </h3>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: 99,
                          background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3
                        }}
                      >
                        ⚡ PLUS
                      </span>
                    </div>

                    {/* 12 Font Style Cards Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                        gap: 14
                      }}
                    >
                      {(Object.keys(CLOCK_FONT_STYLES) as ClockFontStyle[]).map((styleKey) => {
                        const fontObj = CLOCK_FONT_STYLES[styleKey];
                        const isSelected = clockStyle === styleKey;

                        return (
                          <div
                            key={styleKey}
                            onClick={() => {
                              sounds.playClick();
                              setClockStyle(styleKey);
                            }}
                            style={{
                              background: '#14151C',
                              borderRadius: 16,
                              padding: '20px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                              border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                              boxShadow: isSelected ? '0 0 20px rgba(255, 255, 255, 0.15)' : 'none',
                              transition: 'all 0.15s ease',
                              minHeight: 110
                            }}
                          >
                            {fontObj.isFree && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  left: 12,
                                  fontSize: 9.5,
                                  fontWeight: 800,
                                  color: 'rgba(255, 255, 255, 0.65)',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                ÜCRETSİZ
                              </span>
                            )}

                            <div
                              style={{
                                fontSize: isDesktop ? 34 : 28,
                                color: '#FFFFFF',
                                marginBottom: 10,
                                ...fontObj.style
                              }}
                            >
                              12:24
                            </div>

                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'
                              }}
                            >
                              {fontObj.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FOCUS TIMER SETTINGS (Screenshot 2 Exact) */}
              {activeSettingsTab === 'focustimer' && (
                <div>
                  {/* Top Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: '#FFF' }}>Özel Zamanlayıcı Yazı Tipi</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        padding: '2px 7px',
                        borderRadius: 99,
                        background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                        color: '#FFFFFF'
                      }}
                    >
                      ⚡ PLUS
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 20 }}>
                    Zamanlayıcı ve saat stilini özelleştirmek için{' '}
                    <span
                      onClick={() => setActiveSettingsTab('clock')}
                      style={{ color: '#C084FC', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Saat ayarları
                    </span>
                    'na gidin.
                  </div>

                  {/* Section: Timer Style */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                        Zamanlayıcı Görünümü
                      </h3>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: 99,
                          background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                          color: '#FFFFFF'
                        }}
                      >
                        ⚡ PLUS
                      </span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#4ADE80'
                        }}
                      >
                        YENİ
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 14 }}>
                      Kalan sürenin ana ekranda nasıl görüntüleneceğini seçin.
                    </div>

                    {/* 6 Visual Timer Cards */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                        gap: 14,
                        marginBottom: 24
                      }}
                    >
                      {[
                        { id: 'default' as const, label: 'Standart', preview: <span style={{ fontSize: 26, fontWeight: 800 }}>25:00</span> },
                        {
                          id: 'flip' as const,
                          label: 'Flip Saat',
                          preview: (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <div style={{ padding: '6px 10px', background: '#20222C', borderRadius: 6, fontWeight: 900, fontSize: 18 }}>2</div>
                              <div style={{ padding: '6px 10px', background: '#20222C', borderRadius: 6, fontWeight: 900, fontSize: 18 }}>5</div>
                            </div>
                          )
                        },
                        {
                          id: 'progressbar' as const,
                          label: 'İlerleme Çubuğu',
                          preview: (
                            <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 800 }}>25:00</span>
                              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ width: '60%', height: '100%', background: '#FFF' }} />
                              </div>
                            </div>
                          )
                        },
                        {
                          id: 'gauge' as const,
                          label: 'Gösterge',
                          preview: (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <div style={{ width: 26, height: 26, borderRadius: '50%', border: '3px solid #FFF', borderTopColor: 'transparent' }} />
                              <span style={{ fontSize: 11, fontWeight: 700 }}>25:00</span>
                            </div>
                          )
                        },
                        {
                          id: 'dots' as const,
                          label: 'Nokta Matrisi',
                          preview: (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
                                {Array.from({ length: 15 }).map((_, i) => (
                                   <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i < 8 ? '#FFF' : 'rgba(255,255,255,0.25)' }} />
                                ))}
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700 }}>25:00</span>
                            </div>
                          )
                        },
                        {
                          id: 'pie' as const,
                          label: 'Pasta Dilimi',
                          preview: (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'conic-gradient(#FFF 65%, rgba(255,255,255,0.2) 0)' }} />
                              <span style={{ fontSize: 11, fontWeight: 700 }}>25:00</span>
                            </div>
                          )
                        }
                      ].map((card) => {
                        const isSelected = timerWidgetStyle === card.id;
                        return (
                          <div
                            key={card.id}
                            onClick={() => {
                              sounds.playClick();
                              setTimerWidgetStyle(card.id);
                            }}
                            style={{
                              background: '#14151C',
                              borderRadius: 16,
                              padding: '16px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                              boxShadow: isSelected ? '0 0 20px rgba(255, 255, 255, 0.15)' : 'none',
                              transition: 'all 0.15s ease',
                              minHeight: 105
                            }}
                          >
                            <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {card.preview}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)', marginTop: 8 }}>
                              {card.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <FlocusSwitch
                      checked={showTimerProgressBar}
                      onChange={setShowTimerProgressBar}
                      label="Zamanlayıcı İlerleme Çubuğunu Göster"
                      plus
                      description="Zamanlayıcının hemen altında görsel bir ilerleme çubuğu görüntüler."
                    />

                    <FlocusSwitch
                      checked={showBrowserNotification}
                      onChange={setShowBrowserNotification}
                      label="Masaüstü Bildirimleri"
                      plus
                      description="Odak veya mola süresi tamamlandığında sistem bildirimi gönderir."
                    />

                    <FlocusSwitch
                      checked={autoStartBreaks}
                      onChange={setAutoStartBreaks}
                      label="Bölüm Bittiğinde Otomatik Başlat"
                      description="Odak ve mola seansları arasında duraklatmadan otomatik olarak devam eder."
                    />

                    <FlocusSwitch
                      checked={showStreakCounter}
                      onChange={setShowStreakCounter}
                      label="Seri Sayacını Göster"
                      description="Üst gösterge çubuğunda aktif odaklanma serisi alev simgesini gösterir."
                    />

                    <FlocusSwitch
                      checked={showTaskInPip}
                      onChange={setShowTaskInPip}
                      label="Görevi Resim-İçinde-Resim (PiP) Modunda Göster"
                      plus
                      description="Çalıştığınız görevi ekran üzerinde yüzen küçük bir pencerede açık tutar."
                    />

                    {/* Duration Sliders */}
                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#FFF' }}>Zamanlayıcı Süreleri</div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                          <span>Odaklanma Süresi (Dakika)</span>
                          <span style={{ color: currentTheme.accent }}>{workDuration} dk</span>
                        </div>
                        <ModernSlider
                          min={10}
                          max={90}
                          step={5}
                          value={workDuration}
                          accentColor={currentTheme.accent}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setWorkDuration(v);
                            if (pomodoroPhase === 'work' && !isRunning) setTimeLeft(v * 60);
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                          <span>Kısa Mola (Dakika)</span>
                          <span style={{ color: '#00F0FF' }}>{shortBreakDuration} dk</span>
                        </div>
                        <ModernSlider
                          min={2}
                          max={20}
                          step={1}
                          value={shortBreakDuration}
                          accentColor="#00F0FF"
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setShortBreakDuration(v);
                            if (pomodoroPhase === 'short_break' && !isRunning) setTimeLeft(v * 60);
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                          <span>Uzun Mola (Dakika)</span>
                          <span style={{ color: '#A855F7' }}>{longBreakDuration} dk</span>
                        </div>
                        <ModernSlider
                          min={10}
                          max={45}
                          step={5}
                          value={longBreakDuration}
                          accentColor="#A855F7"
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setLongBreakDuration(v);
                            if (pomodoroPhase === 'long_break' && !isRunning) setTimeLeft(v * 60);
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                          <span>Uzun Mola Sıklığı</span>
                          <span style={{ color: '#FFB800' }}>Her {longBreakInterval} seansta</span>
                        </div>
                        <ModernSlider
                          min={2}
                          max={8}
                          step={1}
                          value={longBreakInterval}
                          accentColor="#FFB800"
                          onChange={(e) => setLongBreakInterval(parseInt(e.target.value))}
                        />
                      </div>

                      <FlocusSwitch
                        checked={autoStartFocus}
                        onChange={setAutoStartFocus}
                        label="Moladan Sonra Odaklanmayı Otomatik Başlat"
                        description="Mola bittiğinde odaklanma seansını otomatik olarak devam ettirir."
                      />

                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginBottom: 8 }}>Çalışma Tekniği</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setTimerSubMode('pomodoro');
                              setWorkDuration(30);
                              setShortBreakDuration(5);
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 10,
                              border: 'none',
                              background: timerSubMode === 'pomodoro' ? '#7C3AED' : 'rgba(255,255,255,0.08)',
                              color: '#FFF',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Standart Pomodoro (30/5)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTimerSubMode('animedoro');
                              setWorkDuration(45);
                              setShortBreakDuration(20);
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 10,
                              border: 'none',
                              background: timerSubMode === 'animedoro' ? '#7C3AED' : 'rgba(255,255,255,0.08)',
                              color: '#FFF',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Animedoro (45/20)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: STATS SETTINGS (Gerçek Veri Analitiği) */}
              {activeSettingsTab === 'stats' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Card 1: Focus Calendar */}
                  <div
                    style={{
                      background: '#13141C',
                      borderRadius: 18,
                      padding: 22,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                        Odaklanma Takvimi
                      </h3>

                      <div style={{ display: 'flex', gap: 12 }}>
                        {/* Hours / Sessions toggle */}
                        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, padding: 3 }}>
                          <button
                            onClick={() => setStatsViewMode('hours')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 99,
                              border: 'none',
                              background: statsViewMode === 'hours' ? '#FFF' : 'transparent',
                              color: statsViewMode === 'hours' ? '#000' : '#FFF',
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Saat
                          </button>
                          <button
                            onClick={() => setStatsViewMode('sessions')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 99,
                              border: 'none',
                              background: statsViewMode === 'sessions' ? '#FFF' : 'transparent',
                              color: statsViewMode === 'sessions' ? '#000' : '#FFF',
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Seans
                          </button>
                        </div>

                        {/* 6 months / 1 year toggle */}
                        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, padding: 3 }}>
                          <button
                            onClick={() => setStatsTimeRange('6months')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 99,
                              border: 'none',
                              background: statsTimeRange === '6months' ? '#FFF' : 'transparent',
                              color: statsTimeRange === '6months' ? '#000' : '#FFF',
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            6 Ay
                          </button>
                          <button
                            onClick={() => setStatsTimeRange('1year')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 99,
                              border: 'none',
                              background: statsTimeRange === '1year' ? '#FFF' : 'transparent',
                              color: statsTimeRange === '1year' ? '#000' : '#FFF',
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            1 Yıl
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unblurred Heatmap (Gerçek Çalışma Verileriyle) */}
                    <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateRows: 'repeat(7, 13px)',
                          gridAutoFlow: 'column',
                          gap: 4,
                          minWidth: 500
                        }}
                      >
                        {heatmapDays.map((day, idx) => {
                          let bg = 'rgba(255, 255, 255, 0.05)';
                          if (statsViewMode === 'hours') {
                            if (day.minutes > 120) bg = '#C084FC';
                            else if (day.minutes > 60) bg = '#9333EA';
                            else if (day.minutes > 30) bg = '#6B21A8';
                            else if (day.minutes > 0) bg = '#3B1C68';
                          } else {
                            if (day.sessions >= 4) bg = '#C084FC';
                            else if (day.sessions === 3) bg = '#9333EA';
                            else if (day.sessions === 2) bg = '#6B21A8';
                            else if (day.sessions >= 1) bg = '#3B1C68';
                          }

                          const formattedDate = day.dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                          const tooltip = day.minutes > 0
                            ? `${formattedDate}: ${day.minutes} dk (${(day.minutes / 60).toFixed(1)} sa) odaklanma • ${day.sessions} seans`
                            : `${formattedDate}: Dinlenme`;

                          return (
                            <div
                              key={day.dateStr || idx}
                              title={tooltip}
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: 3,
                                background: bg,
                                transition: 'transform 0.15s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                      <span>{heatmapDateRange.start}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>Az</span>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#3B1C68' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#6B21A8' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#9333EA' }} />
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#C084FC' }} />
                        <span>Çok</span>
                      </div>
                      <span>{heatmapDateRange.end}</span>
                    </div>
                  </div>

                  {/* Card 2: Focus Trend (Gerçek Odaklanma Eğrisi) */}
                  <div
                    style={{
                      background: '#13141C',
                      borderRadius: 18,
                      padding: 22,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                        Odaklanma Trendi
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#A855F7',
                          background: 'rgba(168, 85, 247, 0.15)',
                          padding: '3px 8px',
                          borderRadius: 8
                        }}
                      >
                        ⚡ NetFocus Plus Açık: Tüm Geçmiş Analitiği
                      </span>
                    </div>

                    {/* Smooth Curved Line Chart */}
                    <div style={{ position: 'relative', width: '100%', height: 170 }}>
                      <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Area fill */}
                        {trendData.areaPath && (
                          <path
                            d={trendData.areaPath}
                            fill="url(#trendGrad)"
                          />
                        )}

                        {/* Curve stroke */}
                        {trendData.curvePath && (
                          <path
                            d={trendData.curvePath}
                            fill="transparent"
                            stroke="#7C3AED"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Interactive Markers with Real Data */}
                        {trendData.points.map((pt, i) => (
                          <g key={i}>
                            {/* Marker dot */}
                            <circle cx={pt.cx} cy={pt.cy} r="5" fill="#C084FC" stroke="#FFF" strokeWidth="2" />
                            {/* Text label above */}
                            <text
                              x={pt.cx}
                              y={Math.max(16, pt.cy - 10)}
                              fill="rgba(255, 255, 255, 0.9)"
                              fontSize="11"
                              fontWeight="700"
                              textAnchor="middle"
                            >
                              {pt.timeLabel}
                            </text>
                            {/* Date below */}
                            <text
                              x={pt.cx}
                              y={150}
                              fill="rgba(255, 255, 255, 0.55)"
                              fontSize="10.5"
                              fontWeight="600"
                              textAnchor="middle"
                            >
                              {pt.dateLabel}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THEMES SETTINGS (Screenshot 4 Exact) */}
              {activeSettingsTab === 'themes' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#FFF' }}>
                      Theme Library
                    </h3>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 900,
                        padding: '2px 7px',
                        borderRadius: 6,
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ADE80'
                      }}
                    >
                      NEW
                    </span>
                  </div>

                  {/* Filter Pills from Screenshot 4 */}
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 18 }}>
                    {['All', 'Scenic', 'Interior', 'Urban', 'Animated', 'Gradients & Colors', 'Abstract'].map((cat) => {
                      const isFilterActive = themeCategoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setThemeCategoryFilter(cat)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 99,
                            border: 'none',
                            background: isFilterActive ? '#7C3AED' : 'rgba(255, 255, 255, 0.08)',
                            color: isFilterActive ? '#FFF' : 'rgba(255, 255, 255, 0.75)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Themes Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                      gap: 14,
                      marginBottom: 24
                    }}
                  >
                    {FLOCUS_THEMES.filter(
                      (th) => themeCategoryFilter === 'All' || th.category === themeCategoryFilter
                    ).map((th) => {
                      const isSelected = th.id === currentTheme.id;
                      return (
                        <div
                          key={th.id}
                          onClick={() => {
                            sounds.playThemeSwitch();
                            setCurrentTheme(th);
                          }}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                          }}
                        >
                          {/* Thumbnail preview */}
                          <div
                            style={{
                              height: 100,
                              borderRadius: 14,
                              background: th.url ? `url(${th.url}) center/cover no-repeat` : th.gradient,
                              border: isSelected ? '2.5px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.12)',
                              boxShadow: isSelected ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none',
                              position: 'relative',
                              overflow: 'hidden',
                              transition: 'transform 0.15s ease, border 0.15s ease'
                            }}
                          >
                            {th.isPlus && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  fontSize: 9,
                                  fontWeight: 900,
                                  padding: '2px 6px',
                                  borderRadius: 99,
                                  background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                                  color: '#FFFFFF'
                                }}
                              >
                                PLUS
                              </span>
                            )}
                            {isSelected && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: '#FFF',
                                  boxShadow: '0 0 8px #FFF'
                                }}
                              />
                            )}
                          </div>

                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                              textAlign: 'center'
                            }}
                          >
                            {th.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dimmer & Blur controls */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 18 }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                        <span>Arka Plan Karartma (Dimmer)</span>
                        <span>%{bgDimmer}</span>
                      </div>
                      <ModernSlider
                        min={0}
                        max={80}
                        value={bgDimmer}
                        accentColor={currentTheme.accent}
                        onChange={(e) => setBgDimmer(parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                        <span>Arka Plan Bulanıklığı (Blur)</span>
                        <span>{bgBlur}px</span>
                      </div>
                      <ModernSlider
                        min={0}
                        max={16}
                        value={bgBlur}
                        accentColor={currentTheme.accent}
                        onChange={(e) => setBgBlur(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: QUOTES */}
              {activeSettingsTab === 'quotes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                    Motivasyon Sözleri
                  </h3>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: 18,
                      borderRadius: 16,
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>
                      &ldquo;{FLOCUS_QUOTES[quoteIndex].text}&rdquo;
                    </div>
                    <div style={{ fontSize: 12, color: '#C084FC', fontWeight: 600 }}>
                      — {FLOCUS_QUOTES[quoteIndex].author}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setQuoteIndex((prev) => (prev + 1) % FLOCUS_QUOTES.length);
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#FFF',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    Farklı Bir Söz Getir 🎲
                  </button>
                </div>
              )}

              {/* TAB 6: EXTRAS */}
              {activeSettingsTab === 'extras' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                    Ekstra Efektler & Özellikler
                  </h3>

                  <FlocusSwitch
                    checked={enableTickSound}
                    onChange={setEnableTickSound}
                    label="Tik-Tak Metronom Sesi"
                    description="Her saniye odaklanmayı derinleştiren hafif akustik tik-tak ritmi."
                  />

                  <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: '#FFF', marginBottom: 4 }}>
                      Zen Meditasyon Çanı (Tibet Kasesi)
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 10 }}>
                      Mola ve odak bitişlerinde huzurlu akustik çan sesi çalar.
                    </div>
                    <button
                      onClick={() => ambientEngine.playZenChime()}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#FFF',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Sesi Test Et 🔔
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: ACCOUNT */}
              {activeSettingsTab === 'account' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                    Hesabım & Üyelik
                  </h3>

                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(99, 102, 241, 0.15))',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: 18,
                      padding: 22
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <Zap size={20} fill="#C084FC" color="#C084FC" />
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>
                        NetFocus Plus Aktif
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: '#4ADE80',
                          color: '#000'
                        }}
                      >
                        ÖMÜR BOYU ÜCRETSİZ
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5, marginBottom: 12 }}>
                      Öğrenci profilinize ({profile.name}) özel tüm temalar, 12 tipografi stili, 6 sayaç widgetı ve sınırsız analitik takvim kilitleri tamamen açılmıştır.
                    </div>
                    <div style={{ fontSize: 12, color: '#FFB800', fontWeight: 800 }}>
                      🔥 Bugün NetFocus ile toplam odaklanma: {Math.floor(totalFocusedSecondsToday / 60)} dakika ({completedRounds} seans tamamlandı)
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8 & 9: SUPPORT & WHAT'S NEW */}
              {(activeSettingsTab === 'support' || activeSettingsTab === 'whatsnew') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: '#FFF' }}>
                    {activeSettingsTab === 'support' ? 'Destek & İpuçları' : 'NetFocus v2.4 Yenilikleri'}
                  </h3>
                  <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                    • <strong>Boşluk Tuşu:</strong> Zamanlayıcıyı başlat / durdur.<br />
                    • <strong>R Tuşu:</strong> Sayacı sıfırla.<br />
                    • <strong>12 Tipografi Seçeneği:</strong> Clock ayarlarından Bubble, Soft, Serif, Digital gibi stilleri anında seçebilirsiniz.<br />
                    • <strong>6 Sayaç Widgetı:</strong> Flip Clock, Progress Bar, Gauge, Dot Matrix ve Pie stilleriyle ders çalışmayı görsel bir şölene dönüştürün.<br />
                    • <strong>Tamamen Ücretsiz:</strong> Tüm Flocus Plus özellikleri sınırsız olarak öğrencilerin kullanımına sunuldu!
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
