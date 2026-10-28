/**
 * TypeScript Database Type Definitions
 * Merefleksikan skema PostgreSQL: profiles, projects, tasks
 * (sesuai supabase/migrations/01_initial_schema.sql + 02_auth_profiles_trigger.sql + 03_tasks_rbac.sql)
 * Tidak ada tipe "any" — seluruh field terdefinisi secara eksplisit.
 */

/* ─── Enums ───────────────────────────────────────────────────────────── */

/** Status tugas sesuai enum task_status di PostgreSQL */
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/** Peran pengguna untuk RBAC */
export type UserRole = 'admin' | 'member'

/* ─── Table Row Types ─────────────────────────────────────────────────── */

export interface ProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
  /** Peran untuk otorisasi multi-role (RBAC) */
  role: UserRole
}

export interface ProjectRow {
  id: string
  user_id: string
  title: string
  description: string | null
  budget: number | null
  created_at: string
}

export interface TaskRow {
  id: string
  project_id: string
  /** User yang membuat tugas (FK → auth.users) */
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  /** 'low' | 'medium' | 'high' — disimpan sebagai TEXT di DB */
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

/* ─── Insert Types (omit server-generated fields) ────────────────────── */

export type ProfileInsert = Omit<ProfileRow, 'updated_at'> & {
  updated_at?: string
}

export type ProjectInsert = Omit<ProjectRow, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type TaskInsert = Omit<TaskRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

/* ─── Update Types (all fields optional except id) ───────────────────── */

export type ProfileUpdate = Partial<Omit<ProfileRow, 'id'>> & { id: string }
export type ProjectUpdate = Partial<Omit<ProjectRow, 'id'>> & { id: string }
export type TaskUpdate = Partial<Omit<TaskRow, 'id'>> & { id: string }

/* ─── Main Database Interface ─────────────────────────────────────────── */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      projects: {
        Row: ProjectRow
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
      tasks: {
        Row: TaskRow
        Insert: TaskInsert
        Update: TaskUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      task_status: TaskStatus
      user_role: UserRole
    }
    CompositeTypes: Record<string, never>
  }
}

/* ─── Convenience Re-exports ──────────────────────────────────────────── */

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
