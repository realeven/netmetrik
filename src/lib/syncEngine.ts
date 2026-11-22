// ============================================================================
// NetMetrik - Auto Cloud Sync Engine (Offline-First + Real-Time Listener)
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
  flashcards?: FlashcardItem[];
}

export interface CloudUser {
  id: string;
  email: string;
  name?: string;
  isMock?: boolean;
}

const OFFLINE_QUEUE_KEY = 'netmetrik_offline_sync_queue';
const LAST_KNOWN_UPDATED_AT_KEY = 'netmetrik_last_synced_updated_at';

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

  if (typeof window !== 'undefined') {
    const mockUserStr = localStorage.getItem('netmetrik_mock_cloud_user');
    if (mockUserStr) {
      try {
        return JSON.parse(mockUserStr);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Queue payload locally when offline
 */
export function queueOfflinePayload(payload: SyncPayload): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to queue offline payload:', e);
  }
}

/**
 * Get queued offline payload
 */
export function getQueuedOfflinePayload(): SyncPayload | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear queued offline payload
 */
export function clearQueuedOfflinePayload(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

/**
 * Flush any queued offline data to cloud once network is restored
 */
export async function flushOfflineQueue(): Promise<boolean> {
  if (typeof window !== 'undefined' && !navigator.onLine) {
    return false;
  }
  const queued = getQueuedOfflinePayload();
  if (!queued) return false;

  const success = await pushPayloadToCloud(queued);
  if (success) {
    clearQueuedOfflinePayload();
  }
  return success;
}

/**
 * Push all application data to cloud.
 * Offline-first: if offline or push fails, queues payload locally.
 */
export async function pushPayloadToCloud(payload: SyncPayload): Promise<boolean> {
  const user = await getCurrentCloudUser();
  if (!user) return false; // Guest mode stays purely local

  // If network is offline, queue locally immediately
  if (typeof window !== 'undefined' && !navigator.onLine) {
    queueOfflinePayload(payload);
    return false;
  }

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
        console.warn('Cloud sync push error, saving to offline queue:', error.message);
        queueOfflinePayload(payload);
        return false;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_KNOWN_UPDATED_AT_KEY, payload.clientUpdatedAt);
        clearQueuedOfflinePayload();
      }
      return true;
    } catch (err) {
      console.warn('Cloud push network error, queuing offline:', err);
      queueOfflinePayload(payload);
      return false;
    }
  } else {
    // Simulated cloud store for local testing
    if (typeof window !== 'undefined') {
      localStorage.setItem(`netmetrik_cloud_store_${user.email}`, JSON.stringify(payload));
      localStorage.setItem(LAST_KNOWN_UPDATED_AT_KEY, payload.clientUpdatedAt);
    }
    return true;
  }
}

/**
 * Pull all data from cloud for the logged-in user.
 * Supports conflict resolution using clientUpdatedAt.
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

      if (error || !data || !data.payload) return null;
      const cloudPayload = data.payload as SyncPayload;
      if (typeof window !== 'undefined' && cloudPayload.clientUpdatedAt) {
        localStorage.setItem(LAST_KNOWN_UPDATED_AT_KEY, cloudPayload.clientUpdatedAt);
      }
      return cloudPayload;
    } catch (err) {
      console.warn('Cloud pull failed:', err);
      return null;
    }
  } else {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(`netmetrik_cloud_store_${user.email}`);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}

/**
 * Real-time subscription to cloud changes for instant multi-device / APK-Web sync.
 * Triggers callback whenever remote data changes if newer than local data.
 */
export function subscribeToCloudChanges(
  userId: string,
  onRemoteUpdate: (payload: SyncPayload) => void
): () => void {
  if (!supabase || !userId) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel(`sync-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_sync',
          filter: `user_id=eq.${userId}`
        },
        (change) => {
          const newRow = change.new as { payload?: SyncPayload; client_updated_at?: string } | null;
          if (newRow && newRow.payload) {
            const remotePayload = newRow.payload;
            const remoteTime = new Date(remotePayload.clientUpdatedAt || newRow.client_updated_at || 0).getTime();
            const localLastStr = typeof window !== 'undefined' ? localStorage.getItem(LAST_KNOWN_UPDATED_AT_KEY) : null;
            const localTime = localLastStr ? new Date(localLastStr).getTime() : 0;

            // Conflict resolution: only update if remote is newer
            if (remoteTime > localTime) {
              if (typeof window !== 'undefined' && remotePayload.clientUpdatedAt) {
                localStorage.setItem(LAST_KNOWN_UPDATED_AT_KEY, remotePayload.clientUpdatedAt);
              }
              onRemoteUpdate(remotePayload);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to realtime changes:', err);
    return () => {};
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
  if (typeof window !== 'undefined') {
    localStorage.setItem('netmetrik_mock_cloud_user', JSON.stringify(mockUser));
  }
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
  if (typeof window !== 'undefined') {
    localStorage.setItem('netmetrik_mock_cloud_user', JSON.stringify(mockUser));
  }
  return mockUser;
}

/**
 * Log out from Cloud account (switches back to Guest Mode)
 */
export async function logoutCloudUser(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('netmetrik_mock_cloud_user');
  }
}
