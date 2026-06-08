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
      garden_seed_sowing_windows: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          seed_id: string
          sow_direction: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks: number
          sow_method: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          seed_id: string
          sow_direction: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks: number
          sow_method: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          seed_id?: string
          sow_direction?: Database["public"]["Enums"]["garden_sow_direction"]
          sow_end_weeks?: number
          sow_method?: Database["public"]["Enums"]["garden_sow_method"]
          sow_reference?: Database["public"]["Enums"]["garden_sow_reference"]
          sow_start_weeks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_seed_sowing_windows_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "garden_seeds"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_seed_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          notes: string | null
          seed_id: string
          status: Database["public"]["Enums"]["garden_seed_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          seed_id: string
          status?: Database["public"]["Enums"]["garden_seed_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          seed_id?: string
          status?: Database["public"]["Enums"]["garden_seed_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_seed_tasks_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "garden_seeds"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_seeds: {
        Row: {
          created_at: string
          days_to_emerge: number | null
          days_to_maturity: number | null
          id: string
          is_deer_resistant: boolean | null
          is_succession_planted: boolean
          location_number: string | null
          notes: string | null
          overall_rating: number | null
          purchased_from: string | null
          recommended_sow_method:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches: number | null
          seed_depth_inches:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url: string | null
          source_page_url: string | null
          succession_interval_days: number | null
          sun_type: Database["public"]["Enums"]["garden_sun_type"]
          type: string
          updated_at: string
          variety: string
        }
        Insert: {
          created_at?: string
          days_to_emerge?: number | null
          days_to_maturity?: number | null
          id?: string
          is_deer_resistant?: boolean | null
          is_succession_planted?: boolean
          location_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          purchased_from?: string | null
          recommended_sow_method?:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches?: number | null
          seed_depth_inches?:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url?: string | null
          source_page_url?: string | null
          succession_interval_days?: number | null
          sun_type?: Database["public"]["Enums"]["garden_sun_type"]
          type: string
          updated_at?: string
          variety: string
        }
        Update: {
          created_at?: string
          days_to_emerge?: number | null
          days_to_maturity?: number | null
          id?: string
          is_deer_resistant?: boolean | null
          is_succession_planted?: boolean
          location_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          purchased_from?: string | null
          recommended_sow_method?:
            | Database["public"]["Enums"]["garden_sow_method"]
            | null
          row_spacing_inches?: number | null
          seed_depth_inches?:
            | Database["public"]["Enums"]["garden_seed_depth_inches"]
            | null
          source_image_url?: string | null
          source_page_url?: string | null
          succession_interval_days?: number | null
          sun_type?: Database["public"]["Enums"]["garden_sun_type"]
          type?: string
          updated_at?: string
          variety?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      garden_seed_task_status: "pending" | "completed" | "skipped" | "canceled"
      garden_seed_depth_inches: "0" | "0.125" | "0.25" | "0.5" | "0.75" | "1"
      garden_sow_direction: "before" | "after"
      garden_sow_method: "inside" | "outside" | "either"
      garden_sow_reference: "last_frost" | "first_frost"
      garden_sun_type:
        | "full_sun"
        | "partial_sun"
        | "partial_shade"
        | "shade"
        | "unknown"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      garden_seed_task_status: ["pending", "completed", "skipped", "canceled"],
      garden_seed_depth_inches: ["0", "0.125", "0.25", "0.5", "0.75", "1"],
      garden_sow_direction: ["before", "after"],
      garden_sow_method: ["inside", "outside", "either"],
      garden_sow_reference: ["last_frost", "first_frost"],
      garden_sun_type: [
        "full_sun",
        "partial_sun",
        "partial_shade",
        "shade",
        "unknown",
      ],
    },
  },
} as const
