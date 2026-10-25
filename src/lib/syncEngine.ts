// ============================================================================
// NetMetrik - Auto Cloud Sync Engine (Offline-First)
// ============================================================================
import { supabase, setCustomSupabaseConfig, removeCustomSupabaseConfig } from './supabase';
import type {
  Exam,
  DailyTask,
  QuestionLog,
  StudentProfile,
  TopicStatus,
  QuestionVaultItem,
  BookTrackerItem,
  FlashcardItem
} from '../data/seedData';

export interface SyncPayload {
  version: number;
  clientUpdatedAt: string;
  profile: StudentProfile;
  exams: Exam[];
  tasks: DailyTask[];
  questionLogs: QuestionLog[];
  questionVault: QuestionVaultItem[];
  books: BookTrackerItem[];
  topicProgress: Record<string, TopicStatus>;
  flashcards: FlashcardItem[];
}

export interface CloudUser {
  id: string;
  email: string;
  name?: string;
  isMock?: boolean;
}

export function isRealSupabaseActive(): boolean {
  return Boolean(supabase);
}

export { setCustomSupabaseConfig, removeCustomSupabaseConfig };

/**
 * Get the currently logged-in user (from Supabase or local simulated cloud session).
 */
export async function getCurrentCloudUser(): Promise<CloudUser | null> {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0]
        };
      }
    } catch (err) {
      console.warn('Supabase auth check error:', err);
    }
  }

  const mockUserStr = localStorage.getItem('netmetrik_mock_cloud_user');
  if (mockUserStr) {
    try {
      return JSON.parse(mockUserStr);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Push all application data to cloud.
 * Silently does nothing if the user is in Guest Mode (not logged in).
 */
export async function pushPayloadToCloud(payload: SyncPayload): Promise<boolean> {
  const user = await getCurrentCloudUser();
  if (!user) return false; // Guest mode: stays offline/local only

  if (supabase && !user.isMock) {
    try {
      const { error } = await supabase
        .from('student_sync')
        .upsert({
          user_id: user.id,
          payload,
          client_updated_at: payload.clientUpdatedAt,
          synced_at: new Date().toISOString()
        });
      if (error) {
        console.warn('Cloud sync push error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Cloud push failed:', err);
      return false;
    }
  } else {
    // Simulated cloud store for this user (cross-device/tab simulation)
    localStorage.setItem(`netmetrik_cloud_store_${user.email}`, JSON.stringify(payload));
    return true;
  }
}

/**
 * Pull all data from cloud for the logged-in user.
 */
export async function pullPayloadFromCloud(): Promise<SyncPayload | null> {
  const user = await getCurrentCloudUser();
  if (!user) return null;

  if (supabase && !user.isMock) {
    try {
      const { data, error } = await supabase
        .from('student_sync')
        .select('payload, client_updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) return null;
      return data.payload as SyncPayload;
    } catch (err) {
      console.warn('Cloud pull failed:', err);
      return null;
    }
  } else {
    const raw = localStorage.getItem(`netmetrik_cloud_store_${user.email}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Log in to Cloud account
 */
export async function loginCloudUser(email: string, pass: string): Promise<CloudUser> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.full_name || email.split('@')[0]
    };
  }

  // Simulated cloud user login
  const mockUser: CloudUser = {
    id: 'mock-user-' + btoa(email).slice(0, 8),
    email,
    name: email.split('@')[0],
    isMock: true
  };
  localStorage.setItem('netmetrik_mock_cloud_user', JSON.stringify(mockUser));
  return mockUser;
}

/**
 * Sign up for a Cloud account
 */
export async function registerCloudUser(
  email: string,
  pass: string,
  name: string,
  classLevel?: string,
  fieldTrack?: string
): Promise<CloudUser> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          class_level: classLevel || '12',
          field_track: fieldTrack || 'sayisal'
        }
      }
    });
    if (error) throw error;
    if (!data.user) throw new Error('Kayıt oluşturulamadı');
    return {
      id: data.user.id,
      email: data.user.email || email,
      name: name || data.user.user_metadata?.full_name || email.split('@')[0]
    };
  }

  const mockUser: CloudUser = {
    id: 'mock-user-' + btoa(email).slice(0, 8),
    email,
    name,
    isMock: true
  };
  localStorage.setItem('netmetrik_mock_cloud_user', JSON.stringify(mockUser));
  return mockUser;
}

/**
 * Log out from Cloud account (switches back to Guest Mode)
 */
export async function logoutCloudUser(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('netmetrik_mock_cloud_user');
}
