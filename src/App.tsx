import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Home,
  Calendar as CalendarIcon,
  BarChart3,
  User,
  Plus,
  Minus,
  Clock,
  Target,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  CheckCircle2,
  Circle,
  PenTool,
  Timer,
  ChevronRight,
  Palette,
  Volume2,
  VolumeX,
  BookOpen,
  ChevronDown,
  Search,
  Flame,
  Shield,
  ShieldCheck,
  Zap,
  Printer,
  Smartphone,
  Camera,
  Check,
  Trash2,
  Award,
  Download,
  Upload,
  Brain,
  ArrowLeft,
  ArrowRight,
  Cloud,
  CloudOff,
  LogOut,
  Monitor,
  Bot,
  Image as ImageIcon,
  XCircle,
  Eye,
  EyeOff,
  Maximize2,
  Settings
} from 'lucide-react';
import { AiTutorScreenView } from './components/AiTutorView';
import { FlocusPomodoroView } from './components/FlocusPomodoroView';
import { OsymDistributionView } from './components/OsymDistributionView';
import { OnboardingModal } from './components/OnboardingModal';
import { WeeklyQuestionSchedule } from './components/WeeklyQuestionSchedule';
import { ModernSlider } from './components/ModernSlider';
import { OSYM_QUESTION_DISTRIBUTION } from './data/osymDistributionData';
import { sounds } from './lib/sound';
import {
  getCurrentCloudUser,
  pushPayloadToCloud,
  pullPayloadFromCloud,
  loginCloudUser,
  registerCloudUser,
  logoutCloudUser,
  setCustomSupabaseConfig,
  removeCustomSupabaseConfig,
  isRealSupabaseActive,
  type CloudUser
} from './lib/syncEngine';
import {
  YKS_SUBJECTS,
  INITIAL_PROFILE,
  INITIAL_EXAMS,
  INITIAL_TASKS,
  INITIAL_QUESTION_LOGS,
  INITIAL_QUESTION_VAULT,
  INITIAL_BOOKS,
  INITIAL_FLASHCARDS,
  YOK_ATLAS_BENCHMARKS,
  MOTIVATIONAL_QUOTES
} from './data/seedData';
import { YOK_ATLAS_DATASET_2025 } from './data/yokAtlasDataset';
import type {
  Exam,
  DailyTask,
  QuestionLog,
  StudentProfile,
  TopicStatus,
  QuestionVaultItem,
  QuestionDifficulty,
  BookTrackerItem,
  FlashcardItem,
  DepartmentBenchmark
} from './data/seedData';

type ThemeId = 'theme-blue' | 'theme-graphite' | 'theme-indigo' | 'theme-amber' | 'theme-mint' | 'theme-cyan' | 'theme-lime' | 'theme-purple' | 'theme-emerald';

const THEME_PRESETS: { id: ThemeId; name: string; color: string; desc: string }[] = [
  { id: 'theme-blue', name: 'Cupertino Blue', color: '#0A84FF', desc: 'Apple Sistem Mavisi (Önerilen)' },
  { id: 'theme-graphite', name: 'Space Gray', color: '#E5E5EA', desc: 'Doğal Titanyum & Nötr Gri' },
  { id: 'theme-indigo', name: 'Deep Indigo', color: '#5E5CE6', desc: 'Apple Koyu İndigo' },
  { id: 'theme-amber', name: 'Sunset Amber', color: '#FF9F0A', desc: 'Apple Doğal Turuncu' },
  { id: 'theme-mint', name: 'Activity Mint', color: '#63E6E2', desc: 'Apple Sağlık & Fitness Nane' }
];

type FeatureModalType = 'vault' | 'speed' | 'books' | 'rank' | 'benchmark' | 'report' | 'widget' | 'flashcards' | null;

// ============================================================================
// Main Application Component
// ============================================================================
export default function App() {
  // Navigation Tabs: 'home' | 'calendar' | 'analytics' | 'profile' | 'exams' | 'curriculum' | 'ai' | 'pomodoro' | 'osym'
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'analytics' | 'profile' | 'exams' | 'curriculum' | 'ai' | 'pomodoro' | 'osym'>(() => {
    try {
      const saved = localStorage.getItem('netmetrik_active_tab');
      if (saved && ['home', 'calendar', 'analytics', 'profile', 'exams', 'curriculum', 'ai', 'pomodoro', 'osym'].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return 'home';
  });
  const [isMuted, setIsMuted] = useState(() => sounds.isMuted());

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleNavigateTab = (tab: 'home' | 'calendar' | 'analytics' | 'profile' | 'exams' | 'curriculum' | 'ai' | 'pomodoro' | 'osym') => {
    if (tab !== activeTab) {
      sounds.playTabSwitch();
      setActiveTab(tab);
      try {
        localStorage.setItem('netmetrik_active_tab', tab);
      } catch {}
    }
  };

  // Global tactile button click sound delegation
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, .nav-item-icon-btn, .analiz-card-item, .quick-tool-card');
      if (target && !target.hasAttribute('data-no-click-sound')) {
        if (!target.classList.contains('nav-item-icon-btn')) {
          sounds.playClick();
        }
      }
    };
    window.addEventListener('click', handleGlobalClick, { passive: true });
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Core Persistent State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('netmetrik_student_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Ahmet Yılmaz') return INITIAL_PROFILE;
      return parsed;
    }
    return INITIAL_PROFILE;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return INITIAL_EXAMS;
    const saved = localStorage.getItem('netmetrik_student_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return INITIAL_TASKS;
    const saved = localStorage.getItem('netmetrik_student_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return INITIAL_QUESTION_LOGS;
    const saved = localStorage.getItem('netmetrik_student_question_logs');
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_LOGS;
  });

  // Feature 6: Question Vault (Hata Defteri) State
  const [questionVault, setQuestionVault] = useState<QuestionVaultItem[]>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return INITIAL_QUESTION_VAULT;
    const saved = localStorage.getItem('netmetrik_question_vault');
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_VAULT;
  });

  // Feature 8: Book Tracker State
  const [books, setBooks] = useState<BookTrackerItem[]>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return INITIAL_BOOKS;
    const saved = localStorage.getItem('netmetrik_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  // Feature 9: Flashcards (Hap Bilgi / Formül Kartları) State
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(() => {
    const saved = localStorage.getItem('netmetrik_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  // Topic Progress Map: topicKey -> TopicStatus
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicStatus>>(() => {
    const pSaved = localStorage.getItem('netmetrik_student_profile');
    if (pSaved && JSON.parse(pSaved).name === 'Ahmet Yılmaz') return {};
    const saved = localStorage.getItem('netmetrik_topic_progress');
    if (saved) return JSON.parse(saved);
    return {};
  });

  // Theme State (Apple System Presets - Cupertino Blue as primary)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('netmetrik_theme') as ThemeId;
    if (!saved || saved === 'theme-lime' || saved === 'theme-cyan') {
      return 'theme-blue';
    }
    return saved;
  });
  // View Mode: 'desktop' (Widescreen PC Browser Dashboard) vs 'mobile' (Native Phone Shell)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(() => {
    const saved = localStorage.getItem('netmetrik_view_mode') as 'desktop' | 'mobile';
    if (saved) return saved;
    return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'desktop' : 'mobile';
  });

  useEffect(() => {
    localStorage.setItem('netmetrik_theme', currentTheme);
    localStorage.setItem('netmetrik_view_mode', viewMode);
    document.body.className = `${currentTheme} ${viewMode === 'desktop' ? 'desktop-view-active' : 'mobile-preview-mode'}`;
  }, [currentTheme, viewMode]);

  // Modals State
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'question' | 'study_time' | 'task' | 'exam'>('question');
  const [activeAnalizModal, setActiveAnalizModal] = useState<'trend' | 'exam_time' | 'question_count' | 'study_time' | null>(null);
  
  // Selected Feature Modal for Features (6, 7, 8, 21, 22, 26, 27)
  const [activeFeatureModal, setActiveFeatureModal] = useState<FeatureModalType>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('netmetrik_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('netmetrik_student_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('netmetrik_student_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('netmetrik_student_question_logs', JSON.stringify(questionLogs));
  }, [questionLogs]);

  useEffect(() => {
    localStorage.setItem('netmetrik_question_vault', JSON.stringify(questionVault));
  }, [questionVault]);

  useEffect(() => {
    localStorage.setItem('netmetrik_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('netmetrik_topic_progress', JSON.stringify(topicProgress));
  }, [topicProgress]);

  useEffect(() => {
    localStorage.setItem('netmetrik_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  // Cloud Sync & Guest Mode State
  const [cloudUser, setCloudUser] = useState<CloudUser | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const onboarded = localStorage.getItem('netmetrik_onboarded');
    return !onboarded;
  });

  // 1. Initial Cloud Auth Check & Hydrate
  useEffect(() => {
    getCurrentCloudUser().then(async (user) => {
      if (user) {
        setCloudUser(user);
        setShowOnboardingModal(false);
        try {
          const cloudData = await pullPayloadFromCloud();
          if (cloudData) {
            if (cloudData.profile) setProfile(cloudData.profile);
            if (Array.isArray(cloudData.exams)) setExams(cloudData.exams);
            if (Array.isArray(cloudData.tasks)) setTasks(cloudData.tasks);
            if (Array.isArray(cloudData.questionLogs)) setQuestionLogs(cloudData.questionLogs);
            if (Array.isArray(cloudData.questionVault)) setQuestionVault(cloudData.questionVault);
            if (Array.isArray(cloudData.books)) setBooks(cloudData.books);
            if (cloudData.topicProgress) setTopicProgress(cloudData.topicProgress);
            if (Array.isArray(cloudData.flashcards)) setFlashcards(cloudData.flashcards);
            setLastSyncedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
          }
        } catch (err) {
          console.warn('Initial cloud pull error:', err);
        }
      } else {
        const onboarded = localStorage.getItem('netmetrik_onboarded');
        if (!onboarded) {
          setShowOnboardingModal(true);
        }
      }
    });
  }, []);

  // 2. Tab Visibility Check (Auto-pull when opening app on another device/tab)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && cloudUser) {
        try {
          const cloudData = await pullPayloadFromCloud();
          if (cloudData) {
            if (cloudData.profile) setProfile(cloudData.profile);
            if (Array.isArray(cloudData.exams)) setExams(cloudData.exams);
            if (Array.isArray(cloudData.tasks)) setTasks(cloudData.tasks);
            if (Array.isArray(cloudData.questionLogs)) setQuestionLogs(cloudData.questionLogs);
            if (Array.isArray(cloudData.questionVault)) setQuestionVault(cloudData.questionVault);
            if (Array.isArray(cloudData.books)) setBooks(cloudData.books);
            if (cloudData.topicProgress) setTopicProgress(cloudData.topicProgress);
            if (Array.isArray(cloudData.flashcards)) setFlashcards(cloudData.flashcards);
            setLastSyncedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
          }
        } catch (err) {
          console.warn('Visibility cloud pull error:', err);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cloudUser]);

  // 3. Debounced Auto-Push on any state change (Only if logged in; guest mode remains purely local)
  useEffect(() => {
    if (!cloudUser) return;
    const timer = setTimeout(() => {
      pushPayloadToCloud({
        version: 1,
        clientUpdatedAt: new Date().toISOString(),
        profile,
        exams,
        tasks,
        questionLogs,
        questionVault,
        books,
        topicProgress,
        flashcards
      }).then((ok) => {
        if (ok) {
          setLastSyncedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [cloudUser, profile, exams, tasks, questionLogs, questionVault, books, topicProgress, flashcards]);

  const handleCloudLogin = async (email: string, pass: string) => {
    const user = await loginCloudUser(email, pass);
    setCloudUser(user);
    localStorage.setItem('netmetrik_onboarded', 'true');
    setShowOnboardingModal(false);
    sounds.playSuccess();
    confetti({ particleCount: 50, spread: 60 });
    const cloudData = await pullPayloadFromCloud();
    if (cloudData) {
      if (cloudData.profile) setProfile(cloudData.profile);
      if (Array.isArray(cloudData.exams)) setExams(cloudData.exams);
      if (Array.isArray(cloudData.tasks)) setTasks(cloudData.tasks);
      if (Array.isArray(cloudData.questionLogs)) setQuestionLogs(cloudData.questionLogs);
      if (Array.isArray(cloudData.questionVault)) setQuestionVault(cloudData.questionVault);
      if (Array.isArray(cloudData.books)) setBooks(cloudData.books);
      if (cloudData.topicProgress) setTopicProgress(cloudData.topicProgress);
      if (Array.isArray(cloudData.flashcards)) setFlashcards(cloudData.flashcards);
    } else {
      await pushPayloadToCloud({
        version: 1,
        clientUpdatedAt: new Date().toISOString(),
        profile,
        exams,
        tasks,
        questionLogs,
        questionVault,
        books,
        topicProgress,
        flashcards
      });
    }
    setLastSyncedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCloudRegister = async (
    email: string,
    pass: string,
    name: string,
    classLevel?: string,
    fieldTrack?: 'sayisal' | 'sozel' | 'esit_agirlik' | 'dil'
  ) => {
    const user = await registerCloudUser(email, pass, name, classLevel, fieldTrack);
    setCloudUser(user);
    const updatedProfile: StudentProfile = {
      ...profile,
      name: name || profile.name,
      classLevel: classLevel || profile.classLevel,
      fieldTrack: fieldTrack || profile.fieldTrack
    };
    setProfile(updatedProfile);
    localStorage.setItem('netmetrik_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('netmetrik_onboarded', 'true');
    setShowOnboardingModal(false);
    sounds.playSuccess();
    confetti({ particleCount: 70, spread: 80 });
    await pushPayloadToCloud({
      version: 1,
      clientUpdatedAt: new Date().toISOString(),
      profile: updatedProfile,
      exams,
      tasks,
      questionLogs,
      questionVault,
      books,
      topicProgress,
      flashcards
    });
    setLastSyncedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCloudLogout = async () => {
    await logoutCloudUser();
    setCloudUser(null);
    setLastSyncedTime(null);
    sounds.playClick();
  };

  const todayStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  // Feature 15: Pomodoro Timer & Freeform Stopwatch State
  const [timerType, setTimerType] = useState<'countdown' | 'stopwatch'>('countdown');
  const [studyDurationMinutes, setStudyDurationMinutes] = useState(25);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [selectedTimerSubject, setSelectedTimerSubject] = useState('TYT Matematik');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Freeform Stopwatch State
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  // Countdown Interval
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      sounds.playPomodoroChime();
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      if (timerMode === 'study') {
        setCompletedSessionsCount((c) => c + 1);
        const autoLog: QuestionLog = {
          id: `ql-pomo-${Date.now()}`,
          date: todayStr,
          subjectName: selectedTimerSubject,
          sourceBook: 'Pomodoro Odak Seansı',
          count: 0,
          durationMinutes: studyDurationMinutes
        };
        setQuestionLogs((prev) => [autoLog, ...prev]);

        alert(`🎉 Tebrikler! ${studyDurationMinutes} dakikalık ${selectedTimerSubject} odaklanma seansını tamamladın. Şimdi ${breakDurationMinutes} dakika mola zamanı!`);
        setTimerMode('break');
        setTimerSeconds(breakDurationMinutes * 60);
      } else {
        alert('🔔 Mola bitti! Yeni bir odaklanma seansına başlamaya hazır mısın?');
        setTimerMode('study');
        setTimerSeconds(studyDurationMinutes * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode, studyDurationMinutes, breakDurationMinutes, selectedTimerSubject, todayStr]);

  // Stopwatch Interval
  useEffect(() => {
    let interval: any;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const handleSwitchTimerMode = (mode: 'study' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds((mode === 'study' ? studyDurationMinutes : breakDurationMinutes) * 60);
  };

  const handleSetTimerDuration = (mins: number) => {
    const validMins = Math.max(1, Math.min(180, mins));
    if (timerMode === 'study') {
      setStudyDurationMinutes(validMins);
      if (!isTimerRunning) setTimerSeconds(validMins * 60);
    } else {
      setBreakDurationMinutes(validMins);
      if (!isTimerRunning) setTimerSeconds(validMins * 60);
    }
  };

  const handleAdjustTimerDelta = (deltaMinutes: number) => {
    const currentMins = timerMode === 'study' ? studyDurationMinutes : breakDurationMinutes;
    const newMins = Math.max(1, Math.min(180, currentMins + deltaMinutes));
    handleSetTimerDuration(newMins);
    if (isTimerRunning) {
      setTimerSeconds((prev) => Math.max(10, prev + deltaMinutes * 60));
    }
  };

  const handleSaveStopwatchSession = () => {
    if (stopwatchSeconds < 30) {
      alert('Süreyi kaydetmek için en az 30 saniye çalışmalısınız.');
      return;
    }
    const mins = Math.max(1, Math.round(stopwatchSeconds / 60));
    const newLog: QuestionLog = {
      id: `ql-sw-${Date.now()}`,
      date: todayStr,
      subjectName: selectedTimerSubject,
      sourceBook: 'Serbest Kronometre Çalışması',
      count: 0,
      durationMinutes: mins
    };
    setQuestionLogs((prev) => [newLog, ...prev]);
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
    sounds.playSuccess();
    confetti({ particleCount: 60, spread: 60 });
    alert(`🎉 ${mins} dakikalık serbest çalışma oturumu başarıyla kaydedildi!`);
  };

  // YKS Countdown Logic
  const [countdown, setCountdown] = useState({ days: 236, hours: 14, mins: 28, secs: 40 });

  useEffect(() => {
    const yksDate = new Date('2027-06-19T10:15:00+03:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = yksDate - now;
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayLogs = questionLogs.filter((l) => l.date === todayStr);
  const todaySolvedQuestions = todayLogs.reduce((sum, item) => sum + item.count, 0);
  const todayStudyMinutes = todayLogs.reduce((sum, item) => sum + item.durationMinutes, 0);

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            sounds.playSuccess();
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
          } else {
            sounds.playToggle(false);
          }
          return { ...t, isCompleted: nextState, solvedQuestions: nextState ? t.targetQuestions : 0 };
        }
        return t;
      })
    );
  };

  // Cycle Topic Status
  const handleCycleTopicStatus = (topicKey: string) => {
    const order: TopicStatus[] = ['not_started', 'in_progress', 'completed', 'needs_review'];
    const current = topicProgress[topicKey] || 'not_started';
    const next = order[(order.indexOf(current) + 1) % order.length];
    if (next === 'completed') {
      sounds.playSuccess();
    } else {
      sounds.playToggle(true);
    }
    setTopicProgress((prev) => ({ ...prev, [topicKey]: next }));
  };

  // Toggle Topic Completed State directly (Tick / Untick)
  const handleToggleTopicCompleted = (topicKey: string) => {
    const isCompleted = topicProgress[topicKey] === 'completed';
    const next: TopicStatus = isCompleted ? 'not_started' : 'completed';
    if (next === 'completed') {
      sounds.playSuccess();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 } });
    } else {
      sounds.playToggle(false);
    }
    setTopicProgress((prev) => ({ ...prev, [topicKey]: next }));
  };

  // Add Question Log Handler (Flexible to handle topic, date, count, duration)
  const handleAddQuestionLog = (
    subject: string,
    arg2?: string,
    arg3?: string | number,
    arg4?: number,
    arg5?: number,
    arg6?: string,
    arg7?: number,
    arg8?: number
  ) => {
    let topicName = 'Genel Soru Çözümü';
    let sourceBook = 'Soru Bankası';
    let count = 0;
    let durationMinutes = 0;
    let date = todayStr;
    let correctCount: number | undefined;
    let wrongCount: number | undefined;

    if (typeof arg3 === 'number') {
      // Called as: (subject, source, count, minutes)
      sourceBook = arg2 || 'Soru Bankası';
      count = arg3;
      durationMinutes = arg4 || 0;
    } else {
      // Called as: (subject, topic, source, count, minutes, date, correct, wrong)
      topicName = arg2 || 'Genel Soru Çözümü';
      sourceBook = (arg3 as string) || 'Soru Bankası';
      count = (arg4 as number) || 0;
      durationMinutes = (arg5 as number) || 0;
      if (arg6) date = arg6;
      correctCount = arg7;
      wrongCount = arg8;
    }

    const newLog: QuestionLog = {
      id: `ql-${Date.now()}`,
      date,
      subjectName: subject,
      topicName,
      sourceBook,
      count: Number(count),
      durationMinutes: Number(durationMinutes),
      correctCount,
      wrongCount
    };

    setQuestionLogs((prev) => [newLog, ...prev]);
    sounds.playSuccess();
    confetti({ particleCount: 50, spread: 60 });
    setShowQuickModal(false);
  };

  // Delete Question Log Handler
  const handleDeleteQuestionLog = (id: string) => {
    setQuestionLogs((prev) => prev.filter((q) => q.id !== id));
    sounds.playClick();
  };

  // Add Task Handler
  const handleAddTask = (subjectCode: string, subjectName: string, topic: string, targetQ: number, minutes: number) => {
    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      subjectCode,
      subjectName,
      topicName: topic,
      targetQuestions: Number(targetQ),
      solvedQuestions: 0,
      targetMinutes: Number(minutes),
      spentMinutes: 0,
      isCompleted: false,
      date: todayStr
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowQuickModal(false);
  };

  // Feature 17: Streak Freeze Activator
  const handleActivateStreakFreeze = () => {
    if (profile.streakFreezeAvailable <= 0) {
      alert('Kullanılabilir seri koruma kalkanınız kalmadı.');
      return;
    }
    if (profile.streakFreezeActive) {
      alert('Seri koruma kalkanınız zaten bugün için aktif!');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      streakFreezeActive: true,
      streakFreezeAvailable: prev.streakFreezeAvailable - 1
    }));
    sounds.playSuccess();
    confetti({ particleCount: 50, spread: 50 });
  };

  // Feature 6: Question Vault Handlers
  const handleToggleVaultItemResolved = (id: string) => {
    setQuestionVault((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.isResolved;
          if (next) sounds.playSuccess();
          return { ...item, isResolved: next };
        }
        return item;
      })
    );
  };

  const handleDeleteVaultItem = (id: string) => {
    sounds.playClick();
    setQuestionVault((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddVaultItem = (newItem: QuestionVaultItem) => {
    setQuestionVault((prev) => [newItem, ...prev]);
    sounds.playSuccess();
    confetti({ particleCount: 40, spread: 50 });
  };

  // Feature 8: Book Tracker Handlers
  const handleAdjustBookTests = (bookId: string, delta: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const next = Math.max(0, Math.min(b.totalTests, b.completedTests + delta));
          if (delta > 0) sounds.playClick();
          return { ...b, completedTests: next };
        }
        return b;
      })
    );
  };

  const handleAddBook = (newBook: BookTrackerItem) => {
    setBooks((prev) => [...prev, newBook]);
    sounds.playSuccess();
  };

  // Feature 5: Spaced Repetition (Leitner) Handler for Question Vault
  const handleAdvanceReviewStage = (id: string, remembered: boolean) => {
    setQuestionVault((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (!remembered) {
            sounds.playClick();
            return {
              ...item,
              reviewStage: 1,
              nextReviewDate: '2026-10-21',
              isResolved: false
            };
          }

          const currentStage = item.reviewStage || 1;
          sounds.playSuccess();
          if (currentStage >= 4) {
            confetti({ particleCount: 50, spread: 60 });
            return {
              ...item,
              reviewStage: 4,
              isResolved: true
            };
          }

          let nextDate = '2026-10-23'; // +3 days for stage 2
          if (currentStage === 2) nextDate = '2026-10-27'; // +7 days for stage 3
          if (currentStage === 3) nextDate = '2026-11-10'; // +21 days for stage 4

          return {
            ...item,
            reviewStage: currentStage + 1,
            nextReviewDate: nextDate,
            isResolved: false
          };
        }
        return item;
      })
    );
  };

  // Feature 9: Flashcards Handler
  const handleToggleMasteredFlashcard = (id: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => {
        if (fc.id === id) {
          const next = !fc.isMastered;
          if (next) {
            sounds.playSuccess();
            confetti({ particleCount: 40, spread: 50 });
          } else {
            sounds.playClick();
          }
          return { ...fc, isMastered: next };
        }
        return fc;
      })
    );
  };

  // Feature 4: AI Koç Task Handler
  const handleAddTaskFromAi = (suggestion: {
    subjectCode: string;
    subjectName: string;
    topicName: string;
    targetQuestions: number;
    targetMinutes: number;
  }) => {
    const newTask: DailyTask = {
      id: `task-ai-${Date.now()}`,
      subjectCode: suggestion.subjectCode,
      subjectName: suggestion.subjectName,
      topicName: suggestion.topicName,
      targetQuestions: suggestion.targetQuestions,
      solvedQuestions: 0,
      targetMinutes: suggestion.targetMinutes,
      spentMinutes: 0,
      isCompleted: false,
      date: todayStr
    };
    setTasks((prev) => [newTask, ...prev]);
    sounds.playSuccess();
    confetti({ particleCount: 45, spread: 55 });
  };

  // Feature 2: Data Backup & Restore (JSON Export/Import)
  const handleExportBackup = () => {
    const backupData = {
      app: 'NetMetrik YKS Student',
      version: '1.0',
      exportDate: new Date().toISOString(),
      profile,
      exams,
      tasks,
      questionLogs,
      questionVault,
      books,
      topicProgress,
      flashcards
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netmetrik_yedek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.exams)) setExams(data.exams);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.questionLogs)) setQuestionLogs(data.questionLogs);
        if (Array.isArray(data.questionVault)) setQuestionVault(data.questionVault);
        if (Array.isArray(data.books)) setBooks(data.books);
        if (data.topicProgress) setTopicProgress(data.topicProgress);
        if (Array.isArray(data.flashcards)) setFlashcards(data.flashcards);
        sounds.playSuccess();
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
        alert('Yedek başarıyla yüklendi! Tüm çalışma ve sınav kayıtlarınız geri getirildi.');
      } catch {
        alert('Geçersiz veya bozuk yedek JSON dosyası!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetAllData = () => {
    localStorage.removeItem('netmetrik_student_profile');
    localStorage.removeItem('netmetrik_student_exams');
    localStorage.removeItem('netmetrik_student_tasks');
    localStorage.removeItem('netmetrik_student_question_logs');
    localStorage.removeItem('netmetrik_question_vault');
    localStorage.removeItem('netmetrik_books');
    localStorage.removeItem('netmetrik_topic_progress');
    localStorage.removeItem('netmetrik_flashcards');
    localStorage.removeItem('netmetrik_ai_sessions');
    localStorage.removeItem('netmetrik_ai_energy');
    localStorage.setItem('netmetrik_clean_reset_v1', 'true');

    setProfile(INITIAL_PROFILE);
    setExams([]);
    setTasks([]);
    setQuestionLogs([]);
    setQuestionVault([]);
    setBooks([]);
    setTopicProgress({});

    sounds.playSuccess();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const renderScreenContent = (isDesktop: boolean) => (
    <div key={activeTab} className="tab-content-transition">
      {activeTab === 'analytics' && (
        <AnalyticsScreenView
          exams={exams}
          questionLogs={questionLogs}
          topicProgress={topicProgress}
          onOpenCardModal={(card) => setActiveAnalizModal(card)}
          onOpenFeatureModal={(feat) => setActiveFeatureModal(feat)}
          onNavigate={(tab) => handleNavigateTab(tab)}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'home' && (
        <HomeScreenView
          countdown={countdown}
          profile={profile}
          tasks={tasks}
          exams={exams}
          todaySolvedQuestions={todaySolvedQuestions}
          todayStudyMinutes={todayStudyMinutes}
          questionVault={questionVault}
          books={books}
          topicProgress={topicProgress}
          flashcards={flashcards}
          onAddTaskFromAi={handleAddTaskFromAi}
          onToggleTask={handleToggleTask}
          onActivateFreeze={handleActivateStreakFreeze}
          onOpenFeatureModal={(feat) => setActiveFeatureModal(feat)}
          onNavigate={(tab) => handleNavigateTab(tab)}
          onOpenQuickAdd={(type) => {
            setQuickActionType(type);
            setShowQuickModal(true);
          }}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarTasksView
          tasks={tasks}
          questionLogs={questionLogs}
          onAddQuestionLog={handleAddQuestionLog}
          onDeleteQuestionLog={handleDeleteQuestionLog}
          onToggleTask={handleToggleTask}
          onOpenAddTask={() => {
            setQuickActionType('task');
            setShowQuickModal(true);
          }}
          // Feature 15: Dual Mode Props
          timerType={timerType}
          onSwitchTimerType={setTimerType}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          timerMode={timerMode}
          studyDurationMinutes={studyDurationMinutes}
          breakDurationMinutes={breakDurationMinutes}
          completedSessionsCount={completedSessionsCount}
          selectedTimerSubject={selectedTimerSubject}
          stopwatchSeconds={stopwatchSeconds}
          isStopwatchRunning={isStopwatchRunning}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onResetTimer={() => {
            setIsTimerRunning(false);
            setTimerSeconds((timerMode === 'study' ? studyDurationMinutes : breakDurationMinutes) * 60);
          }}
          onToggleStopwatch={() => setIsStopwatchRunning(!isStopwatchRunning)}
          onResetStopwatch={() => {
            setIsStopwatchRunning(false);
            setStopwatchSeconds(0);
          }}
          onSaveStopwatchSession={handleSaveStopwatchSession}
          onSwitchMode={handleSwitchTimerMode}
          onSetDuration={handleSetTimerDuration}
          onAdjustDelta={handleAdjustTimerDelta}
          onSelectSubject={setSelectedTimerSubject}
          onOpenFlocus={() => handleNavigateTab('pomodoro')}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'exams' && (
        <ExamsScreenView
          exams={exams}
          onAddExam={(newExam) => {
            setExams((prev) => [newExam, ...prev]);
            sounds.playSuccess();
            confetti({ particleCount: 70, spread: 70 });
          }}
          onUpdateExam={(updatedExam) => {
            setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
            sounds.playSuccess();
          }}
          onDeleteExam={(examId) => {
            setExams((prev) => prev.filter((e) => e.id !== examId));
            sounds.playToggle(false);
          }}
          onOpenPrintReport={() => setActiveFeatureModal('report')}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'curriculum' && (
        <CurriculumScreenView
          topicProgress={topicProgress}
          onCycleStatus={handleCycleTopicStatus}
          onToggleTopicCompleted={handleToggleTopicCompleted}
          onOpenOsymDistribution={() => handleNavigateTab('osym')}
          userFieldTrack={profile.fieldTrack}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'osym' && (
        <OsymDistributionView
          topicProgress={topicProgress}
          onToggleTopicCompleted={handleToggleTopicCompleted}
          userFieldTrack={profile.fieldTrack}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileScreenView
          profile={profile}
          exams={exams}
          questionLogs={questionLogs}
          topicProgress={topicProgress}
          currentTheme={currentTheme}
          isMuted={isMuted}
          cloudUser={cloudUser}
          lastSyncedTime={lastSyncedTime}
          onCloudLogin={handleCloudLogin}
          onCloudRegister={handleCloudRegister}
          onCloudLogout={handleCloudLogout}
          onToggleMute={handleToggleMute}
          onActivateFreeze={handleActivateStreakFreeze}
          onSelectTheme={(t) => {
            setCurrentTheme(t);
            sounds.playThemeSwitch();
          }}
          onUpdateProfile={(updated) => setProfile(updated)}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onOpenFeatureModal={(feat) => setActiveFeatureModal(feat)}
          onResetAllData={handleResetAllData}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'ai' && (
        <AiTutorScreenView
          profile={profile}
          onAddTask={(code, name, topic, count, mins) => handleAddTask(code, name, topic, count, mins)}
          onAddVaultItem={(qText, subName, topName, sol) => {
            handleAddVaultItem({
              id: 'vault-' + Date.now(),
              subjectCode: 'ayt_mat',
              subjectName: subName,
              topicName: topName,
              correctAnswer: 'C',
              difficulty: 'Orta',
              note: `${qText}\n\nÇözüm Özeti: ${sol}`,
              reason: 'bilgi',
              date: '2026-10-20',
              isResolved: false
            });
          }}
          isDesktop={isDesktop}
        />
      )}

      {activeTab === 'pomodoro' && (
        <FlocusPomodoroView
          profile={profile}
          tasks={tasks}
          questionLogs={questionLogs}
          onToggleTask={handleToggleTask}
          onLogStudySession={(subject, minutes) => {
            const autoLog: QuestionLog = {
              id: `ql-flocus-${Date.now()}`,
              date: todayStr,
              subjectName: subject || 'Flocus Odak Seansı',
              sourceBook: 'Flocus Pomodoro & Ambiyans',
              count: 0,
              durationMinutes: minutes
            };
            setQuestionLogs((prev) => [autoLog, ...prev]);
          }}
          isDesktop={isDesktop}
          onExit={() => handleNavigateTab('home')}
        />
      )}
    </div>
  );

  return (
    <div className={currentTheme}>
      {viewMode === 'desktop' ? (
        <div className="desktop-app-shell">
          {/* Desktop Left Sidebar (hidden when in immersive NetFocus mode) */}
          {activeTab !== 'pomodoro' && (
            <aside className="desktop-sidebar">
            <div>
              {/* Brand Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingBottom: 18, borderBottom: '1px solid var(--color-border)' }}>
                <div
                  onClick={() => handleNavigateTab('home')}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  title="NetMetrik"
                >
                  <img
                    src="/logo.jpg"
                    alt="NetMetrik Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--color-accent)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    NetMetrik
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginTop: 1 }}>
                    YKS Çalışma Koçu
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="desktop-nav-list">
                <button
                  className={`desktop-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('home')}
                >
                  <Home size={19} />
                  <span>Bugün (Ana Sayfa)</span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('ai')}
                >
                  <Bot size={18} />
                  <span>Akıllı Koç (AI)</span>
                </button>

                <button
                  className="desktop-nav-btn"
                  onClick={() => handleNavigateTab('pomodoro')}
                >
                  <Timer size={18} />
                  <span>NetFocus Odak</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 99,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--color-text-muted)'
                    }}
                  >
                    Odak
                  </span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('calendar')}
                >
                  <BarChart3 size={19} />
                  <span>Haftalık Soru Çizelgesi</span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'exams' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('exams')}
                >
                  <Award size={19} />
                  <span>Denemeler & Karne</span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('curriculum')}
                >
                  <BookOpen size={19} />
                  <span>Konu Takip Çizelgesi</span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'osym' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('osym')}
                >
                  <Flame size={19} color={activeTab === 'osym' ? 'var(--color-accent)' : undefined} />
                  <span>ÖSYM Soru Dağılımı</span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 99,
                      background: 'rgba(212, 255, 0, 0.15)',
                      color: 'var(--color-accent)'
                    }}
                  >
                    2018–2026
                  </span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('analytics')}
                >
                  <BarChart3 size={19} />
                  <span>Analiz & Rapor</span>
                </button>

                <button
                  className={`desktop-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => handleNavigateTab('profile')}
                >
                  <User size={19} />
                  <span>Profil & Bulut</span>
                </button>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}
                onClick={() => {
                  sounds.playClick();
                  setQuickActionType('question');
                  setShowQuickModal(true);
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Hızlı Soru / Görev Ekle</span>
              </button>

              <button
                onClick={() => setViewMode('mobile')}
                className="btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}
                title="Mobil Görünüme Geç"
              >
                <Smartphone size={16} />
                <span>📱 Mobil Görünüme Geç</span>
              </button>

              {/* Tema & Ses Kontrolleri */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => setShowThemePicker(true)}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  title="Tema Değiştir"
                >
                  <Palette size={14} />
                  <span>Tema</span>
                </button>

                <button
                  onClick={handleToggleMute}
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'Sessiz' : 'Ses'}</span>
                </button>
              </div>

              {/* Bulut Senkronizasyon Durumu */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                {cloudUser ? (
                  <span className="badge-sync-cloud active" style={{ fontSize: 10.5, padding: '4px 8px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={cloudUser.email}>
                    <Cloud size={12} /> {cloudUser.email}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowOnboardingModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 99,
                      background: 'rgba(10, 132, 255, 0.1)',
                      border: '1px solid rgba(10, 132, 255, 0.25)',
                      color: 'var(--color-accent)',
                      fontSize: 10.5,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    title="Giriş Yap veya Hesap Oluştur"
                  >
                    <Cloud size={12} /> Giriş Yap / Kayıt Ol
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}

          {/* Desktop Main Workspace Area */}
          <div
            className="desktop-main-viewport"
            style={activeTab === 'pomodoro' ? { padding: 0, margin: 0, width: '100vw', height: '100vh', overflow: 'hidden' } : undefined}
          >
            {/* Desktop Top Header (Emil Kowalski / Linear Glass Navigation Bar) */}
            {activeTab !== 'pomodoro' && (
              <header className="desktop-top-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)' }} />
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: -0.2 }}>
                      {activeTab === 'home' && 'Bugün • Çalışma Özeti'}
                      {activeTab === 'ai' && 'NetMetrik AI • YKS Çalışma Koçu'}
                      {activeTab === 'calendar' && 'Haftalık Soru Çizelgesi & Çalışma Planı'}
                      {activeTab === 'exams' && 'Denemeler & Karne • Net Analizleri'}
                      {activeTab === 'curriculum' && 'Konu Takip Çizelgesi • TYT & AYT'}
                      {activeTab === 'analytics' && 'Gelişmiş Analizler & Raporlar'}
                      {activeTab === 'profile' && 'Öğrenci Profili & Bulut Hesabı'}
                    </h2>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      YKS 2027 Hazırlığı • Canlı Takip
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Streak Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 12px',
                      borderRadius: 99,
                      background: 'rgba(255, 159, 10, 0.12)',
                      border: '1px solid rgba(255, 159, 10, 0.25)',
                      color: '#FF9F0A',
                      fontSize: 12,
                      fontWeight: 600
                    }}
                    title="Aktif Çalışma Serisi"
                  >
                    <Flame size={14} color="#FF9F0A" />
                    <span>{profile.currentStreak} Gün Seri</span>
                  </div>

                  {/* Theme Button */}
                  <button
                    onClick={() => setShowThemePicker(true)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    title="Renk Temasını Değiştir"
                  >
                    <Palette size={13} color="var(--color-accent)" />
                    <span>Tema</span>
                  </button>

                  {/* Sound Button */}
                  <button
                    onClick={handleToggleMute}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                  >
                    {isMuted ? <VolumeX size={13} color="#FF453A" /> : <Volume2 size={13} color="#30D158" />}
                    <span>{isMuted ? 'Sessiz' : 'Ses'}</span>
                  </button>

                  {/* Switch to Mobile Button */}
                  <button
                    onClick={() => setViewMode('mobile')}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    title="Mobil Telefon Görünümüne Geç"
                  >
                    <Smartphone size={13} />
                    <span>Mobil Mod</span>
                  </button>

                  {/* Student Avatar */}
                  <div
                    onClick={() => handleNavigateTab('profile')}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--color-surface-elevated)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      marginLeft: 2
                    }}
                    title={`${profile.name} Profili`}
                  >
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'B'}
                  </div>
                </div>
              </header>
            )}

            {/* Desktop Content Body */}
            <div
              className="desktop-content-body"
              style={activeTab === 'pomodoro' ? { padding: 0, margin: 0, maxWidth: '100%', width: '100%', height: '100vh' } : undefined}
            >
              {renderScreenContent(true)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mobile-viewport-shell">
          {/* Native-style Status Bar (hidden in NetFocus) */}
          {activeTab !== 'pomodoro' && (
            <div className="status-bar-time">
              <span>18:07</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span>VoLTE</span>
                <span>5G</span>
                <span>🔋 85%</span>
              </div>
            </div>
          )}

          {/* Screen Title & Header Action with Cyber Cyan Brand Logo (hidden in NetFocus) */}
          {activeTab !== 'pomodoro' && (
            <div
              className="screen-header-title"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                position: 'sticky',
                top: 0,
                zIndex: 45,
                background: 'rgba(12, 16, 24, 0.88)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}
            >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* NetMetrik Brand Logo in Cyber Cyan */}
              <div
                onClick={() => handleNavigateTab('home')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px var(--color-glow)',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  transition: 'transform 140ms var(--ease-spring)'
                }}
                className="clickable-card"
                title="NetMetrik Ana Sayfa"
              >
                <img
                  src="/logo.jpg"
                  alt="NetMetrik Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--color-accent)', letterSpacing: 1.1, textTransform: 'uppercase', lineHeight: 1 }}>
                  NetMetrik
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginTop: 2, letterSpacing: -0.3 }}>
                  {activeTab === 'analytics' && 'Analiz & Rapor'}
                  {activeTab === 'home' && 'Bugün'}
                  {activeTab === 'ai' && 'NetMetrik AI'}
                  {activeTab === 'calendar' && 'Haftalık Soru Çizelgesi'}
                  {activeTab === 'exams' && 'Denemeler & Karne'}
                  {activeTab === 'curriculum' && 'Konu Takip'}
                  {activeTab === 'osym' && 'ÖSYM Soru Dağılımı'}
                  {activeTab === 'profile' && 'Profilim'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* ÖSYM Quick Access Button */}
              <button
                onClick={() => handleNavigateTab('osym')}
                style={{
                  background: activeTab === 'osym' ? 'rgba(212, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: activeTab === 'osym' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                  color: activeTab === 'osym' ? 'var(--color-accent)' : '#fff',
                  borderRadius: 11,
                  padding: '6px 9px',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer'
                }}
                title="ÖSYM Soru Dağılımı (2018–2026)"
              >
                <Flame size={13} color="var(--color-accent)" />
                <span>ÖSYM</span>
              </button>

              {/* Flocus Mobile Quick Access Button */}
              <button
                onClick={() => handleNavigateTab('pomodoro')}
                style={{
                  background: 'rgba(212, 255, 0, 0.14)',
                  border: '1px solid rgba(212, 255, 0, 0.45)',
                  color: '#D4FF00',
                  borderRadius: 11,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  transition: 'transform 140ms var(--ease-out)'
                }}
                title="NetFocus Pomodoro & Ambiyans"
              >
                <Timer size={13} />
                <span>Odak</span>
              </button>

              {/* NetMetrik AI Mobile Quick Access Button */}
              <button
                onClick={() => handleNavigateTab('ai')}
                style={{
                  background: activeTab === 'ai' ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : 'rgba(168, 85, 247, 0.16)',
                  border: activeTab === 'ai' ? '1px solid #C084FC' : '1px solid rgba(168, 85, 247, 0.4)',
                  color: activeTab === 'ai' ? '#FFF' : '#C084FC',
                  borderRadius: 11,
                  padding: '6px 11px',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'ai' ? '0 0 14px rgba(168, 85, 247, 0.55)' : 'none',
                  transition: 'transform 140ms var(--ease-out)'
                }}
                title="NetMetrik AI YKS Koçu"
              >
                <Bot size={13} />
                <span>AI</span>
              </button>

              {/* Switch to Desktop PC Mode Button */}
              <button
                onClick={() => setViewMode('desktop')}
                style={{
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: 'var(--color-accent)',
                  borderRadius: 11,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  transition: 'transform 140ms var(--ease-out)'
                }}
                title="Geniş Ekran PC Moduna Geç"
              >
                <Monitor size={13} />
                <span>PC</span>
              </button>

              <button
                onClick={() => handleNavigateTab('profile')}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: activeTab === 'profile' ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.08)',
                  border: activeTab === 'profile' ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: activeTab === 'profile' ? 'var(--color-on-accent)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 140ms var(--ease-out)'
                }}
                title="Profilime Git"
              >
                <User size={15} />
              </button>
            </div>
          </div>
        )}

          {/* Screen Content Area with Tab Transitions */}
          <main
            className="screen-scroll-container"
            style={activeTab === 'pomodoro' ? { padding: 0, margin: 0, height: '100vh', overflow: 'hidden' } : undefined}
          >
            {renderScreenContent(false)}
          </main>

          {/* Floating Pill Bottom Navigation with Protruding Center (+) FAB (hidden in NetFocus) */}
          {activeTab !== 'pomodoro' && (
            <nav className="floating-bottom-nav">
              {/* Tab 1: Home */}
              <button
                className={`nav-item-icon-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigateTab('home')}
                title="Ana Sayfa (Bugün)"
              >
                <Home size={25} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              </button>

              {/* Tab 2: Calendar / Haftalık Çizelge */}
              <button
                className={`nav-item-icon-btn ${activeTab === 'calendar' ? 'active' : ''}`}
                onClick={() => handleNavigateTab('calendar')}
                title="Haftalık Soru Çizelgesi & Sayaç"
              >
                <CalendarIcon size={25} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
              </button>

              {/* Center Protruding (+) FAB */}
              <button
                className="center-fab-protruding"
                id="center-quick-fab"
                title="Hızlı Ekle"
                onClick={() => {
                  sounds.playClick();
                  setQuickActionType('question');
                  setShowQuickModal(true);
                }}
              >
                <Plus size={32} strokeWidth={3} />
              </button>

              {/* Tab 3: Curriculum / Konular */}
              <button
                className={`nav-item-icon-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                onClick={() => handleNavigateTab('curriculum')}
                title="Konular & Müfredat Tablosu"
              >
                <BookOpen
                  size={25}
                  color={activeTab === 'curriculum' ? 'var(--color-accent)' : undefined}
                  strokeWidth={activeTab === 'curriculum' ? 2.8 : 2}
                />
              </button>

              {/* Tab 4: Analytics */}
              <button
                className={`nav-item-icon-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleNavigateTab('analytics')}
                title="Analiz"
              >
                <BarChart3
                  size={25}
                  color={activeTab === 'analytics' ? 'var(--color-accent)' : undefined}
                  strokeWidth={activeTab === 'analytics' ? 2.8 : 2}
                />
              </button>

              {/* Tab 5: Profile & Settings */}
              <button
                className={`nav-item-icon-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavigateTab('profile')}
                title="Profil & Ayarlar"
              >
                <User
                  size={25}
                  color={activeTab === 'profile' ? 'var(--color-accent)' : undefined}
                  strokeWidth={activeTab === 'profile' ? 2.8 : 2}
                />
              </button>
            </nav>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------------
          Quick Action Modal / Drawer
      ---------------------------------------------------------------------- */}
      {showQuickModal && (
        <div className="modal-overlay" onClick={() => setShowQuickModal(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  className={`btn-secondary ${quickActionType === 'question' ? 'active' : ''}`}
                  onClick={() => setQuickActionType('question')}
                >
                  Soru Çözümü
                </button>
                <button
                  className={`btn-secondary ${quickActionType === 'study_time' ? 'active' : ''}`}
                  onClick={() => setQuickActionType('study_time')}
                >
                  Çalışma Süresi
                </button>
                <button
                  className={`btn-secondary ${quickActionType === 'task' ? 'active' : ''}`}
                  onClick={() => setQuickActionType('task')}
                >
                  Yeni Görev
                </button>
              </div>
              <button
                onClick={() => setShowQuickModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {quickActionType === 'question' ? (
              <QuickQuestionForm onSave={handleAddQuestionLog} />
            ) : quickActionType === 'study_time' ? (
              <QuickStudyTimeForm
                onSave={(act, mins, d) => {
                  handleAddQuestionLog(act, 'Genel Çalışma', 'Çalışma Seansı', 0, mins, d);
                  setShowQuickModal(false);
                }}
              />
            ) : (
              <QuickTaskForm onSave={handleAddTask} />
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          Apple HIG System Theme Picker Modal
      ---------------------------------------------------------------------- */}
      {showThemePicker && (
        <div className="modal-overlay" onClick={() => setShowThemePicker(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '82vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                  Arayüz Teması
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Apple Human Interface Guidelines uyumlu 5 rafine renk seçeneği
                </p>
              </div>
              <button
                onClick={() => setShowThemePicker(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 12 }}>
              {THEME_PRESETS.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTheme(t.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'var(--color-surface)',
                      border: isSelected ? `1.5px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} color={t.color} />}
                  </button>
                );
              })}
            </div>

            <button
              className="btn-primary"
              style={{ marginTop: 18, width: '100%', padding: '14px' }}
              onClick={() => setShowThemePicker(false)}
            >
              Tamamla
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          2x2 Analiz Action Modal
      ---------------------------------------------------------------------- */}
      {activeAnalizModal && (
        <div className="modal-overlay" onClick={() => setActiveAnalizModal(null)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {activeAnalizModal === 'trend' && '📈 Net Trendi Detayı'}
                {activeAnalizModal === 'exam_time' && '⏱️ Deneme Süresi Analizi'}
                {activeAnalizModal === 'question_count' && '✏️ Çözülen Soru Dağılımı'}
                {activeAnalizModal === 'study_time' && '⏱️ Çalışma Süresi'}
              </div>
              <button
                onClick={() => setActiveAnalizModal(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {activeAnalizModal === 'trend' && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
                  Son denemelerinde TYT netlerin yükseliş eğiliminde. Özellikle Matematik ve Fen alanında son 3 haftada +4.5 net artış gözlemlendi.
                </div>
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#1F2026',
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{exam.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{exam.date}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-accent)' }}>
                      {exam.totalNet.toFixed(2)} Net
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeAnalizModal === 'exam_time' && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
                  Ortalama deneme tamamlama süren 162 dakika. ÖSYM 165 dakikalık TYT süresi için ideal banttasın.
                </div>
                <div style={{ background: '#1F2026', borderRadius: 14, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span>Önerilen Süre:</span>
                    <span style={{ fontWeight: 700 }}>165 dk</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span>Senin Ortalaman:</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-accent)' }}>162.5 dk</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>Kalan Emniyet Payı:</span>
                    <span style={{ fontWeight: 700, color: '#38BDF8' }}>+2.5 dk</span>
                  </div>
                </div>
              </div>
            )}

            {activeAnalizModal === 'question_count' && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
                  Son 7 günde kaydedilen soru çözümleri:
                </div>
                {questionLogs.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#1F2026',
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{q.subjectName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{q.sourceBook} • {q.durationMinutes} dk</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-accent)' }}>
                      {q.count} Soru
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeAnalizModal === 'study_time' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <Clock size={44} color="var(--color-accent)" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: 18, fontWeight: 700 }}>Toplam Odaklanma Süresi</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-accent)', margin: '8px 0' }}>
                  {(questionLogs.reduce((acc, q) => acc + q.durationMinutes, 0) / 60).toFixed(1)} Saat
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Pomodoro ve serbest çalışma seansları dahil kümülatif süre.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          9 FEATURES MODALS (6, 7, 8, 21, 22, 26, 27)
      ---------------------------------------------------------------------- */}
      {/* 1. Feature 6: Question Vault (Hata Defteri) Modal */}
      {activeFeatureModal === 'vault' && (
        <QuestionVaultModal
          vault={questionVault}
          onToggleResolved={handleToggleVaultItemResolved}
          onDelete={handleDeleteVaultItem}
          onAdd={handleAddVaultItem}
          onAdvanceReviewStage={handleAdvanceReviewStage}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 2. Feature 7: Speed Meter (Hız Sayacı) Modal */}
      {activeFeatureModal === 'speed' && (
        <SpeedMeterModal
          onSaveLog={handleAddQuestionLog}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 3. Feature 8: Book Tracker (Kaynak Kitap Takibi) Modal */}
      {activeFeatureModal === 'books' && (
        <BookTrackerModal
          books={books}
          onAdjustTests={handleAdjustBookTests}
          onAddBook={handleAddBook}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 4. Feature 21: YKS Rank Simulator Modal */}
      {activeFeatureModal === 'rank' && (
        <RankSimulatorModal
          profile={profile}
          latestExam={exams[0]}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 5. Feature 22: Benchmark Comparator (YÖK Atlas) Modal */}
      {activeFeatureModal === 'benchmark' && (
        <BenchmarkModal
          exams={exams}
          profile={profile}
          onUpdateTarget={(bm) => {
            setProfile((prev) => ({
              ...prev,
              targetUniversity: bm.university,
              targetDepartment: bm.department,
              targetTytNet: bm.tytTotal,
              targetAytNet: bm.aytTotal,
              fieldTrack: bm.track
            }));
            sounds.playSuccess();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          }}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 6. Feature 26: Printable PDF Report Modal */}
      {activeFeatureModal === 'report' && (
        <PrintableReportModal
          profile={profile}
          exams={exams}
          questionLogs={questionLogs}
          topicProgress={topicProgress}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 7. Feature 27: Screen Widget Simulator Modal */}
      {activeFeatureModal === 'widget' && (
        <WidgetSimulatorModal
          countdown={countdown}
          profile={profile}
          todaySolvedQuestions={todaySolvedQuestions}
          todayStudyMinutes={todayStudyMinutes}
          latestExam={exams[0]}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 8. Feature 9: Flashcards (Hap Bilgi / Formül Kartları) Modal */}
      {activeFeatureModal === 'flashcards' && (
        <FlashcardsModal
          flashcards={flashcards}
          onToggleMastered={handleToggleMasteredFlashcard}
          onClose={() => setActiveFeatureModal(null)}
        />
      )}

      {/* 9. First-Time User Onboarding & Cloud Registration Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => {
          localStorage.setItem('netmetrik_onboarded', 'guest');
          setShowOnboardingModal(false);
        }}
        onRegister={async ({ email, pass, name, classLevel, fieldTrack }) => {
          await handleCloudRegister(email, pass, name, classLevel, fieldTrack);
        }}
        onLogin={async (email, pass) => {
          await handleCloudLogin(email, pass);
        }}
      />
    </div>
  );
}

// ============================================================================
// 1. ANALİZ EKRANI (MATCHES USER SCREENSHOT + NEW 21, 22, 26 FEATURES)
// ============================================================================
function AnalyticsScreenView({
  exams,
  questionLogs = [],
  topicProgress = {},
  onOpenCardModal,
  onOpenFeatureModal,
  onNavigate,
  isDesktop
}: {
  exams: Exam[];
  questionLogs?: QuestionLog[];
  topicProgress?: Record<string, TopicStatus>;
  onOpenCardModal: (card: 'trend' | 'exam_time' | 'question_count' | 'study_time') => void;
  onOpenFeatureModal: (feat: FeatureModalType) => void;
  onNavigate: (tab: any) => void;
  isDesktop?: boolean;
}) {
  const [heroCardIndex, setHeroCardIndex] = useState(0);
  const [heatmapRange, setHeatmapRange] = useState<'4_ay' | '1_yil'>('4_ay');

  const now = useMemo(() => new Date(), []);
  const todayDateStr = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [now]);

  // Aggregate real question logs by date
  const logsByDate = useMemo(() => {
    const map = new Map<string, { questions: number; minutes: number }>();
    (questionLogs || []).forEach((l: QuestionLog) => {
      const existing = map.get(l.date) || { questions: 0, minutes: 0 };
      map.set(l.date, {
        questions: existing.questions + (l.count || 0),
        minutes: existing.minutes + (l.durationMinutes || 0)
      });
    });
    return map;
  }, [questionLogs]);

  // Heatmap dimensions & labels
  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const columnsCount = heatmapRange === '4_ay' ? 18 : 36;

  // Monday of the current week (0 = Monday, 6 = Sunday)
  const todayDayOfWeek = (now.getDay() + 6) % 7;
  const currentWeekMonday = useMemo(() => {
    const d = new Date(now);
    d.setDate(now.getDate() - todayDayOfWeek);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now, todayDayOfWeek]);

  // Start Monday of the entire matrix
  const startMonday = useMemo(() => {
    const d = new Date(currentWeekMonday);
    d.setDate(currentWeekMonday.getDate() - (columnsCount - 1) * 7);
    return d;
  }, [currentWeekMonday, columnsCount]);

  // Generate real calendar cell data: 7 rows x columnsCount columns
  const { heatmapGrid, monthHeaders } = useMemo(() => {
    const headers: { month: string; colIndex: number }[] = [];
    let lastMonth = -1;

    for (let c = 0; c < columnsCount; c++) {
      const colDate = new Date(startMonday);
      colDate.setDate(startMonday.getDate() + c * 7);
      const m = colDate.getMonth();
      if (m !== lastMonth) {
        headers.push({ month: monthNames[m], colIndex: c });
        lastMonth = m;
      }
    }

    const grid = Array.from({ length: 7 }, (_, rowIndex) =>
      Array.from({ length: columnsCount }, (_, colIndex) => {
        const cellDate = new Date(startMonday);
        cellDate.setDate(startMonday.getDate() + colIndex * 7 + rowIndex);
        const y = cellDate.getFullYear();
        const m = String(cellDate.getMonth() + 1).padStart(2, '0');
        const d = String(cellDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const isToday = dateStr === todayDateStr;
        const isFuture = cellDate.getTime() > now.getTime() && !isToday;
        const stats = logsByDate.get(dateStr) || { questions: 0, minutes: 0 };

        let level = 0;
        if (stats.questions > 0) {
          if (stats.questions <= 25) level = 1;
          else if (stats.questions <= 60) level = 2;
          else if (stats.questions <= 100) level = 3;
          else if (stats.questions <= 150) level = 4;
          else level = 5;
        }

        const formattedDate = cellDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' });

        return {
          dateStr,
          formattedDate,
          level,
          isToday,
          isFuture,
          questions: stats.questions,
          minutes: stats.minutes
        };
      })
    );

    return { heatmapGrid: grid, monthHeaders: headers };
  }, [startMonday, columnsCount, todayDateStr, logsByDate, now]);

  const [selectedCellDetail, setSelectedCellDetail] = useState<{
    dateStr: string;
    formattedDate: string;
    questions: number;
    minutes: number;
    isToday: boolean;
  } | null>(null);

  useEffect(() => {
    const todayStats = logsByDate.get(todayDateStr) || { questions: 0, minutes: 0 };
    setSelectedCellDetail({
      dateStr: todayDateStr,
      formattedDate: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }),
      questions: todayStats.questions,
      minutes: todayStats.minutes,
      isToday: true
    });
  }, [logsByDate, todayDateStr, now]);

  // Feature 3: Trend Line Chart State
  const [trendMetric, setTrendMetric] = useState<'tyt_total' | 'ayt_total' | 'tyt_mat' | 'tyt_fen'>('tyt_total');
  const [selectedTrendPoint, setSelectedTrendPoint] = useState<{ id: string; title: string; publisher: string; date: string; net: number } | null>(null);

  const tytExams = exams.filter((e) => e.type === 'TYT');
  const aytExams = exams.filter((e) => e.type === 'AYT');
  const latestTyt = tytExams[0];
  const latestAyt = aytExams[0];

  const last7DaysQuestions = useMemo(() => {
    return (questionLogs || []).filter((l: QuestionLog) => {
      const diff = (now.getTime() - new Date(l.date).getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 7;
    }).reduce((s: number, l: QuestionLog) => s + l.count, 0);
  }, [questionLogs, now]);

  const avgDuration = useMemo(() => {
    return exams.length > 0 ? Math.round(exams.reduce((s, e) => s + (e.durationMinutes || 165), 0) / exams.length) : 0;
  }, [exams]);

  // Calculate overall topic percentages
  const totalTytTopics = YKS_SUBJECTS.filter((s) => s.category === 'TYT').reduce((sum, s) => sum + s.topics.length, 0);
  const completedTytTopics = YKS_SUBJECTS.filter((s) => s.category === 'TYT').reduce(
    (sum, s) => sum + s.topics.filter((t) => topicProgress[`${s.code}_${t}`] === 'completed').length,
    0
  );
  const tytPct = Math.round((completedTytTopics / (totalTytTopics || 1)) * 100);

  const totalAytTopics = YKS_SUBJECTS.filter((s) => s.category === 'AYT').reduce((sum, s) => sum + s.topics.length, 0);
  const completedAytTopics = YKS_SUBJECTS.filter((s) => s.category === 'AYT').reduce(
    (sum, s) => sum + s.topics.filter((t) => topicProgress[`${s.code}_${t}`] === 'completed').length,
    0
  );
  const aytPct = Math.round((completedAytTopics / (totalAytTopics || 1)) * 100);

  return (
    <div style={{ padding: isDesktop ? 0 : '0 18px', display: 'flex', flexDirection: 'column', gap: isDesktop ? 22 : 16 }}>
      {/* --------------------------------------------------------------------
          Card 1: Top Hero Wave Card (TYT Genel Net)
      -------------------------------------------------------------------- */}
      <div>
        <div className="wave-hero-card">
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {heroCardIndex === 0 && 'TYT Genel Net'}
              {heroCardIndex === 1 && 'AYT Genel Net'}
              {heroCardIndex === 2 && 'Haftalık Soru Çözümü'}
              {heroCardIndex === 3 && 'Ortalama Süre'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 10, color: '#FFFFFF' }}>
              {heroCardIndex === 0 && (latestTyt ? `${latestTyt.totalNet.toFixed(2)} Net (TYT)` : 'Henüz TYT sınavı yok')}
              {heroCardIndex === 1 && (latestAyt ? `${latestAyt.totalNet.toFixed(2)} Net (AYT)` : 'Henüz AYT sınavı yok')}
              {heroCardIndex === 2 && `${last7DaysQuestions} Soru / Son 7 Gün`}
              {heroCardIndex === 3 && (exams.length > 0 ? `${avgDuration} dk / Deneme` : '0 dk')}
            </div>
          </div>

          {/* Smooth Topographic Wave Graphic */}
          <svg
            className="wave-graphic"
            viewBox="0 0 400 120"
            fill="none"
            preserveAspectRatio="none"
            style={{ height: 110 }}
          >
            <path
              d="M0,60 C80,20 160,90 240,40 C320,0 360,70 400,50 L400,120 L0,120 Z"
              fill="#1F2027"
              opacity="0.8"
            />
            <path
              d="M0,75 C90,45 170,95 250,60 C330,25 370,85 400,65 L400,120 L0,120 Z"
              fill="#262832"
              opacity="0.9"
            />
            <path
              d="M0,90 C100,65 180,105 260,75 C340,50 380,95 400,80 L400,120 L0,120 Z"
              fill="#2E303B"
            />
          </svg>
        </div>

        {/* Carousel indicator dots */}
        <div className="wave-hero-dots">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              onClick={() => setHeroCardIndex(idx)}
              className={`wave-dot ${heroCardIndex === idx ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Banner: Direct Link to Weekly Question Schedule (Ders & Konu Çizelgesi)
      -------------------------------------------------------------------- */}
      <div
        onClick={() => {
          sounds.playClick();
          if (onNavigate) onNavigate('calendar');
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.16) 0%, rgba(0, 240, 255, 0.1) 100%)',
          border: '1.5px solid rgba(10, 132, 255, 0.4)',
          borderRadius: 18,
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(10, 132, 255, 0.15)',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(10, 132, 255, 0.35)'
            }}
          >
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 900, color: '#FFFFFF' }}>
              Haftalık Ders & Konu Soru Çizelgesi
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Pazartesi–Pazar ders/konu soru matrisi, günlük çalışma süreleri ve NetFocus takibi
            </div>
          </div>
        </div>

        <button
          style={{
            padding: '7px 14px',
            borderRadius: 99,
            background: 'var(--color-accent)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 10px rgba(10, 132, 255, 0.3)'
          }}
        >
          Çizelgeyi Aç →
        </button>
      </div>

      {/* --------------------------------------------------------------------
          Card 2: Soru Çözüm Geçmişi (Heatmap Matrix)
      -------------------------------------------------------------------- */}
      <div className="app-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
            Soru çözüm geçmişi
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setHeatmapRange('4_ay')}
              className={`pill-toggle-btn ${heatmapRange === '4_ay' ? 'active' : ''}`}
            >
              4 ay
            </button>
            <button
              onClick={() => setHeatmapRange('1_yil')}
              className={`pill-toggle-btn ${heatmapRange === '1_yil' ? 'active' : ''}`}
            >
              1 yıl
            </button>
          </div>
        </div>

        {/* Month Labels Bar */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            height: 16,
            marginBottom: 8,
            paddingLeft: 30,
            fontSize: 11,
            color: 'var(--color-text-dim)',
            fontWeight: 600,
            overflowX: 'hidden'
          }}
        >
          {monthHeaders.map((hdr, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `calc(30px + ${(hdr.colIndex / columnsCount) * 100}%)`,
                whiteSpace: 'nowrap'
              }}
            >
              {hdr.month}
            </span>
          ))}
        </div>

        {/* Heatmap Grid with Days on Left */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10, color: 'var(--color-text-dim)', fontWeight: 600 }}>
            {daysOfWeek.map((d) => (
              <span key={d} style={{ height: 14, lineHeight: '14px' }}>
                {d}
              </span>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, overflowX: heatmapRange === '1_yil' ? 'auto' : 'hidden' }}>
            {heatmapGrid.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', gap: 5, justifyContent: 'space-between' }}>
                {row.map((cell, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => {
                      if (cell.isFuture) return;
                      setSelectedCellDetail({
                        dateStr: cell.dateStr,
                        formattedDate: cell.formattedDate,
                        questions: cell.questions,
                        minutes: cell.minutes,
                        isToday: cell.isToday
                      });
                      sounds.playClick();
                    }}
                    className={`heatmap-cell ${cell.isToday ? 'today-selected' : cell.level > 0 ? `level-${cell.level}` : ''}`}
                    title={`${cell.formattedDate}: ${cell.questions} Soru (${cell.minutes} dk)`}
                    style={{
                      cursor: cell.isFuture ? 'default' : 'pointer',
                      opacity: cell.isFuture ? 0.25 : 1,
                      boxShadow: cell.isToday ? '0 0 0 1.5px var(--color-accent)' : undefined
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Cell Activity Banner */}
        {selectedCellDetail && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 10,
              background: '#1F2026',
              border: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 11.5
            }}
          >
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {selectedCellDetail.isToday ? `Bugün (${selectedCellDetail.formattedDate})` : selectedCellDetail.formattedDate}:
            </span>
            <span style={{ color: selectedCellDetail.questions > 0 ? 'var(--color-accent)' : 'var(--color-text-dim)', fontWeight: 700 }}>
              {selectedCellDetail.questions > 0
                ? `${selectedCellDetail.questions} Soru • ${selectedCellDetail.minutes} dk Çalışma`
                : 'Soru çözümü kaydedilmedi'}
            </span>
          </div>
        )}

        {/* Heatmap Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 11, color: 'var(--color-text-dim)' }}>
          <span>Dokun • basılı tut</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>Az</span>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#21232A' }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1A3B22' }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#235D33' }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#2E8046' }} />
            <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-accent)' }} />
            <span>Çok</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Feature 3: Zaman Çizelgeli Net Gelişim Grafiği (Apple HIG Trend Line Chart)
      -------------------------------------------------------------------- */}
      {(() => {
        const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));
        const trendPoints: { id: string; title: string; publisher: string; date: string; net: number }[] = [];

        sortedExams.forEach((e) => {
          if (trendMetric === 'tyt_total' && e.type === 'TYT') {
            trendPoints.push({ id: e.id, title: e.title, publisher: e.publisher, date: e.date, net: e.totalNet });
          } else if (trendMetric === 'ayt_total' && e.type === 'AYT') {
            trendPoints.push({ id: e.id, title: e.title, publisher: e.publisher, date: e.date, net: e.totalNet });
          } else if (trendMetric === 'tyt_mat' && e.type === 'TYT') {
            const mat = e.subjectResults.find((s) => s.subjectCode === 'tyt_mat');
            if (mat) trendPoints.push({ id: e.id, title: e.title, publisher: e.publisher, date: e.date, net: mat.net });
          } else if (trendMetric === 'tyt_fen' && e.type === 'TYT') {
            const fenNet = e.subjectResults
              .filter((s) => ['tyt_fizik', 'tyt_kimya', 'tyt_biyo'].includes(s.subjectCode))
              .reduce((sum, s) => sum + s.net, 0);
            trendPoints.push({ id: e.id, title: e.title, publisher: e.publisher, date: e.date, net: fenNet });
          }
        });

        const netValues = trendPoints.map((p) => p.net);
        const minVal = netValues.length > 0 ? Math.min(...netValues) : 0;
        const maxVal = netValues.length > 0 ? Math.max(...netValues) : 100;
        const minNet = Math.floor(minVal - (maxVal - minVal < 4 ? 2 : 1.5));
        const maxNet = Math.ceil(maxVal + (maxVal - minVal < 4 ? 2 : 1.5));
        const netRange = Math.max(4, maxNet - minNet);

        // Apple proportions: 760x170 wide aspect ratio
        const svgW = 760;
        const svgH = 170;
        const padL = 42;
        const padR = 24;
        const padT = 18;
        const padB = 30;
        const plotW = svgW - padL - padR;
        const plotH = svgH - padT - padB;

        const coords = trendPoints.map((p, idx) => {
          const x = padL + (idx / Math.max(1, trendPoints.length - 1)) * plotW;
          const y = padT + plotH - ((p.net - minNet) / netRange) * plotH;
          return { ...p, x, y };
        });

        // Smooth cubic bezier spline
        const getCurvedPath = (pts: { x: number; y: number }[]) => {
          if (pts.length < 2) return '';
          if (pts.length === 2) {
            const dx = pts[1].x - pts[0].x;
            return `M ${pts[0].x},${pts[0].y} C ${pts[0].x + dx * 0.45},${pts[0].y} ${pts[0].x + dx * 0.55},${pts[1].y} ${pts[1].x},${pts[1].y}`;
          }
          let d = `M ${pts[0].x},${pts[0].y}`;
          for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i === 0 ? 0 : i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
          }
          return d;
        };

        const curvedLinePath = getCurvedPath(coords);
        const areaPath = coords.length > 0 && curvedLinePath
          ? `${curvedLinePath} L ${coords[coords.length - 1].x},${padT + plotH} L ${coords[0].x},${padT + plotH} Z`
          : '';

        const firstNet = trendPoints[0]?.net || 0;
        const latestNet = trendPoints[trendPoints.length - 1]?.net || 0;
        const diffNet = latestNet - firstNet;
        const avgNet = netValues.length > 0 ? netValues.reduce((s, v) => s + v, 0) / netValues.length : 0;

        return (
          <div
            className="app-card"
            style={{
              padding: '20px 22px',
              maxWidth: 960,
              margin: '0 auto',
              borderRadius: 'var(--radius-card)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Top Bar: Title + Metric Switcher */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 14
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <BarChart3 size={17} color="var(--color-accent)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                    Net Gelişim İvmesi & Trend Eğrisi
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Tarihsel deneme netleri ve sınav başı gelişim eğrisi
                </div>
              </div>

              {/* Metric Selector Tabs */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'tyt_total', label: 'TYT Toplam' },
                  { id: 'ayt_total', label: 'AYT Toplam' },
                  { id: 'tyt_mat', label: 'TYT Mat' },
                  { id: 'tyt_fen', label: 'TYT Fen' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setTrendMetric(tab.id as any);
                      setSelectedTrendPoint(null);
                    }}
                    className={`pill-toggle-btn ${trendMetric === tab.id ? 'active' : ''}`}
                    style={{ fontSize: 12, padding: '5px 12px' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apple Stat Highlights Strip */}
            {trendPoints.length >= 2 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: 14
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', letterSpacing: -0.5 }}>
                    {latestNet.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    SON NET
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: diffNet >= 0 ? 'rgba(48, 209, 88, 0.14)' : 'rgba(255, 69, 58, 0.14)',
                      color: diffNet >= 0 ? '#30D158' : '#FF453A'
                    }}
                  >
                    {diffNet >= 0 ? `+${diffNet.toFixed(2)} Net ↗` : `${diffNet.toFixed(2)} Net ↘`}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span>
                    En Yüksek: <strong style={{ color: '#FFFFFF' }}>{maxVal.toFixed(2)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Ortalama: <strong style={{ color: '#FFFFFF' }}>{avgNet.toFixed(2)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Kayıtlı Deneme: <strong style={{ color: '#FFFFFF' }}>{trendPoints.length}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Chart Area */}
            {coords.length >= 2 ? (
              <div style={{ width: '100%', position: 'relative' }}>
                <svg
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 200,
                    overflow: 'visible',
                    display: 'block'
                  }}
                >
                  <defs>
                    <linearGradient id="trendGradientApple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines & Y Axis labels */}
                  {[0, 0.5, 1].map((ratio) => {
                    const yVal = padT + plotH * (1 - ratio);
                    const netLabel = (minNet + netRange * ratio).toFixed(1);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padL}
                          y1={yVal}
                          x2={padL + plotW}
                          y2={yVal}
                          stroke="rgba(255, 255, 255, 0.07)"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padL - 8}
                          y={yVal + 3.5}
                          fill="rgba(255, 255, 255, 0.45)"
                          fontSize="10"
                          textAnchor="end"
                          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                          fontWeight="500"
                        >
                          {netLabel}
                        </text>
                      </g>
                    );
                  })}

                  {/* Smooth Area gradient */}
                  {areaPath && <path d={areaPath} fill="url(#trendGradientApple)" />}

                  {/* Smooth Curved Line Path */}
                  {curvedLinePath && (
                    <path
                      d={curvedLinePath}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data Points */}
                  {coords.map((pt) => {
                    const isSelected = selectedTrendPoint?.id === pt.id;
                    return (
                      <g
                        key={pt.id}
                        onClick={() => setSelectedTrendPoint(pt)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Selected halo */}
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={9}
                            fill="var(--color-accent)"
                            opacity="0.25"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 5.5 : 4}
                          fill={isSelected ? '#FFFFFF' : 'var(--color-accent)'}
                          stroke="#1C1C1E"
                          strokeWidth="2"
                        />
                        {/* X-axis date label */}
                        <text
                          x={pt.x}
                          y={svgH - 8}
                          fill={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'}
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                          fontWeight={isSelected ? 700 : 500}
                        >
                          {pt.date.split('-').slice(1).join('/')}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Selected Point Detail Callout (Apple Floating Card) */}
                {selectedTrendPoint && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12
                    }}
                  >
                    <div>
                      <strong style={{ color: '#FFFFFF', fontSize: 13 }}>
                        {selectedTrendPoint.title}
                      </strong>
                      <span style={{ color: 'var(--color-text-dim)', marginLeft: 6 }}>
                        ({selectedTrendPoint.publisher})
                      </span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 2 }}>
                        📅 Tarih: {selectedTrendPoint.date}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-accent)' }}>
                        {selectedTrendPoint.net.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-dim)', marginLeft: 3 }}>
                        NET
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--color-text-muted)', fontSize: 12 }}>
                Grafik çizimi için en az 2 deneme kaydı gerekiyor.
              </div>
            )}
          </div>
        );
      })()}

      {/* --------------------------------------------------------------------
          Section: ANALİZ (2x2 Grid)
      -------------------------------------------------------------------- */}
      <div>
        <div className="section-label">ANALİZ</div>
        <div className="grid-2x2">
          <div className="analiz-card-item" onClick={() => onOpenCardModal('trend')}>
            <BarChart3 size={20} color="var(--color-accent)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Net trendi</span>
          </div>
          <div className="analiz-card-item" onClick={() => onOpenCardModal('exam_time')}>
            <Timer size={20} color="var(--color-accent)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Deneme süresi</span>
          </div>
          <div className="analiz-card-item" onClick={() => onOpenCardModal('question_count')}>
            <PenTool size={20} color="var(--color-accent)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Çözülen soru</span>
          </div>
          <div className="analiz-card-item" onClick={() => onOpenCardModal('study_time')}>
            <Play size={20} color="var(--color-accent)" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Çalışma Süresi</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Section: GELİŞMİŞ SİMÜLASYON & RAPORLAR (FEATURES 21, 22, 26)
      -------------------------------------------------------------------- */}
      <div>
        <div className="section-label">GELİŞMİŞ SİMÜLASYON & RAPORLAR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Feature 21: Rank Simulator */}
          <div
            onClick={() => onOpenFeatureModal('rank')}
            className="app-card"
            style={{
              cursor: 'pointer',
              border: '1px solid var(--color-accent-border)',
              background: 'linear-gradient(135deg, var(--color-accent-dim) 0%, rgba(24, 25, 30, 1) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>YKS Sıralama Simülatörü</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>TYT, AYT ve OBP ile 2024/2025 ÖSYM yığılma hesabı</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>

          {/* Feature 22: Benchmark Comparator */}
          <div
            onClick={() => onOpenFeatureModal('benchmark')}
            className="app-card"
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(24, 25, 30, 1) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} color="#00F0FF" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Hedef Bölüm Kıyaslayıcısı</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>YÖK Atlas Boğaziçi, ODTÜ, Hacettepe taban netleri</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>

          {/* Feature 26: Printable PDF Report */}
          <div
            onClick={() => onOpenFeatureModal('report')}
            className="app-card"
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.05) 0%, rgba(24, 25, 30, 1) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(192, 132, 252, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Printer size={20} color="#C084FC" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Karne & Rapor Çıktısı (PDF)</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>A4 formatında yazdırılabilir haftalık gelişim karnesi</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--color-text-muted)" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Section: KAYITLAR
      -------------------------------------------------------------------- */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>KAYITLAR</div>
          <button
            onClick={() => onNavigate('exams')}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Tüm Denemeler
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {exams.slice(0, 2).map((exam) => (
            <div
              key={exam.id}
              onClick={() => onNavigate('exams')}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 18,
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{exam.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {exam.publisher} • {exam.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-accent)' }}>
                  {exam.totalNet.toFixed(2)} Net
                </span>
                <ChevronRight size={16} color="var(--color-text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Section: KONU & MÜFREDAT BİTİRME TABLOSU
      -------------------------------------------------------------------- */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>MÜFREDAT KONU TABLOSU</div>
          <button
            onClick={() => onNavigate('curriculum')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Tabloyu İncele →
          </button>
        </div>

        <div
          onClick={() => onNavigate('curriculum')}
          className="app-card"
          style={{
            marginTop: 10,
            cursor: 'pointer',
            border: '1px solid var(--color-border)',
            background: 'linear-gradient(145deg, var(--color-accent-dim) 0%, rgba(24, 25, 30, 1) 100%)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="var(--color-accent)" />
              <span style={{ fontSize: 15, fontWeight: 800 }}>Konu Bitirme Tablosu</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 700 }}>
              TYT %{tytPct} • AYT %{aytPct}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                <span>TYT Müfredatı ({completedTytTopics}/{totalTytTopics} Konu)</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>%{tytPct}</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#1A1C22', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${tytPct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 99 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                <span>AYT Müfredatı ({completedAytTopics}/{totalAytTopics} Konu)</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>%{aytPct}</span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#1A1C22', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${aytPct}%`, height: '100%', background: '#38BDF8', borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. HOME SCREEN (INCLUDES FEATURES 17, 6, 7, 8, 27)
// ============================================================================
function HomeScreenView({
  countdown,
  profile,
  tasks,
  exams: _exams,
  todaySolvedQuestions,
  todayStudyMinutes,
  questionVault,
  books,
  topicProgress: _topicProgress,
  flashcards,
  onAddTaskFromAi,
  onToggleTask,
  onActivateFreeze,
  onOpenFeatureModal,
  onNavigate,
  onOpenQuickAdd,
  isDesktop
}: {
  countdown: { days: number; hours: number; mins: number; secs: number };
  profile: StudentProfile;
  tasks: DailyTask[];
  exams?: Exam[];
  todaySolvedQuestions: number;
  todayStudyMinutes: number;
  questionVault: QuestionVaultItem[];
  books: BookTrackerItem[];
  topicProgress?: Record<string, TopicStatus>;
  flashcards?: FlashcardItem[];
  onAddTaskFromAi?: (suggestion: {
    subjectCode: string;
    subjectName: string;
    topicName: string;
    targetQuestions: number;
    targetMinutes: number;
  }) => void;
  onToggleTask: (id: string) => void;
  onActivateFreeze: () => void;
  onOpenFeatureModal: (feat: FeatureModalType) => void;
  onNavigate: (tab: any) => void;
  onOpenQuickAdd: (type: 'question' | 'task' | 'exam') => void;
  isDesktop?: boolean;
}) {
  const questionPct = Math.min(100, Math.round((todaySolvedQuestions / (profile.dailyQuestionGoal || 100)) * 100));
  const pendingVaultCount = questionVault.filter((q) => !q.isResolved).length;

  const totalTests = books.reduce((sum, b) => sum + b.totalTests, 0);
  const completedTests = books.reduce((sum, b) => sum + b.completedTests, 0);
  const bookCompletionPct = Math.round((completedTests / (totalTests || 1)) * 100);

  const heroGreetingBanner = (
    <div
      className="app-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: '22px 24px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }} />
            <span>2026-2027 HAZIRLIK SEZONU</span>
          </div>
          <h1 style={{ fontSize: isDesktop ? 24 : 20, fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: -0.3 }}>
            Hoş geldin{profile.name ? `, ${profile.name}` : ''} 👋
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {profile.targetDepartment ? (
              <>
                Hedef: <strong style={{ color: '#FFFFFF' }}>{profile.targetDepartment}</strong> ({profile.fieldTrack?.toUpperCase() || 'SAY'}) • <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{profile.targetUniversity}</span>
              </>
            ) : (
              <span>Hedef: <em style={{ color: 'var(--color-text-dim)' }}>Henüz hedef bölüm seçilmedi</em></span>
            )}
          </p>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => onOpenFeatureModal('benchmark')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 99,
                background: 'rgba(10, 132, 255, 0.12)',
                border: '1px solid rgba(10, 132, 255, 0.3)',
                color: '#0A84FF',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={13} />
              <span>Hedef Değiştir & Net Açığını Gör (YÖK Atlas) ➔</span>
            </button>
          </div>
        </div>

        {/* Quick status metrics group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: 'rgba(255, 159, 10, 0.12)', border: '1px solid rgba(255, 159, 10, 0.25)', color: '#FF9F0A', fontSize: 12, fontWeight: 600 }}>
            <Flame size={15} color="#FF9F0A" />
            <span>{profile.currentStreak} Gün Seri</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: 'rgba(48, 209, 88, 0.12)', border: '1px solid rgba(48, 209, 88, 0.25)', color: '#30D158', fontSize: 12, fontWeight: 600 }}>
            <Target size={15} color="#30D158" />
            <span>%{questionPct} Tamamlandı</span>
          </div>
        </div>
      </div>
    </div>
  );

  const countdownCard = (
    <div
      className="app-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: '20px 22px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Sparkles size={15} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.2 }}>YKS 2027 Geri Sayım</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>TYT (20 Haziran 2027) & AYT (21 Haziran 2027)</div>
          </div>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(255, 255, 255, 0.08)', color: 'var(--color-accent)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {countdown.days} Gün Kaldı
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
        {[
          { val: countdown.days, label: 'GÜN' },
          { val: String(countdown.hours).padStart(2, '0'), label: 'SAAT' },
          { val: String(countdown.mins).padStart(2, '0'), label: 'DAKİKA' },
          { val: String(countdown.secs).padStart(2, '0'), label: 'SANİYE' }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '12px 6px',
              borderRadius: 14
            }}
          >
            <div
              className="tabular-nums"
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: idx === 0 ? 'var(--color-accent)' : '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1
              }}
            >
              {item.val}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 6, letterSpacing: 0.5 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Line */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 500 }}>
          <span>Yıllık Hazırlık İlerlemesi</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>%64</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'var(--color-accent)', borderRadius: 99 }} />
        </div>
      </div>

      {/* Motivational Quote Strip */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 11.5, fontStyle: 'italic' }}>
        <Sparkles size={13} color="var(--color-accent)" style={{ flexShrink: 0 }} />
        <span>"{MOTIVATIONAL_QUOTES[0] || 'Bugünün teri, yarının başarısıdır.'}"</span>
      </div>
    </div>
  );

  const streakCard = (
    <div
      className="app-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 18px',
        borderRadius: 18
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'rgba(255, 159, 10, 0.15)',
            border: '1px solid rgba(255, 159, 10, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Flame size={24} color="#FF9F0A" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16.5, fontWeight: 700, color: '#FFFFFF' }}>
              {profile.currentStreak} Günlük Seri
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2, fontWeight: 500 }}>
            En uzun serin: <strong style={{ color: '#FF9F0A' }}>{profile.longestStreak} gün</strong> • Çizgiyi koru
          </div>
        </div>
      </div>

      <div>
        {profile.streakFreezeActive ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 99,
              background: 'rgba(0, 229, 153, 0.15)',
              border: '1px solid #00E599',
              color: '#00E599',
              fontSize: 11.5,
              fontWeight: 800
            }}
            title="Bugün ders çalışmasan dahi serin bozulmayacak"
          >
            <ShieldCheck size={14} />
            <span>Kalkan Aktif</span>
          </div>
        ) : profile.streakFreezeAvailable > 0 ? (
          <button
            onClick={onActivateFreeze}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 99,
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid #00F0FF',
              color: '#00F0FF',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="1 adet koruma kalkanını harcayarak serini koru"
          >
            <Shield size={14} />
            <span>Kalkanı Aç ({profile.streakFreezeAvailable})</span>
          </button>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Kalkan: 0</span>
        )}
      </div>
    </div>
  );

  const aiCoachCard = (
    <div
      className="app-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: '20px 22px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Sparkles size={16} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF' }}>Akıllı Çalışma Koçu</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Zayıf alanlarına ve hata defterine göre hedefler</div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('ai')}
          className="btn-secondary"
          style={{
            fontSize: 12,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
          title="Koç ile Sohbet Et"
        >
          <Bot size={14} color="var(--color-accent)" />
          <span>Koça Danış</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          {
            id: 'ai-1',
            subjectCode: 'ayt_fizik',
            subjectName: 'AYT Fizik',
            topicName: 'Vektörler ve Bağıl Hareket',
            badge: 'Hata Tekrarı',
            badgeColor: '#FF9F0A',
            reason: 'Hata defterinde 2 yanlış soru birikti. 20 soruyla pekiştir.',
            targetQuestions: 20,
            targetMinutes: 35
          },
          {
            id: 'ai-2',
            subjectCode: 'tyt_mat',
            subjectName: 'TYT Matematik',
            topicName: 'Basit Eşitsizlikler',
            badge: 'Net Artışı',
            badgeColor: '#0A84FF',
            reason: 'Müfredatta çalışılıyor durumunda. Sınavda garanti 1 net kazandırır.',
            targetQuestions: 25,
            targetMinutes: 40
          },
          {
            id: 'ai-3',
            subjectCode: 'tyt_turkce',
            subjectName: 'TYT Türkçe',
            topicName: 'Paragrafta Anlam',
            badge: 'Tempo Antrenmanı',
            badgeColor: '#5E5CE6',
            reason: 'Soru başına 65 saniye ortalamayı korumak için 20 soru hız antrenmanı.',
            targetQuestions: 20,
            targetMinutes: 22
          }
        ].map((sug) => {
          const alreadyAdded = tasks.some((t) => t.topicName === sug.topicName && t.date === '2026-10-20');
          return (
            <div
              key={sug.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 6, background: `${sug.badgeColor}20`, color: sug.badgeColor }}>
                    {sug.badge}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
                    {sug.subjectName}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sug.topicName}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{sug.reason}</div>
                <div style={{ fontSize: 10.5, color: 'var(--color-accent)', fontWeight: 600, marginTop: 4 }}>
                  Hedef: {sug.targetQuestions} Soru • ⏱️ {sug.targetMinutes} dk
                </div>
              </div>

              <button
                disabled={alreadyAdded}
                onClick={() => {
                  if (onAddTaskFromAi) {
                    onAddTaskFromAi({
                      subjectCode: sug.subjectCode,
                      subjectName: sug.subjectName,
                      topicName: sug.topicName,
                      targetQuestions: sug.targetQuestions,
                      targetMinutes: sug.targetMinutes
                    });
                  }
                }}
                style={{
                  padding: '8px 13px',
                  borderRadius: 11,
                  background: alreadyAdded ? 'rgba(0, 229, 153, 0.15)' : 'rgba(212, 255, 0, 0.15)',
                  border: alreadyAdded ? '1px solid #00E599' : '1px solid var(--color-accent)',
                  color: alreadyAdded ? '#00E599' : 'var(--color-accent)',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: alreadyAdded ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                {alreadyAdded ? (
                  <>
                    <Check size={14} />
                    <span>Eklendi</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Göreve Ekle</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const quickToolsCard = (
    <div>
      <div className="section-label">HIZLI ARAÇLAR & YARDIMCILAR</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {/* Tool 1: Question Vault (Feature 6) */}
        <div
          onClick={() => onOpenFeatureModal('vault')}
          className="quick-tool-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="var(--color-accent)" />
            </div>
            {pendingVaultCount > 0 ? (
              <span style={{ fontSize: 10, padding: '3px 7px', borderRadius: 99, background: 'rgba(255, 80, 80, 0.18)', color: '#FF5050', fontWeight: 800, border: '1px solid rgba(255, 80, 80, 0.25)' }}>
                {pendingVaultCount} Bekliyor
              </span>
            ) : (
              <span style={{ fontSize: 10, padding: '3px 7px', borderRadius: 99, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-dim)', fontWeight: 700 }}>
                0 Bekleyen
              </span>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--color-text)' }}>Hata Defteri</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Aralıklı tekrar algoritması</div>
          </div>
        </div>

        {/* Tool 2: Speed Meter (Feature 7) */}
        <div
          onClick={() => onOpenFeatureModal('speed')}
          className="quick-tool-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(10, 132, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={17} color="#0A84FF" />
            </div>
            <span style={{ fontSize: 10, padding: '3px 7px', borderRadius: 99, background: 'rgba(10, 132, 255, 0.12)', color: '#0A84FF', fontWeight: 600 }}>
              Kronometre
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>Hız Sayacı</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Soru tempo analizi</div>
          </div>
        </div>

        {/* Tool 3: Book Tracker (Feature 8) */}
        <div
          onClick={() => onOpenFeatureModal('books')}
          className="quick-tool-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(191, 90, 242, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={17} color="#BF5AF2" />
            </div>
            <span style={{ fontSize: 10, padding: '3px 7px', borderRadius: 99, background: 'rgba(191, 90, 242, 0.12)', color: '#BF5AF2', fontWeight: 600 }}>
              %{bookCompletionPct} Bitti
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>Kaynak Kitaplar</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{books.length} Test kitabı takipte</div>
          </div>
        </div>

        {/* Tool 4: Screen Widget Preview (Feature 27) */}
        <div
          onClick={() => onOpenFeatureModal('widget')}
          className="quick-tool-card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(99, 230, 226, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={17} color="#63E6E2" />
            </div>
            <span style={{ fontSize: 10, padding: '3px 7px', borderRadius: 99, background: 'rgba(99, 230, 226, 0.12)', color: '#63E6E2', fontWeight: 600 }}>
              Önizleme
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>Ekran Widget'ı</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Kilit & ana ekran</div>
          </div>
        </div>

        {/* Tool 5: Flashcards (Feature 9) */}
        <div
          onClick={() => onOpenFeatureModal('flashcards')}
          className="quick-tool-card quick-tool-card-wide"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div style={{ width: 34, height: 34, minWidth: 34, borderRadius: 10, background: 'rgba(94, 92, 230, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="#5E5CE6" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Hap Bilgi & Formüller
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Kritik formül ezber kartları
              </div>
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: 'rgba(48, 209, 88, 0.14)', color: '#30D158', whiteSpace: 'nowrap' }}>
              {flashcards ? flashcards.filter((f) => f.isMastered).length : 0}/{flashcards?.length || 6} Ezber
            </span>
            <ChevronRight size={14} color="var(--color-text-dim)" />
          </div>
        </div>

        {/* Tool 6: YÖK Atlas Hedef & Net Açığı (Feature 22) */}
        <div
          onClick={() => onOpenFeatureModal('benchmark')}
          className="quick-tool-card quick-tool-card-wide"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(10, 132, 255, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div style={{ width: 34, height: 34, minWidth: 34, borderRadius: 10, background: 'rgba(10, 132, 255, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color="#0A84FF" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                YÖK Atlas Hedef & Net Açığı
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.targetUniversity} • {profile.targetDepartment}
              </div>
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: 'rgba(10, 132, 255, 0.14)', color: '#0A84FF', whiteSpace: 'nowrap' }}>
              Hedef Analizi ➔
            </span>
            <ChevronRight size={14} color="var(--color-text-dim)" />
          </div>
        </div>
      </div>
    </div>
  );

  const goalsCard = (
    <div className="app-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={16} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: '#FFFFFF' }}>Günün Çalışma Özeti</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Hedefe göre anlık durum</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)' }}>
          %{questionPct} Tamamlandı
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '14px 16px', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            <Target size={14} color="var(--color-accent)" />
            <span>Çözülen Soru</span>
          </div>
          <div className="tabular-nums" style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.3 }}>
            {todaySolvedQuestions} <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 400 }}>/ {profile.dailyQuestionGoal}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '14px 16px', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            <Clock size={14} color="var(--color-accent)" />
            <span>Çalışma Süresi</span>
          </div>
          <div className="tabular-nums" style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.3 }}>
            {Math.floor(todayStudyMinutes / 60)}s {todayStudyMinutes % 60}d{' '}
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 400 }}>/ {Math.floor(profile.dailyStudyMinutesGoal / 60)}s</span>
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={() => onOpenQuickAdd('question')}
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>+ Soru Çözümü Kaydet</span>
      </button>
    </div>
  );

  const tasksCard = (
    <div className="app-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(212, 255, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={16} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: '#FFFFFF' }}>Bugünün Görevleri</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
              {tasks.filter((t) => t.isCompleted).length}/{tasks.length} Görev Tamamlandı
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('calendar')}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: 11.5 }}
        >
          <span>Tümünü Gör</span>
          <ChevronRight size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task.id}
            onClick={() => {
              sounds.playClick();
              onToggleTask(task.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.03)',
              border: task.isCompleted
                ? '1px solid rgba(48, 209, 88, 0.25)'
                : '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'transform 120ms var(--ease-out), border-color 120ms ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="clickable-card"
          >
            <div>
              {task.isCompleted ? (
                <CheckCircle2 size={22} color="#30D158" />
              ) : (
                <Circle size={22} color="var(--color-text-muted)" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: 6,
                    background: task.isCompleted ? 'rgba(48, 209, 88, 0.12)' : 'rgba(255, 255, 255, 0.07)',
                    color: task.isCompleted ? '#30D158' : 'var(--color-text-muted)'
                  }}
                >
                  {task.subjectName}
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    color: task.isCompleted ? 'var(--color-text-muted)' : '#FFFFFF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {task.topicName}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Hedef: <strong style={{ color: 'var(--color-accent)' }}>{task.targetQuestions} soru</strong> • ⏱️ {task.targetMinutes} dakika
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="desktop-home-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {heroGreetingBanner}
          {countdownCard}
          {aiCoachCard}
          {goalsCard}
          {tasksCard}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {streakCard}
          {quickToolsCard}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {heroGreetingBanner}
      {countdownCard}
      {streakCard}
      {aiCoachCard}
      {quickToolsCard}
      {goalsCard}
      {tasksCard}
    </div>
  );
}

// ============================================================================
// 3. CALENDAR & TASKS & DUAL-MODE POMODORO SCREEN (FEATURE 15)
// ============================================================================
function CalendarTasksView({
  tasks,
  questionLogs = [],
  onAddQuestionLog,
  onDeleteQuestionLog,
  onToggleTask,
  onOpenAddTask,
  timerType,
  onSwitchTimerType,
  timerSeconds,
  isTimerRunning,
  timerMode,
  studyDurationMinutes,
  breakDurationMinutes,
  completedSessionsCount,
  selectedTimerSubject,
  stopwatchSeconds,
  isStopwatchRunning,
  onToggleTimer,
  onResetTimer,
  onToggleStopwatch,
  onResetStopwatch,
  onSaveStopwatchSession,
  onSwitchMode,
  onSetDuration,
  onAdjustDelta,
  onSelectSubject,
  onOpenFlocus,
  isDesktop
}: {
  tasks: DailyTask[];
  questionLogs?: QuestionLog[];
  onAddQuestionLog?: (
    subject: string,
    topic: string,
    source: string,
    count: number,
    minutes: number,
    date?: string,
    correct?: number,
    wrong?: number
  ) => void;
  onDeleteQuestionLog?: (id: string) => void;
  onToggleTask: (id: string) => void;
  onOpenAddTask: () => void;
  timerType: 'countdown' | 'stopwatch';
  onSwitchTimerType: (type: 'countdown' | 'stopwatch') => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  timerMode: 'study' | 'break';
  studyDurationMinutes: number;
  breakDurationMinutes: number;
  completedSessionsCount: number;
  selectedTimerSubject: string;
  stopwatchSeconds: number;
  isStopwatchRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onToggleStopwatch: () => void;
  onResetStopwatch: () => void;
  onSaveStopwatchSession: () => void;
  onSwitchMode: (mode: 'study' | 'break') => void;
  onSetDuration: (mins: number) => void;
  onAdjustDelta: (delta: number) => void;
  onSelectSubject: (s: string) => void;
  onOpenFlocus?: () => void;
  isDesktop?: boolean;
}) {
  const [calendarSubTab, setCalendarSubTab] = useState<'schedule' | 'timer' | 'tasks'>('schedule');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  // Countdown calculations
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const currentTargetMinutes = timerMode === 'study' ? studyDurationMinutes : breakDurationMinutes;
  const totalDuration = currentTargetMinutes * 60;
  const progressPct = Math.min(100, Math.max(0, ((totalDuration - timerSeconds) / totalDuration) * 100));

  // Stopwatch calculations
  const swHrs = Math.floor(stopwatchSeconds / 3600);
  const swMins = Math.floor((stopwatchSeconds % 3600) / 60);
  const swSecs = stopwatchSeconds % 60;

  const studyPresets = [15, 25, 40, 50, 60];
  const breakPresets = [5, 10, 15, 20];

  return (
    <div style={{ padding: isDesktop ? 0 : '0 18px', display: 'flex', flexDirection: 'column', gap: isDesktop ? 20 : 16 }}>
      {/* Calendar Sub-Tabs: Haftalık Soru Çizelgesi (DEFAULT) | Odak & Sayaç | Görevler */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: 6,
          background: 'rgba(0, 0, 0, 0.35)',
          padding: 4,
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setCalendarSubTab('schedule');
          }}
          style={{
            padding: '10px 8px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            background: calendarSubTab === 'schedule' ? 'var(--color-accent)' : 'transparent',
            color: calendarSubTab === 'schedule' ? '#FFFFFF' : 'var(--color-text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: calendarSubTab === 'schedule' ? '0 4px 14px rgba(10, 132, 255, 0.35)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <BarChart3 size={16} />
          <span>Haftalık Soru Çizelgesi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setCalendarSubTab('timer');
          }}
          style={{
            padding: '10px 8px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            background: calendarSubTab === 'timer' ? 'var(--color-accent)' : 'transparent',
            color: calendarSubTab === 'timer' ? '#FFFFFF' : 'var(--color-text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: calendarSubTab === 'timer' ? '0 4px 14px rgba(10, 132, 255, 0.35)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Timer size={16} />
          <span>Odak & Sayaç</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setCalendarSubTab('tasks');
          }}
          style={{
            padding: '10px 8px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            border: 'none',
            background: calendarSubTab === 'tasks' ? 'var(--color-accent)' : 'transparent',
            color: calendarSubTab === 'tasks' ? '#FFFFFF' : 'var(--color-text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxShadow: calendarSubTab === 'tasks' ? '0 4px 14px rgba(10, 132, 255, 0.35)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={16} />
          <span>Görevler ({tasks.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: HAFTALIK SORU ÇİZELGESİ (MATRİS & DERS/KONU BAZLI) */}
      {calendarSubTab === 'schedule' && (
        <WeeklyQuestionSchedule
          questionLogs={questionLogs}
          onAddQuestionLog={onAddQuestionLog || (() => {})}
          onDeleteQuestionLog={onDeleteQuestionLog || (() => {})}
          isDesktop={isDesktop}
        />
      )}

      {/* SUB-TAB 2: ODAK & KRONOMETRE & FLOCUS */}
      {calendarSubTab === 'timer' && (
        <>
      {/* Flocus Focus & Ambient Sounds Banner */}
      {onOpenFlocus && (
        <div
          onClick={() => {
            sounds.playSuccess();
            onOpenFlocus();
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(212, 255, 0, 0.18) 0%, rgba(0, 240, 255, 0.18) 100%)',
            border: '1px solid rgba(212, 255, 0, 0.45)',
            borderRadius: 18,
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #D4FF00 0%, #00F0FF 100%)',
                color: '#080B10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900
              }}
            >
              <Timer size={22} />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>NetFocus Odaklanma Alanı</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#D4FF00', color: '#000', fontWeight: 900 }}>YENİ</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Ambiyans sesleri (yağmur, şömine, lo-fi), estetik saat & temalar
              </div>
            </div>
          </div>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 99,
              background: '#D4FF00',
              border: 'none',
              color: '#080B10',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            NetFocus'a Git ✨
          </button>
        </div>
      )}

      {/* Dual Mode Switcher Banner: Feature 15 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          className={`btn-secondary ${timerType === 'countdown' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13, fontWeight: 800 }}
          onClick={() => {
            sounds.playClick();
            onSwitchTimerType('countdown');
          }}
        >
          <Timer size={16} />
          <span>Geri Sayım (Pomodoro)</span>
        </button>
        <button
          className={`btn-secondary ${timerType === 'stopwatch' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13, fontWeight: 800 }}
          onClick={() => {
            sounds.playClick();
            onSwitchTimerType('stopwatch');
          }}
        >
          <Clock size={16} />
          <span>Serbest Kronometre</span>
        </button>
      </div>

      {/* Focus Timer Card */}
      <div
        className="app-card"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 26, 38, 0.9) 0%, rgba(12, 16, 24, 0.96) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 22,
          textAlign: 'center',
          position: 'relative',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {timerType === 'countdown' ? (
          <>
            {/* Countdown Mode Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 16 }}>
                <Timer size={18} color="var(--color-accent)" />
                <span>Odaklanma Sayacı</span>
              </div>

              {/* Mode Pill Toggle */}
              <div
                style={{
                  display: 'flex',
                  background: '#0E0F12',
                  padding: 3,
                  borderRadius: 999,
                  border: '1px solid var(--color-border)'
                }}
              >
                <button
                  onClick={() => onSwitchMode('study')}
                  style={{
                    background: timerMode === 'study' ? 'var(--color-accent)' : 'transparent',
                    color: timerMode === 'study' ? '#000000' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: 11,
                    border: 'none',
                    borderRadius: 999,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Çalışma
                </button>
                <button
                  onClick={() => onSwitchMode('break')}
                  style={{
                    background: timerMode === 'break' ? '#38BDF8' : 'transparent',
                    color: timerMode === 'break' ? '#000000' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: 11,
                    border: 'none',
                    borderRadius: 999,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Mola
                </button>
              </div>
            </div>

            {/* Duration Quick Presets Bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {timerMode === 'study' ? 'Çalışma Süresi:' : 'Mola Süresi:'}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: timerMode === 'study' ? 'var(--color-accent)' : '#38BDF8'
                  }}
                >
                  {currentTargetMinutes} Dakika
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {(timerMode === 'study' ? studyPresets : breakPresets).map((preset) => {
                  const isActive = currentTargetMinutes === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => onSetDuration(preset)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: isActive ? 'var(--color-surface-hover)' : 'rgba(255,255,255,0.03)',
                        border: isActive
                          ? `1.5px solid ${timerMode === 'study' ? 'var(--color-accent)' : '#38BDF8'}`
                          : '1px solid var(--color-border)',
                        color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset} dk
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Circular Timer Readout */}
            <div style={{ position: 'relative', width: 170, height: 170, margin: '0 auto 14px auto' }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="85" cy="85" r="74" stroke="#212328" strokeWidth="8" fill="transparent" />
                <circle
                  cx="85"
                  cy="85"
                  r="74"
                  stroke={timerMode === 'study' ? 'var(--color-accent)' : '#38BDF8'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 74}
                  strokeDashoffset={2 * Math.PI * 74 * (1 - progressPct / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="tabular-nums" style={{ fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: timerMode === 'study' ? 'var(--color-accent)' : '#38BDF8',
                    fontWeight: 700,
                    marginTop: 2
                  }}
                >
                  {timerMode === 'study' ? selectedTimerSubject : '☕ Dinlenme Zamanı'}
                </div>
              </div>
            </div>

            {/* Main Controls & Step Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => onAdjustDelta(-5)}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700 }}
                title="5 dakika azalt"
              >
                <Minus size={14} />
                <span>-5 dk</span>
              </button>

              <button
                className="btn-primary"
                onClick={onToggleTimer}
                style={{
                  minWidth: 125,
                  padding: '12px 18px',
                  backgroundColor: timerMode === 'study' ? 'var(--color-accent)' : '#38BDF8'
                }}
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isTimerRunning ? 'Duraklat' : 'Başlat'}</span>
              </button>

              <button
                onClick={() => onAdjustDelta(5)}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700 }}
                title="5 dakika ekle"
              >
                <Plus size={14} />
                <span>+5 dk</span>
              </button>

              <button className="btn-secondary" onClick={onResetTimer} title="Sıfırla" style={{ padding: '10px 12px' }}>
                <RotateCcw size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Feature 15: Freeform Stopwatch Mode */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 16 }}>
                <Clock size={18} color="#00F0FF" />
                <span>Serbest Kronometre</span>
              </div>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: 'rgba(0, 240, 255, 0.15)', color: '#00F0FF', fontWeight: 700 }}>
                Süre Kısıtlamasız
              </span>
            </div>

            {/* Big Digital Stopwatch Display */}
            <div style={{ padding: '24px 0', margin: '0 auto 10px auto' }}>
              <div
                className="tabular-nums"
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.02em',
                  color: isStopwatchRunning ? '#00F0FF' : '#FFF'
                }}
              >
                {swHrs > 0 ? `${String(swHrs).padStart(2, '0')}:` : ''}
                {String(swMins).padStart(2, '0')}:{String(swSecs).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                {isStopwatchRunning ? '⚡ Odaklanma oturumu devam ediyor...' : 'Başlat butonuna basarak süre tutun'}
              </div>
            </div>

            {/* Stopwatch Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <button
                className="btn-primary"
                onClick={onToggleStopwatch}
                style={{ minWidth: 130, padding: '12px 20px', backgroundColor: '#00F0FF', color: '#000' }}
              >
                {isStopwatchRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isStopwatchRunning ? 'Durdur' : 'Başlat'}</span>
              </button>

              <button className="btn-secondary" onClick={onResetStopwatch} title="Sıfırla" style={{ padding: '10px 14px' }}>
                <RotateCcw size={16} />
                <span>Sıfırla</span>
              </button>

              {stopwatchSeconds > 30 && (
                <button
                  className="btn-primary"
                  onClick={onSaveStopwatchSession}
                  style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
                >
                  <Check size={16} />
                  <span>Seansı Kaydet</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Bottom Bar: Subject Select & Completed Sessions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--color-border)',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Ders:</span>
            <select
              value={selectedTimerSubject}
              onChange={(e) => onSelectSubject(e.target.value)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: '#1D1F25',
                border: '1px solid var(--color-border)',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {YKS_SUBJECTS.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            Tamamlanan Seans: <strong style={{ color: 'var(--color-accent)' }}>{completedSessionsCount}</strong>
          </div>
        </div>
      </div>
      </>
      )}

      {/* SUB-TAB 3: GÜNLÜK GÖREVLER LİSTESİ */}
      {calendarSubTab === 'tasks' && (
      <div className="app-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Günlük Görev Listesi</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Bugün tamamlanması hedeflenen plan</div>
          </div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onOpenAddTask}>
            <Plus size={14} />
            <span>Görev Ekle</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <button className={`pill-toggle-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Tümü ({tasks.length})
          </button>
          <button className={`pill-toggle-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
            Kalan ({tasks.filter((t) => !t.isCompleted).length})
          </button>
          <button className={`pill-toggle-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
            Biten ({tasks.filter((t) => t.isCompleted).length})
          </button>
        </div>

        {/* Tasks List Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Bu filtrede görev bulunamadı.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: task.isCompleted ? 'rgba(212, 255, 0, 0.05)' : '#1D1F25',
                  border: task.isCompleted ? '1px solid rgba(212, 255, 0, 0.3)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {task.isCompleted ? (
                  <CheckCircle2 size={22} color="var(--color-accent)" />
                ) : (
                  <Circle size={22} color="var(--color-text-muted)" />
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      color: task.isCompleted ? 'var(--color-text-muted)' : '#FFFFFF'
                    }}
                  >
                    {task.subjectName} • {task.topicName}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Hedef: {task.targetQuestions} soru • {task.targetMinutes} dakika
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. EXAMS SCREEN
// ============================================================================
function ExamsScreenView({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  onOpenPrintReport,
  isDesktop
}: {
  exams: Exam[];
  onAddExam: (newExam: Exam) => void;
  onUpdateExam?: (updatedExam: Exam) => void;
  onDeleteExam?: (examId: string) => void;
  onOpenPrintReport?: () => void;
  isDesktop?: boolean;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [examType, setExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'kolay' | 'orta' | 'osym' | 'zor'>('osym');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duration] = useState(165);

  // Exam Detail & Edit Modal States
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPublisher, setEditPublisher] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'kolay' | 'orta' | 'osym' | 'zor'>('orta');
  const [editScores, setEditScores] = useState<Record<string, { correct: number; wrong: number; blank: number }>>({});

  // Feature 6 Filter States
  const [filterType, setFilterType] = useState<'all' | 'TYT' | 'AYT'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'kolay' | 'orta' | 'osym' | 'zor'>('all');
  const [filterPublisher, setFilterPublisher] = useState<string>('all');

  const uniquePublishers = Array.from(new Set(exams.map((e) => e.publisher).filter(Boolean)));

  const filteredExams = exams.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (filterDifficulty !== 'all' && (e.difficulty || 'orta') !== filterDifficulty) return false;
    if (filterPublisher !== 'all' && e.publisher !== filterPublisher) return false;
    return true;
  });

  const avgNet = filteredExams.length > 0
    ? filteredExams.reduce((sum, e) => sum + e.totalNet, 0) / filteredExams.length
    : 0;
  const maxNet = filteredExams.length > 0
    ? Math.max(...filteredExams.map((e) => e.totalNet))
    : 0;

  const tytSubjects = [
    { code: 'tyt_turkce', name: 'Türkçe', q: 40 },
    { code: 'tyt_sosyal', name: 'Sosyal Bilimler', q: 20 },
    { code: 'tyt_mat', name: 'Temel Matematik', q: 40 },
    { code: 'tyt_fizik', name: 'Fizik', q: 7 },
    { code: 'tyt_kimya', name: 'Kimya', q: 7 },
    { code: 'tyt_biyo', name: 'Biyoloji', q: 6 }
  ];

  const aytSubjects = [
    { code: 'ayt_mat', name: 'AYT Matematik', q: 40 },
    { code: 'ayt_fizik', name: 'AYT Fizik', q: 14 },
    { code: 'ayt_kimya', name: 'AYT Kimya', q: 13 },
    { code: 'ayt_biyo', name: 'AYT Biyoloji', q: 13 }
  ];

  const activeSubjects = examType === 'TYT' ? tytSubjects : aytSubjects;
  const [scores, setScores] = useState<Record<string, { correct: number; wrong: number; blank: number }>>({});

  const handleScoreChange = (code: string, field: 'correct' | 'wrong' | 'blank', val: number) => {
    setScores((prev) => ({
      ...prev,
      [code]: {
        correct: field === 'correct' ? val : prev[code]?.correct || 0,
        wrong: field === 'wrong' ? val : prev[code]?.wrong || 0,
        blank: field === 'blank' ? val : prev[code]?.blank || 0
      }
    }));
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen deneme adını girin.');
      return;
    }

    let totalNet = 0;
    const subjectResults = activeSubjects.map((s) => {
      const c = scores[s.code]?.correct || 0;
      const w = scores[s.code]?.wrong || 0;
      const b = scores[s.code]?.blank || 0;
      // Allow negative nets (e.g. 0 correct, 1 wrong = -0.25)
      const net = Math.round((c - w * 0.25) * 100) / 100;
      totalNet += net;
      return {
        subjectCode: s.code,
        subjectName: s.name,
        correct: c,
        wrong: w,
        blank: b,
        net
      };
    });
    totalNet = Math.round(totalNet * 100) / 100;

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title,
      type: examType,
      publisher: publisher || 'Deneme Yayını',
      difficulty: formDifficulty,
      date,
      totalNet,
      durationMinutes: duration,
      subjectResults
    };

    onAddExam(newExam);
    setShowAddForm(false);
    setTitle('');
    setPublisher('');
    setScores({});
  };

  // Open Exam Detail Modal
  const handleOpenExamDetail = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditingExam(false);
    setEditTitle(exam.title);
    setEditPublisher(exam.publisher || '');
    setEditDate(exam.date);
    setEditDifficulty(exam.difficulty || 'orta');

    const initScores: Record<string, { correct: number; wrong: number; blank: number }> = {};
    if (exam.subjectResults && exam.subjectResults.length > 0) {
      exam.subjectResults.forEach((sr) => {
        initScores[sr.subjectCode] = {
          correct: sr.correct,
          wrong: sr.wrong,
          blank: sr.blank
        };
      });
    }
    setEditScores(initScores);
  };

  const handleEditScoreChange = (code: string, field: 'correct' | 'wrong' | 'blank', val: number) => {
    setEditScores((prev) => ({
      ...prev,
      [code]: {
        correct: field === 'correct' ? val : prev[code]?.correct || 0,
        wrong: field === 'wrong' ? val : prev[code]?.wrong || 0,
        blank: field === 'blank' ? val : prev[code]?.blank || 0
      }
    }));
  };

  const handleSaveEditExam = () => {
    if (!selectedExam) return;
    if (!editTitle.trim()) {
      alert('Lütfen deneme adını girin.');
      return;
    }

    const examSubjectsList = selectedExam.type === 'TYT' ? tytSubjects : aytSubjects;
    let totalNet = 0;
    const updatedSubjectResults = examSubjectsList.map((s) => {
      const c = editScores[s.code]?.correct || 0;
      const w = editScores[s.code]?.wrong || 0;
      const b = editScores[s.code]?.blank || 0;
      const net = Math.round((c - w * 0.25) * 100) / 100;
      totalNet += net;
      return {
        subjectCode: s.code,
        subjectName: s.name,
        correct: c,
        wrong: w,
        blank: b,
        net
      };
    });
    totalNet = Math.round(totalNet * 100) / 100;

    const updatedExam: Exam = {
      ...selectedExam,
      title: editTitle.trim(),
      publisher: editPublisher.trim() || 'Deneme Yayını',
      difficulty: editDifficulty,
      date: editDate || selectedExam.date,
      totalNet,
      subjectResults: updatedSubjectResults
    };

    if (onUpdateExam) {
      onUpdateExam(updatedExam);
    }
    setSelectedExam(updatedExam);
    setIsEditingExam(false);
  };

  const handleDeleteSelectedExam = () => {
    if (!selectedExam) return;
    if (window.confirm(`"${selectedExam.title}" denemesini silmek istediğinize emin misiniz?`)) {
      if (onDeleteExam) {
        onDeleteExam(selectedExam.id);
      }
      setSelectedExam(null);
      setIsEditingExam(false);
    }
  };

  const difficultyBadges: Record<string, { label: string; color: string }> = {
    kolay: { label: 'Kolay', color: '#00E599' },
    orta: { label: 'Orta', color: '#FFB800' },
    osym: { label: 'ÖSYM Ayarı', color: '#C084FC' },
    zor: { label: 'Zor', color: '#FF5050' }
  };

  return (
    <div style={{ padding: isDesktop ? 0 : '0 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Banner & Print Trigger (Feature 26) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Denemeler & Karne</h2>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Toplam {exams.length} Deneme Sınavı Kayıtlı</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onOpenPrintReport && (
            <button
              className="btn-secondary"
              onClick={onOpenPrintReport}
              style={{ padding: '8px 12px', fontSize: 12 }}
              title="Karne çıktısı al"
            >
              <Printer size={15} />
              <span>Yazdır</span>
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            <Plus size={16} />
            <span>{showAddForm ? 'İptal' : 'Deneme Ekle'}</span>
          </button>
        </div>
      </div>

      {showAddForm ? (
        <form onSubmit={handleSaveExam} className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Yeni Deneme Sınavı Kaydı</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              className={`btn-secondary ${examType === 'TYT' ? 'active' : ''}`}
              style={{ justifyContent: 'center' }}
              onClick={() => setExamType('TYT')}
            >
              TYT Denemesi
            </button>
            <button
              type="button"
              className={`btn-secondary ${examType === 'AYT' ? 'active' : ''}`}
              style={{ justifyContent: 'center' }}
              onClick={() => setExamType('AYT')}
            >
              AYT Denemesi
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Deneme Adı</label>
            <input
              type="text"
              required
              placeholder="Ör: 3D Türkiye Geneli TYT-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Yayınevi</label>
              <input
                type="text"
                placeholder="Ör: 3D Yayınları"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Tarih</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
              />
            </div>
          </div>

          {/* Feature 6: Zorluk Seviyesi Seçimi */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>
              Zorluk Seviyesi
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { id: 'kolay', label: '🟢 Kolay', color: '#00E599' },
                { id: 'orta', label: '🟡 Orta', color: '#FFB800' },
                { id: 'osym', label: '🟣 ÖSYM', color: '#C084FC' },
                { id: 'zor', label: '🔴 Zor', color: '#FF5050' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormDifficulty(lvl.id as any)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: formDifficulty === lvl.id ? `${lvl.color}25` : '#1D1F25',
                    border: formDifficulty === lvl.id ? `1.5px solid ${lvl.color}` : '1px solid var(--color-border)',
                    color: formDifficulty === lvl.id ? lvl.color : 'var(--color-text-muted)'
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Net Matrix Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700 }}>
              <span>Ders</span>
              <span style={{ textAlign: 'center' }}>Doğru</span>
              <span style={{ textAlign: 'center' }}>Yanlış</span>
              <span style={{ textAlign: 'center' }}>Net</span>
            </div>

            {activeSubjects.map((sub) => {
              const currentScore = scores[sub.code] || { correct: 0, wrong: 0, blank: 0 };
              const currentNet = Math.round((currentScore.correct - currentScore.wrong * 0.25) * 100) / 100;
              return (
                <div key={sub.code} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{sub.name}</span>
                  <input
                    type="number"
                    min="0"
                    max={sub.q}
                    value={currentScore.correct || ''}
                    onChange={(e) => handleScoreChange(sub.code, 'correct', Number(e.target.value))}
                    style={{ padding: 6, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', textAlign: 'center' }}
                  />
                  <input
                    type="number"
                    min="0"
                    max={sub.q}
                    value={currentScore.wrong || ''}
                    onChange={(e) => handleScoreChange(sub.code, 'wrong', Number(e.target.value))}
                    style={{ padding: 6, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', textAlign: 'center' }}
                  />
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, color: currentNet < 0 ? '#FF453A' : 'var(--color-accent)' }}>
                    {currentNet > 0 ? `+${currentNet.toFixed(2)}` : currentNet.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Denemeyi Kaydet
          </button>
        </form>
      ) : (
        <>
          {/* Feature 6: Filter Tabs & Publisher Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className={`pill-toggle-btn ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  Tümü ({exams.length})
                </button>
                <button
                  className={`pill-toggle-btn ${filterType === 'TYT' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setFilterType(filterType === 'TYT' ? 'all' : 'TYT');
                  }}
                  title={filterType === 'TYT' ? 'Filtreyi kaldır (Tüm sınavlar)' : 'Sadece TYT'}
                >
                  TYT {filterType === 'TYT' ? '✕' : ''}
                </button>
                <button
                  className={`pill-toggle-btn ${filterType === 'AYT' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setFilterType(filterType === 'AYT' ? 'all' : 'AYT');
                  }}
                  title={filterType === 'AYT' ? 'Filtreyi kaldır (Tüm sınavlar)' : 'Sadece AYT'}
                >
                  AYT {filterType === 'AYT' ? '✕' : ''}
                </button>
              </div>

              {/* Publisher Selector Dropdown */}
              <select
                value={filterPublisher}
                onChange={(e) => setFilterPublisher(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 99,
                  background: '#1D1F25',
                  border: '1px solid var(--color-border)',
                  color: '#fff',
                  fontSize: 11,
                  maxWidth: 140
                }}
              >
                <option value="all">Tüm Yayınlar</option>
                {uniquePublishers.map((pub) => (
                  <option key={pub} value={pub}>{pub}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter Pills */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
              <button
                className={`pill-toggle-btn ${filterDifficulty === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('all')}
              >
                Tümü
              </button>
              <button
                className={`pill-toggle-btn ${filterDifficulty === 'kolay' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setFilterDifficulty(filterDifficulty === 'kolay' ? 'all' : 'kolay');
                }}
                title={filterDifficulty === 'kolay' ? 'Filtreyi kaldır' : 'Kolay'}
              >
                🟢 Kolay {filterDifficulty === 'kolay' ? '✕' : ''}
              </button>
              <button
                className={`pill-toggle-btn ${filterDifficulty === 'orta' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setFilterDifficulty(filterDifficulty === 'orta' ? 'all' : 'orta');
                }}
                title={filterDifficulty === 'orta' ? 'Filtreyi kaldır' : 'Orta'}
              >
                🟡 Orta {filterDifficulty === 'orta' ? '✕' : ''}
              </button>
              <button
                className={`pill-toggle-btn ${filterDifficulty === 'osym' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setFilterDifficulty(filterDifficulty === 'osym' ? 'all' : 'osym');
                }}
                title={filterDifficulty === 'osym' ? 'Filtreyi kaldır' : 'ÖSYM Ayarı'}
              >
                🟣 ÖSYM Ayarı {filterDifficulty === 'osym' ? '✕' : ''}
              </button>
              <button
                className={`pill-toggle-btn ${filterDifficulty === 'zor' ? 'active' : ''}`}
                onClick={() => {
                  sounds.playClick();
                  setFilterDifficulty(filterDifficulty === 'zor' ? 'all' : 'zor');
                }}
                title={filterDifficulty === 'zor' ? 'Filtreyi kaldır' : 'Zor'}
              >
                🔴 Zor {filterDifficulty === 'zor' ? '✕' : ''}
              </button>
            </div>
          </div>

          {/* KPI Summary Strip */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: '#191A20',
              border: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11
            }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>
              Filtrelenen: <strong style={{ color: '#fff' }}>{filteredExams.length}</strong> Deneme
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Ortalama: <strong style={{ color: avgNet < 0 ? '#FF453A' : 'var(--color-accent)' }}>{avgNet.toFixed(2)}</strong> Net
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Zirve: <strong style={{ color: '#00F0FF' }}>{maxNet.toFixed(2)}</strong> Net
            </span>
          </div>

          {/* Exams List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredExams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
                Bu filtreye uygun deneme sınavı bulunamadı.
              </div>
            ) : (
              filteredExams.map((exam) => {
                const diff = exam.difficulty ? difficultyBadges[exam.difficulty] : null;
                return (
                  <div
                    key={exam.id}
                    className="app-card"
                    onClick={() => handleOpenExamDetail(exam)}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 255, 0, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(212, 255, 0, 0.15)', color: 'var(--color-accent)' }}>
                            {exam.type}
                          </span>
                          {diff && (
                            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: `${diff.color}20`, color: diff.color }}>
                              {diff.label}
                            </span>
                          )}
                          <span style={{ fontSize: 10, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            Detay & Düzenle ↗
                          </span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exam.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {exam.publisher} • {exam.date}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: exam.totalNet < 0 ? '#FF453A' : 'var(--color-accent)'
                        }}>
                          {exam.totalNet > 0 ? `+${exam.totalNet.toFixed(2)}` : exam.totalNet.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-text-muted)' }}>NET</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* EXAM DETAIL & EDIT MODAL */}
      {selectedExam && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedExam(null);
              setIsEditingExam(false);
            }
          }}
        >
          <div
            style={{
              maxWidth: 560,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#141519',
              border: '1px solid var(--color-border)',
              borderRadius: 20,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'rgba(212, 255, 0, 0.15)', color: 'var(--color-accent)' }}>
                    {selectedExam.type}
                  </span>
                  {selectedExam.difficulty && difficultyBadges[selectedExam.difficulty] && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 6,
                        background: `${difficultyBadges[selectedExam.difficulty].color}20`,
                        color: difficultyBadges[selectedExam.difficulty].color
                      }}
                    >
                      {difficultyBadges[selectedExam.difficulty].label}
                    </span>
                  )}
                  {isEditingExam && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'rgba(0, 240, 255, 0.15)', color: '#00F0FF' }}>
                      Düzenleme Modu
                    </span>
                  )}
                </div>
                {!isEditingExam ? (
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>
                    {selectedExam.title}
                  </h3>
                ) : (
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>Deneme Adı</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: '#1D1F25',
                        border: '1px solid var(--color-border)',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedExam(null);
                  setIsEditingExam(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Meta details / edit fields */}
            {!isEditingExam ? (
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span>📚 <strong>Yayın:</strong> {selectedExam.publisher}</span>
                <span>📅 <strong>Tarih:</strong> {selectedExam.date}</span>
                {selectedExam.durationMinutes && (
                  <span>⏱️ <strong>Süre:</strong> {selectedExam.durationMinutes} dk</span>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>Yayınevi</label>
                  <input
                    type="text"
                    value={editPublisher}
                    onChange={(e) => setEditPublisher(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: '#1D1F25',
                      border: '1px solid var(--color-border)',
                      color: '#fff',
                      fontSize: 12
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>Tarih</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: '#1D1F25',
                      border: '1px solid var(--color-border)',
                      color: '#fff',
                      fontSize: 12
                    }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>Zorluk</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {[
                      { id: 'kolay', label: 'Kolay', color: '#00E599' },
                      { id: 'orta', label: 'Orta', color: '#FFB800' },
                      { id: 'osym', label: 'ÖSYM', color: '#C084FC' },
                      { id: 'zor', label: 'Zor', color: '#FF5050' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setEditDifficulty(lvl.id as any)}
                        style={{
                          padding: '6px 4px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: editDifficulty === lvl.id ? `${lvl.color}25` : '#1D1F25',
                          border: editDifficulty === lvl.id ? `1.5px solid ${lvl.color}` : '1px solid var(--color-border)',
                          color: editDifficulty === lvl.id ? lvl.color : 'var(--color-text-muted)'
                        }}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Total Net Banner */}
            {(() => {
              let displayNet = selectedExam.totalNet;
              let totalCorrect = selectedExam.subjectResults?.reduce((a, b) => a + (b.correct || 0), 0) || 0;
              let totalWrong = selectedExam.subjectResults?.reduce((a, b) => a + (b.wrong || 0), 0) || 0;
              let totalBlank = selectedExam.subjectResults?.reduce((a, b) => a + (b.blank || 0), 0) || 0;

              if (isEditingExam) {
                const examSubjectsList = selectedExam.type === 'TYT' ? tytSubjects : aytSubjects;
                let editTotal = 0;
                totalCorrect = 0;
                totalWrong = 0;
                totalBlank = 0;
                examSubjectsList.forEach((s) => {
                  const c = editScores[s.code]?.correct || 0;
                  const w = editScores[s.code]?.wrong || 0;
                  const b = editScores[s.code]?.blank || 0;
                  editTotal += Math.round((c - w * 0.25) * 100) / 100;
                  totalCorrect += c;
                  totalWrong += w;
                  totalBlank += b;
                });
                displayNet = Math.round(editTotal * 100) / 100;
              }

              return (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: displayNet < 0 ? 'rgba(255, 69, 58, 0.1)' : 'rgba(212, 255, 0, 0.08)',
                    border: displayNet < 0 ? '1px solid rgba(255, 69, 58, 0.3)' : '1px solid rgba(212, 255, 0, 0.25)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)' }}>TOPLAM NET</div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: displayNet < 0 ? '#FF453A' : 'var(--color-accent)'
                      }}
                    >
                      {displayNet > 0 ? `+${displayNet.toFixed(2)}` : displayNet.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 14, textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Doğru</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#00E599' }}>{totalCorrect}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Yanlış</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#FF453A' }}>{totalWrong}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Boş</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-muted)' }}>{totalBlank}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Subject Results Table */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                Ders Bazlı Net Dağılımı {isEditingExam && '(Doğru / Yanlış Değerlerini Düzenleyin)'}
              </div>

              {!isEditingExam ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
                      fontSize: 11,
                      color: 'var(--color-text-muted)',
                      fontWeight: 700,
                      padding: '4px 8px'
                    }}
                  >
                    <span>Ders</span>
                    <span style={{ textAlign: 'center' }}>Doğru</span>
                    <span style={{ textAlign: 'center' }}>Yanlış</span>
                    <span style={{ textAlign: 'center' }}>Boş</span>
                    <span style={{ textAlign: 'right' }}>Net</span>
                  </div>
                  {selectedExam.subjectResults?.map((sr) => (
                    <div
                      key={sr.subjectCode}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
                        padding: '8px 10px',
                        borderRadius: 10,
                        background: '#1D1F25',
                        border: '1px solid var(--color-border)',
                        alignItems: 'center',
                        fontSize: 12
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{sr.subjectName}</span>
                      <span style={{ textAlign: 'center', color: '#00E599', fontWeight: 700 }}>{sr.correct}</span>
                      <span style={{ textAlign: 'center', color: '#FF453A', fontWeight: 700 }}>{sr.wrong}</span>
                      <span style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{sr.blank}</span>
                      <span
                        style={{
                          textAlign: 'right',
                          fontWeight: 800,
                          color: sr.net < 0 ? '#FF453A' : 'var(--color-accent)'
                        }}
                      >
                        {sr.net > 0 ? `+${sr.net.toFixed(2)}` : sr.net.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Editable Table */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
                      fontSize: 11,
                      color: 'var(--color-text-muted)',
                      fontWeight: 700,
                      padding: '4px 8px'
                    }}
                  >
                    <span>Ders</span>
                    <span style={{ textAlign: 'center' }}>Doğru</span>
                    <span style={{ textAlign: 'center' }}>Yanlış</span>
                    <span style={{ textAlign: 'right' }}>Net</span>
                  </div>
                  {(selectedExam.type === 'TYT' ? tytSubjects : aytSubjects).map((sub) => {
                    const current = editScores[sub.code] || { correct: 0, wrong: 0, blank: 0 };
                    const currentNet = Math.round((current.correct - current.wrong * 0.25) * 100) / 100;
                    return (
                      <div
                        key={sub.code}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
                          gap: 6,
                          alignItems: 'center',
                          padding: '6px 8px',
                          borderRadius: 10,
                          background: '#1D1F25',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{sub.name}</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.q}
                          value={current.correct || ''}
                          onChange={(e) => handleEditScoreChange(sub.code, 'correct', Number(e.target.value))}
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: '#141519',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 12
                          }}
                        />
                        <input
                          type="number"
                          min="0"
                          max={sub.q}
                          value={current.wrong || ''}
                          onChange={(e) => handleEditScoreChange(sub.code, 'wrong', Number(e.target.value))}
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: '#141519',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 12
                          }}
                        />
                        <div
                          style={{
                            textAlign: 'right',
                            fontSize: 13,
                            fontWeight: 800,
                            color: currentNet < 0 ? '#FF453A' : 'var(--color-accent)'
                          }}
                        >
                          {currentNet > 0 ? `+${currentNet.toFixed(2)}` : currentNet.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 8 }}>
              {!isEditingExam ? (
                <>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedExam}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: 'rgba(255, 69, 58, 0.1)',
                      border: '1px solid rgba(255, 69, 58, 0.3)',
                      color: '#FF453A',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Sil</span>
                  </button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsEditingExam(true)}
                      style={{ padding: '8px 14px', fontSize: 12 }}
                    >
                      <span>✏️ Düzenle</span>
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        setSelectedExam(null);
                        setIsEditingExam(false);
                      }}
                      style={{ padding: '8px 16px', fontSize: 12 }}
                    >
                      <span>Kapat</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setIsEditingExam(false);
                      handleOpenExamDetail(selectedExam);
                    }}
                    style={{ padding: '8px 14px', fontSize: 12 }}
                  >
                    <span>İptal</span>
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSaveEditExam}
                    style={{ padding: '8px 18px', fontSize: 12 }}
                  >
                    <Check size={14} />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. CURRICULUM SCREEN (MÜFREDAT TABLOSU & ÖSYM SORU DAĞILIMI)
// ============================================================================
function CurriculumScreenView({
  topicProgress,
  onCycleStatus,
  onToggleTopicCompleted,
  onOpenOsymDistribution,
  userFieldTrack = 'sayisal',
  isDesktop
}: {
  topicProgress: Record<string, TopicStatus>;
  onCycleStatus: (topicKey: string) => void;
  onToggleTopicCompleted?: (topicKey: string) => void;
  onOpenOsymDistribution?: () => void;
  userFieldTrack?: string;
  isDesktop?: boolean;
}) {
  const [activeCurriculumTab, setActiveCurriculumTab] = useState<'mufredat' | 'osym'>('mufredat');
  const [examCategory, setExamCategory] = useState<'TYT' | 'AYT'>('TYT');
  const [selectedFieldTrack, setSelectedFieldTrack] = useState<'sayisal' | 'esit_agirlik' | 'sozel' | 'all'>(
    userFieldTrack === 'sayisal' || userFieldTrack === 'esit_agirlik' || userFieldTrack === 'sozel'
      ? (userFieldTrack as any)
      : 'sayisal'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  const [expandedSubjectCodes, setExpandedSubjectCodes] = useState<Record<string, boolean>>({
    tyt_mat: true,
    tyt_turkce: true,
    ayt_mat: true
  });

  const availableSubjects = YKS_SUBJECTS.filter((s) => {
    if (s.category !== examCategory) return false;
    if (examCategory === 'AYT' && selectedFieldTrack === 'sayisal') {
      return ['ayt_mat', 'ayt_geo', 'ayt_fizik', 'ayt_kimya', 'ayt_biyo'].includes(s.code);
    }
    if (examCategory === 'AYT' && selectedFieldTrack === 'esit_agirlik') {
      return ['ayt_mat', 'ayt_geo', 'ayt_edebiyat', 'ayt_tarih', 'ayt_cografya'].includes(s.code);
    }
    if (examCategory === 'AYT' && selectedFieldTrack === 'sozel') {
      return ['ayt_edebiyat', 'ayt_tarih', 'ayt_cografya', 'ayt_felsefe', 'ayt_din'].includes(s.code);
    }
    return true;
  });

  const totalTopicsInCategory = availableSubjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedTopicsInCategory = availableSubjects.reduce(
    (sum, s) => sum + s.topics.filter((t) => topicProgress[`${s.code}_${t}`] === 'completed').length,
    0
  );
  const categoryPct = Math.round((completedTopicsInCategory / (totalTopicsInCategory || 1)) * 100);

  const toggleSubjectExpand = (code: string) => {
    sounds.playClick();
    setExpandedSubjectCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const expandAll = () => {
    sounds.playClick();
    const allExpanded: Record<string, boolean> = {};
    availableSubjects.forEach((s) => {
      allExpanded[s.code] = true;
    });
    setExpandedSubjectCodes(allExpanded);
  };

  const collapseAll = () => {
    sounds.playClick();
    setExpandedSubjectCodes({});
  };

  return (
    <div style={{ padding: isDesktop ? 0 : '0 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Main Section Switcher: Konu Takip Çizelgesi vs ÖSYM Soru Dağılımı */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          type="button"
          className={`btn-secondary ${activeCurriculumTab === 'mufredat' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '12px 14px', fontSize: 13, fontWeight: 800 }}
          onClick={() => {
            sounds.playTabSwitch();
            setActiveCurriculumTab('mufredat');
          }}
        >
          <BookOpen size={16} />
          <span>Konu Takip Çizelgesi</span>
        </button>
        <button
          type="button"
          className={`btn-secondary ${activeCurriculumTab === 'osym' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '12px 14px', fontSize: 13, fontWeight: 800 }}
          onClick={() => {
            sounds.playTabSwitch();
            if (onOpenOsymDistribution) {
              onOpenOsymDistribution();
            } else {
              setActiveCurriculumTab('osym');
            }
          }}
        >
          <Flame size={16} color="var(--color-accent)" />
          <span>ÖSYM Soru Dağılımı</span>
        </button>
      </div>

      {activeCurriculumTab === 'osym' ? (
        <OsymDistributionView
          topicProgress={topicProgress}
          onToggleTopicCompleted={onToggleTopicCompleted || onCycleStatus}
          userFieldTrack={selectedFieldTrack}
          isDesktop={isDesktop}
        />
      ) : (
        <>
          {/* Category Toggle: TYT vs AYT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              className={`btn-secondary ${examCategory === 'TYT' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13, fontWeight: 800 }}
              onClick={() => {
                sounds.playTabSwitch();
                setExamCategory('TYT');
              }}
            >
              📘 TYT Konu Tablosu
            </button>
            <button
              className={`btn-secondary ${examCategory === 'AYT' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13, fontWeight: 800 }}
              onClick={() => {
                sounds.playTabSwitch();
                setExamCategory('AYT');
              }}
            >
              📕 AYT Konu Tablosu
            </button>
          </div>

          {/* AYT Alan Seçimi (Sayısal, Eşit Ağırlık, Sözel, Tüm Dersler) */}
          {examCategory === 'AYT' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'rgba(212, 255, 0, 0.05)',
                border: '1px solid rgba(212, 255, 0, 0.2)',
                borderRadius: 12,
                overflowX: 'auto'
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                🎯 Alan:
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                {[
                  { id: 'sayisal', label: '🔬 Sayısal (MF)' },
                  { id: 'esit_agirlik', label: '⚖️ Eşit Ağırlık (TM)' },
                  { id: 'sozel', label: '📚 Sözel (TS)' },
                  { id: 'all', label: '🌐 Tüm Dersler' }
                ].map((track) => {
                  const isActive = selectedFieldTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      className={`alan-btn${isActive ? ' active' : ''}`}
                      style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11 }}
                      onClick={() => {
                        sounds.playClick();
                        const nextTrack = selectedFieldTrack === track.id ? 'all' : (track.id as any);
                        setSelectedFieldTrack(nextTrack);
                      }}
                      title={isActive ? 'Tıklayarak seçimi kaldır / geri çek' : track.label}
                    >
                      {track.label} {isActive && track.id !== 'all' ? '✕' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Overall Progress Banner */}
          <div
            className="app-card"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 255, 0, 0.08) 0%, rgba(26, 28, 34, 1) 100%)',
              border: '1px solid var(--color-border)',
              padding: 16
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>
                  {examCategory === 'AYT' && selectedFieldTrack === 'sayisal'
                    ? 'AYT Sayısal (MF) Müfredat İlerlemesi'
                    : examCategory === 'AYT' && selectedFieldTrack === 'esit_agirlik'
                    ? 'AYT Eşit Ağırlık (TM) Müfredat İlerlemesi'
                    : examCategory === 'AYT' && selectedFieldTrack === 'sozel'
                    ? 'AYT Sözel (TS) Müfredat İlerlemesi'
                    : `${examCategory} Müfredat İlerlemesi`}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Toplam {completedTopicsInCategory} / {totalTopicsInCategory} Konu Tamamlandı
                </div>
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                %{categoryPct}
              </div>
            </div>

            <div style={{ width: '100%', height: 10, background: '#14161C', borderRadius: 99, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${categoryPct}%`,
                  height: '100%',
                  background: 'var(--color-accent)',
                  borderRadius: 99,
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {/* Search & Status Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                placeholder="Konu ara (ör: fonksiyon, türev, paragraf)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 12,
                  background: '#18191E',
                  border: '1px solid var(--color-border)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  className={`pill-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Tümü
                </button>
                <button
                  className={`pill-toggle-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed');
                  }}
                  title={statusFilter === 'completed' ? 'Filtreyi geri çek / kaldır' : 'Bitti'}
                >
                  ✓ Bitti {statusFilter === 'completed' ? '✕' : ''}
                </button>
                <button
                  className={`pill-toggle-btn ${statusFilter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress');
                  }}
                  title={statusFilter === 'in_progress' ? 'Filtreyi geri çek / kaldır' : 'Çalışılıyor'}
                >
                  ⏳ Çalışılıyor {statusFilter === 'in_progress' ? '✕' : ''}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                <button onClick={expandAll} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 700 }}>
                  Tümünü Aç
                </button>
                <span style={{ color: 'var(--color-text-dim)' }}>•</span>
                <button onClick={collapseAll} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                  Kapat
                </button>
              </div>
            </div>
          </div>

          {/* Subjects Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableSubjects.map((sub) => {
              const isExpanded = !!expandedSubjectCodes[sub.code];
              const subTopics = sub.topics.filter((t) => {
                const matchesQuery = t.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesQuery) return false;
                const currentStatus = topicProgress[`${sub.code}_${t}`] || 'not_started';
                if (statusFilter === 'all') return true;
                return currentStatus === statusFilter;
              });

              const totalSub = sub.topics.length;
              const completedSub = sub.topics.filter((t) => topicProgress[`${sub.code}_${t}`] === 'completed').length;
              const subPct = Math.round((completedSub / (totalSub || 1)) * 100);

              if (subTopics.length === 0 && searchQuery) return null;

              return (
                <div
                  key={sub.code}
                  className="app-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    background: '#18191E'
                  }}
                >
                  <div
                    onClick={() => toggleSubjectExpand(sub.code)}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                      background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: sub.color,
                          boxShadow: `0 0 8px ${sub.color}`
                        }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{sub.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {completedSub} / {totalSub} Konu Tamamlandı
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: sub.color }}>%{subPct}</div>
                      </div>
                      <ChevronDown
                        size={18}
                        color="var(--color-text-muted)"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: 12,
                          textAlign: 'left'
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: '#121318',
                              borderBottom: '1px solid var(--color-border)',
                              color: 'var(--color-text-muted)',
                              fontWeight: 800,
                              fontSize: 11
                            }}
                          >
                            <th style={{ padding: '10px 12px', width: 44, textAlign: 'center' }}>Tik</th>
                            <th style={{ padding: '10px 14px' }}>Konu Adı</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', width: 130 }}>ÖSYM Çıkmış</th>
                            <th style={{ padding: '10px 14px', textAlign: 'right', width: 130 }}>Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subTopics.map((topic, idx) => {
                            const topicKey = `${sub.code}_${topic}`;
                            const currentStatus: TopicStatus = topicProgress[topicKey] || 'not_started';
                            const isCompleted = currentStatus === 'completed';

                            // Match topic with ÖSYM distribution data
                            const osymSub = OSYM_QUESTION_DISTRIBUTION.find((os) => os.code === sub.code);
                            const osymTopic = osymSub?.topics.find((ot) => {
                              const a = ot.topic.toLowerCase().trim();
                              const b = topic.toLowerCase().trim();
                              return a === b || a.includes(b) || b.includes(a);
                            });

                            return (
                              <tr
                                key={topic}
                                onClick={() => {
                                  if (onToggleTopicCompleted) {
                                    onToggleTopicCompleted(topicKey);
                                  } else {
                                    onCycleStatus(topicKey);
                                  }
                                }}
                                style={{
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                  background: isCompleted
                                    ? 'rgba(212, 255, 0, 0.04)'
                                    : idx % 2 === 1
                                    ? 'rgba(255, 255, 255, 0.015)'
                                    : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'background 0.12s ease'
                                }}
                                className="table-row-hover"
                              >
                                <td style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {isCompleted ? (
                                      <CheckCircle2 size={19} color="var(--color-accent)" />
                                    ) : currentStatus === 'in_progress' ? (
                                      <Circle size={19} color="#00F0FF" />
                                    ) : (
                                      <Circle size={19} color="rgba(255, 255, 255, 0.25)" />
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                                  <span
                                    style={{
                                      fontSize: 13,
                                      fontWeight: isCompleted ? 700 : 600,
                                      color: isCompleted ? 'var(--color-text-muted)' : '#FFFFFF',
                                      textDecoration: isCompleted ? 'line-through' : 'none'
                                    }}
                                  >
                                    {topic}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                  {osymTopic ? (
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 800,
                                        fontFamily: 'var(--font-mono)',
                                        padding: '2px 8px',
                                        borderRadius: 6,
                                        background: osymTopic.total >= 10 ? 'rgba(212, 255, 0, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                                        color: osymTopic.total >= 10 ? 'var(--color-accent)' : 'var(--color-text-dim)'
                                      }}
                                    >
                                      {osymTopic.total} Soru
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>–</span>
                                  )}
                                </td>
                                <td style={{ padding: '10px 14px', textAlign: 'right', verticalAlign: 'middle' }}>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 800,
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      background:
                                        isCompleted
                                          ? 'rgba(212, 255, 0, 0.15)'
                                          : currentStatus === 'in_progress'
                                          ? 'rgba(0, 240, 255, 0.15)'
                                          : currentStatus === 'needs_review'
                                          ? 'rgba(192, 132, 252, 0.15)'
                                          : '#1A1C22',
                                      color:
                                        isCompleted
                                          ? 'var(--color-accent)'
                                          : currentStatus === 'in_progress'
                                          ? '#00F0FF'
                                          : currentStatus === 'needs_review'
                                          ? '#C084FC'
                                          : 'var(--color-text-dim)',
                                      border:
                                        isCompleted
                                          ? '1px solid rgba(212, 255, 0, 0.3)'
                                          : currentStatus === 'in_progress'
                                          ? '1px solid rgba(0, 240, 255, 0.3)'
                                          : currentStatus === 'needs_review'
                                          ? '1px solid rgba(192, 132, 252, 0.3)'
                                          : '1px solid #232530',
                                      display: 'inline-block',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {isCompleted && '✓ Bitti'}
                                    {currentStatus === 'in_progress' && '⏳ Çalışılıyor'}
                                    {currentStatus === 'needs_review' && '🔄 Tekrar Et'}
                                    {currentStatus === 'not_started' && '○ Başlanmadı'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// 6. PROFILE & SETTINGS SCREEN (Kullanıcı Profili & Sistem Ayarları)
// ============================================================================
function ProfileScreenView({
  profile,
  exams = [],
  questionLogs = [],
  topicProgress = {},
  currentTheme = 'theme-blue',
  isMuted = false,
  cloudUser = null,
  lastSyncedTime = null,
  onCloudLogin,
  onCloudRegister,
  onCloudLogout,
  onToggleMute,
  onActivateFreeze,
  onSelectTheme,
  onUpdateProfile,
  onExportBackup,
  onImportBackup,
  onOpenFeatureModal,
  onResetAllData,
  viewMode = 'desktop',
  onToggleViewMode,
  isDesktop = false
}: {
  profile: StudentProfile;
  exams?: Exam[];
  questionLogs?: QuestionLog[];
  topicProgress?: Record<string, TopicStatus>;
  currentTheme?: ThemeId;
  isMuted?: boolean;
  cloudUser?: CloudUser | null;
  lastSyncedTime?: string | null;
  onCloudLogin?: (email: string, pass: string) => Promise<void>;
  onCloudRegister?: (email: string, pass: string, name: string) => Promise<void>;
  onCloudLogout?: () => Promise<void>;
  onToggleMute?: () => void;
  onActivateFreeze?: () => void;
  onSelectTheme?: (t: ThemeId) => void;
  onUpdateProfile: (p: StudentProfile) => void;
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenFeatureModal?: (feat: FeatureModalType) => void;
  onResetAllData?: () => void;
  viewMode?: 'desktop' | 'mobile';
  onToggleViewMode?: (mode: 'desktop' | 'mobile') => void;
  isDesktop?: boolean;
}) {
  // Navigation Sub-Tabs: 'profile' (Profil & Hedefler) | 'settings' (Ayarlar & Tercihler) | 'cloud' (Bulut & Yedekleme)
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'settings' | 'cloud'>('profile');

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  const handleExecuteReset = () => {
    if (onResetAllData) {
      onResetAllData();
    }
    setName('');
    setTargetUni('');
    setTargetDept('');
    setTargetTytNet(0);
    setTargetAytNet(0);
    setShowResetConfirm(false);
    setResetSuccessMessage(true);
    setTimeout(() => setResetSuccessMessage(false), 3500);
  };

  // Profile Edit Local States
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [classLevel, setClassLevel] = useState(profile.classLevel);
  const [fieldTrack, setFieldTrack] = useState(profile.fieldTrack);
  const [obp, setObp] = useState(profile.obp);
  const [targetUni, setTargetUni] = useState(profile.targetUniversity);
  const [targetDept, setTargetDept] = useState(profile.targetDepartment);
  const [targetTytNet, setTargetTytNet] = useState(profile.targetTytNet);
  const [targetAytNet, setTargetAytNet] = useState(profile.targetAytNet);

  // Daily Goals States
  const [dailyQGoal, setDailyQGoal] = useState(profile.dailyQuestionGoal || 150);
  const [dailyMGoal, setDailyMGoal] = useState(profile.dailyStudyMinutesGoal || 210);
  const [goalsSaved, setGoalsSaved] = useState(false);

  // Cloud Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Supabase Custom Config states
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [cfgUrl, setCfgUrl] = useState(() => localStorage.getItem('netmetrik_custom_supabase_url') || '');
  const [cfgKey, setCfgKey] = useState(() => localStorage.getItem('netmetrik_custom_supabase_key') || '');
  const [isSupabaseLive, setIsSupabaseLive] = useState(() => isRealSupabaseActive());

  // Cumulative Metrics
  const totalQuestionsAllTime = questionLogs.reduce((sum, q) => sum + q.count, 0);
  const totalStudyHoursAllTime = (questionLogs.reduce((sum, q) => sum + q.durationMinutes, 0) / 60).toFixed(1);
  const completedTopicsCount = Object.values(topicProgress).filter((s) => s === 'completed').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      classLevel,
      fieldTrack,
      obp: Number(obp),
      targetUniversity: targetUni,
      targetDepartment: targetDept,
      targetTytNet: Number(targetTytNet),
      targetAytNet: Number(targetAytNet)
    });
    setEditingProfile(false);
    sounds.playSuccess();
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleSaveDailyGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      dailyQuestionGoal: Number(dailyQGoal),
      dailyStudyMinutesGoal: Number(dailyMGoal)
    });
    setGoalsSaved(true);
    sounds.playSuccess();
    setTimeout(() => setGoalsSaved(false), 2200);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authEmail || !authPass) {
      setAuthError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    if (authPass.length < 6) {
      setAuthError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        if (onCloudRegister) await onCloudRegister(authEmail, authPass, authName);
      } else {
        if (onCloudLogin) await onCloudLogin(authEmail, authPass);
      }
      setAuthEmail('');
      setAuthPass('');
      setAuthName('');
      sounds.playSuccess();
    } catch (err: any) {
      setAuthError(err?.message || 'İşlem başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfgUrl || !cfgKey) {
      alert('Lütfen hem Project URL hem Anon Key giriniz.');
      return;
    }
    const success = setCustomSupabaseConfig(cfgUrl, cfgKey);
    if (success) {
      setIsSupabaseLive(true);
      sounds.playSuccess();
      confetti({ particleCount: 30, spread: 50 });
      alert('Supabase API bağlantısı kaydedildi! Artık bulut hesabınızla giriş yapabilirsiniz.');
      setShowConfigPanel(false);
    } else {
      alert('Geçersiz URL formatı. Lütfen https:// ile başlayan bir Supabase URL girin.');
    }
  };

  const handleDisconnectSupabase = () => {
    removeCustomSupabaseConfig();
    setIsSupabaseLive(false);
    setCfgUrl('');
    setCfgKey('');
    sounds.playClick();
    alert('Özel Supabase yapılandırması kaldırıldı.');
  };

  const renderResetAccountCard = () => (
    <div
      className="app-card"
      style={{
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(255, 69, 58, 0.3)',
        background: 'rgba(255, 69, 58, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#FF453A', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🗑️</span>
            <span>Tüm Hesap Verilerini Sıfırla</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--color-text-dim)', marginTop: 2 }}>
            Çözülen tüm soru sayılarını, denemeleri, çalışma sürelerini ve hedefleri sıfırlar
          </div>
        </div>
        {!showResetConfirm && (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: 'rgba(255, 69, 58, 0.15)',
              border: '1px solid rgba(255, 69, 58, 0.4)',
              color: '#FF453A',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Hesabı Sıfırla
          </button>
        )}
      </div>

      {showResetConfirm && (
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: 'rgba(255, 69, 58, 0.15)',
            border: '1px solid rgba(255, 69, 58, 0.35)',
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: isDesktop ? 'center' : 'stretch',
            gap: 12
          }}
        >
          <div style={{ fontSize: 12, color: '#FFB3B0', fontWeight: 600 }}>
            ⚠️ DİKKAT: Çözülen tüm soru sayıları, deneme netleri ve çalışma verileri kalıcı olarak sıfırlanacaktır. Devam etmek istiyor musun?
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleExecuteReset}
              style={{
                padding: '7px 18px',
                borderRadius: 8,
                background: '#FF453A',
                border: 'none',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 69, 58, 0.4)'
              }}
            >
              Evet, Hepsini Sıfırla
            </button>
          </div>
        </div>
      )}

      {resetSuccessMessage && (
        <div style={{ padding: '9px 14px', borderRadius: 10, background: 'rgba(48, 209, 88, 0.15)', border: '1px solid rgba(48, 209, 88, 0.3)', color: '#30D158', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>✓</span>
          <span>Tüm soru sayıları, denemeler ve çalışma kayıtları başarıyla sıfırlandı!</span>
        </div>
      )}
    </div>
  );

  // Get Initials for Avatar
  const getInitials = (n: string) => {
    if (!n) return 'ÖG';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ padding: isDesktop ? 0 : '0 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* SEGMENTED CONTROL HEADER (Apple HIG) */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: 4,
          borderRadius: 14,
          display: 'flex',
          gap: 4,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          onClick={() => {
            setActiveSubTab('profile');
            sounds.playClick();
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: activeSubTab === 'profile' ? 'var(--color-surface-elevated)' : 'transparent',
            color: activeSubTab === 'profile' ? '#FFFFFF' : 'var(--color-text-muted)',
            boxShadow: activeSubTab === 'profile' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            border: activeSubTab === 'profile' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <User size={15} color={activeSubTab === 'profile' ? 'var(--color-accent)' : undefined} />
          <span>Profil & Hedefler</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('settings');
            sounds.playClick();
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: activeSubTab === 'settings' ? 'var(--color-surface-elevated)' : 'transparent',
            color: activeSubTab === 'settings' ? '#FFFFFF' : 'var(--color-text-muted)',
            boxShadow: activeSubTab === 'settings' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            border: activeSubTab === 'settings' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Settings size={15} color={activeSubTab === 'settings' ? 'var(--color-accent)' : undefined} />
          <span>Ayarlar & Tercihler</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('cloud');
            sounds.playClick();
          }}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: activeSubTab === 'cloud' ? 'var(--color-surface-elevated)' : 'transparent',
            color: activeSubTab === 'cloud' ? '#FFFFFF' : 'var(--color-text-muted)',
            boxShadow: activeSubTab === 'cloud' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            border: activeSubTab === 'cloud' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Cloud size={15} color={activeSubTab === 'cloud' ? 'var(--color-accent)' : undefined} />
          <span>Bulut & Yedek</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: PROFİL & HEDEFLER                                         */}
      {/* ==================================================================== */}
      {activeSubTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* USER IDENTITY CARD */}
          <div className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, rgba(255,255,255,0.15) 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 800,
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {getInitials(profile.name)}
                </div>

                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {profile.name || 'Öğrenci'}
                  </h2>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 3 }}>
                    {profile.classLevel}. Sınıf • <strong style={{ color: 'var(--color-accent)' }}>{profile.fieldTrack.toUpperCase()}</strong> • OBP: <strong style={{ color: '#FF9F0A' }}>{profile.obp}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 99, background: 'rgba(255, 159, 10, 0.12)', border: '1px solid rgba(255, 159, 10, 0.25)', color: '#FF9F0A', fontSize: 12, fontWeight: 700 }}>
                  <Flame size={15} />
                  <span>{profile.currentStreak} Gün Seri</span>
                </div>

                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 13px', borderRadius: 10 }}
                >
                  {editingProfile ? 'Vazgeç' : 'Profili Düzenle'}
                </button>
              </div>
            </div>

            {/* Streak Freeze Alert */}
            {profile.streakFreezeAvailable > 0 && !profile.streakFreezeActive && onActivateFreeze && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, background: 'rgba(10, 132, 255, 0.08)', border: '1px solid rgba(10, 132, 255, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <Shield size={16} color="var(--color-accent)" />
                  <span>Kullanılabilir <strong>{profile.streakFreezeAvailable} adet</strong> seri kalkanın bulunuyor.</span>
                </div>
                <button
                  onClick={onActivateFreeze}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 99,
                    background: 'var(--color-accent)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Kalkanı Aç 🛡️
                </button>
              </div>
            )}

            {/* PROFILE EDIT INLINE FORM */}
            {editingProfile && (
              <form onSubmit={handleSaveProfile} style={{ paddingTop: 14, borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr 1fr' : '1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Ad Soyad</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Sınıf / Seviye</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    >
                      <option value="11">11. Sınıf</option>
                      <option value="12">12. Sınıf (YKS Hazırlık)</option>
                      <option value="Mezun">Mezun</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Alan (Puan Türü)</label>
                    <select
                      value={fieldTrack}
                      onChange={(e) => setFieldTrack(e.target.value as any)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    >
                      <option value="sayisal">Sayısal (SAY)</option>
                      <option value="esit_agirlik">Eşit Ağırlık (EA)</option>
                      <option value="sozel">Sözel (SÖZ)</option>
                      <option value="dil">Yabancı Dil (DİL)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr 1fr' : '1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Diploma Notu (OBP: 50 - 100)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="50"
                      max="100"
                      value={obp}
                      onChange={(e) => setObp(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef TYT Neti</label>
                    <input
                      type="number"
                      step="0.25"
                      value={targetTytNet}
                      onChange={(e) => setTargetTytNet(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef AYT Neti</label>
                    <input
                      type="number"
                      step="0.25"
                      value={targetAytNet}
                      onChange={(e) => setTargetAytNet(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef Üniversite</label>
                    <input
                      type="text"
                      value={targetUni}
                      onChange={(e) => setTargetUni(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef Bölüm</label>
                    <input
                      type="text"
                      value={targetDept}
                      onChange={(e) => setTargetDept(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12.5 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '9px 20px', borderRadius: 10, fontSize: 12.5, fontWeight: 700 }}
                >
                  Profil Değişikliklerini Kaydet ✓
                </button>
              </form>
            )}
          </div>

          {/* TARGET DEPARTMENT & YOK ATLAS SHORTCUT CARD */}
          <div
            className="app-card"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.08) 0%, rgba(28, 28, 30, 0.7) 100%)',
              border: '1px solid rgba(10, 132, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 800, fontSize: 14.5, color: '#FFFFFF' }}>YKS Hedefim & YÖK Atlas Uyumu</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF' }}>
                {profile.fieldTrack.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 10 }}>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Hedef Program</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{profile.targetDepartment || 'Tıp Fakültesi'}</div>
                <div style={{ fontSize: 12, color: 'var(--color-accent)', marginTop: 2 }}>{profile.targetUniversity || 'Hacettepe Üniversitesi'}</div>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Hedef Netler</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#30D158' }}>
                  TYT: {profile.targetTytNet} • AYT: {profile.targetAytNet}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Toplam Hedef: {(profile.targetTytNet + profile.targetAytNet).toFixed(1)} Net
                </div>
              </div>
            </div>

            {onOpenFeatureModal && (
              <button
                onClick={() => onOpenFeatureModal('benchmark')}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: 12,
                  background: 'rgba(10, 132, 255, 0.15)',
                  border: '1px solid rgba(10, 132, 255, 0.35)',
                  color: '#0A84FF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease'
                }}
              >
                <Target size={16} />
                <span>🏛️ YÖK Atlas'tan Bölüm Seç & Net Açığını Gör ➔</span>
              </button>
            )}
          </div>

          {/* CUMULATIVE STATS CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr', gap: 10 }}>
            <div className="app-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Toplam Çözülen Soru</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-accent)', marginTop: 4 }}>
                {totalQuestionsAllTime} <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Soru</span>
              </div>
            </div>

            <div className="app-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Toplam Çalışma</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#30D158', marginTop: 4 }}>
                {totalStudyHoursAllTime} <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Saat</span>
              </div>
            </div>

            <div className="app-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Kayıtlı Deneme</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FF9F0A', marginTop: 4 }}>
                {exams.length} <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Adet</span>
              </div>
            </div>

            <div className="app-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Tamamlanan Konu</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#BF5AF2', marginTop: 4 }}>
                {completedTopicsCount} <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Konu</span>
              </div>
            </div>
          </div>

          {/* Reset Account Option directly accessible in Profile */}
          {renderResetAccountCard()}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: AYARLAR & TERCİHLER                                       */}
      {/* ==================================================================== */}
      {activeSubTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* THEME PRESET SELECTION (Apple 5 Curated Themes) */}
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Palette size={18} color="var(--color-accent)" />
              <span style={{ fontWeight: 800, fontSize: 14.5, color: '#FFFFFF' }}>Görünüm & Renk Teması</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {THEME_PRESETS.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme(t.id);
                      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 4px',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? `2px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title={t.name}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: t.color,
                        boxShadow: isSelected ? `0 0 10px ${t.color}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#000'
                      }}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: isSelected ? 800 : 500,
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-muted)',
                        textAlign: 'center',
                        lineHeight: 1.1
                      }}
                    >
                      {t.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIEW MODE TOGGLE (DESKTOP VS MOBILE) */}
          {onToggleViewMode && (
            <div className="app-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Monitor size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 800, fontSize: 14.5, color: '#FFFFFF' }}>Cihaz & Ekran Modu</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>
                İstediğiniz an geniş ekran web dashboard'u ile mobil telefon önizlemesi arasında geçiş yapabilirsiniz.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => onToggleViewMode('desktop')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: viewMode === 'desktop' ? 'rgba(10, 132, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: viewMode === 'desktop' ? '1.5px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: viewMode === 'desktop' ? '#FFFFFF' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: 700
                  }}
                >
                  <Monitor size={18} color={viewMode === 'desktop' ? 'var(--color-accent)' : undefined} />
                  <span>🖥️ Geniş Ekran PC</span>
                </button>

                <button
                  onClick={() => onToggleViewMode('mobile')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: viewMode === 'mobile' ? 'rgba(10, 132, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: viewMode === 'mobile' ? '1.5px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: viewMode === 'mobile' ? '#FFFFFF' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: 700
                  }}
                >
                  <Smartphone size={18} color={viewMode === 'mobile' ? 'var(--color-accent)' : undefined} />
                  <span>📱 Mobil Telefon</span>
                </button>
              </div>
            </div>
          )}

          {/* DAILY WORK GOALS FORM */}
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={18} color="var(--color-accent)" />
              <span style={{ fontWeight: 800, fontSize: 14.5, color: '#FFFFFF' }}>Günlük Çalışma Hedefleri</span>
            </div>

            <form onSubmit={handleSaveDailyGoals} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span>Günlük Soru Hedefi:</span>
                  <strong style={{ color: 'var(--color-accent)' }}>{dailyQGoal} Soru</strong>
                </div>
                <ModernSlider
                  min={50}
                  max={400}
                  step={10}
                  value={dailyQGoal}
                  accentColor="var(--color-accent)"
                  onChange={(e) => setDailyQGoal(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span>Günlük Çalışma Süresi:</span>
                  <strong style={{ color: '#30D158' }}>{dailyMGoal} Dakika ({Math.floor(dailyMGoal / 60)}s {dailyMGoal % 60}dk)</strong>
                </div>
                <ModernSlider
                  min={30}
                  max={480}
                  step={15}
                  value={dailyMGoal}
                  accentColor="#30D158"
                  onChange={(e) => setDailyMGoal(Number(e.target.value))}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: 'flex-start', padding: '9px 18px', borderRadius: 10, fontSize: 12.5 }}
              >
                {goalsSaved ? 'Hedefler Kaydedildi ✓' : 'Hedefleri Güncelle'}
              </button>
            </form>
          </div>

          {/* AUDIO & HAPTIC SETTINGS */}
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isMuted ? (
                  <VolumeX size={20} color="var(--color-text-muted)" />
                ) : (
                  <Volume2 size={20} color="var(--color-accent)" />
                )}
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#FFFFFF' }}>Dokunsal Ses Efektleri</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    Tıklama, başarı ve sekme sesleri
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => sounds.playSuccess()}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: 11, borderRadius: 99 }}
                >
                  Test Sesi 🎵
                </button>

                <button
                  type="button"
                  onClick={onToggleMute}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: isMuted ? 'rgba(255,255,255,0.06)' : 'rgba(10, 132, 255, 0.15)',
                    border: isMuted ? '1px solid var(--color-border)' : '1px solid var(--color-accent)',
                    color: isMuted ? 'var(--color-text-muted)' : 'var(--color-accent)',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {isMuted ? 'Sessiz' : 'Açık 🔊'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: BULUT & YEDEKLEME                                         */}
      {/* ==================================================================== */}
      {activeSubTab === 'cloud' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* CLOUD MULTI-DEVICE SYNC CARD */}
          <div className="app-card" style={{ border: cloudUser ? '1px solid var(--color-accent-border)' : '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: cloudUser ? 'rgba(10, 132, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cloudUser ? (
                    <Cloud size={20} color="var(--color-accent)" />
                  ) : (
                    <CloudOff size={20} color="var(--color-text-muted)" />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#FFFFFF' }}>Bulut Yedekleme & Çoklu Cihaz</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {cloudUser
                      ? 'Telefon, tablet ve bilgisayarınız otomatik eşitleniyor'
                      : 'Verileriniz şu an yalnızca bu cihazda (Misafir Modu)'}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: 99,
                  background: cloudUser ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  color: cloudUser ? '#30D158' : 'var(--color-text-dim)',
                  border: cloudUser ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid var(--color-border)'
                }}
              >
                {cloudUser ? 'Bulut Aktif 🟢' : 'Misafir Modu 👤'}
              </span>
            </div>

            {cloudUser ? (
              <div>
                <div
                  style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{cloudUser.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 2 }}>
                      {lastSyncedTime ? `Son otomatik eşitleme: ${lastSyncedTime}` : 'Arka plan senkronizasyonu devrede'}
                    </div>
                  </div>
                  <button
                    onClick={onCloudLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'rgba(255, 80, 80, 0.12)',
                      border: '1px solid rgba(255, 80, 80, 0.25)',
                      color: '#FF5050',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={13} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                  ✅ Soru çözdüğünüzde, deneme eklediğinizde veya konu tamamladığınızda verileriniz arka planda otomatik olarak buluta yüklenir. Başka bir cihazda oturum açtığınızda kaldığınız yerden devam edersiniz.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.45 }}>
                  Tüm çalışmalarınızın telefon, tablet ve bilgisayarınız arasında <strong>otomatik eşitlenmesi</strong> için ücretsiz hesap oluşturabilir veya giriş yapabilirsiniz.
                </div>

                {/* Auth Tab Switch */}
                <div style={{ display: 'flex', background: 'var(--color-surface-elevated)', borderRadius: 10, padding: 3, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 8,
                      background: authMode === 'login' ? 'var(--color-surface)' : 'transparent',
                      color: authMode === 'login' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Giriş Yap
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 8,
                      background: authMode === 'register' ? 'var(--color-surface)' : 'transparent',
                      color: authMode === 'register' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Kayıt Ol
                  </button>
                </div>

                {authError && (
                  <div style={{ fontSize: 11, color: '#FF5050', background: 'rgba(255, 80, 80, 0.1)', padding: '6px 10px', borderRadius: 8, marginBottom: 10 }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleSubmitAuth} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {authMode === 'register' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız (İsteğe bağlı)"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12 }}
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="email"
                      placeholder="E-posta Adresi (ör: ogrenci@gmail.com)"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Şifre (en az 6 karakter)"
                      value={authPass}
                      onChange={(e) => setAuthPass(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12 }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: 4, justifyContent: 'center', fontSize: 12, padding: '10px 0' }}
                  >
                    {authLoading ? 'Bağlanılıyor...' : authMode === 'register' ? 'Hesap Oluştur & Eşitlemeyi Başlat' : 'Giriş Yap & Eşitle'}
                  </button>
                </form>

                <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--color-text-dim)', textAlign: 'center' }}>
                  🛡️ Kayıt zorunlu değildir. Giriş yapmadan misafir modunda dilediğiniz gibi yerel olarak kullanabilirsiniz.
                </div>

                {/* Supabase Connection Setup Toggle */}
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setShowConfigPanel(!showConfigPanel)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    ⚙️ {showConfigPanel ? 'Bağlantı Ayarlarını Gizle' : 'Ücretsiz Supabase Projesini Bağla (API Keys)'}
                  </button>

                  {showConfigPanel && (
                    <form onSubmit={handleSaveSupabaseConfig} style={{ marginTop: 10, background: 'var(--color-surface-elevated)', padding: 12, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        supabase.com'da ücretsiz açtığınız projenin <strong>Project Settings → API</strong> kısmındaki bilgileri buraya yapıştırın:
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Project URL (https://xyz.supabase.co)"
                          value={cfgUrl}
                          onChange={(e) => setCfgUrl(e.target.value)}
                          required
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 11 }}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="anon public key (eyJhbGciOi...)"
                          value={cfgKey}
                          onChange={(e) => setCfgKey(e.target.value)}
                          required
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 11 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: 11, padding: '7px 0', justifyContent: 'center' }}>
                          Anahtarları Kaydet & Bağlan
                        </button>
                        {isSupabaseLive && (
                          <button type="button" onClick={handleDisconnectSupabase} className="btn-secondary" style={{ fontSize: 11, padding: '7px 10px' }}>
                            Sıfırla
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DATA BACKUP & RESTORE CARD */}
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Download size={20} color="var(--color-accent)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#FFFFFF' }}>Veri Yedekleme & Cihaz Aktarımı</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  Tüm deneme, profil, soru ve çalışma kayıtlarını JSON olarak indir veya geri yükle
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={onExportBackup}
                className="btn-secondary"
                style={{ justifyContent: 'center', fontSize: 12, padding: '10px 12px' }}
              >
                <Download size={15} />
                <span>Yedeği İndir</span>
              </button>

              <label
                className="btn-secondary"
                style={{
                  justifyContent: 'center',
                  fontSize: 12,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  margin: 0
                }}
              >
                <Upload size={15} />
                <span>Yedek Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Reset All Data Card */}
            <div style={{ marginTop: 14 }}>
              {renderResetAccountCard()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. FEATURE MODALS (6, 7, 8, 21, 22, 26, 27)
// ============================================================================

// ----------------------------------------------------------------------------
// Feature 6: Question Vault Modal (Fotoğraflı Yanlış Soru Havuzu / Hata Defteri)
// ----------------------------------------------------------------------------
function QuestionVaultModal({
  vault,
  onToggleResolved,
  onDelete,
  onAdd,
  onAdvanceReviewStage,
  onClose
}: {
  vault: QuestionVaultItem[];
  onToggleResolved: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (newItem: QuestionVaultItem) => void;
  onAdvanceReviewStage?: (id: string, remembered: boolean) => void;
  onClose: () => void;
}) {
  // Mode: 'practice' (Soru Çözme Modu) | 'list' (Hata Defterim Listesi) | 'add' (Yeni Soru Ekle)
  const [activeMode, setActiveMode] = useState<'practice' | 'list' | 'add'>('practice');

  // Practice Mode state
  const [practiceSubject, setPracticeSubject] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<{ correct: number; totalAnswered: number }>({ correct: 0, totalAnswered: 0 });

  // Add Form state
  const [formSubject, setFormSubject] = useState<string>('tyt_mat');
  const [formTopic, setFormTopic] = useState<string>('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [formDifficulty, setFormDifficulty] = useState<QuestionDifficulty>('Orta');
  const [formNote, setFormNote] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // List mode filter state
  const [listSubject, setListSubject] = useState<string>('all');
  const [listDifficulty, setListDifficulty] = useState<string>('all');
  const [listStatus, setListStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  // Lightbox Modal for Question Image
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const todayStr = '2026-10-24';

  // Questions for Practice Mode based on selected course
  const practiceQuestions = vault.filter((q) => {
    if (practiceSubject !== 'all' && q.subjectCode !== practiceSubject) return false;
    return true;
  });

  const currentQuestion: QuestionVaultItem | undefined = practiceQuestions[currentQuestionIndex];

  // Subject options in vault that actually have questions
  const subjectsInVault = Array.from(new Set(vault.map((q) => q.subjectCode)))
    .map((code) => {
      const s = YKS_SUBJECTS.find((sub) => sub.code === code);
      const count = vault.filter((q) => q.subjectCode === code).length;
      return { code, name: s ? s.name : code, count };
    });

  // Switch course in practice mode
  const handleSelectPracticeSubject = (code: string) => {
    sounds.playClick();
    setPracticeSubject(code);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowAnswerKey(false);
  };

  // Option Click Handler — just selects/deselects, does NOT submit automatically
  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (!currentQuestion) return;
    if (isAnswerSubmitted) return; // cevap zaten gönderildiyse tıklamayı engelle

    sounds.playClick();
    // Aynı şıkta tekrar tıklamak seçimi kaldırır
    setSelectedOption(selectedOption === option ? null : option);
  };

  // Cevabı Onayla — seçili şıkkı kesinleştirir
  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedOption || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      sounds.playSuccess();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      setSessionScore((prev) => ({
        correct: prev.correct + 1,
        totalAnswered: prev.totalAnswered + 1
      }));
      if (onAdvanceReviewStage) {
        onAdvanceReviewStage(currentQuestion.id, true);
      }
    } else {
      sounds.playToggle(false);
      setSessionScore((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1
      }));
      if (onAdvanceReviewStage) {
        onAdvanceReviewStage(currentQuestion.id, false);
      }
    }
  };

  const handleRetractOption = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowAnswerKey(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowAnswerKey(false);
    }
  };

  const handleRetryCurrent = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowAnswerKey(false);
  };

  // File Upload (Device Camera or Photo Library -> Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP).');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormImageUrl(dataUrl);
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Resim okunurken bir hata oluştu.');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Save new question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      alert('Lütfen soru konusunu veya başlığını girin.');
      return;
    }

    const foundSub = YKS_SUBJECTS.find((s) => s.code === formSubject);
    const newQuestion: QuestionVaultItem = {
      id: `qv-${Date.now()}`,
      subjectCode: formSubject,
      subjectName: foundSub ? foundSub.name : 'Matematik',
      topicName: formTopic.trim(),
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      correctAnswer: formCorrectAnswer || 'A',
      difficulty: formDifficulty,
      note: formNote.trim() || 'Doğru çözüm notu belirtilmedi.',
      reason: 'dikkat',
      isResolved: false,
      date: todayStr,
      reviewStage: 1,
      nextReviewDate: todayStr
    };

    onAdd(newQuestion);
    // Switch to practice mode with this subject
    setPracticeSubject(formSubject);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setActiveMode('practice');

    // Reset fields
    setFormTopic('');
    setFormNote('');
  };

  // Difficulty badge styling helpers
  const getDifficultyMeta = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'Kolay':
        return { label: 'Kolay', color: '#30D158', bg: 'rgba(48, 209, 88, 0.12)' };
      case 'Orta':
        return { label: 'Orta', color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.12)' };
      case 'Zor':
        return { label: 'Zor', color: '#FF453A', bg: 'rgba(255, 69, 58, 0.12)' };
      case 'ÖSYM Seviyesi':
        return { label: 'ÖSYM Seviyesi', color: '#BF5AF2', bg: 'rgba(191, 90, 242, 0.12)' };
      default:
        return { label: 'Orta', color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.12)' };
    }
  };

  // List mode filtered questions
  const filteredListItems = vault.filter((item) => {
    if (listSubject !== 'all' && item.subjectCode !== listSubject) return false;
    if (listDifficulty !== 'all' && item.difficulty !== listDifficulty) return false;
    if (listStatus === 'pending' && item.isResolved) return false;
    if (listStatus === 'resolved' && !item.isResolved) return false;
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          width: '100%',
          maxWidth: 680,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 19 }}>📔</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                Hata Defteri & Soru Çözümü
              </h3>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Yanlış yaptığın soruları fotoğrafla, derse göre filtrele ve cevabı görmeden test et.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Apple Segmented Control */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 12,
            padding: 3,
            marginBottom: 14
          }}
        >
          <button
            onClick={() => setActiveMode('practice')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 10,
              border: 'none',
              background: activeMode === 'practice' ? '#2C2C2E' : 'transparent',
              color: activeMode === 'practice' ? '#FFFFFF' : 'var(--color-text-muted)',
              fontWeight: activeMode === 'practice' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeMode === 'practice' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <span>🎯</span>
            <span>Soruları Çöz</span>
          </button>

          <button
            onClick={() => setActiveMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 10,
              border: 'none',
              background: activeMode === 'list' ? '#2C2C2E' : 'transparent',
              color: activeMode === 'list' ? '#FFFFFF' : 'var(--color-text-muted)',
              fontWeight: activeMode === 'list' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeMode === 'list' ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <span>📋</span>
            <span>Defter Listesi ({vault.length})</span>
          </button>

          <button
            onClick={() => setActiveMode('add')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 10,
              border: 'none',
              background: activeMode === 'add' ? 'var(--color-accent)' : 'transparent',
              color: activeMode === 'add' ? 'var(--color-on-accent)' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeMode === 'add' ? '0 2px 8px rgba(10, 132, 255, 0.4)' : 'none'
            }}
          >
            <Plus size={15} />
            <span>Soru Ekle</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MODE 1: PRACTICE & TEST MODE (SORULARI ÇÖZ)                       */}
        {/* ------------------------------------------------------------------ */}
        {activeMode === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Subject Filter Bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Ders Seçimi
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                <button
                  className={`pill-toggle-btn ${practiceSubject === 'all' ? 'active' : ''}`}
                  onClick={() => handleSelectPracticeSubject('all')}
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  Tüm Dersler ({vault.length})
                </button>
                {subjectsInVault.map((s) => {
                  const isActive = practiceSubject === s.code;
                  return (
                    <button
                      key={s.code}
                      className={`pill-toggle-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectPracticeSubject(isActive ? 'all' : s.code)}
                      style={{ fontSize: 12, padding: '6px 12px' }}
                      title={isActive ? 'Filtreyi kaldır (Tüm dersler)' : s.name}
                    >
                      {s.name} ({s.count}) {isActive ? '✕' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions Empty State */}
            {practiceQuestions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: 'var(--color-surface)',
                  borderRadius: 18,
                  border: '1px solid var(--color-border)',
                  marginTop: 10
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  Bu derste henüz hatalı soru eklenmemiş
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 360, margin: '0 auto 16px auto' }}>
                  Denemelerde veya soru bankalarında takıldığın soruların fotoğrafını ekleyerek test etmeye başla.
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (practiceSubject !== 'all') setFormSubject(practiceSubject);
                    setActiveMode('add');
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px' }}
                >
                  <Plus size={16} />
                  <span>Bu Derse İlk Soruyu Ekle</span>
                </button>
              </div>
            ) : currentQuestion ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Question Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--color-surface)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 8,
                        background: 'rgba(10, 132, 255, 0.15)',
                        color: 'var(--color-accent)'
                      }}
                    >
                      {currentQuestion.subjectName}
                    </span>
                    {(() => {
                      const diffMeta = getDifficultyMeta(currentQuestion.difficulty || 'Orta');
                      return (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '3px 9px',
                            borderRadius: 8,
                            background: diffMeta.bg,
                            color: diffMeta.color
                          }}
                        >
                          {diffMeta.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {sessionScore.totalAnswered > 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF'
                        }}
                      >
                        {sessionScore.correct}/{sessionScore.totalAnswered} Doğru
                      </span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      Soru {currentQuestionIndex + 1} / {practiceQuestions.length}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: 'none',
                          borderRadius: 8,
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: currentQuestionIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                          cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <ArrowLeft size={14} />
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === practiceQuestions.length - 1}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: 'none',
                          borderRadius: 8,
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: currentQuestionIndex === practiceQuestions.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                          cursor: currentQuestionIndex === practiceQuestions.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Topic */}
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
                  {currentQuestion.topicName}
                </div>

                {/* Question Photo Container */}
                <div
                  onClick={() => currentQuestion.imageUrl && setLightboxImageUrl(currentQuestion.imageUrl)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: 280,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#0D0E12',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'zoom-in',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                  title="Fotoğrafı tam ekran büyütmek için tıkla"
                >
                  {currentQuestion.imageUrl ? (
                    <img
                      src={currentQuestion.imageUrl}
                      alt={currentQuestion.topicName}
                      style={{
                        width: '100%',
                        height: '100%',
                        maxHeight: 280,
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div style={{ padding: 40, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                      <ImageIcon size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                      <div>Bu soruya fotoğraf eklenmedi</div>
                    </div>
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 20,
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: '#E5E5EA'
                    }}
                  >
                    <Maximize2 size={12} />
                    <span>Büyüt</span>
                  </div>
                </div>

                {/* Answer Key Toggle & Hidden Answer Notice Banner */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 8,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px dashed rgba(255, 255, 255, 0.12)',
                      borderRadius: 12,
                      padding: '10px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                      <EyeOff size={16} color="var(--color-accent)" />
                      <span>
                        <strong>Doğru cevap:</strong> {isAnswerSubmitted || showAnswerKey ? `"${currentQuestion.correctAnswer}" şıkkı` : 'Gizli (soruyu çöz ve işaretle)'}
                      </span>
                    </div>

                    {/* Cevap Anahtarı Toggle Butonu (Açılır / Geri Çekilir) */}
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setShowAnswerKey(!showAnswerKey);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: showAnswerKey ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.08)',
                        color: showAnswerKey ? '#0A0C10' : '#E5E5EA',
                        border: showAnswerKey ? '1px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.15)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Cevap anahtarını aç veya kapat (geri çek)"
                    >
                      {showAnswerKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{showAnswerKey ? '🔑 Cevap Anahtarını Kapat (Geri Çek)' : '🔑 Cevap Anahtarı'}</span>
                    </button>
                  </div>

                  {/* Show Answer Key Banner when showAnswerKey is true and not submitted */}
                  {showAnswerKey && !isAnswerSubmitted && (
                    <div
                      style={{
                        borderRadius: 12,
                        padding: '12px 16px',
                        background: 'rgba(212, 255, 0, 0.08)',
                        border: '1px solid var(--color-accent)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        animation: 'fadeIn 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-accent)' }}>
                          🔑 Doğru Cevap: {currentQuestion.correctAnswer}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAnswerKey(false)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ✕ Gizle (Geri Çek)
                        </button>
                      </div>
                      {currentQuestion.note && (
                        <div style={{ fontSize: 12, color: '#FFFFFF', lineHeight: 1.4 }}>
                          💡 <strong>Çözüm Notu:</strong> {currentQuestion.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Result Feedback Card (Shown after an option is selected) */}
                {isAnswerSubmitted && (
                  <div
                    style={{
                      borderRadius: 14,
                      padding: '12px 16px',
                      background:
                        selectedOption === currentQuestion.correctAnswer
                          ? 'rgba(48, 209, 88, 0.12)'
                          : 'rgba(255, 69, 58, 0.12)',
                      border: `1.5px solid ${
                        selectedOption === currentQuestion.correctAnswer ? '#30D158' : '#FF453A'
                      }`,
                      animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {selectedOption === currentQuestion.correctAnswer ? (
                          <>
                            <CheckCircle2 size={22} color="#30D158" />
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#30D158' }}>
                                Tebrikler! Doğru Cevap: {currentQuestion.correctAnswer}
                              </div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                                Bu soruyu başarıyla pekiştirdin.
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle size={22} color="#FF453A" />
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#FF453A' }}>
                                Yanlış! Sen "{selectedOption}" dedin. Doğru Cevap: {currentQuestion.correctAnswer}
                              </div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                                Çözüm notunu inceleyebilir veya şıkkı geri çekip tekrar deneyebilirsin.
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Seçimi Geri Çek butonu */}
                      <button
                        type="button"
                        onClick={handleRetractOption}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 12px',
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5
                        }}
                        title="İşaretlemeyi geri çek / iptal et"
                      >
                        <RotateCcw size={13} />
                        <span>Seçimi Geri Çek</span>
                      </button>
                    </div>

                    {/* Solution / Note */}
                    {currentQuestion.note && (
                      <div
                        style={{
                          marginTop: 10,
                          paddingTop: 10,
                          borderTop: `1px solid ${
                            selectedOption === currentQuestion.correctAnswer
                              ? 'rgba(48, 209, 88, 0.2)'
                              : 'rgba(255, 69, 58, 0.2)'
                          }`,
                          fontSize: 13,
                          color: '#FFFFFF',
                          lineHeight: 1.45
                        }}
                      >
                        💡 <strong>Çözüm & Püf Noktası:</strong> {currentQuestion.note}
                      </div>
                    )}
                  </div>
                )}

                {/* Option Buttons A, B, C, D, E */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      Cevabını İşaretle (Seçtiğin şıkka tekrar basarak geri çekebilirsin):
                    </div>
                    {selectedOption && (
                      <button
                        type="button"
                        onClick={handleRetractOption}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FF453A',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <RotateCcw size={12} />
                        <span>Seçimi Geri Çek</span>
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => {
                      const isChosen = selectedOption === opt;
                      const isCorrectAnswer = currentQuestion.correctAnswer === opt;

                      let btnBg = 'var(--color-surface)';
                      let btnBorder = '1px solid rgba(255, 255, 255, 0.1)';
                      let btnColor = 'var(--color-text)';
                      let opacity = 1;

                      if (isAnswerSubmitted) {
                        if (isCorrectAnswer) {
                          btnBg = '#30D158';
                          btnBorder = '1.5px solid #30D158';
                          btnColor = '#000000';
                        } else if (isChosen) {
                          btnBg = '#FF453A';
                          btnBorder = '1.5px solid #FF453A';
                          btnColor = '#FFFFFF';
                        } else {
                          opacity = 0.45;
                        }
                      } else if (showAnswerKey && isCorrectAnswer) {
                        btnBg = 'rgba(212, 255, 0, 0.2)';
                        btnBorder = '1.5px dashed var(--color-accent)';
                        btnColor = 'var(--color-accent)';
                      } else if (isChosen) {
                        // Seçili ama henüz cevap gönderilmemiş → accent rengiyle vurgula
                        btnBg = 'var(--color-accent)';
                        btnBorder = '1.5px solid var(--color-accent)';
                        btnColor = 'var(--color-on-accent)';
                      } else {
                        // Seçili olmayan → tamamen sönük/normal
                        btnBg = 'var(--color-surface)';
                        btnBorder = '1px solid rgba(255, 255, 255, 0.08)';
                        btnColor = 'var(--color-text-muted)';
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleOptionClick(opt)}
                          style={{
                            padding: '16px 0',
                            borderRadius: 14,
                            background: btnBg,
                            border: btnBorder,
                            color: btnColor,
                            fontSize: 18,
                            fontWeight: 700,
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            opacity,
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4
                          }}
                          title={isChosen ? 'Seçimi geri çekmek için tekrar tıkla' : `Şık ${opt}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isCorrectAnswer && (
                            <span style={{ fontSize: 10, fontWeight: 800 }}>✓ DOĞRU</span>
                          )}
                          {isAnswerSubmitted && isChosen && !isCorrectAnswer && (
                            <span style={{ fontSize: 10, fontWeight: 800 }}>✕ SENİN</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cevabı Onayla — sadece seçili şık varsa ve henüz gönderilmediyse görünür */}
                {!isAnswerSubmitted && selectedOption && (
                  <button
                    className="btn-primary"
                    onClick={handleSubmitAnswer}
                    style={{ width: '100%', padding: '14px', fontSize: 14, gap: 8, marginTop: 4, borderRadius: 14 }}
                  >
                    <span>✓ Cevabı Onayla ({selectedOption})</span>
                  </button>
                )}

                {/* Action Buttons Post-Answer */}
                {isAnswerSubmitted && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                    <button
                      className="btn-secondary"
                      onClick={handleRetryCurrent}
                      style={{ padding: '12px', fontSize: 13, gap: 6 }}
                    >
                      <RotateCcw size={15} />
                      <span>Tekrar Çöz</span>
                    </button>

                    {currentQuestionIndex < practiceQuestions.length - 1 ? (
                      <button
                        className="btn-primary"
                        onClick={handleNextQuestion}
                        style={{ padding: '12px', fontSize: 13, gap: 6 }}
                      >
                        <span>Sonraki Soru</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setCurrentQuestionIndex(0);
                          setSelectedOption(null);
                          setIsAnswerSubmitted(false);
                        }}
                        style={{ padding: '12px', fontSize: 13, gap: 6 }}
                      >
                        <span>Başa Dön</span>
                        <RotateCcw size={15} />
                      </button>
                    )}
                  </div>
                )}

                {/* Mark as Resolved button */}
                <button
                  onClick={() => onToggleResolved(currentQuestion.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: currentQuestion.isResolved ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: currentQuestion.isResolved ? '1px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: currentQuestion.isResolved ? '#30D158' : 'var(--color-text-muted)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  {currentQuestion.isResolved ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Bu Soru Kalıcı Pekiştirildi ✓</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      <span>Bu Soruyu Pekiştirdim / Çözüldü Olarak İşaretle</span>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 2: LIST MODE (HATA DEFTERİM TÜM SORULAR)                     */}
        {/* ------------------------------------------------------------------ */}
        {activeMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* Filter controls */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <select
                value={listSubject}
                onChange={(e) => setListSubject(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  background: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 12
                }}
              >
                <option value="all">Tüm Dersler</option>
                {YKS_SUBJECTS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={listDifficulty}
                onChange={(e) => setListDifficulty(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  background: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 12
                }}
              >
                <option value="all">Tüm Zorluklar</option>
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
                <option value="ÖSYM Seviyesi">ÖSYM Seviyesi</option>
              </select>

              <select
                value={listStatus}
                onChange={(e) => setListStatus(e.target.value as any)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 10,
                  background: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 12
                }}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Henüz Pekiştirilmedi</option>
                <option value="resolved">Pekiştirildi ✓</option>
              </select>
            </div>

            {/* Questions list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
              {filteredListItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  Filtreye uygun soru bulunamadı.
                </div>
              ) : (
                filteredListItems.map((item) => {
                  const diffMeta = getDifficultyMeta(item.difficulty || 'Orta');
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--color-surface)',
                        borderRadius: 14,
                        padding: 12,
                        border: item.isResolved ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid var(--color-border)',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center'
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        onClick={() => item.imageUrl && setLightboxImageUrl(item.imageUrl)}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 10,
                          overflow: 'hidden',
                          background: '#0D0E12',
                          flexShrink: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={20} color="var(--color-text-muted)" />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: 'rgba(10, 132, 255, 0.15)',
                              color: 'var(--color-accent)'
                            }}
                          >
                            {item.subjectName}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: diffMeta.bg,
                              color: diffMeta.color
                            }}
                          >
                            {diffMeta.label}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: '#FFFFFF'
                            }}
                          >
                            Cevap: {item.correctAnswer}
                          </span>
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.topicName}
                        </div>

                        {item.note && (
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.note}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button
                          onClick={() => {
                            setPracticeSubject(item.subjectCode);
                            const idx = vault.filter((q) => q.subjectCode === item.subjectCode).findIndex((q) => q.id === item.id);
                            setCurrentQuestionIndex(idx >= 0 ? idx : 0);
                            setSelectedOption(null);
                            setIsAnswerSubmitted(false);
                            setActiveMode('practice');
                          }}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8 }}
                        >
                          Çöz ➔
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-dim)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4
                          }}
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MODE 3: ADD NEW QUESTION (FOTOĞRAFLI YENİ SORU EKLE)                */}
        {/* ------------------------------------------------------------------ */}
        {activeMode === 'add' && (
          <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {/* Photo Upload Area */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                Sorunun Fotoğrafı (Kamera veya Dosya Seç)
              </label>

              <div
                style={{
                  border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: 16,
                  padding: 16,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  position: 'relative'
                }}
              >
                {formImageUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        maxHeight: 180,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#0E0F12'
                      }}
                    >
                      <img
                        src={formImageUrl}
                        alt="Önizleme"
                        style={{ width: '100%', height: '100%', maxHeight: 180, objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Camera size={14} />
                        <span>Fotoğrafı Değiştir</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'rgba(255, 69, 58, 0.12)',
                          color: '#FF453A',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(10, 132, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-accent)'
                      }}
                    >
                      <Camera size={22} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
                      Cihazından Soru Fotoğrafı Yükle
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      Kamera ile çek veya galerinden seç (PNG, JPG, WEBP)
                    </div>
                    <label
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: 'var(--color-accent)',
                        color: 'var(--color-on-accent)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Upload size={15} />
                      <span>{isUploadingImage ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* Presets */}
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-dim)' }}>
                      veya hızlı test için hazır şablon kullan:
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() =>
                          setFormImageUrl('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')
                        }
                        style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        Matematik Soru Taslağı
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormImageUrl('https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80')
                        }
                        style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                      >
                        Fizik Çizimi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subject and Difficulty Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  Hangi Ders?
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: '#2C2C2E',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: 13
                  }}
                >
                  {YKS_SUBJECTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  Zorluk Seviyesi
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                  {(['Kolay', 'Orta', 'Zor', 'ÖSYM Seviyesi'] as QuestionDifficulty[]).map((d) => {
                    const isSelected = formDifficulty === d;
                    const meta = getDifficultyMeta(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          sounds.playClick();
                          setFormDifficulty(formDifficulty === d ? 'Orta' : d);
                        }}
                        style={{
                          padding: '7px 4px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected ? meta.color : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#000000' : 'var(--color-text-muted)',
                          border: isSelected ? `1px solid ${meta.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                        title={isSelected ? 'Zorluğu varsayılana çekmek için tıkla' : d}
                      >
                        {d} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Correct Answer Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Sorunun Doğru Cevabı (Şıkkı):
                </label>
                {formCorrectAnswer && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setFormCorrectAnswer(null);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FF453A',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Seçimi Kaldır ✕
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => {
                  const isSelected = formCorrectAnswer === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      className={`option-btn${isSelected ? ' selected' : ''}`}
                      onClick={() => {
                        sounds.playClick();
                        setFormCorrectAnswer(isSelected ? null : opt);
                      }}
                      title={isSelected ? 'Seçimi geri çekmek için tekrar tıkla' : `Şık ${opt}`}
                    >
                      {opt} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Konu / Başlık
              </label>
              <input
                type="text"
                required
                placeholder="Ör: Türevde Teğet Eğimi veya Paragrafta Ana Düşünce"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 13
                }}
              />
            </div>

            {/* Solution / Note */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Çözüm Notun / Püf Noktası (Cevabı yanlış yaptığında gösterilecek)
              </label>
              <textarea
                rows={2}
                placeholder="Ör: Formülde işaret değişimine dikkat et, paydayı sıfır yapan kökü çözüm kümesinden çıkar..."
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: '#2C2C2E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 14,
                borderRadius: 14,
                marginTop: 6
              }}
            >
              Hata Defterine Kaydet ve Çözmeye Başla ➔
            </button>
          </form>
        )}

        {/* Lightbox Modal */}
        {lightboxImageUrl && (
          <div
            onClick={() => setLightboxImageUrl(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '92vw',
                maxHeight: '88vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <button
                onClick={() => setLightboxImageUrl(null)}
                style={{
                  position: 'absolute',
                  top: -44,
                  right: 0,
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <img
                src={lightboxImageUrl}
                alt="Soru Görseli"
                style={{
                  maxWidth: '100%',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 7: Speed Meter Modal (Soru Çözüm Hızı & Tek Tuşla Tempo Hesaplayıcı)
// ----------------------------------------------------------------------------
function SpeedMeterModal({
  onSaveLog,
  onClose
}: {
  onSaveLog?: (subject: string, source: string, count: number, minutes: number) => void;
  onClose: () => void;
}) {
  const [selectedSubject, setSelectedSubject] = useState('TYT Matematik');
  const [solvedQuestions, setSolvedQuestions] = useState(20);
  const [targetSecPerQ, setTargetSecPerQ] = useState(60);

  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Suggested targets per course
  const coursePresets: Record<string, number> = {
    'TYT Matematik': 75,
    'TYT Türkçe': 65,
    'TYT Fen Bilimleri': 45,
    'TYT Sosyal Bilimler': 40,
    'AYT Matematik': 110,
    'AYT Fizik': 90,
    'AYT Kimya': 70,
    'AYT Biyoloji': 60
  };

  const handleSelectSubject = (sub: string) => {
    setSelectedSubject(sub);
    if (coursePresets[sub]) {
      setTargetSecPerQ(coursePresets[sub]);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFinished]);

  const handleToggleRunning = () => {
    sounds.playClick();
    setIsRunning(!isRunning);
  };

  const handleFinishTest = () => {
    if (totalSeconds < 5) {
      alert('Hız hesaplayabilmek için test süresi en az 5 saniye olmalıdır.');
      return;
    }
    sounds.playSuccess();
    confetti({ particleCount: 70, spread: 70 });
    setIsRunning(false);
    setIsFinished(true);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsRunning(false);
    setIsFinished(false);
    setTotalSeconds(0);
    setIsSaved(false);
  };

  // Calculations
  const validQuestions = Math.max(1, solvedQuestions);
  const averageSecondsPerQuestion = Math.round(totalSeconds / validQuestions);
  const avgMins = Math.floor(averageSecondsPerQuestion / 60);
  const avgSecsRemainder = averageSecondsPerQuestion % 60;

  const totalMinutesDisplay = Math.floor(totalSeconds / 60);
  const totalSecondsRemainder = totalSeconds % 60;

  const isFast = averageSecondsPerQuestion <= targetSecPerQ;
  const speedDiff = targetSecPerQ - averageSecondsPerQuestion;

  const handleSaveToDailyLog = () => {
    if (!onSaveLog) return;
    const durationMinutes = Math.max(1, Math.round(totalSeconds / 60));
    onSaveLog(selectedSubject, 'Hız Sayacı Testi', validQuestions, durationMinutes);
    setIsSaved(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              ⚡ Soru Çözüm Hızı & Tempo Sayacı
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Testi bir kez başlat, bitirince durdur ve soru başına düşen süreni gör
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {!isFinished ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Settings Card: Active before starting or while running */}
            <div style={{ background: '#1F2027', padding: 14, borderRadius: 14, border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Ders</label>
                  <select
                    disabled={isRunning}
                    value={selectedSubject}
                    onChange={(e) => handleSelectSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: '#121316', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12 }}
                  >
                    {YKS_SUBJECTS.map((s) => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef Tempo (sn/soru)</label>
                  <input
                    disabled={isRunning}
                    type="number"
                    min="10"
                    max="300"
                    value={targetSecPerQ}
                    onChange={(e) => setTargetSecPerQ(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: '#121316', border: '1px solid var(--color-border)', color: '#fff', fontSize: 12 }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Çözülecek / Çözülen Soru Sayısı</label>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#00F0FF' }}>{solvedQuestions} Soru</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[10, 15, 20, 30, 40].map((count) => (
                    <button
                      key={count}
                      type="button"
                      disabled={isRunning}
                      onClick={() => setSolvedQuestions(count)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        borderRadius: 8,
                        background: solvedQuestions === count ? 'rgba(0, 240, 255, 0.2)' : '#121316',
                        border: solvedQuestions === count ? '1.5px solid #00F0FF' : '1px solid var(--color-border)',
                        color: solvedQuestions === count ? '#00F0FF' : 'var(--color-text-muted)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: isRunning ? 'default' : 'pointer'
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Big Stopwatch Display */}
            <div
              style={{
                textAlign: 'center',
                padding: '24px 0',
                background: 'linear-gradient(145deg, #18191E 0%, #121316 100%)',
                borderRadius: 20,
                border: isRunning ? '1.5px solid #00F0FF' : '1px solid var(--color-border)',
                boxShadow: isRunning ? '0 0 24px rgba(0, 240, 255, 0.15)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: 12, color: isRunning ? '#00F0FF' : 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {isRunning ? '⚡ TEST SÜRESİ AKIYOR' : totalSeconds > 0 ? '⏸️ DURAKLATILDI' : 'TEST BAŞLAMAYA HAZIR'}
              </div>

              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  margin: '8px 0'
                }}
              >
                {String(totalMinutesDisplay).padStart(2, '0')}:{String(totalSecondsRemainder).padStart(2, '0')}
              </div>

              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                {totalSeconds > 0 ? (
                  <span>
                    Şu anki Canlı Ortalama: <strong style={{ color: isFast ? 'var(--color-accent)' : '#FFB800' }}>
                      ~{averageSecondsPerQuestion} saniye / soru
                    </strong>
                  </span>
                ) : (
                  <span>{solvedQuestions} soru için testi başlatın</span>
                )}
              </div>
            </div>

            {/* Action Buttons: Start / Pause / Finish */}
            <div style={{ display: 'flex', gap: 10 }}>
              {!isRunning && totalSeconds === 0 ? (
                <button
                  className="btn-primary"
                  onClick={handleToggleRunning}
                  style={{ flex: 1, padding: '14px', backgroundColor: '#00F0FF', color: '#000', fontSize: 15 }}
                >
                  <Play size={18} />
                  <span>Testi Başlat</span>
                </button>
              ) : (
                <>
                  <button
                    className="btn-secondary"
                    onClick={handleToggleRunning}
                    style={{ flex: 1, padding: '14px', fontSize: 14, fontWeight: 700 }}
                  >
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    <span>{isRunning ? 'Duraklat' : 'Devam Et'}</span>
                  </button>

                  <button
                    className="btn-primary"
                    onClick={handleFinishTest}
                    style={{ flex: 1.3, padding: '14px', backgroundColor: 'var(--color-accent)', color: '#000', fontSize: 14 }}
                  >
                    <Check size={18} />
                    <span>Testi Bitir & Hesapla</span>
                  </button>
                </>
              )}

              {totalSeconds > 0 && (
                <button className="btn-secondary" onClick={handleReset} style={{ padding: '12px 14px' }} title="Sıfırla">
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Test Speed Calculation & Evaluation */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>⏱️</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Soru Çözüm Hızı Karnesi</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {selectedSubject} • {validQuestions} Soru
            </div>

            {/* Giant Metric: Seconds Per Question */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(212, 255, 0, 0.1) 0%, rgba(24, 25, 30, 1) 100%)',
                border: '1.5px solid var(--color-accent)',
                borderRadius: 18,
                padding: '18px 14px',
                margin: '16px 0',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 700 }}>
                ORTALAMA SORU BAŞINA SÜRE
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: isFast ? 'var(--color-accent)' : '#FFB800',
                  margin: '6px 0',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {avgMins > 0 ? `${avgMins} dk ${avgSecsRemainder} sn` : `${averageSecondsPerQuestion} Saniye`}
              </div>
              <div style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>
                {isFast ? (
                  <span style={{ color: 'var(--color-accent)' }}>
                    ⚡ Harika! Hedefinden soru başına {Math.abs(speedDiff)} saniye daha hızlısın.
                  </span>
                ) : (
                  <span style={{ color: '#FFB800' }}>
                    ⏳ Hedefinden soru başına {Math.abs(speedDiff)} saniye daha yavaşsın.
                  </span>
                )}
              </div>
            </div>

            {/* Test Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#1F2027', padding: 12, borderRadius: 14, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Toplam Harcanan Süre</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#38BDF8', marginTop: 4 }}>
                  {totalMinutesDisplay}d {totalSecondsRemainder}s
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
                  Net kronometre süresi
                </div>
              </div>

              <div style={{ background: '#1F2027', padding: 12, borderRadius: 14, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Çözülen Soru</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={solvedQuestions}
                    onChange={(e) => setSolvedQuestions(Number(e.target.value))}
                    style={{
                      width: 65,
                      padding: '4px 6px',
                      borderRadius: 6,
                      background: '#121316',
                      border: '1px solid var(--color-border)',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 800
                    }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Soru</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
                  Gerekirse sayıyı düzelt
                </div>
              </div>
            </div>

            {/* Projection Note */}
            <div style={{ background: '#18191E', padding: 12, borderRadius: 12, fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16, textAlign: 'left' }}>
              💡 <strong style={{ color: '#fff' }}>Sınav Projeksiyonu: </strong>
              Bu tempoyu korursan, 40 soruluk bir {selectedSubject} bölümünü yaklaşık{' '}
              <strong style={{ color: 'var(--color-accent)' }}>
                {Math.round((averageSecondsPerQuestion * 40) / 60)} dakikada
              </strong>{' '}
              tamamlayacaksın!
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {onSaveLog && (
                <button
                  className="btn-primary"
                  onClick={handleSaveToDailyLog}
                  disabled={isSaved}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: isSaved ? '#16A34A' : '#00F0FF',
                    color: '#000',
                    fontSize: 13
                  }}
                >
                  <Check size={16} />
                  <span>{isSaved ? 'Günlüğe Kaydedildi ✓' : 'Bu Testi Günlük Soru Sayacıma Ekle'}</span>
                </button>
              )}

              <button className="btn-secondary" onClick={handleReset} style={{ width: '100%', padding: '12px' }}>
                <RotateCcw size={15} />
                <span>Yeni Bir Hız Testi Başlat</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 8: Book Tracker Modal (Kaynak Kitap Takipçisi)
// ----------------------------------------------------------------------------
function BookTrackerModal({
  books,
  onAdjustTests,
  onAddBook,
  onClose
}: {
  books: BookTrackerItem[];
  onAdjustTests: (id: string, delta: number) => void;
  onAddBook: (b: BookTrackerItem) => void;
  onClose: () => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [subject, setSubject] = useState('TYT Matematik');
  const [totalTests, setTotalTests] = useState(30);

  const totalAllTests = books.reduce((s, b) => s + b.totalTests, 0);
  const completedAllTests = books.reduce((s, b) => s + b.completedTests, 0);
  const overallPct = Math.round((completedAllTests / (totalAllTests || 1)) * 100);

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen kitap adını girin.');
      return;
    }
    const newBook: BookTrackerItem = {
      id: `book-${Date.now()}`,
      title,
      publisher: publisher || 'Yayınevi',
      subjectName: subject,
      totalTests: Number(totalTests),
      completedTests: 0
    };
    onAddBook(newBook);
    setShowAddForm(false);
    setTitle('');
    setPublisher('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              📚 Kaynak Kitap Takipçisi
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Soru bankalarının test bitirme oranlarını ve kalan testlerini takip et
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Overall Completion Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.1) 0%, rgba(24, 25, 30, 1) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.3)',
            borderRadius: 14,
            padding: 14,
            marginBottom: 14
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Genel Kaynak Bitirme Oranı</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#C084FC' }}>%{overallPct}</span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#14161C', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${overallPct}%`, height: '100%', background: '#C084FC', borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>Toplam {books.length} Kaynak Kitap</span>
            <span>{completedAllTests} / {totalAllTests} Test Bitti</span>
          </div>
        </div>

        {showAddForm ? (
          <form onSubmit={handleSaveBook} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Kitap Adı</label>
              <input
                type="text"
                required
                placeholder="Ör: Orijinal AYT Matematik Soru Bankası"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Yayınevi</label>
                <input
                  type="text"
                  placeholder="Ör: Orijinal Yayınları"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Toplam Test</label>
                <input
                  type="number"
                  min="1"
                  value={totalTests}
                  onChange={(e) => setTotalTests(Number(e.target.value))}
                  style={{ width: '100%', padding: 8, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Ders</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 8, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
              >
                {YKS_SUBJECTS.map((s) => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Kaydet</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>İptal</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Kitaplarım</span>
              <button
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: 11 }}
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={14} />
                <span>Kitap Ekle</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: '55vh' }}>
              {books.map((book) => {
                const pct = Math.round((book.completedTests / book.totalTests) * 100);
                return (
                  <div key={book.id} style={{ background: '#1F2027', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{book.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                          {book.publisher} • {book.subjectName}
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#C084FC' }}>
                        %{pct}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: 6, background: '#14161C', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#C084FC', borderRadius: 99 }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {book.completedTests} / {book.totalTests} Test Çözüldü
                      </span>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => onAdjustTests(book.id, -1)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: '#14161C',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="1 test azalt"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => onAdjustTests(book.id, 1)}
                          style={{
                            padding: '0 10px',
                            height: 28,
                            borderRadius: 8,
                            background: 'rgba(192, 132, 252, 0.15)',
                            border: '1px solid #C084FC',
                            color: '#C084FC',
                            fontSize: 11,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer'
                          }}
                          title="1 test ekle"
                        >
                          <Plus size={14} />
                          <span>+1 Test</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 21: Rank Simulator Modal (YKS Sıralama Simülatörü)
// ----------------------------------------------------------------------------
function RankSimulatorModal({
  profile,
  latestExam,
  onClose
}: {
  profile: StudentProfile;
  latestExam?: Exam;
  onClose: () => void;
}) {
  const [track, setTrack] = useState<'sayisal' | 'esit_agirlik' | 'sozel' | 'dil'>(profile.fieldTrack);
  const [tytNet, setTytNet] = useState(latestExam ? latestExam.totalNet : 91.5);
  const [aytNet, setAytNet] = useState(64.75);
  const [obp, setObp] = useState(profile.obp);

  // ÖSYM Standard formula simulation for Yerleştirme Puanı & Rank projection
  const tytRaw = 100 + tytNet * 3.3;
  const aytRaw = aytNet * 3.75;
  const placementScore = tytRaw * 0.4 + aytRaw * 0.6 + obp * 0.6;

  // 2024 & 2025 statistical curve interpolation
  let estimatedRank2024 = 15000;
  let range2025Min = 13500;
  let range2025Max = 17000;

  if (placementScore >= 520) {
    estimatedRank2024 = Math.round(50 + (550 - placementScore) * 15);
    range2025Min = Math.round(estimatedRank2024 * 0.85);
    range2025Max = Math.round(estimatedRank2024 * 1.15);
  } else if (placementScore >= 480) {
    estimatedRank2024 = Math.round(1500 + (520 - placementScore) * 120);
    range2025Min = Math.round(estimatedRank2024 * 0.9);
    range2025Max = Math.round(estimatedRank2024 * 1.15);
  } else if (placementScore >= 440) {
    estimatedRank2024 = Math.round(7000 + (480 - placementScore) * 280);
    range2025Min = Math.round(estimatedRank2024 * 0.92);
    range2025Max = Math.round(estimatedRank2024 * 1.12);
  } else if (placementScore >= 380) {
    estimatedRank2024 = Math.round(22000 + (440 - placementScore) * 650);
    range2025Min = Math.round(estimatedRank2024 * 0.9);
    range2025Max = Math.round(estimatedRank2024 * 1.1);
  } else {
    estimatedRank2024 = Math.round(75000 + (380 - placementScore) * 1400);
    range2025Min = Math.round(estimatedRank2024 * 0.88);
    range2025Max = Math.round(estimatedRank2024 * 1.12);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              🎯 YKS Sıralama Simülatörü
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              2024 ve 2025 ÖSYM yığılma katsayıları ile gerçekçi sıralama hesabı
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Alan Seçici */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
          {[
            { id: 'sayisal', label: 'Sayısal' },
            { id: 'esit_agirlik', label: 'Eşit Ağ.' },
            { id: 'sozel', label: 'Sözel' },
            { id: 'dil', label: 'YDT Dil' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id as any)}
              className={`pill-toggle-btn ${track === t.id ? 'active' : ''}`}
              style={{ padding: '8px 4px', fontSize: 11 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Result Highlight Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212, 255, 0, 0.1) 0%, rgba(24, 25, 30, 1) 100%)',
            border: '1.5px solid var(--color-accent)',
            borderRadius: 16,
            padding: 16,
            textAlign: 'center',
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {track.toUpperCase()} TAHMİNİ YKS SIRALAMAN
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--color-accent)', margin: '6px 0', fontFamily: 'var(--font-mono)' }}>
            ~{estimatedRank2024.toLocaleString('tr-TR')}.
          </div>
          <div style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 700 }}>
            2025 Yığılma Projeksiyon Aralığı: <span style={{ color: '#00F0FF' }}>{range2025Min.toLocaleString('tr-TR')} - {range2025Max.toLocaleString('tr-TR')}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginTop: 4 }}>
            Yerleştirme Puanı (Y-{track.slice(0, 3).toUpperCase()}): {placementScore.toFixed(2)}
          </div>
        </div>

        {/* Inputs & Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>TYT Toplam Neti:</span>
              <strong style={{ color: 'var(--color-accent)' }}>{tytNet.toFixed(1)} Net</strong>
            </div>
            <ModernSlider
              min={20}
              max={120}
              step={0.5}
              value={tytNet}
              accentColor="var(--color-accent)"
              onChange={(e) => setTytNet(Number(e.target.value))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>AYT Toplam Neti:</span>
              <strong style={{ color: '#38BDF8' }}>{aytNet.toFixed(1)} Net</strong>
            </div>
            <ModernSlider
              min={10}
              max={80}
              step={0.5}
              value={aytNet}
              accentColor="#38BDF8"
              onChange={(e) => setAytNet(Number(e.target.value))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>Diploma Notu (OBP):</span>
              <strong style={{ color: '#FFB800' }}>{obp.toFixed(1)}</strong>
            </div>
            <ModernSlider
              min={50}
              max={100}
              step={0.5}
              value={obp}
              accentColor="#FFB800"
              onChange={(e) => setObp(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Quick Insight Bar */}
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: '#1F2027', fontSize: 12, color: 'var(--color-text-muted)' }}>
          💡 <strong style={{ color: '#fff' }}>Hızlı Analiz: </strong>
          AYT'de yapacağın fazladan <strong style={{ color: 'var(--color-accent)' }}>+3 net</strong>, bu bantta sıralamanı yaklaşık{' '}
          <strong style={{ color: 'var(--color-accent)' }}>{Math.round(estimatedRank2024 * 0.18).toLocaleString('tr-TR')} kişi</strong> öne taşıyacaktır!
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 22: Benchmark Comparator (YÖK Atlas Hedef Kıyaslama)
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Feature 22: Benchmark Comparator (YÖK Atlas Hedef Seçici & Net Açığı Analizi)
// ----------------------------------------------------------------------------
function BenchmarkModal({
  exams,
  profile,
  onUpdateTarget,
  onClose
}: {
  exams: Exam[];
  profile: StudentProfile;
  onUpdateTarget: (bm: DepartmentBenchmark) => void;
  onClose: () => void;
}) {
  // Combine custom benchmarks and 2025 dataset
  const allDepartments = useMemo(() => {
    const combined: DepartmentBenchmark[] = [...YOK_ATLAS_BENCHMARKS];
    const seen = new Set(combined.map((b) => `${b.university.toLowerCase()}-${b.department.toLowerCase()}`));
    for (const d of YOK_ATLAS_DATASET_2025) {
      const key = `${d.university.toLowerCase()}-${d.department.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(d);
      }
    }
    return combined;
  }, []);

  // Find initial department based on profile target, or first item
  const initialDept = useMemo(() => {
    const targetUni = (profile.targetUniversity || '').toLowerCase().trim();
    const targetDept = (profile.targetDepartment || '').toLowerCase().trim();
    const found = allDepartments.find(
      (b) =>
        (targetUni && b.university.toLowerCase().includes(targetUni)) ||
        (targetDept && b.department.toLowerCase().includes(targetDept))
    );
    return found || allDepartments[0];
  }, [allDepartments, profile]);

  const [selectedDept, setSelectedDept] = useState<DepartmentBenchmark>(initialDept);
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState<'all' | 'sayisal' | 'esit_agirlik' | 'sozel' | 'dil'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Devlet' | 'Vakıf'>('all');
  const [justUpdated, setJustUpdated] = useState(false);

  // Filtered department list
  const filteredDepartments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allDepartments.filter((b) => {
      if (trackFilter !== 'all' && b.track !== trackFilter) return false;
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      if (!q) return true;
      return (
        b.university.toLowerCase().includes(q) ||
        b.department.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
      );
    });
  }, [allDepartments, searchTerm, trackFilter, typeFilter]);

  // Compute User's Current Performance from Real Exams
  const latestTyt = exams.find((e) => e.type === 'TYT') || exams[0];
  const userTytTurkce = latestTyt?.subjectResults?.find((s) => s.subjectCode.includes('turkce'))?.net ?? 34.0;
  const userTytSosyal = latestTyt?.subjectResults?.find((s) => s.subjectCode.includes('sosyal'))?.net ?? 15.25;
  const userTytMat = latestTyt?.subjectResults?.find((s) => s.subjectCode.includes('mat'))?.net ?? 27.5;
  const userTytFen = latestTyt?.subjectResults?.filter((s) => ['tyt_fizik', 'tyt_kimya', 'tyt_biyo'].includes(s.subjectCode)).reduce((a, b) => a + b.net, 0) ?? 14.75;
  const userTytTotal = Math.round((userTytTurkce + userTytSosyal + userTytMat + userTytFen) * 100) / 100;

  // AYT Results according to track
  const latestAyt = exams.find((e) => e.type === 'AYT');
  const userAytMat = latestAyt?.subjectResults?.find((s) => s.subjectCode.includes('mat'))?.net ?? 31.25;
  const userAytFizik = latestAyt?.subjectResults?.find((s) => s.subjectCode.includes('fizik'))?.net ?? 10.5;
  const userAytKimya = latestAyt?.subjectResults?.find((s) => s.subjectCode.includes('kimya'))?.net ?? 10.75;
  const userAytBiyo = latestAyt?.subjectResults?.find((s) => s.subjectCode.includes('biyo'))?.net ?? 12.25;
  const userAytEdebiyat = 20.0;
  const userAytTarih = 7.0;
  const userAytCografya = 4.5;
  const userAytDil = 72.0;

  let userAytTotal = 0;
  if (selectedDept.track === 'sayisal') {
    userAytTotal = Math.round((userAytMat + userAytFizik + userAytKimya + userAytBiyo) * 100) / 100;
  } else if (selectedDept.track === 'esit_agirlik') {
    userAytTotal = Math.round((userAytMat + userAytEdebiyat + userAytTarih + userAytCografya) * 100) / 100;
  } else if (selectedDept.track === 'sozel') {
    userAytTotal = Math.round((userAytEdebiyat + userAytTarih + userAytCografya + 24.5) * 100) / 100;
  } else {
    userAytTotal = userAytDil;
  }

  const userTotal = Math.round((userTytTotal + userAytTotal) * 100) / 100;
  const targetTotal = Math.round((selectedDept.tytTotal + selectedDept.aytTotal) * 100) / 100;

  // Deficit Calculations (Net Açığı)
  const totalDeficit = Math.round((userTotal - targetTotal) * 100) / 100;
  const tytDeficit = Math.round((userTytTotal - selectedDept.tytTotal) * 100) / 100;
  const aytDeficit = Math.round((userAytTotal - selectedDept.aytTotal) * 100) / 100;
  const matchPct = Math.min(100, Math.round((userTotal / targetTotal) * 100));

  // Build subject breakdown based on department track
  const subjectBreakdown = useMemo(() => {
    const list: { name: string; user: number; target: number; category: 'TYT' | 'AYT' }[] = [
      { name: 'TYT Türkçe', user: userTytTurkce, target: selectedDept.tytTurkce, category: 'TYT' },
      { name: 'TYT Sosyal Bilimler', user: userTytSosyal, target: selectedDept.tytSosyal, category: 'TYT' },
      { name: 'TYT Temel Matematik', user: userTytMat, target: selectedDept.tytMat, category: 'TYT' },
      { name: 'TYT Fen Bilimleri', user: userTytFen, target: selectedDept.tytFen, category: 'TYT' }
    ];

    if (selectedDept.track === 'sayisal') {
      list.push(
        { name: 'AYT Matematik', user: userAytMat, target: selectedDept.aytMat, category: 'AYT' },
        { name: 'AYT Fizik', user: userAytFizik, target: selectedDept.aytFizik, category: 'AYT' },
        { name: 'AYT Kimya', user: userAytKimya, target: selectedDept.aytKimya, category: 'AYT' },
        { name: 'AYT Biyoloji', user: userAytBiyo, target: selectedDept.aytBiyo, category: 'AYT' }
      );
    } else if (selectedDept.track === 'esit_agirlik') {
      list.push(
        { name: 'AYT Matematik', user: userAytMat, target: selectedDept.aytMat, category: 'AYT' },
        { name: 'AYT Türk Dili ve Edebiyatı', user: userAytEdebiyat, target: selectedDept.aytEdebiyat || 20.0, category: 'AYT' },
        { name: 'AYT Tarih-1', user: userAytTarih, target: selectedDept.aytTarih || 7.0, category: 'AYT' },
        { name: 'AYT Coğrafya-1', user: userAytCografya, target: selectedDept.aytCografya || 4.5, category: 'AYT' }
      );
    } else if (selectedDept.track === 'sozel') {
      list.push(
        { name: 'AYT Türk Dili ve Edebiyatı', user: userAytEdebiyat, target: selectedDept.aytEdebiyat || 21.0, category: 'AYT' },
        { name: 'AYT Tarih-1', user: userAytTarih, target: selectedDept.aytTarih || 8.0, category: 'AYT' },
        { name: 'AYT Coğrafya-1', user: userAytCografya, target: selectedDept.aytCografya || 5.0, category: 'AYT' }
      );
    } else {
      list.push(
        { name: 'YDT Yabancı Dil Testi', user: userAytDil, target: selectedDept.aytDil || 75.0, category: 'AYT' }
      );
    }

    return list;
  }, [selectedDept, userTytTurkce, userTytSosyal, userTytMat, userTytFen, userAytMat, userAytFizik, userAytKimya, userAytBiyo, userAytEdebiyat, userAytTarih, userAytCografya, userAytDil]);

  // Identify top bottleneck subjects with largest net deficit
  const topBottlenecks = useMemo(() => {
    return [...subjectBreakdown]
      .map((s) => ({ ...s, gap: Math.round((s.user - s.target) * 100) / 100 }))
      .filter((s) => s.gap < 0)
      .sort((a, b) => a.gap - b.gap)
      .slice(0, 2);
  }, [subjectBreakdown]);

  const handleSelectAsTarget = () => {
    onUpdateTarget(selectedDept);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 2500);
  };

  const formatRank = (rank: number) => {
    if (!rank || rank <= 0) return '-';
    if (rank < 1000) return `${rank}.`;
    return `${(rank / 1000).toFixed(1)}k`;
  };

  const getTrackBadge = (track: string) => {
    switch (track) {
      case 'sayisal': return { label: 'SAY', color: '#0A84FF', bg: 'rgba(10, 132, 255, 0.15)' };
      case 'esit_agirlik': return { label: 'EA', color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.15)' };
      case 'sozel': return { label: 'SÖZ', color: '#FF453A', bg: 'rgba(255, 69, 58, 0.15)' };
      case 'dil': return { label: 'DİL', color: '#BF5AF2', bg: 'rgba(191, 90, 242, 0.15)' };
      default: return { label: 'YKS', color: '#E5E5EA', bg: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '92vh',
          maxWidth: 820,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'var(--color-bg)',
          borderRadius: 22,
          overflow: 'hidden'
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface)',
            flexShrink: 0
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(10, 132, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={16} color="#0A84FF" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                YÖK Atlas Hedef Bölüm Seçici & Net Açığı
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              yokatlas.yok.gov.tr resmi verileri • Taban puan, başarı sırası (k) ve son giren net analizi
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* SEARCH & FILTERS BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Üniversite, bölüm veya şehir ara... (Örn: Boğaziçi, Tıp, Bilgisayar, Hukuk, İzmir)"
                style={{
                  width: '100%',
                  padding: '11px 38px 11px 40px',
                  borderRadius: 12,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: 2
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Track Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-dim)', marginRight: 2 }}>Puan Türü:</span>
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'sayisal', label: 'Sayısal (SAY)' },
                { id: 'esit_agirlik', label: 'Eşit Ağırlık (EA)' },
                { id: 'sozel', label: 'Sözel (SÖZ)' },
                { id: 'dil', label: 'Dil (DİL)' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrackFilter(t.id as any)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 99,
                    fontSize: 11.5,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: trackFilter === t.id ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.06)',
                    color: trackFilter === t.id ? '#FFFFFF' : 'var(--color-text-muted)'
                  }}
                >
                  {t.label}
                </button>
              ))}

              <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 4px' }} />

              <span style={{ fontSize: 11, color: 'var(--color-text-dim)', marginRight: 2 }}>Tür:</span>
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'Devlet', label: 'Devlet' },
                { id: 'Vakıf', label: 'Vakıf' }
              ].map((ty) => (
                <button
                  key={ty.id}
                  onClick={() => setTypeFilter(ty.id as any)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: typeFilter === ty.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: typeFilter === ty.id ? '#FFFFFF' : 'var(--color-text-muted)'
                  }}
                >
                  {ty.label}
                </button>
              ))}

              <span style={{ fontSize: 11, color: 'var(--color-text-dim)', marginLeft: 'auto' }}>
                {filteredDepartments.length} Program
              </span>
            </div>
          </div>

          {/* ACTIVE TARGET INSPECTOR & NET DEFICIT CARD */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 18,
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Target Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  {(() => {
                    const badge = getTrackBadge(selectedDept.track);
                    return (
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    );
                  })()}
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(255, 255, 255, 0.07)', color: 'var(--color-text-muted)' }}>
                    {selectedDept.city} • {selectedDept.type}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {selectedDept.department}
                </h2>
                <div style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600, marginTop: 2 }}>
                  🏛️ {selectedDept.university}
                </div>
              </div>

              {/* Action Button: Set as Profile Target */}
              <div>
                <button
                  onClick={handleSelectAsTarget}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: justUpdated ? '#30D158' : 'var(--color-accent)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(10, 132, 255, 0.3)'
                  }}
                >
                  <Check size={15} />
                  <span>{justUpdated ? 'Hedefin Olarak Kaydedildi!' : 'Bu Bölümü Hedefim Yap ✓'}</span>
                </button>
              </div>
            </div>

            {/* Official YÖK Atlas Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Taban Puan (2024)</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{selectedDept.baseScore.toFixed(2)}</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Başarı Sırası (k)</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#FF9F0A' }}>{formatRank(selectedDept.lastRank)}</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Kontenjan</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{selectedDept.quota} Kişi</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 2 }}>Son Giren Neti</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#30D158' }}>{targetTotal.toFixed(2)} <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Net</span></div>
              </div>
            </div>

            {/* NET DEFICIT (NET AÇIĞI) SUMMARY CARD */}
            <div
              style={{
                borderRadius: 16,
                padding: '16px 18px',
                background: totalDeficit >= 0
                  ? 'linear-gradient(135deg, rgba(48, 209, 88, 0.12) 0%, rgba(28, 28, 30, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 69, 58, 0.12) 0%, rgba(28, 28, 30, 0.6) 100%)',
                border: totalDeficit >= 0
                  ? '1px solid rgba(48, 209, 88, 0.3)'
                  : '1px solid rgba(255, 69, 58, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Bölümü Kazanmak İçin Kalan Net Durumu
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: totalDeficit >= 0 ? '#30D158' : '#FF453A', marginTop: 2 }}>
                    {totalDeficit >= 0
                      ? `+${totalDeficit.toFixed(2)} Net Hedefin Üzerindesin! ✨`
                      : `${Math.abs(totalDeficit).toFixed(2)} Net Eksik ⚠️`}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Hedef Eşleşme Oranı</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: totalDeficit >= 0 ? '#30D158' : 'var(--color-accent)' }}>
                    %{matchPct}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: 9, background: 'rgba(0, 0, 0, 0.4)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                <div
                  style={{
                    width: `${matchPct}%`,
                    height: '100%',
                    background: totalDeficit >= 0
                      ? 'linear-gradient(90deg, #30D158, #63E6E2)'
                      : 'linear-gradient(90deg, #0A84FF, #30D158)',
                    borderRadius: 99,
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              {/* Detailed Sub Metrics */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ color: 'var(--color-text-dim)' }}>Senin Toplamın: </span>
                  <strong style={{ color: '#FFFFFF' }}>{userTotal.toFixed(2)} Net</strong>
                  <span style={{ color: 'var(--color-text-dim)', fontSize: 11 }}> (TYT {userTytTotal.toFixed(2)} + AYT {userAytTotal.toFixed(2)})</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-dim)' }}>Hedef Son Giren: </span>
                  <strong style={{ color: '#FFFFFF' }}>{targetTotal.toFixed(2)} Net</strong>
                  <span style={{ color: 'var(--color-text-dim)', fontSize: 11 }}> (TYT {selectedDept.tytTotal.toFixed(2)} + AYT {selectedDept.aytTotal.toFixed(2)})</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11.5 }}>
                <div>
                  TYT Açığı:{' '}
                  <strong style={{ color: tytDeficit >= 0 ? '#30D158' : '#FF9F0A' }}>
                    {tytDeficit >= 0 ? `+${tytDeficit.toFixed(2)} Hedefte ✓` : `${tytDeficit.toFixed(2)} Net Eksik`}
                  </strong>
                </div>
                <div>
                  AYT Açığı:{' '}
                  <strong style={{ color: aytDeficit >= 0 ? '#30D158' : '#FF453A' }}>
                    {aytDeficit >= 0 ? `+${aytDeficit.toFixed(2)} Hedefte ✓` : `${aytDeficit.toFixed(2)} Net Eksik`}
                  </strong>
                </div>
              </div>
            </div>

            {/* AI COACH TACTICAL STRATEGY BOX */}
            {topBottlenecks.length > 0 && (
              <div
                style={{
                  background: 'rgba(10, 132, 255, 0.08)',
                  border: '1px solid rgba(10, 132, 255, 0.2)',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(10, 132, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={15} color="#0A84FF" />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                  💡 <strong style={{ color: '#FFFFFF' }}>Koç Tavsiyesi: </strong>
                  Bu bölümü kazanmak için en yüksek net artırma fırsatın{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>{topBottlenecks.map((b) => `${b.name} (${b.gap} net)`).join(' ve ')}</strong>{' '}
                  alanlarında. Haftada ortalama <strong style={{ color: '#30D158' }}>+1.5 net</strong> artış sağlayarak hedefine ulaşabilirsin!
                </div>
              </div>
            )}

            {/* SUBJECT-BY-SUBJECT BREAKDOWN TABLE */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Ders Bazında Net Açığı & Kıyaslama Tablosu</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-dim)', fontWeight: 400 }}>Mevcut Denemelerine Göre</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {subjectBreakdown.map((item) => {
                  const diff = Math.round((item.user - item.target) * 100) / 100;
                  const isAhead = diff >= 0;
                  const subPct = Math.min(100, Math.round((item.user / (item.target || 1)) * 100));

                  return (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 10,
                        gap: 10
                      }}
                    >
                      <div style={{ minWidth: 150 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FFFFFF' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
                          Sen: <strong style={{ color: '#FFFFFF' }}>{item.user.toFixed(2)}</strong> • Hedef: <strong style={{ color: 'var(--color-text-muted)' }}>{item.target.toFixed(2)}</strong>
                        </div>
                      </div>

                      {/* Mini bar */}
                      <div style={{ flex: 1, height: 5, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${subPct}%`,
                            height: '100%',
                            background: isAhead ? '#30D158' : 'var(--color-accent)',
                            borderRadius: 99
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isAhead ? 'rgba(48, 209, 88, 0.14)' : 'rgba(255, 69, 58, 0.14)',
                          color: isAhead ? '#30D158' : '#FF453A',
                          minWidth: 80,
                          textAlign: 'center'
                        }}
                      >
                        {isAhead ? `+${diff.toFixed(2)} Net ✓` : `${diff.toFixed(2)} Eksik`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ALL SEARCHABLE DEPARTMENTS CATALOG (MorphaxTheDeveloper/yokatlas-dataset-2025) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                YÖK Atlas 2025 Bölüm Kataloğu ({filteredDepartments.length})
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
                İncelemek istediğin bölüme tıkla
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 10,
                maxHeight: '38vh',
                overflowY: 'auto',
                paddingRight: 4
              }}
            >
              {filteredDepartments.map((dept) => {
                const isSelected = dept.id === selectedDept.id;
                const badge = getTrackBadge(dept.track);
                const deptTotal = Math.round((dept.tytTotal + dept.aytTotal) * 100) / 100;

                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDept(dept);
                      sounds.playClick();
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: isSelected ? 'rgba(10, 132, 255, 0.1)' : 'var(--color-surface)',
                      border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>
                            {dept.city} • {dept.type}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                          {dept.department}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                          {dept.university}
                        </div>
                      </div>

                      {isSelected && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(48, 209, 88, 0.15)', color: '#30D158' }}>
                          ✓ Seçili
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: 11 }}>
                      <span style={{ color: 'var(--color-text-dim)' }}>
                        Taban: <strong style={{ color: '#FFFFFF' }}>{dept.baseScore.toFixed(2)}</strong>
                      </span>
                      <span style={{ color: '#FF9F0A', fontWeight: 600 }}>
                        {formatRank(dept.lastRank)}
                      </span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                        {deptTotal.toFixed(2)} Net
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 26: Printable PDF Report Modal (Karne Raporu Çıktısı)
// ----------------------------------------------------------------------------
function PrintableReportModal({
  profile,
  exams,
  questionLogs,
  topicProgress,
  onClose
}: {
  profile: StudentProfile;
  exams: Exam[];
  questionLogs: QuestionLog[];
  topicProgress: Record<string, TopicStatus>;
  onClose: () => void;
}) {
  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const totalQuestions = questionLogs.reduce((s, q) => s + q.count, 0);
  const totalMinutes = questionLogs.reduce((s, q) => s + q.durationMinutes, 0);
  const completedTopics = Object.values(topicProgress).filter((s) => s === 'completed').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh', width: '100%', maxWidth: 540 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              🖨️ Karne & Haftalık Gelişim Raporu
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              A4 formatında yazdırılabilir veya PDF olarak indirilebilir resmi karne
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Print Button */}
        <div style={{ marginBottom: 12 }}>
          <button className="btn-primary" onClick={handlePrint} style={{ width: '100%', padding: '12px' }}>
            <Printer size={16} />
            <span>Yazdır / PDF Olarak Kaydet (Print)</span>
          </button>
        </div>

        {/* Printable Sheet Preview */}
        <div
          className="printable-report-sheet"
          style={{
            background: '#FFFFFF',
            color: '#111827',
            padding: 20,
            borderRadius: 12,
            overflowY: 'auto',
            maxHeight: '60vh',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontSize: 12
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E5E7EB', paddingBottom: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>NETMETRİK</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>ÖĞRENCİ GELİŞİM VE DENEME KARNESİ</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Tarih: 20 Ekim 2026</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>Rapor No: #NM-2026-10</div>
            </div>
          </div>

          {/* Student Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 14 }}>
            <div>
              <div><strong>Öğrenci:</strong> {profile.name}</div>
              <div><strong>Sınıf & Alan:</strong> {profile.classLevel}. Sınıf • {profile.fieldTrack.toUpperCase()}</div>
              <div><strong>OBP:</strong> {profile.obp}</div>
            </div>
            <div>
              <div><strong>Hedef:</strong> {profile.targetUniversity}</div>
              <div><strong>Bölüm:</strong> {profile.targetDepartment}</div>
              <div><strong>Hedef Net:</strong> TYT: {profile.targetTytNet} • AYT: {profile.targetAytNet}</div>
            </div>
          </div>

          {/* Exam Results Table */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 6, color: '#374151' }}>SON DENEME SINAVI NETLERİ</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F3F4F6' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}>Sınav Adı</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}>Tür</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}>Tarih</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #E5E7EB', textAlign: 'right' }}>Toplam Net</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((ex) => (
                  <tr key={ex.id}>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', fontWeight: 600 }}>{ex.title}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}>{ex.type}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB' }}>{ex.date}</td>
                    <td style={{ padding: '6px 8px', border: '1px solid #E5E7EB', textAlign: 'right', fontWeight: 800, color: '#16A34A' }}>
                      {ex.totalNet.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cumulative Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14, textAlign: 'center' }}>
            <div style={{ border: '1px solid #E5E7EB', padding: 8, borderRadius: 6 }}>
              <div style={{ color: '#6B7280', fontSize: 10 }}>Toplam Soru</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{totalQuestions}</div>
            </div>
            <div style={{ border: '1px solid #E5E7EB', padding: 8, borderRadius: 6 }}>
              <div style={{ color: '#6B7280', fontSize: 10 }}>Çalışma Saati</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{(totalMinutes / 60).toFixed(1)}s</div>
            </div>
            <div style={{ border: '1px solid #E5E7EB', padding: 8, borderRadius: 6 }}>
              <div style={{ color: '#6B7280', fontSize: 10 }}>Biten Konular</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{completedTopics} Konu</div>
            </div>
          </div>

          {/* Coach's Evaluation Note */}
          <div style={{ background: '#FEF3C7', padding: 10, borderRadius: 8, borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontWeight: 800, color: '#92400E', marginBottom: 2 }}>Akademik Koçun Notu & Tavsiyesi:</div>
            <div style={{ color: '#78350F', fontSize: 11 }}>
              Öğrencinin TYT Matematik ve Türkçe ivmesi son 4 haftada çok olumlu seyretmektedir. AYT Fizik dalga mekaniği ve TYT Geometri alanındaki eksikler kapatıldığında hedef üniversite taban netlerine rahatlıkla ulaşılacaktır.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 27: Customizable Widget Simulator (Ekran Widget'ı)
// ----------------------------------------------------------------------------
function WidgetSimulatorModal({
  countdown,
  profile,
  todaySolvedQuestions,
  todayStudyMinutes: _todayStudyMinutes,
  latestExam,
  onClose
}: {
  countdown: { days: number; hours: number; mins: number; secs: number };
  profile: StudentProfile;
  todaySolvedQuestions: number;
  todayStudyMinutes?: number;
  latestExam?: Exam;
  onClose: () => void;
}) {
  const [widgetSize, setWidgetSize] = useState<'small' | 'medium' | 'lockscreen'>('medium');
  const [showFlame, setShowFlame] = useState(true);
  const [showGoalBar, setShowGoalBar] = useState(true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              📱 Özelleştirilebilir Ekran Widget'ı
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              iOS ve Android ana ekranında / kilit ekranında canlı durum takibi
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Size Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          <button
            className={`pill-toggle-btn ${widgetSize === 'small' ? 'active' : ''}`}
            onClick={() => setWidgetSize('small')}
          >
            Küçük (2x2)
          </button>
          <button
            className={`pill-toggle-btn ${widgetSize === 'medium' ? 'active' : ''}`}
            onClick={() => setWidgetSize('medium')}
          >
            Orta (4x2)
          </button>
          <button
            className={`pill-toggle-btn ${widgetSize === 'lockscreen' ? 'active' : ''}`}
            onClick={() => setWidgetSize('lockscreen')}
          >
            Kilit Ekranı
          </button>
        </div>

        {/* Phone Mockup Canvas */}
        <div
          style={{
            background: '#0B0C0E',
            border: '2px solid #2A2D37',
            borderRadius: 24,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 220,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
            marginBottom: 16
          }}
        >
          {widgetSize === 'small' && (
            <div
              style={{
                width: 155,
                height: 155,
                borderRadius: 22,
                background: 'linear-gradient(145deg, #1A1C22 0%, #121316 100%)',
                border: '1.5px solid rgba(212, 255, 0, 0.4)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-accent)' }}>YKS 2027</span>
                {showFlame && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#FFB800', fontSize: 11, fontWeight: 900 }}>
                    <Flame size={13} />
                    <span>{profile.currentStreak}</span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
                  {countdown.days}
                </div>
                <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontWeight: 700 }}>GÜN KALDI</div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                  Bugün: <strong>{todaySolvedQuestions}</strong> / {profile.dailyQuestionGoal} Q
                </div>
                {showGoalBar && (
                  <div style={{ width: '100%', height: 4, background: '#252730', borderRadius: 99, marginTop: 4 }}>
                    <div style={{ width: `${Math.min(100, (todaySolvedQuestions / profile.dailyQuestionGoal) * 100)}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 99 }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {widgetSize === 'medium' && (
            <div
              style={{
                width: '100%',
                maxWidth: 320,
                borderRadius: 22,
                background: 'linear-gradient(145deg, #1A1C22 0%, #121316 100%)',
                border: '1.5px solid rgba(212, 255, 0, 0.4)',
                padding: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="var(--color-accent)" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#FFF' }}>NetMetrik YKS Takip</span>
                </div>
                {showFlame && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFB800', fontSize: 11, fontWeight: 900 }}>
                    <Flame size={14} />
                    <span>{profile.currentStreak} Gün Seri</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    {countdown.days} GÜN
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                    Hedef: {profile.targetDepartment}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }}>
                    {latestExam ? `${latestExam.totalNet.toFixed(1)} Net` : '91.50 Net'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Son Deneme</div>
                </div>
              </div>

              {showGoalBar && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #232530' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    <span>Günün Hedefi: {todaySolvedQuestions} / {profile.dailyQuestionGoal} Soru</span>
                    <span>{Math.round((todaySolvedQuestions / profile.dailyQuestionGoal) * 100)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#252730', borderRadius: 99 }}>
                    <div style={{ width: `${Math.min(100, (todaySolvedQuestions / profile.dailyQuestionGoal) * 100)}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 99 }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {widgetSize === 'lockscreen' && (
            <div
              style={{
                width: '100%',
                maxWidth: 280,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '10px 14px',
                textAlign: 'center',
                color: '#FFF'
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', opacity: 0.8 }}>
                YKS 2027 • {countdown.days} GÜN KALDI
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>
                🔥 {profile.currentStreak} Gün Seri • {todaySolvedQuestions} Soru Çözüldü
              </div>
            </div>
          )}
        </div>

        {/* Options Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>Seri Alevini Göster 🔥</span>
            <input
              type="checkbox"
              checked={showFlame}
              onChange={(e) => setShowFlame(e.target.checked)}
              style={{ transform: 'scale(1.2)', accentColor: 'var(--color-accent)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>Günlük Soru Hedef Barı</span>
            <input
              type="checkbox"
              checked={showGoalBar}
              onChange={(e) => setShowGoalBar(e.target.checked)}
              style={{ transform: 'scale(1.2)', accentColor: 'var(--color-accent)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Feature 9: Flashcards & Formula Cards Modal (Hap Bilgi & Formül Kartları)
// ----------------------------------------------------------------------------
function FlashcardsModal({
  flashcards,
  onToggleMastered,
  onClose
}: {
  flashcards: FlashcardItem[];
  onToggleMastered: (id: string) => void;
  onClose: () => void;
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredCards = flashcards.filter((card) => {
    if (selectedSubject !== 'all' && card.subjectCode !== selectedSubject) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const totalMastered = flashcards.filter((c) => c.isMastered).length;
  const progressPct = Math.round((totalMastered / (flashcards.length || 1)) * 100);

  const handleNext = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleCardClick = () => {
    sounds.playClick();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '88vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={20} color="var(--color-accent)" />
              <span>Hap Bilgi & Formül Kartları</span>
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
              Karta dokunarak formülü aç, ezberlediğin kartları hafızaya ekle
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Progress Bar Strip */}
        <div style={{ background: '#1D1F25', padding: '10px 14px', borderRadius: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Ezberlenen Formüller:</span>
            <span style={{ color: 'var(--color-accent)' }}>{totalMastered} / {flashcards.length} (%{progressPct})</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'var(--color-accent)',
                borderRadius: 3,
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
          <button
            className={`pill-toggle-btn ${selectedSubject === 'all' ? 'active' : ''}`}
            onClick={() => {
              setSelectedSubject('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            Tümü ({flashcards.length})
          </button>
          {[
            { code: 'ayt_mat', name: 'AYT Mat' },
            { code: 'tyt_mat', name: 'TYT Mat' },
            { code: 'ayt_fizik', name: 'AYT Fizik' },
            { code: 'tyt_fizik', name: 'TYT Fizik' },
            { code: 'ayt_kimya', name: 'AYT Kimya' },
            { code: 'ayt_biyo', name: 'AYT Biyoloji' }
          ].map((sub) => {
            const count = flashcards.filter((f) => f.subjectCode === sub.code).length;
            if (count === 0) return null;
            return (
              <button
                key={sub.code}
                className={`pill-toggle-btn ${selectedSubject === sub.code ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSubject(sub.code);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>

        {/* 3D Flip Card */}
        {currentCard ? (
          <div style={{ marginBottom: 16 }}>
            <div className="flashcard-perspective" onClick={handleCardClick} style={{ minHeight: 250 }}>
              <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Front Side */}
                <div className="flashcard-face flashcard-front">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'rgba(212, 255, 0, 0.15)', color: 'var(--color-accent)' }}>
                        {currentCard.subjectName} • {currentCard.category}
                      </span>
                      {currentCard.isMastered && (
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(0, 229, 153, 0.2)', color: '#00E599' }}>
                          ✓ Ezberlendi
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 800, marginTop: 14, color: '#fff' }}>
                      {currentCard.title}
                    </h4>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5, marginTop: 10 }}>
                      {currentCard.front}
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-accent)', fontWeight: 700 }}>
                    💡 Formülü ve çözümü görmek için dokun ↺
                  </div>
                </div>

                {/* Back Side */}
                <div className="flashcard-face flashcard-back">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'rgba(0, 240, 255, 0.15)', color: '#00F0FF' }}>
                        {currentCard.subjectName}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
                        Formül & Püf Nokta
                      </span>
                    </div>

                    <div style={{
                      marginTop: 14,
                      padding: '12px 14px',
                      background: 'rgba(0,0,0,0.4)',
                      borderRadius: 12,
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      fontFamily: 'monospace',
                      fontSize: 14,
                      color: '#00F0FF',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left'
                    }}>
                      {currentCard.back}
                    </div>

                    {currentCard.formulaNote && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255, 184, 0, 0.1)', borderRadius: 8, borderLeft: '3px solid #FFB800', textAlign: 'left', fontSize: 11, color: '#FFE082' }}>
                        <strong>Önemli: </strong>{currentCard.formulaNote}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-dim)' }}>
                    Ön yüze dönmek için dokun ↺
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, gap: 10 }}>
              <button
                onClick={handlePrev}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: 12 }}
                disabled={filteredCards.length <= 1}
              >
                <ArrowLeft size={16} />
                <span>Önceki</span>
              </button>

              <button
                onClick={() => onToggleMastered(currentCard.id)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: currentCard.isMastered ? 'rgba(0, 229, 153, 0.15)' : 'rgba(212, 255, 0, 0.15)',
                  border: currentCard.isMastered ? '1px solid #00E599' : '1px solid var(--color-accent)',
                  color: currentCard.isMastered ? '#00E599' : 'var(--color-accent)',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Check size={16} />
                <span>{currentCard.isMastered ? 'Ezberlendi ✓' : 'Ezberledim / Hakimim'}</span>
              </button>

              <button
                onClick={handleNext}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: 12 }}
                disabled={filteredCards.length <= 1}
              >
                <span>Sonraki</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-dim)', marginTop: 8 }}>
              Kart {currentIndex + 1} / {filteredCards.length}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
            Bu derste henüz formül kartı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Forms for Quick Action Modal
// ============================================================================
function QuickQuestionForm({
  onSave
}: {
  onSave: (
    subject: string,
    topicOrSource: string,
    sourceOrCount: string | number,
    count?: number,
    minutes?: number,
    date?: string
  ) => void;
}) {
  const [subject, setSubject] = useState(YKS_SUBJECTS[0].name);
  const currentSub = YKS_SUBJECTS.find((s) => s.name === subject) || YKS_SUBJECTS[0];
  const [topic, setTopic] = useState(currentSub.topics[0] || 'Genel');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicText, setCustomTopicText] = useState('');
  const [source, setSource] = useState('');
  const [count, setCount] = useState(30);
  const [date, setDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  const handleSubjectChange = (newSub: string) => {
    setSubject(newSub);
    const found = YKS_SUBJECTS.find((s) => s.name === newSub);
    if (found && found.topics.length > 0) {
      setTopic(found.topics[0]);
      setIsCustomTopic(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = isCustomTopic
      ? customTopicText.trim() || 'Özel Konu'
      : topic;
    onSave(subject, finalTopic, source || 'Soru Bankası', count, 0, date);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Tarih
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: 9, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13 }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Ders Seçin
        </label>
        <select
          value={subject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
        >
          <optgroup label="TYT Dersleri">
            {YKS_SUBJECTS.filter((s) => s.category === 'TYT').map((s) => (
              <option key={s.code} value={s.name}>{s.name}</option>
            ))}
          </optgroup>
          <optgroup label="AYT Dersleri">
            {YKS_SUBJECTS.filter((s) => s.category === 'AYT').map((s) => (
              <option key={s.code} value={s.name}>{s.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Konu Seçin
          </label>
          <button
            type="button"
            onClick={() => setIsCustomTopic(!isCustomTopic)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', fontSize: 11, cursor: 'pointer', padding: 0 }}
          >
            {isCustomTopic ? 'Listeden Seç' : '+ Farklı Konu Yaz'}
          </button>
        </div>
        {isCustomTopic ? (
          <input
            type="text"
            placeholder="Konu adı yazın..."
            value={customTopicText}
            onChange={(e) => setCustomTopicText(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
          />
        ) : (
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
          >
            {currentSub.topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
            <option value="Genel Soru Çözümü">Genel / Karma Soru Çözümü</option>
          </select>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Kaynak Kitap / Test (İsteğe Bağlı)
        </label>
        <input
          type="text"
          placeholder="Ör: 3D Soru Bankası Test 4, Bilgi Sarmal..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Çözülen Soru Sayısı</label>
        <input
          type="number"
          min="1"
          max="2000"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', fontSize: 14, fontWeight: 800 }}
        />
        <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
          {[10, 20, 30, 50, 100].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setCount((prev) => prev + amt)}
              style={{ flex: 1, padding: '4px 0', borderRadius: 6, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--color-text-dim)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              +{amt}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
        Çizelgeye Kaydet ve Seriyi Güncelle
      </button>
    </form>
  );
}

function QuickStudyTimeForm({
  onSave
}: {
  onSave: (activity: string, minutes: number, date: string) => void;
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [activity, setActivity] = useState('Masa Başı Konu Çalışması');
  const [customText, setCustomText] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [minutes, setMinutes] = useState(60);

  const activities = [
    'Masa Başı Konu Çalışması',
    'Video Ders İzleme',
    'Genel Etüt',
    'Kütüphane Çalışması',
    'Deneme Analizi & Tekrar',
    'Özet & Formül Tekrarı'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAct = isCustom ? customText.trim() || 'Genel Çalışma' : activity;
    onSave(finalAct, minutes, date);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Tarih
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: 9, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13 }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Çalışma Türü / Aktivite
          </label>
          <button
            type="button"
            onClick={() => setIsCustom(!isCustom)}
            style={{ background: 'transparent', border: 'none', color: '#30D158', fontSize: 11, cursor: 'pointer', padding: 0 }}
          >
            {isCustom ? 'Önerilenlerden Seç' : '+ Farklı Başlık Yaz'}
          </button>
        </div>
        {isCustom ? (
          <input
            type="text"
            placeholder="Aktivite adı..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
          />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activities.map((act) => (
              <button
                key={act}
                type="button"
                onClick={() => setActivity(act)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: activity === act ? 800 : 600,
                  background: activity === act ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: activity === act ? '1px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: activity === act ? '#30D158' : 'var(--color-text-dim)',
                  cursor: 'pointer'
                }}
              >
                {act}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Çalışma Süresi (Dakika)</label>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#30D158' }}>
            {minutes >= 60 ? `${Math.floor(minutes / 60)}s ${minutes % 60 > 0 ? `${minutes % 60}d` : ''}` : `${minutes} dk`}
          </span>
        </div>
        <input
          type="number"
          min="5"
          max="1440"
          step="5"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff', fontSize: 14, fontWeight: 800 }}
        />
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {[30, 45, 60, 90, 120].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setMinutes(amt)}
              style={{ flex: 1, padding: '4px 0', borderRadius: 6, background: minutes === amt ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: minutes === amt ? '1px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)', color: minutes === amt ? '#30D158' : 'var(--color-text-dim)', fontSize: 10.5, cursor: 'pointer' }}
            >
              {amt >= 60 ? `${amt / 60}s` : `${amt}d`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#80BFFF', background: 'rgba(10, 132, 255, 0.08)', padding: '7px 10px', borderRadius: 8 }}>
        💡 NetFocus Pomodoro seanslarınız otomatik olarak buraya eklenir.
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4, background: 'linear-gradient(135deg, #30D158 0%, #248A3D 100%)' }}>
        Çalışma Süresini Kaydet
      </button>
    </form>
  );
}

function QuickTaskForm({
  onSave
}: {
  onSave: (subjectCode: string, subjectName: string, topic: string, count: number, minutes: number) => void;
}) {
  const [subjectCode, setSubjectCode] = useState(YKS_SUBJECTS[0].code);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(30);
  const [minutes, setMinutes] = useState(45);

  const selectedSub = YKS_SUBJECTS.find((s) => s.code === subjectCode) || YKS_SUBJECTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Lütfen konu veya görev başlığı girin.');
      return;
    }
    onSave(subjectCode, selectedSub.name, topic, count, minutes);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Ders</label>
        <select
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
        >
          {YKS_SUBJECTS.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Konu / Görev Başlığı</label>
        <input
          type="text"
          required
          placeholder="Ör: Problemler Test 5"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef Soru</label>
          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Hedef Süre (dk)</label>
          <input
            type="number"
            min="0"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 10, background: '#1D1F25', border: '1px solid var(--color-border)', color: '#fff' }}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
        Görevi Ekle
      </button>
    </form>
  );
}
