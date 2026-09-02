export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          level: Database["public"]["Enums"]["level_enum"]
          subject: Database["public"]["Enums"]["subject_enum"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["level_enum"]
          subject: Database["public"]["Enums"]["subject_enum"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["level_enum"]
          subject?: Database["public"]["Enums"]["subject_enum"]
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed: boolean
          course_id: string
          enrolled_at: string
          id: string
          last_accessed: string
          progress: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          enrolled_at?: string
          id?: string
          last_accessed?: string
          progress?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          enrolled_at?: string
          id?: string
          last_accessed?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          course_id: string
          created_at: string
          duration: number | null
          id: string
          order: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string
          course_id: string
          created_at?: string
          duration?: number | null
          id?: string
          order?: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          duration?: number | null
          id?: string
          order?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          lesson_id: string
          time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id: string
          time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id?: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: string
          explanation: string | null
          id: string
          options: string[]
          order: number
          points: number
          quiz_id: string
          text: string
        }
        Insert: {
          correct_answer: string
          explanation?: string | null
          id?: string
          options?: string[]
          order?: number
          points?: number
          quiz_id: string
          text: string
        }
        Update: {
          correct_answer?: string
          explanation?: string | null
          id?: string
          options?: string[]
          order?: number
          points?: number
          quiz_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          passed: boolean
          quiz_id: string
          score: number
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          started_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          lesson_id: string
          passing_score: number
          time_limit: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id: string
          passing_score?: number
          time_limit?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          lesson_id?: string
          passing_score?: number
          time_limit?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_registrations: {
        Row: {
          age_group: string
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          guardian_name: string | null
          id: string
          phone: string
          position: string | null
        }
        Insert: {
          age_group: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          guardian_name?: string | null
          id?: string
          phone: string
          position?: string | null
        }
        Update: {
          age_group?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          guardian_name?: string | null
          id?: string
          phone?: string
          position?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "STUDENT" | "PARENT" | "COACH" | "ADMIN"
      level_enum: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
      subject_enum:
        | "MATHEMATICS"
        | "SCIENCE"
        | "ENGLISH"
        | "LANGUAGES"
        | "COMPUTER_STUDIES"
        | "PHYSICAL_EDUCATION"
      subscription_plan: "FREE" | "PREMIUM" | "ELITE"
      subscription_status: "ACTIVE" | "EXPIRED" | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["STUDENT", "PARENT", "COACH", "ADMIN"],
      level_enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      subject_enum: [
        "MATHEMATICS",
        "SCIENCE",
        "ENGLISH",
        "LANGUAGES",
        "COMPUTER_STUDIES",
        "PHYSICAL_EDUCATION",
      ],
      subscription_plan: ["FREE", "PREMIUM", "ELITE"],
      subscription_status: ["ACTIVE", "EXPIRED", "CANCELLED"],
    },
  },
} as const
